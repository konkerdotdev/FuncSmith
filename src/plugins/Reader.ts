import * as P from '@konker.dev/effect-ts-prelude';

import type { FileSet, FileSetItem } from '../lib/fileSet';
import type { FileSetMapping } from '../types';
import { FuncSmithContextReader, FuncSmithContextSource } from '../types';
import { wrapMapping } from './lib';

export const readerMappingCtor =
  <IF extends FileSetItem>(
    globPattern?: string
  ): FileSetMapping<IF, IF | FileSetItem, FuncSmithContextSource | FuncSmithContextReader> =>
  (_fileSet: FileSet<IF>) =>
    P.pipe(
      P.Effect.all([FuncSmithContextSource, FuncSmithContextReader]),
      P.Effect.flatMap(([funcSmithContextSource, funcSmithContextReader]) =>
        funcSmithContextReader.reader(funcSmithContextSource.sourcePath, globPattern)
      ),
      P.Effect.map((newFileSet) => [..._fileSet, ...newFileSet])
    );

export const reader = wrapMapping(readerMappingCtor);
