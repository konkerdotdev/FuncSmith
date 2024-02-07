import * as P from '@konker.dev/effect-ts-prelude';

import type { FileSetItem } from '../lib/fileSet';
import type { FileSetMappingResult } from '../types';
import { FuncSmithContextEnv } from '../types';
import { wrapInjection } from './lib';

export const DEFAULT_ENV = {};

export const envInjectionCtor =
  <IF extends FileSetItem, R>(env: Record<string, unknown> = DEFAULT_ENV) =>
  (result: FileSetMappingResult<IF, R>): FileSetMappingResult<IF, Exclude<R, FuncSmithContextEnv>> =>
    P.pipe(result, P.Effect.provideService(FuncSmithContextEnv, FuncSmithContextEnv.of({ env })));

export const env = wrapInjection(envInjectionCtor);
