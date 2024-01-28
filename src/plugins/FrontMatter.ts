import * as P from '@konker.dev/effect-ts-prelude';

import type { FileSet, FileSetItem } from '../lib/fileSet';
import type { FrontMatter } from '../lib/frontMatter';
import { extractFrontMatter } from '../lib/frontMatter';
import type { FileSetMapping } from '../types';

export const frontMatter =
  <IF extends FileSetItem, OF extends FrontMatter<IF>, R>() =>
  (next: FileSetMapping<FrontMatter<IF>, OF, R>): FileSetMapping<IF, OF, R> =>
  (fileSet: FileSet<IF>) =>
    P.pipe(fileSet, P.Array.map(extractFrontMatter), P.Effect.all, P.Effect.flatMap(next));
