import * as P from '@konker.dev/effect-ts-prelude';

import type { FileSetItem } from '../lib/fileSet';
import type { DefaultContext, FileSetMappingResult } from '../types';
import { FsDepContext } from '../types';
import { wrapInjection } from './lib';

export type MetadataContext = {
  readonly metadata: Record<string, unknown>;
};

export const metadataInjectionCtor =
  <IF extends FileSetItem, R, C extends DefaultContext>(metadata: Record<string, unknown>) =>
  (
    result: FileSetMappingResult<IF, R>
  ): FileSetMappingResult<IF, Exclude<R, FsDepContext<C & MetadataContext>> | FsDepContext<C>> =>
    P.pipe(
      FsDepContext<C>(),
      P.Effect.flatMap((fsDepContext) =>
        P.pipe(
          result,
          P.Effect.provideService(
            FsDepContext<C & MetadataContext>(),
            FsDepContext<C & MetadataContext>().of({ ...fsDepContext, metadata })
          )
        )
      )
    );

export const metadata = wrapInjection(metadataInjectionCtor);
