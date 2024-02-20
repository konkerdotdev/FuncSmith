import * as P from '@konker.dev/effect-ts-prelude';

import { toFuncSmithError } from '../error';
import type { FileSetItem } from '../lib/fileSet';
import type { FileSetMappingResult } from '../types';
import { FsDepContext, FsDepSink, FsDepWriter } from '../types';
import { wrapInjection } from './lib';

export const sinkInjectionCtor =
  <IF extends FileSetItem, R>(sinkPath: string) =>
  (result: FileSetMappingResult<IF, R>): FileSetMappingResult<IF, Exclude<R, FsDepSink> | FsDepContext | FsDepWriter> =>
    P.pipe(
      P.Effect.Do,
      P.Effect.bind('deps', () => P.Effect.all([FsDepContext<IF>(), FsDepWriter])),
      P.Effect.bind('fullSinkPath', ({ deps: [fsDepContext, fsDepReader] }) =>
        fsDepReader.tinyFs.isAbsolute(sinkPath)
          ? P.Effect.succeed(sinkPath)
          : P.pipe(fsDepReader.tinyFs.joinPath(fsDepContext.rootDirPath, sinkPath), P.Effect.mapError(toFuncSmithError))
      ),
      P.Effect.flatMap(({ fullSinkPath }) =>
        P.pipe(result, P.Effect.provideService(FsDepSink, FsDepSink.of({ sinkPath: fullSinkPath })))
      )
    );

export const sink = wrapInjection(sinkInjectionCtor);
