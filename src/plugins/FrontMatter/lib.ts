import * as P from '@konker.dev/effect-ts-prelude';
import micromatch from 'micromatch';

import type { FuncSmithError } from '../../error';
import type { FileSetItem } from '../../lib/fileSet';
import { extractFrontMatter } from '../../lib/frontMatter';
import type { FrontMatter } from './types';

// --------------------------------------------------------------------------
export const processItemFrontMatter =
  <T extends FileSetItem>(globPattern: string) =>
  (item: T): P.Effect.Effect<T | FrontMatter<T>, FuncSmithError> =>
    micromatch.some([item.relPath], [globPattern]) ? extractFrontMatter(item) : P.Effect.succeed(item);
