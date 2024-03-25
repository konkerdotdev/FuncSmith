import * as P from '@konker.dev/effect-ts-prelude';

import type { DefaultContext, FileSetMappingResult } from '../index';
import type { FileSetItem } from '../lib/fileSet';
import { FsDepContext } from '../types';
import { wrapInjection } from './lib';

export type RootContext = {
  readonly rootDirPath: string;
};

export const rootInjectionCtor =
  <IF extends FileSetItem, R>(rootDirPath: string) =>
  (
    result: FileSetMappingResult<IF, R>
  ): FileSetMappingResult<IF, Exclude<R, FsDepContext<RootContext>> | FsDepContext<DefaultContext>> =>
    P.pipe(
      FsDepContext<DefaultContext>(),
      P.Effect.flatMap((fsDepContext) =>
        P.pipe(
          result,
          P.Effect.provideService(
            FsDepContext<RootContext>(),
            FsDepContext<RootContext>().of({
              ...fsDepContext,
              rootDirPath,
            })
          )
        )
      )
    );

export const root = wrapInjection(rootInjectionCtor);
