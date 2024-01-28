import * as P from '@konker.dev/effect-ts-prelude';

import type { FileSet, FileSetItem } from '../lib/fileSet';
import type { FrontMatter } from '../lib/frontMatter';
import type { FileSetMapping } from '../types';
import { FuncSmithContextSink, FuncSmithContextWriter } from '../types';

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
