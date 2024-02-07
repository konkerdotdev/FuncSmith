import * as P from '@konker.dev/effect-ts-prelude';

import { toFuncSmithError } from '../error';
import type { FileSetItem } from '../lib/fileSet';
import type { FileSetMappingResult } from '../types';
import { FuncSmithContext, FuncSmithContextReader, FuncSmithContextSource } from '../types';
import { wrapInjection } from './lib';

// FIXME: remove default
export const DEFAULT_SOURCE_PATH = './src';

export const sourceInjectionCtor =
  <IF extends FileSetItem, R>(sourcePath: string = DEFAULT_SOURCE_PATH) =>
  (
    result: FileSetMappingResult<IF, R>
  ): FileSetMappingResult<IF, Exclude<R, FuncSmithContextSource> | FuncSmithContext<IF> | FuncSmithContextReader> =>
    P.pipe(
      P.Effect.Do,
      P.Effect.bind('deps', () => P.Effect.all([FuncSmithContext<IF>(), FuncSmithContextReader])),
      P.Effect.bind('fullSourcePath', ({ deps: [funFuncSmithContext, funcSmithContextReader] }) =>
        funcSmithContextReader.tinyFs.isAbsolute(sourcePath)
          ? P.Effect.succeed(sourcePath)
          : P.pipe(
              funcSmithContextReader.tinyFs.joinPath(funFuncSmithContext.rootDirPath, sourcePath),
              P.Effect.mapError(toFuncSmithError)
            )
      ),
      P.Effect.flatMap(({ fullSourcePath }) =>
        P.pipe(
          result,
          P.Effect.provideService(FuncSmithContextSource, FuncSmithContextSource.of({ sourcePath: fullSourcePath }))
        )
      )
    );

export const source = wrapInjection(sourceInjectionCtor);
