import type { FileSetItem } from '../../lib/fileSet';
import { isFrontMatter } from '../../lib/frontMatter';
import type { FrontMatter } from '../FrontMatter/types';
import type { DraftsOptions } from './types';

export const draftsShouldKeep =
  <T extends FileSetItem>(options: Partial<DraftsOptions>, defaultOptions: DraftsOptions) =>
  (item: T | FrontMatter<T>) => {
    const safeOptions: DraftsOptions = { ...defaultOptions, ...options };
    const frontMatter = isFrontMatter(item) ? item.frontMatter : {};
    const draft = frontMatter.draft ?? safeOptions.default;
    return safeOptions.include ? !!draft : !draft;
  };
