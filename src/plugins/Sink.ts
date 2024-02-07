import * as P from '@konker.dev/effect-ts-prelude';

import { toFuncSmithError } from '../error';
import type { FileSetItem } from '../lib/fileSet';
import type { FileSetMappingResult } from '../types';
import { FuncSmithContext, FuncSmithContextSink, FuncSmithContextWriter } from '../types';
import { wrapInjection } from './lib';

// FIXME: remove default
export const DEFAULT_SINK_PATH = './build';

export const sinkInjectionCtor =
  <IF extends FileSetItem, R>(sinkPath: string = DEFAULT_SINK_PATH) =>
  (
    result: FileSetMappingResult<IF, R>
  ): FileSetMappingResult<IF, Exclude<R, FuncSmithContextSink> | FuncSmithContext | FuncSmithContextWriter> =>
    P.pipe(
      P.Effect.Do,
      P.Effect.bind('deps', () => P.Effect.all([FuncSmithContext<IF>(), FuncSmithContextWriter])),
      P.Effect.bind('fullSinkPath', ({ deps: [funFuncSmithContext, funcSmithContextReader] }) =>
        funcSmithContextReader.tinyFs.isAbsolute(sinkPath)
          ? P.Effect.succeed(sinkPath)
          : P.pipe(
              funcSmithContextReader.tinyFs.joinPath(funFuncSmithContext.rootDirPath, sinkPath),
              P.Effect.mapError(toFuncSmithError)
            )
      ),
      P.Effect.flatMap(({ fullSinkPath }) =>
        P.pipe(
          result,
          P.Effect.provideService(FuncSmithContextSink, FuncSmithContextSink.of({ sinkPath: fullSinkPath }))
        )
      )
    );

export const sink = wrapInjection(sinkInjectionCtor);
