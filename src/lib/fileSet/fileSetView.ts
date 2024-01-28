import * as P from '@konker.dev/effect-ts-prelude';

import type { FileSet, FileSetItem } from './index';

/**
 * A "fileset view" should:
 * - update if the file set is updated
 * - dynamically provide its properties
 *   - proxy?
 */
export const FileSetView = <T extends FileSetItem>(fileSet: FileSet<T>) => {
  return P.Effect.succeed(fileSet);
};
