import * as P from '@konker.dev/effect-ts-prelude';

import type { FileSet, FileSetItem } from '../lib/fileSet';
import type { FrontMatter } from '../lib/frontMatter';
import { extractFrontMatter } from '../lib/frontMatter';
import type { FileSetMapping } from '../types';
import { wrapMapping } from './lib';

export const frontMatterMappingCtor =
  <IF extends FileSetItem>(): FileSetMapping<IF, FrontMatter<IF>, never> =>
  (fileSet: FileSet<IF>) =>
    P.pipe(fileSet, P.Array.map(extractFrontMatter), P.Effect.all);

export const frontMatter = wrapMapping(frontMatterMappingCtor);
