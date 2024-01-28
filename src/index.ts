/*
  Note: even though we aim to allow for almost any source/destination of data,
  we use the metaphor of a "file" and a "directory" tree to represent the data.

  The design is initially informed by fs and also S3 as source and/or sink
*/
import type * as P from '@konker.dev/effect-ts-prelude';

import type { FuncSmithError } from './error';
import type { FileSet, FileSetItem } from './lib/fileSet';
import type { FileSetMapping, FuncSmithContext } from './types';

// --------------------------------------------------------------------------
export * from './plugins';
export * from './types';

// --------------------------------------------------------------------------
export const EMPTY_FILESET = <T extends FileSetItem>(): FileSet<T> => [];

export function FuncSmith<T extends FileSetItem, R>(
  pluginStack: FileSetMapping<FileSetItem, T, R>
): P.Effect.Effect<R | FuncSmithContext, FuncSmithError, FileSet<T>> {
  return pluginStack(EMPTY_FILESET<T>());
}
