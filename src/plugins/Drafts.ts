import * as P from '@konker.dev/effect-ts-prelude';

import type { FileSet, FileSetItem } from '../lib/fileSet';
import type { FrontMatter } from '../lib/frontMatter';
import type { FileSetMapping } from '../types';
import { wrapMapping } from './lib';

// --------------------------------------------------------------------------
export type DraftsOptions = {
  readonly default: boolean;
  readonly include: boolean;
};
export const DEFAULT_DRAFTS_OPTIONS: DraftsOptions = {
  default: false,
  include: false,
};

export const draftsShouldKeep =
  <T extends FileSetItem>(options: Partial<DraftsOptions>) =>
  (item: T | FrontMatter<T>) => {
    const safeOptions: DraftsOptions = { ...DEFAULT_DRAFTS_OPTIONS, ...options };
    const frontMatter = 'frontMatter' in item ? item.frontMatter : {};
    const draft = frontMatter.draft ?? safeOptions.default;
    return safeOptions.include ? !!draft : !draft;
  };

// --------------------------------------------------------------------------
export const draftsMappingCtor =
  <IF extends FileSetItem>(options: Partial<DraftsOptions> = DEFAULT_DRAFTS_OPTIONS): FileSetMapping<IF, IF, never> =>
  (fileSet: FileSet<IF>) =>
    P.pipe(fileSet, P.Array.filter(draftsShouldKeep(options)), P.Effect.succeed);

export const drafts = wrapMapping(draftsMappingCtor);
