import type * as P from '@konker.dev/effect-ts-prelude';

import type { Environment } from '../index';

export const FILE_ITEM_TYPE_FILE = 'FILE_ITEM_TYPE_FILE';
export const FILE_ITEM_TYPE_DIR = 'FILE_ITEM_TYPE_DIR';
export type FileItemType = typeof FILE_ITEM_TYPE_FILE | typeof FILE_ITEM_TYPE_DIR;

export type FileItem = {
  name: string;
  type: FileItemType;
  content: Buffer;
};

export type FileSet = Array<FileItem>;

export type FileSetMapping<D extends Environment> = (a: FileSet) => P.Effect.Effect<D, Error, FileSet>;
