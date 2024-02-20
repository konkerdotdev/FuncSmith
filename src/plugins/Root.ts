import * as P from '@konker.dev/effect-ts-prelude';

import { EMPTY_FILESET, type FileSetMappingResult } from '../index';
import type { FileSetItem } from '../lib/fileSet';
import { FsDepContext } from '../types';
import { wrapInjection } from './lib';

export const rootInjectionCtor =
  <IF extends FileSetItem, R>(rootDirPath: string) =>
  (result: FileSetMappingResult<IF, R>): FileSetMappingResult<IF, Exclude<R, FsDepContext<IF>>> =>
    P.pipe(
      result,
      P.Effect.provideService(FsDepContext<IF>(), FsDepContext<IF>().of({ fileSet: EMPTY_FILESET<IF>(), rootDirPath }))
    );

export const root = wrapInjection(rootInjectionCtor);
