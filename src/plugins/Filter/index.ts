import * as P from '@konker.dev/effect-ts-prelude';

import type { FileSet, FileSetItem } from '../../lib/fileSet';
import type { FileSetMapping } from '../../types';
import { wrapMapping } from '../lib';
import { filterShouldKeep } from './lib';
import type { FilterOptions } from './types';

// ---------------------------------a-----------------------------------------
export const DEFAULT_FILTER_OPTIONS: FilterOptions = {
  drop: [],
  keep: ['**'],
} as const;

// --------------------------------------------------------------------------
export const filterMappingCtor =
  <IF extends FileSetItem>(options: Partial<FilterOptions> = DEFAULT_FILTER_OPTIONS): FileSetMapping<IF, IF, never> =>
  (fileSet: FileSet<IF>) =>
    P.pipe(fileSet, P.Array.filter(filterShouldKeep(options, DEFAULT_FILTER_OPTIONS)), P.Effect.succeed);

export const filter = wrapMapping(filterMappingCtor);
