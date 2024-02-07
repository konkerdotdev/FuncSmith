import * as P from '@konker.dev/effect-ts-prelude';
import micromatch from 'micromatch';

import type { FileSet, FileSetItem } from '../lib/fileSet';
import type { FrontMatter } from '../lib/frontMatter';
import type { FileSetMapping } from '../types';
import { wrapMapping } from './lib';

// --------------------------------------------------------------------------
export type FilterOptions = {
  readonly drop: Array<string>;
  readonly keep: Array<string>;
};
export const DEFAULT_FILTER_OPTIONS: FilterOptions = {
  drop: [],
  keep: ['**'],
};

/**
 * First `drop`, then `keep` is applied
 */
export const filterShouldKeep =
  <T extends FrontMatter<FileSetItem>>(options: Partial<FilterOptions>) =>
  (item: T) => {
    const safeOptions: FilterOptions = { ...DEFAULT_FILTER_OPTIONS, ...options };
    const drop = micromatch.some([item.relPath], safeOptions.drop);
    const keep = micromatch.some([item.relPath], safeOptions.keep);

    return !drop && keep;
  };

// --------------------------------------------------------------------------
export const filterMappingCtor =
  <IF extends FrontMatter<FileSetItem>>(
    options: Partial<FilterOptions> = DEFAULT_FILTER_OPTIONS
  ): FileSetMapping<IF, IF, never> =>
  (fileSet: FileSet<IF>) =>
    P.pipe(fileSet, P.Array.filter(filterShouldKeep(options)), P.Effect.succeed);

export const filter = wrapMapping(filterMappingCtor);
