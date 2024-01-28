import * as P from '@konker.dev/effect-ts-prelude';

import type { FileSet, FileSetItem } from '../lib/fileSet';
import type { FileSetMapping } from '../types';
import { FuncSmithContextReader, FuncSmithContextSource } from '../types';

export const reader =
  <IF extends FileSetItem, R>(globPattern?: string) =>
  (
    next: FileSetMapping<FileSetItem, IF, R>
  ): FileSetMapping<FileSetItem, FileSetItem, R | FuncSmithContextSource | FuncSmithContextReader> =>
  (_ifs: FileSet<FileSetItem>) =>
    P.pipe(
      P.Effect.all([FuncSmithContextSource, FuncSmithContextReader]),
      P.Effect.flatMap(([funcSmithContextSource, funcSmithContextReader]) =>
        funcSmithContextReader.reader(funcSmithContextSource.sourcePath, globPattern)
      ),
      P.Effect.flatMap(next)
    );
