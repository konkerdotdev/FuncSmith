import * as P from '@konker.dev/effect-ts-prelude';

import type { FileSetItem } from '../lib/fileSet';
import type { FileSetMappingResult } from '../types';
import { FsDepMetadata } from '../types';
import { wrapInjection } from './lib';

/*
TODO: Amend to be an additive operation, adding stuff to metadata rather than clobbering?
*/
export const metadataInjectionCtor =
  <IF extends FileSetItem, R>(metadata: Record<string, unknown>) =>
  (result: FileSetMappingResult<IF, R>): FileSetMappingResult<IF, Exclude<R, FsDepMetadata>> =>
    P.pipe(result, P.Effect.provideService(FsDepMetadata, FsDepMetadata.of({ metadata })));

export const metadata = wrapInjection(metadataInjectionCtor);
