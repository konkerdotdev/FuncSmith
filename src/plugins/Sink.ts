import * as P from '@konker.dev/effect-ts-prelude';

import { toFuncSmithError } from '../error';
import type { FileSet, FileSetItem } from '../lib/fileSet';
import type { FileSetMapping, FuncSmithPlugin } from '../types';
import { FuncSmithContext, FuncSmithContextSink, FuncSmithContextWriter } from '../types';

export const sink =
  <IF extends FileSetItem, OF extends FileSetItem, R>(
    sinkPath: string
  ): FuncSmithPlugin<
    IF,
    OF,
    IF,
    Exclude<R, FuncSmithContextSink> | FuncSmithContext | FuncSmithContextWriter,
    R | FuncSmithContext
  > =>
  (
    next: FileSetMapping<IF, OF, R | FuncSmithContext>
  ): FileSetMapping<IF, OF, Exclude<R, FuncSmithContextSink> | FuncSmithContext | FuncSmithContextWriter> =>
  (ifs: FileSet<IF>) =>
    P.pipe(
      P.Effect.Do,
      P.Effect.bind('deps', () => P.Effect.all([FuncSmithContext<IF>(), FuncSmithContextWriter])),
      P.Effect.bind('fullSinkPath', ({ deps: [funFuncSmithContext, funcSmithContextReader] }) =>
        funcSmithContextReader.tinyFs.isAbsolute(sinkPath)
          ? P.Effect.succeed(sinkPath)
          : P.pipe(
              funcSmithContextReader.tinyFs.joinPath(funFuncSmithContext.rootDirPath, sinkPath),
              P.Effect.mapError(toFuncSmithError)
            )
      ),
      P.Effect.flatMap(({ fullSinkPath }) =>
        P.pipe(
          next(ifs),
          P.Effect.provideService(FuncSmithContextSink, FuncSmithContextSink.of({ sinkPath: fullSinkPath }))
        )
      )
    );
