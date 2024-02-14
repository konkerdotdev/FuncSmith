import * as P from '@konker.dev/effect-ts-prelude';

import type { FileSet, FileSetItem } from '../../lib/fileSet';
import type { FileSetMapping } from '../../types';
import { wrapMapping } from '../lib';
import { processItemFrontMatter } from './lib';
import type { FrontMatter, FrontMatterOptions } from './types';

// --------------------------------------------------------------------------
export const DEFAULT_FRONT_MATTER_OPTIONS: FrontMatterOptions = {
  globPattern: '**/*.md',
};

// --------------------------------------------------------------------------
export const frontMatterMappingCtor =
  <IF extends FileSetItem>(
    options: FrontMatterOptions = DEFAULT_FRONT_MATTER_OPTIONS
  ): FileSetMapping<IF, IF | FrontMatter<IF>, never> =>
  (fileSet: FileSet<IF>) => {
    const safeOptions = { ...DEFAULT_FRONT_MATTER_OPTIONS, ...options };
    return P.pipe(fileSet, P.Array.map(processItemFrontMatter(safeOptions.globPattern)), P.Effect.all);
  };

export const frontMatter = wrapMapping(frontMatterMappingCtor);
