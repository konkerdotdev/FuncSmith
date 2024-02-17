import * as P from '@konker.dev/effect-ts-prelude';
import type { TinyFileSystem, TinyFileSystemError } from '@konker.dev/tiny-filesystem-fp';
import { arrayBufferToString } from '@konker.dev/tiny-filesystem-fp/dist/lib/array';
import type { DirectoryData, FileData } from '@konker.dev/tiny-treecrawler-fp';
import { isFileData } from '@konker.dev/tiny-treecrawler-fp/dist/lib/utils';
import micromatch from 'micromatch';

import type { FuncSmithError } from '../../error';
import { toFuncSmithError } from '../../error';
import type { GeneralError } from '../utils';
import { hashHex } from '../utils';
import type { FileSetItem, FileSetItemFile } from './index';
import { FileSetItemType } from './index';

export type RenameSpec = [RegExp, string];

// --------------------------------------------------------------------------
export function isFileSetItemFile<T extends FileSetItem>(data: T): data is T & FileSetItemFile {
  return data._tag === FileSetItemType.File;
}

// --------------------------------------------------------------------------
export function fileSetItemRename<T extends FileSetItemFile>(
  tfs: TinyFileSystem,
  renameSpec: RenameSpec,
  item: T
): P.Effect.Effect<never, FuncSmithError, T> {
  const relPath = item.relPath.replace(renameSpec[0], renameSpec[1]);
  const fileName = tfs.basename(relPath);
  const fileExt = tfs.extname(fileName);
  const fileBase = tfs.basename(fileName, fileExt);
  return P.pipe(
    P.Effect.Do,
    P.Effect.bind('path', () => tfs.joinPath(item.baseDir, relPath)),
    P.Effect.bind('relDir', () => tfs.dirName(relPath)),
    P.Effect.map(({ path, relDir }) => ({
      ...item,
      path,
      relPath,
      relDir,
      fileName,
      fileBase,
      fileExt,
    })),
    P.Effect.mapError(toFuncSmithError)
  );
}

// --------------------------------------------------------------------------
export function fileSetItemMatchesPattern<T extends FileSetItemFile>(
  globPattern: string | undefined,
  fileSetItem: T
): boolean {
  return !!globPattern ? micromatch([fileSetItem.path], [globPattern])?.length > 0 : true;
}

// --------------------------------------------------------------------------
export const toFileSetItemFile =
  (tfs: TinyFileSystem, sourcePath: string) =>
  (i: FileData): P.Effect.Effect<never, TinyFileSystemError | GeneralError, FileSetItemFile> => {
    const fileName = tfs.basename(i.path);
    const fileExt = tfs.extname(i.path);

    return P.pipe(
      P.Effect.Do,
      P.Effect.bind('relDir', () => tfs.dirName(tfs.relative(sourcePath, i.path))),
      P.Effect.bind('pathHash', () => hashHex(i.path)),
      P.Effect.map(({ pathHash, relDir }) => ({
        _tag: FileSetItemType.File,
        _id: pathHash,
        path: i.path,
        baseDir: sourcePath,
        relPath: tfs.relative(sourcePath, i.path),
        relDir,
        fileName,
        fileExt,
        fileBase: tfs.basename(i.path, fileExt),
        contents: new Uint8Array(i.data),
      }))
    );
  };

// --------------------------------------------------------------------------
export const toFileSystemItemList =
  (tfs: TinyFileSystem, sourcePath: string) =>
  (
    list: Array<DirectoryData | FileData>
  ): P.Effect.Effect<never, TinyFileSystemError | GeneralError, Array<FileSetItem>> =>
    P.pipe(list.filter(isFileData), P.Array.map(toFileSetItemFile(tfs, sourcePath)), P.Effect.all);

// --------------------------------------------------------------------------
export function fileSetItemContentsToString(contents: ArrayBuffer | string): string {
  return typeof contents === 'string' ? contents : arrayBufferToString(contents);
}
