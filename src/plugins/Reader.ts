import * as P from '@konker.dev/effect-ts-prelude';

import type { FileSet, FileSetItem } from '../lib/fileSet';
import type { FileSetMapping } from '../types';
import { FsDepReader, FsDepSource } from '../types';
import { wrapMapping } from './lib';

export const readerMappingCtor =
  <IF extends FileSetItem>(globPattern?: string): FileSetMapping<IF, IF | FileSetItem, FsDepSource | FsDepReader> =>
  (_fileSet: FileSet<IF>) =>
    P.pipe(
      P.Effect.all([FsDepSource, FsDepReader]),
      P.Effect.flatMap(([fsDepSource, fsDepReader]) => fsDepReader.reader(fsDepSource.sourcePath, globPattern)),
      P.Effect.map((newFileSet) => [..._fileSet, ...newFileSet])
    );

export const reader = wrapMapping(readerMappingCtor);
