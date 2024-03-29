import * as P from '@konker.dev/effect-ts-prelude';
import type { TinyFileSystem, TinyFileSystemError } from '@konker.dev/tiny-filesystem-fp';
import { arrayBufferToString, stringToUint8Array } from '@konker.dev/tiny-filesystem-fp/dist/lib/array';
import type { DirectoryData, FileData } from '@konker.dev/tiny-treecrawler-fp';
import { TreeCrawlerDataType } from '@konker.dev/tiny-treecrawler-fp';
import { isFileData } from '@konker.dev/tiny-treecrawler-fp/dist/lib/utils';
import micromatch from 'micromatch';

import type { FuncSmithError } from '../../error';
import { toFuncSmithError } from '../../error';
import type { GeneralError } from '../utils';
import { hashHex } from '../utils';
import { ID_PROP } from './idRefs';
import type { FileSetItem, FileSetItemFile } from './index';
import { FileSetItemType } from './index';

export type RenameSpec = [RegExp, string];

// --------------------------------------------------------------------------
export function isFileSetItemFile<T extends FileSetItem>(data: T): data is T & FileSetItemFile {
  return data._tag === FileSetItemType.File;
}

// --------------------------------------------------------------------------
export function fileSetSetFileName<T extends FileSetItemFile>(
  tfs: TinyFileSystem,
  newValue: string,
  item: T
): P.Effect.Effect<T, FuncSmithError> {
  const fileName = newValue;
  const fileExt = tfs.extname(newValue);
  const fileBase = tfs.basename(newValue, fileExt);
  return P.pipe(
    P.Effect.Do,
    P.Effect.bind('relPath', () => tfs.joinPath(item.relDir, fileName)),
    P.Effect.bind('link', ({ relPath }) => tfs.joinPath(tfs.PATH_SEP, relPath)),
    P.Effect.bind('path', ({ relPath }) => tfs.joinPath(item.baseDir, relPath)),
    P.Effect.map(({ link, path, relPath }) => ({
      ...item,
      path,
      relPath,
      link,
      fileName,
      fileBase,
      fileExt,
    })),
    P.Effect.mapError(toFuncSmithError)
  );
}

export function fileSetSetRelDir<T extends FileSetItemFile>(
  tfs: TinyFileSystem,
  newValue: string,
  item: T
): P.Effect.Effect<T, FuncSmithError> {
  const relDir = newValue;
  return P.pipe(
    P.Effect.Do,
    P.Effect.bind('relPath', () => tfs.joinPath(relDir, item.fileName)),
    P.Effect.bind('link', ({ relPath }) => tfs.joinPath(tfs.PATH_SEP, relPath)),
    P.Effect.bind('path', ({ relPath }) => tfs.joinPath(item.baseDir, relPath)),
    P.Effect.map(({ link, path, relPath }) => ({
      ...item,
      path,
      relPath,
      link,
      relDir,
    })),
    P.Effect.mapError(toFuncSmithError)
  );
}

// --------------------------------------------------------------------------
export function fileSetItemRename<T extends FileSetItemFile>(
  tfs: TinyFileSystem,
  renameSpec: RenameSpec,
  item: T
): P.Effect.Effect<T, FuncSmithError> {
  const relPath = item.relPath.replace(renameSpec[0], renameSpec[1]);
  const fileName = tfs.basename(relPath);
  const fileExt = tfs.extname(fileName);
  const fileBase = tfs.basename(fileName, fileExt);
  return P.pipe(
    P.Effect.Do,
    P.Effect.bind('link', () => tfs.joinPath(tfs.PATH_SEP, relPath)),
    P.Effect.bind('path', () => tfs.joinPath(item.baseDir, relPath)),
    P.Effect.bind('relDir', () => tfs.dirName(relPath)),
    P.Effect.map(({ link, path, relDir }) => ({
      ...item,
      path,
      relPath,
      link,
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
  (i: FileData): P.Effect.Effect<FileSetItemFile, TinyFileSystemError | GeneralError> => {
    const fileName = tfs.basename(i.path);
    const fileExt = tfs.extname(i.path);
    const relPath = tfs.relative(sourcePath, i.path);

    return P.pipe(
      P.Effect.Do,
      P.Effect.bind('link', () => tfs.joinPath(tfs.PATH_SEP, relPath)),
      P.Effect.bind('relDir', () => tfs.dirName(tfs.relative(sourcePath, i.path))),
      P.Effect.bind('pathHash', () => hashHex(i.path)),
      P.Effect.map(({ link, pathHash, relDir }) => ({
        _tag: FileSetItemType.File,
        [ID_PROP]: pathHash,
        path: i.path,
        baseDir: sourcePath,
        relPath,
        link,
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
    list: ReadonlyArray<DirectoryData | FileData>
  ): P.Effect.Effect<Array<FileSetItem>, TinyFileSystemError | GeneralError> =>
    P.pipe(list.filter(isFileData), P.Array.map(toFileSetItemFile(tfs, sourcePath)), P.Effect.all);

// --------------------------------------------------------------------------
export function fileSetItemContentsToString(contents: ArrayBuffer | string): string {
  return typeof contents === 'string' ? contents : arrayBufferToString(contents);
}

// --------------------------------------------------------------------------
// FIXME: check that path is a child of sourcePath
export function createFileSetItemFile(
  tfs: TinyFileSystem,
  sourcePath: string,
  path: string,
  data: string | ArrayBuffer
): P.Effect.Effect<FileSetItemFile, TinyFileSystemError | GeneralError> {
  return P.pipe(
    {
      _tag: TreeCrawlerDataType.File,
      level: 0,
      path,
      data: typeof data === 'string' ? stringToUint8Array(data) : data,
    },
    toFileSetItemFile(tfs, sourcePath)
  );
}
