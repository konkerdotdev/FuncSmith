import * as P from '@konker.dev/effect-ts-prelude';

import type { FileSet } from '../mappings';
import type { FileSink, FileSinkWriter } from './index';

export const fsFileSinkWriter: FileSinkWriter = (_fs: FileSink, _d: FileSet) => {
  console.log('KONK90', _d);
  // Write the list of FileItems to the file system at the given path
  return P.Effect.succeed(P.Effect.unit);
};
