import * as P from '@konker.dev/effect-ts-prelude';
import micromatch from 'micromatch';

import type { FuncSmithError } from '../error';
import type { FileSet, FileSetItem } from '../lib/fileSet';
import type { FrontMatter } from '../lib/frontMatter';
import { extractFrontMatter } from '../lib/frontMatter';
import type { FileSetMapping } from '../types';
import { wrapMapping } from './lib';

export type FrontMatterOptions = {
  readonly globPattern: string;
};

export const DEFAULT_FRONT_MATTER_OPTIONS: FrontMatterOptions = {
  globPattern: '**/*.md',
};

export const processItemFrontMatter =
  <T extends FileSetItem>(globPattern: string) =>
  (item: T): P.Effect.Effect<never, FuncSmithError, T | FrontMatter<T>> =>
    micromatch.some([item.relPath], [globPattern]) ? extractFrontMatter(item) : P.Effect.succeed(item);

export const frontMatterMappingCtor =
  <IF extends FileSetItem>(
    options: FrontMatterOptions = DEFAULT_FRONT_MATTER_OPTIONS
  ): FileSetMapping<IF, IF | FrontMatter<IF>, never> =>
  (fileSet: FileSet<IF>) => {
    const safeOptions = { ...DEFAULT_FRONT_MATTER_OPTIONS, ...options };
    return P.pipe(fileSet, P.Array.map(processItemFrontMatter(safeOptions.globPattern)), P.Effect.all);
  };

export const frontMatter = wrapMapping(frontMatterMappingCtor);
