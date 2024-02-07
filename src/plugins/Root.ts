import * as P from '@konker.dev/effect-ts-prelude';

import { EMPTY_FILESET, type FileSetMappingResult } from '../index';
import type { FileSetItem } from '../lib/fileSet';
import { FuncSmithContext } from '../types';
import { wrapInjection } from './lib';

// FIXME: remove default
export const DEFAULT_ROOT_DIR_PATH = '.';

export const rootInjectionCtor =
  <IF extends FileSetItem, R>(rootDirPath = DEFAULT_ROOT_DIR_PATH) =>
  (result: FileSetMappingResult<IF, R>): FileSetMappingResult<IF, Exclude<R, FuncSmithContext<IF>>> =>
    P.pipe(
      result,
      P.Effect.provideService(
        FuncSmithContext<IF>(),
        FuncSmithContext<IF>().of({ fileSet: EMPTY_FILESET<IF>(), rootDirPath })
      )
    );

export const root = wrapInjection(rootInjectionCtor);
