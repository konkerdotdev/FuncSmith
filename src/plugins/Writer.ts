import * as P from '@konker.dev/effect-ts-prelude';

import type { FileSet, FileSetItem } from '../lib/fileSet';
import type { FileSetMapping } from '../types';
import { FsDepSink, FsDepWriter } from '../types';
import { wrapMapping } from './lib';

export const writerMappingCtor =
  <IF extends FileSetItem>(): FileSetMapping<IF, IF, FsDepSink | FsDepWriter> =>
  (fileSet: FileSet<IF>) =>
    P.pipe(
      P.Effect.all([FsDepSink, FsDepWriter]),
      P.Effect.tap(([fsDepSink, fsDepWriter]) => fsDepWriter.writer(fsDepSink.sinkPath, fileSet)),
      P.Effect.map((_) => fileSet)
    );

export const writer = wrapMapping(writerMappingCtor);
