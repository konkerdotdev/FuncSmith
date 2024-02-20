import * as P from '@konker.dev/effect-ts-prelude';

import { toFuncSmithError } from '../error';
import type { FileSet, FileSetItem } from '../lib/fileSet';
import { FsDepSink, FsDepWriter } from '../types';
import { wrapMapping } from './lib';

export const cleanerMapping = <IF extends FileSetItem>(fileSet: FileSet<IF>) =>
  P.pipe(
    P.Effect.all([FsDepSink, FsDepWriter]),
    P.Effect.tap(([fsDepSink, fsDepWriter]) => fsDepWriter.tinyFs.removeDirectory(fsDepSink.sinkPath)),
    P.Effect.mapError(toFuncSmithError),
    P.Effect.map((_) => fileSet)
  );

export const cleaner = wrapMapping(() => cleanerMapping);
