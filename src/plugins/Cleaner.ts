import * as P from '@konker.dev/effect-ts-prelude';

import { toFuncSmithError } from '../error';
import type { FileSet, FileSetItem } from '../lib/fileSet';
import type { FileSetMapping } from '../types';
import { FuncSmithContextSink, FuncSmithContextWriter } from '../types';

export const cleaner =
  <T extends FileSetItem, R>() =>
  (next: FileSetMapping<T, T, R>): FileSetMapping<T, T, R | FuncSmithContextSink | FuncSmithContextWriter> =>
  (fileSet: FileSet<T>) =>
    P.pipe(
      P.Effect.all([FuncSmithContextSink, FuncSmithContextWriter]),
      P.Effect.tap(([funcSmithContextSink, funcSmithContextWriter]) =>
        funcSmithContextWriter.tinyFs.removeDirectory(funcSmithContextSink.sinkPath)
      ),
      P.Effect.mapError(toFuncSmithError),
      P.Effect.map((_) => fileSet),
      P.Effect.flatMap(next)
    );
