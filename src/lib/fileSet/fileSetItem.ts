import * as P from '@konker.dev/effect-ts-prelude';
import type { TinyFileSystem, TinyFileSystemError } from '@konker.dev/tiny-filesystem-fp';
import type { DirectoryData, FileData } from '@konker.dev/tiny-treecrawler-fp';
import { isFileData } from '@konker.dev/tiny-treecrawler-fp/dist/lib/utils';
import micromatch from 'micromatch';

import type { FuncSmithError } from '../../error';
import { toFuncSmithError } from '../../error';
import type { FileSetItem, FileSetItemFile } from './index';
import { FileSetItemType } from './index';

export type RenameSpec = [RegExp, string];

// --------------------------------------------------------------------------
export function isFileItem<T extends FileSetItem>(data: T): data is T & FileSetItemFile {
  return data._tag === FileSetItemType.File;
}

// --------------------------------------------------------------------------
/*
  baseDir: string;
  relPath: string;
  relDir: string;
  fileName: string;
  fileBase: string;
  fileExt: string;
 */
export function fileSetItemSetFileName<T extends FileSetItemFile>(tfs: TinyFileSystem, fileName: string, item: T): T {
  const fileExt = tfs.extname(fileName);
  const fileBase = tfs.basename(fileName, fileExt);
  return {
    ...item,
    fileName,
    fileBase,
    fileExt,
    // relPath: tfs.joinPath(item.relDir, fileName),
  };
}

export function fileSetItemSetFileBase<T extends FileSetItemFile>(
  tfs: TinyFileSystem,
  fileBase: string,
  item: T
): P.Effect.Effect<never, TinyFileSystemError, T> {
  const fileName = `${fileBase}${item.fileExt}`;
  return P.pipe(
    P.Effect.Do,
    P.Effect.bind('relPath', () => tfs.joinPath(item.relDir, fileName)),
    P.Effect.bind('path', ({ relPath }) => tfs.joinPath(item.baseDir, relPath)),
    P.Effect.map(({ path, relPath }) => ({
      ...item,
      path,
      fileBase,
      fileName,
      relPath,
    }))
  );
}

export function fileSetItemSetFileExtension<T extends FileSetItemFile>(
  tfs: TinyFileSystem,
  fileExt: string,
  item: T
): P.Effect.Effect<never, FuncSmithError, T> {
  const fileName = `${item.fileBase}${fileExt}`;
  return P.pipe(
    P.Effect.Do,
    P.Effect.bind('relPath', () => tfs.joinPath(item.relDir, fileName)),
    P.Effect.bind('path', ({ relPath }) => tfs.joinPath(item.baseDir, relPath)),
    P.Effect.map(({ path, relPath }) => ({
      ...item,
      path,
      fileExt,
      fileName,
      relPath,
    })),
    P.Effect.mapError(toFuncSmithError)
  );
}

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
export const toFileSetItemFile =
  (tfs: TinyFileSystem, sourcePath: string) =>
  (i: FileData): P.Effect.Effect<never, TinyFileSystemError, FileSetItemFile> => {
    const fileName = tfs.basename(i.path);
    const fileExt = tfs.extname(i.path);

    return P.pipe(
      tfs.dirName(tfs.relative(sourcePath, i.path)),
      (x) => x,
      P.Effect.map((relDir) => ({
        _tag: FileSetItemType.File,
        path: i.path,
        baseDir: sourcePath,
        relPath: tfs.relative(sourcePath, i.path),
        relDir,
        fileName,
        fileExt,
        fileBase: tfs.basename(i.path, fileExt),
        contents: i.data.map((x) => (typeof x === 'string' ? x : String(x))).join(''),
      }))
    );
  };

// --------------------------------------------------------------------------
export const toFileSystemItemList =
  (tfs: TinyFileSystem, sourcePath: string) =>
  (list: Array<DirectoryData | FileData>): P.Effect.Effect<never, TinyFileSystemError, Array<FileSetItem>> =>
    P.pipe(list.filter(isFileData), P.Array.map(toFileSetItemFile(tfs, sourcePath)), P.Effect.all);

// --------------------------------------------------------------------------
export function fileSetItemMatchesPattern<T extends FileSetItemFile>(
  globPattern: string | undefined,
  fileSetItem: T
): boolean {
  return !!globPattern ? micromatch([fileSetItem.path], [globPattern])?.length > 0 : true;
}
