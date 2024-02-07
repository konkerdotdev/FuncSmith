import * as P from '@konker.dev/effect-ts-prelude';

import { toFuncSmithError } from '../error';
import type { FileSet, FileSetItem } from '../lib/fileSet';
import { FuncSmithContextSink, FuncSmithContextWriter } from '../types';
import { wrapMapping } from './lib';

export const cleanerMapping = <IF extends FileSetItem>(fileSet: FileSet<IF>) =>
  P.pipe(
    P.Effect.all([FuncSmithContextSink, FuncSmithContextWriter]),
    P.Effect.tap(([funcSmithContextSink, funcSmithContextWriter]) =>
      funcSmithContextWriter.tinyFs.removeDirectory(funcSmithContextSink.sinkPath)
    ),
    P.Effect.mapError(toFuncSmithError),
    P.Effect.map((_) => fileSet)
  );

export const cleaner = wrapMapping(() => cleanerMapping);
