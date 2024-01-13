import * as P from '@konker.dev/effect-ts-prelude';

import type { Environment } from '../index';
import type { FileSet } from '../mappings';
import { fsFileSinkWriter } from './FsFileSinkWriter';

export type FileSink = {
  type: string;
  path: string;
};

export type FileSinkWriter = <D extends Environment>(fs: FileSink, d: FileSet) => P.Effect.Effect<D, Error, void>;

export type FileSinkWriterFactory = <D extends Environment>(type: string) => P.Effect.Effect<D, Error, FileSinkWriter>;

export const writerFactory: FileSinkWriterFactory = (_type: string) => {
  //[TODO: fill in something for fs here to start with]
  return P.Effect.succeed(fsFileSinkWriter);
};
