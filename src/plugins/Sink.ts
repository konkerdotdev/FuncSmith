import * as P from '@konker.dev/effect-ts-prelude';

import { toFuncSmithError } from '../error';
import type { FileSetItem } from '../lib/fileSet';
import type { FileSetMappingResult } from '../types';
import { FsDepContext, FsDepSink, FsDepWriter } from '../types';
import { wrapInjection } from './lib';
import type { RootContext } from './Root';

export type SinkContext = {
  readonly fullSinkPath: string;
  readonly sinkPath: string;
};

// TODO: RootContext is not enforced on the type level?
export const sinkInjectionCtor =
  <IF extends FileSetItem, R, C extends RootContext>(sinkPath: string) =>
  (
    result: FileSetMappingResult<IF, R | FsDepContext<C>>
  ): FileSetMappingResult<IF, Exclude<R, FsDepSink | FsDepContext<C & SinkContext>> | FsDepContext<C> | FsDepWriter> =>
    P.pipe(
      P.Effect.Do,
      P.Effect.bind('deps', () => P.Effect.all([FsDepContext<C>(), FsDepWriter])),
      P.Effect.bind('fullSinkPath', ({ deps: [fsDepContext, fsDepWriter] }) =>
        fsDepWriter.tinyFs.isAbsolute(sinkPath)
          ? P.Effect.succeed(sinkPath)
          : P.pipe(fsDepWriter.tinyFs.joinPath(fsDepContext.rootDirPath, sinkPath), P.Effect.mapError(toFuncSmithError))
      ),
      P.Effect.flatMap(({ deps: [fsDepContext, _], fullSinkPath }) =>
        P.pipe(
          result,
          P.Effect.provideService(FsDepSink, FsDepSink.of({ sinkPath: fullSinkPath })),
          P.Effect.provideService(
            FsDepContext<C & SinkContext>(),
            FsDepContext<C & SinkContext>().of({
              ...fsDepContext,
              fullSinkPath,
              sinkPath,
            })
          )
        )
      )
    );

export const sink = wrapInjection(sinkInjectionCtor);
