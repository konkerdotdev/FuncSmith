import micromatch from 'micromatch';

import type { FileSetItem } from '../../lib/fileSet';
import type { FilterOptions } from './types';

/**
 * First `drop`, then `keep` is applied
 */
export const filterShouldKeep =
  <T extends FileSetItem>(options: Partial<FilterOptions>, defaultOptions: FilterOptions) =>
  (item: T) => {
    const safeOptions: FilterOptions = { ...defaultOptions, ...options };
    const drop = micromatch.some([item.relPath], safeOptions.drop);
    const keep = micromatch.some([item.relPath], safeOptions.keep);

    return !drop || keep;
  };
