import * as P from '@konker.dev/effect-ts-prelude';

import type { FileSetItem } from '../lib/fileSet';
import type { FileSetMappingResult } from '../types';
import { FsDepEnv } from '../types';
import { wrapInjection } from './lib';

export const envInjectionCtor =
  <IF extends FileSetItem, R>(env: Record<string, unknown>) =>
  (result: FileSetMappingResult<IF, R>): FileSetMappingResult<IF, Exclude<R, FsDepEnv>> =>
    P.pipe(result, P.Effect.provideService(FsDepEnv, FsDepEnv.of({ env })));

export const env = wrapInjection(envInjectionCtor);
