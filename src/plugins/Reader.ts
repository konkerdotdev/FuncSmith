import * as P from '@konker.dev/effect-ts-prelude';

import type { FileSet, FileSetItem } from '../lib/fileSet';
import type { FileSetMapping } from '../types';
import { FuncSmithContextReader, FuncSmithContextSource } from '../types';

/* FIXME: restore
// --------------------------------------------------------------------------
export const readerMapping =
  <IF extends FileSetItem>(
    globPattern?: string
  ): FileSetMapping<IF, FileSetItem, FuncSmithContextSource | FuncSmithContextReader> =>
  (_fileSet: FileSet<IF>) =>
    P.pipe(
      P.Effect.all([FuncSmithContextSource, FuncSmithContextReader]),
      P.Effect.flatMap(([funcSmithContextSource, funcSmithContextReader]) =>
        funcSmithContextReader.reader(funcSmithContextSource.sourcePath, globPattern)
      )
    );

// --------------------------------------------------------------------------
export const reader =
  <IF extends FileSetItem, OF extends FileSetItem, R>(globPattern?: string) =>
  (
    next: FileSetMapping<FileSetItem, OF, R>
  ): FileSetMapping<IF, OF, R | FuncSmithContextSource | FuncSmithContextReader> =>
  (fileSet: FileSet<IF>) =>
    P.pipe(fileSet, readerMapping(globPattern), P.Effect.flatMap(next));
*/

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
