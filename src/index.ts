/*
  Note: even though we aim to allow for almost any source/destination of data,
  we use the metaphor of a "file" and a "directory" tree to represent the data.

  The design is initially informed by fs and also S3 as source and/or sink
*/
import * as P from '@konker.dev/effect-ts-prelude';

import type { FuncSmithError } from './error';
import type { FileSet, FileSetItem } from './lib/fileSet';
import type { FileSetMapping, FuncSmithPlugin } from './types';

// --------------------------------------------------------------------------
export * from './plugins';
export * from './types';

// --------------------------------------------------------------------------
export const EMPTY_FILESET = <T extends FileSetItem>(): FileSet<T> => [];

export function FuncSmith<T extends FileSetItem, R>(
  pluginStack: FileSetMapping<FileSetItem, T, R>
): P.Effect.Effect<FileSet<T>, FuncSmithError, R> {
  return pluginStack(EMPTY_FILESET<T>());
}

export function FuncSmith2<T extends FileSetItem, RN, RM>(
  pluginStack: FuncSmithPlugin<FileSetItem, T, RN, RM>
): P.Effect.Effect<FileSet<T>, FuncSmithError, RM> {
  return P.pipe(EMPTY_FILESET<T>(), pluginStack(P.Effect.succeed));
}
