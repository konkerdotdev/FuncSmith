import type * as P from '@konker.dev/effect-ts-prelude';

import type { FuncSmithError } from '../error';
import type { FileSet, FileSetItem } from '../lib/fileSet';

export type FileSink = {
  type: string;
  path: string;
};

export type FileSinkWriter<T extends FileSetItem> = (
  sinkPath: string,
  fileSet: FileSet<T>
) => P.Effect.Effect<never, FuncSmithError, void>;

/* FIXME: remove?
export type FileSinkWriterFactory<R, T extends FileSetItem> = (
  type: string
) => P.Effect.Effect<R, FuncsmithError, FileSinkWriter<R, T>>;

export const writerFactory = (_type: string) => {
  //[TODO: fill in something for fs here to start with]
  return P.Effect.succeed(fsFileSinkWriter);
};
*/
