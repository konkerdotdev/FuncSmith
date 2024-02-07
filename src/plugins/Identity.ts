import * as P from '@konker.dev/effect-ts-prelude';

import type { FileSet, FileSetItem } from '../lib/fileSet';
import type { FileSetMapping } from '../types';

// --------------------------------------------------------------------------
export const identityMapping =
  <IF extends FileSetItem>(): FileSetMapping<IF, IF, never> =>
  (fileSet: FileSet<IF>) =>
    P.Effect.succeed(fileSet);

// --------------------------------------------------------------------------
export const identity =
  <IF extends FileSetItem, OF extends FileSetItem, R>() =>
  (next: FileSetMapping<IF, OF, R>): FileSetMapping<IF, OF, R> =>
  (fileSet: FileSet<IF>) =>
    P.pipe(fileSet, identityMapping(), P.Effect.flatMap(next));
