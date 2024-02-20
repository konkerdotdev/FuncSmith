import * as P from '@konker.dev/effect-ts-prelude';

import { toFuncSmithError } from '../error';
import type { FileSetItem } from '../lib/fileSet';
import type { FileSetMappingResult } from '../types';
import { FsDepContext, FsDepReader, FsDepSource } from '../types';
import { wrapInjection } from './lib';

export const sourceInjectionCtor =
  <IF extends FileSetItem, R>(sourcePath: string) =>
  (
    result: FileSetMappingResult<IF, R>
  ): FileSetMappingResult<IF, Exclude<R, FsDepSource> | FsDepContext<IF> | FsDepReader> =>
    P.pipe(
      P.Effect.Do,
      P.Effect.bind('deps', () => P.Effect.all([FsDepContext<IF>(), FsDepReader])),
      P.Effect.bind('fullSourcePath', ({ deps: [fsDepContext, fsDepReader] }) =>
        fsDepReader.tinyFs.isAbsolute(sourcePath)
          ? P.Effect.succeed(sourcePath)
          : P.pipe(
              fsDepReader.tinyFs.joinPath(fsDepContext.rootDirPath, sourcePath),
              P.Effect.mapError(toFuncSmithError)
            )
      ),
      P.Effect.flatMap(({ fullSourcePath }) =>
        P.pipe(result, P.Effect.provideService(FsDepSource, FsDepSource.of({ sourcePath: fullSourcePath })))
      )
    );

export const source = wrapInjection(sourceInjectionCtor);
