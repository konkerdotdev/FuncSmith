import * as P from '@konker.dev/effect-ts-prelude';

import { toFuncSmithError } from '../error';
import type { FileSet, FileSetItem } from '../lib/fileSet';
import type { FileSetMapping } from '../types';
import { FuncSmithContextSink, FuncSmithContextWriter } from '../types';

export const cleanerMapping =
  <IF extends FileSetItem>(): FileSetMapping<IF, IF, FuncSmithContextSink | FuncSmithContextWriter> =>
  (fileSet: FileSet<IF>) =>
    P.pipe(
      P.Effect.all([FuncSmithContextSink, FuncSmithContextWriter]),
      P.Effect.tap(([funcSmithContextSink, funcSmithContextWriter]) =>
        funcSmithContextWriter.tinyFs.removeDirectory(funcSmithContextSink.sinkPath)
      ),
      P.Effect.mapError(toFuncSmithError),
      P.Effect.map((_) => fileSet)
    );

// --------------------------------------------------------------------------
export const cleaner =
  <IF extends FileSetItem, OF extends FileSetItem, R>() =>
  (next: FileSetMapping<IF, OF, R>): FileSetMapping<IF, OF, R | FuncSmithContextSink | FuncSmithContextWriter> =>
  (fileSet: FileSet<IF>) =>
    P.pipe(fileSet, cleanerMapping(), P.Effect.flatMap(next));
