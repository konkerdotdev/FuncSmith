import * as P from '@konker.dev/effect-ts-prelude';

import { toFuncSmithError } from '../error';
import type { FileSetItem } from '../lib/fileSet';
import type { FileSetMappingResult } from '../types';
import { FsDepContext, FsDepReader, FsDepSource } from '../types';
import { wrapInjection } from './lib';
import type { RootContext } from './Root';

export type SourceContext = {
  readonly fullSourcePath: string;
  readonly sourcePath: string;
};

// TODO: RootContext is not enforced on the type level?
export const sourceInjectionCtor =
  <IF extends FileSetItem, R, C extends RootContext>(sourcePath: string) =>
  (
    result: FileSetMappingResult<IF, R>
  ): FileSetMappingResult<
    IF,
    FsDepContext<C> | FsDepReader | Exclude<R, FsDepSource | FsDepContext<C & SourceContext>>
  > =>
    P.pipe(
      P.Effect.Do,
      P.Effect.bind('fsDepContext', () => FsDepContext<C>()),
      P.Effect.bind('fsDepReader', () => FsDepReader),
      P.Effect.bind('fullSourcePath', ({ fsDepContext, fsDepReader }) =>
        fsDepReader.tinyFs.isAbsolute(sourcePath)
          ? P.Effect.succeed(sourcePath)
          : P.pipe(
              fsDepReader.tinyFs.joinPath(fsDepContext.rootDirPath, sourcePath),
              P.Effect.mapError(toFuncSmithError)
            )
      ),
      P.Effect.flatMap(({ fsDepContext, fullSourcePath }) =>
        P.pipe(
          result,
          P.Effect.provideService(FsDepSource, FsDepSource.of({ sourcePath: fullSourcePath })),
          P.Effect.provideService(
            FsDepContext<C & SourceContext>(),
            FsDepContext<C & SourceContext>().of({
              ...fsDepContext,
              fullSourcePath,
              sourcePath,
            })
          )
        )
      )
    );

export const source = wrapInjection(sourceInjectionCtor);
