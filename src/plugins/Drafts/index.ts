import * as P from '@konker.dev/effect-ts-prelude';

import type { FileSet, FileSetItem } from '../../lib/fileSet';
import type { FileSetMapping } from '../../types';
import { wrapMapping } from '../lib';
import { draftsShouldKeep } from './lib';
import type { DraftsOptions } from './types';

// --------------------------------------------------------------------------
export const DEFAULT_DRAFTS_OPTIONS: DraftsOptions = {
  default: false,
  include: false,
};

// --------------------------------------------------------------------------
export const draftsMappingCtor =
  <IF extends FileSetItem>(options: Partial<DraftsOptions> = DEFAULT_DRAFTS_OPTIONS): FileSetMapping<IF, IF, never> =>
  (fileSet: FileSet<IF>) =>
    P.pipe(fileSet, P.Array.filter(draftsShouldKeep(options, DEFAULT_DRAFTS_OPTIONS)), P.Effect.succeed);

export const drafts = wrapMapping(draftsMappingCtor);
