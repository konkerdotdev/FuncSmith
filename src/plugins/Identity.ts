import * as P from '@konker.dev/effect-ts-prelude';

import type { FileSet, FileSetItem } from '../lib/fileSet';
import { wrapMapping } from './lib';

export function identityMapping<IF extends FileSetItem>(fileSet: FileSet<IF>) {
  return P.Effect.succeed(fileSet);
}

export const identity = wrapMapping(() => identityMapping);
