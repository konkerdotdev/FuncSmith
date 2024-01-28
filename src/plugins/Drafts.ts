import * as P from '@konker.dev/effect-ts-prelude';

import type { FileSet, FileSetItem } from '../lib/fileSet';
import type { FrontMatter } from '../lib/frontMatter';
import type { FileSetMapping } from '../types';

export type DraftsOptions = {
  readonly default: boolean;
  readonly include: boolean;
};
export const DEFAULT_DRAFTS_OPTIONS: DraftsOptions = {
  default: false,
  include: false,
};

export const shouldKeep =
  <T extends FrontMatter<FileSetItem>>(options: Partial<DraftsOptions>) =>
  (item: T) => {
    const safeOptions: DraftsOptions = { ...DEFAULT_DRAFTS_OPTIONS, ...options };
    const draft = item.frontMatter?.draft ?? safeOptions.default;
    return safeOptions.include ? !!draft : !draft;
  };

export const drafts =
  <IF extends FrontMatter<FileSetItem>, OF extends IF, R>(options: Partial<DraftsOptions> = DEFAULT_DRAFTS_OPTIONS) =>
  (next: FileSetMapping<IF, OF, R>): FileSetMapping<IF, OF, R> =>
  (fileSet: FileSet<IF>) =>
    P.pipe(fileSet, P.Array.filter(shouldKeep(options)), next);
