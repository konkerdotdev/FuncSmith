import * as P from '@konker.dev/effect-ts-prelude';

import type { FileSet, FileSetItem } from '../lib/fileSet';
import type { FileSetMapping } from '../types';
import { FuncSmithContextSink, FuncSmithContextWriter } from '../types';
import { wrapMapping } from './lib';

export const writerMappingCtor =
  <IF extends FileSetItem>(): FileSetMapping<IF, IF, FuncSmithContextSink | FuncSmithContextWriter> =>
  (fileSet: FileSet<IF>) =>
    P.pipe(
      P.Effect.all([FuncSmithContextSink, FuncSmithContextWriter]),
      P.Effect.tap(([funcSmithContextSink, funcSmithContextWriter]) =>
        funcSmithContextWriter.writer(funcSmithContextSink.sinkPath, fileSet)
      ),
      P.Effect.map((_) => fileSet)
    );

export const writer = wrapMapping(writerMappingCtor);
