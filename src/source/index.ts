import * as P from '@konker.dev/effect-ts-prelude';

import type { Environment } from '../index';
import type { FileSet } from '../mappings';
import { fsFileSourceReader } from './FsFileSourceReader';

export type FileSource = {
  type: string;
  path: string;
};

export type FileSourceReader = <D extends Environment>(fs: FileSource) => P.Effect.Effect<D, Error, FileSet>;

export type FileSourceReaderFactory = <D extends Environment>(
  type: string
) => P.Effect.Effect<D, Error, FileSourceReader>;

export const readerFactory: FileSourceReaderFactory = (_type) => {
  //[TODO: fill in something for fs here to start with]
  return P.Effect.succeed(fsFileSourceReader);
};
