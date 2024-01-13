/*
  Note: even though we aim to allow for almost any source/destination of data,
  we use the metaphor of a "file" and a "directory" tree to represent the data.

  The design is initially informed by fs and also S3 as source and/or sink
*/
import * as P from '@konker.dev/effect-ts-prelude';

import type { FileSetMapping } from './mappings';
import type { FileSink } from './sink';
import { writerFactory } from './sink';
import type { FileSource } from './source';
import { readerFactory } from './source';

export const Environment = P.Context.Tag<Record<string, unknown>>();
export type Environment = typeof Environment;

//[TODO: instead of void return some kind of stats?]
export function FuncSmith<D extends Environment>(
  src: FileSource,
  sink: FileSink,
  // eslint-disable-next-line fp/no-rest-parameters
  ...mappings: Array<FileSetMapping<D>>
): P.Effect.Effect<D, Error, void> {
  return P.pipe(
    P.Effect.Do,
    P.Effect.bind('reader', () => readerFactory<D>(src.type)),
    P.Effect.bind('writer', () => writerFactory<D>(sink.type)),
    P.Effect.bind('fileSet', ({ reader }) => reader<D>(src)),
    P.Effect.bind('mappedFileSet', ({ fileSet }) =>
      P.pipe(
        mappings,
        P.Effect.reduce(fileSet, (acc, val) => val(acc))
      )
    ),
    P.Effect.flatMap(({ mappedFileSet, writer }) => writer<D>(sink, mappedFileSet))
  );
}
