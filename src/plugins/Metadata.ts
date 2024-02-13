import * as P from '@konker.dev/effect-ts-prelude';

import type { FileSetItem } from '../lib/fileSet';
import type { FileSetMappingResult } from '../types';
import { FuncSmithContextMetadata } from '../types';
import { wrapInjection } from './lib';

export const DEFAULT_METADATA = {};

/*
TODO: Amend to be an additive operation, adding stuff to metadata rather than clobbering?
*/

export const metadataInjectionCtor =
  <IF extends FileSetItem, R>(metadata: Record<string, unknown> = DEFAULT_METADATA) =>
  (result: FileSetMappingResult<IF, R>): FileSetMappingResult<IF, Exclude<R, FuncSmithContextMetadata>> =>
    P.pipe(result, P.Effect.provideService(FuncSmithContextMetadata, FuncSmithContextMetadata.of({ metadata })));

export const metadata = wrapInjection(metadataInjectionCtor);
