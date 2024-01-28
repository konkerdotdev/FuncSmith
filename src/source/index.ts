import type * as P from '@konker.dev/effect-ts-prelude';

import type { FuncSmithError } from '../error';
import type { FileSet, FileSetItem } from '../lib/fileSet';

export type FileSource = {
  type: string;
  path: string;
};

export type FileSourceReader<T extends FileSetItem> = (
  sourcePath: string,
  globPattern?: string
) => P.Effect.Effect<never, FuncSmithError, FileSet<T>>;

/* FIXME: remove?
export type FileSourceReaderFactory<R, T extends FileSetItem> = (
  type: string
) => P.Effect.Effect<R, FuncSmithError, FileSourceReader<R, T>>;

export const readerFactory = <R, T extends FileSetItem>(
  _type: string
): P.Effect.Effect<R, FuncSmithError, FileSourceReader<R, T>> => {
  //[TODO: fill in something for fs here to start with]
  return P.Effect.succeed(fsFileSourceReader);
};
*/
