import * as P from '@konker.dev/effect-ts-prelude';

import type { FileSet, FileSetItem } from '../lib/fileSet';
import type { FrontMatter } from '../lib/frontMatter';
import type { FileSetMapping } from '../types';
import { FuncSmithContextSink, FuncSmithContextWriter } from '../types';

/* FIXME: restore
// --------------------------------------------------------------------------
export const writerMapping =
  <IF extends FileSetItem>(): FileSetMapping<IF, IF, FuncSmithContextSink | FuncSmithContextWriter> =>
  (fileSet: FileSet<IF>) =>
    P.pipe(
      P.Effect.all([FuncSmithContextSink, FuncSmithContextWriter]),
      P.Effect.tap(([funcSmithContextSink, funcSmithContextWriter]) =>
        funcSmithContextWriter.writer(funcSmithContextSink.sinkPath, fileSet)
      ),
      P.Effect.map((_) => fileSet)
    );

// --------------------------------------------------------------------------
export const writer =
  <IF extends FileSetItem, OF extends FileSetItem, R>() =>
  (next: FileSetMapping<IF, OF, R>): FileSetMapping<IF, OF, R | FuncSmithContextSink | FuncSmithContextWriter> =>
  (fileSet: FileSet<IF>) =>
    P.pipe(fileSet, writerMapping(), P.Effect.flatMap(next));
*/

export const writer =
  <T extends FrontMatter<FileSetItem>, R>() =>
  (next: FileSetMapping<T, T, R>): FileSetMapping<T, T, R | FuncSmithContextSink | FuncSmithContextWriter> =>
  (fileSet: FileSet<T>) =>
    P.pipe(
      P.Effect.all([FuncSmithContextSink, FuncSmithContextWriter]),
      P.Effect.tap(([funcSmithContextSink, funcSmithContextWriter]) =>
        funcSmithContextWriter.writer(funcSmithContextSink.sinkPath, fileSet)
      ),
      P.Effect.map((_) => fileSet),
      P.Effect.flatMap(next)
    );
