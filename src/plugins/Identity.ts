import * as P from '@konker.dev/effect-ts-prelude';

import type { FileSet, FileSetItem } from '../lib/fileSet';
import type { FileSetMapping } from '../types';

export const identity =
  <IF extends FileSetItem, OF extends IF, R>() =>
  (next: FileSetMapping<IF, OF, R>): FileSetMapping<IF, OF, R> =>
  (fileSet: FileSet<IF>) =>
    P.pipe(P.Effect.succeed(fileSet), P.Effect.flatMap(next));
