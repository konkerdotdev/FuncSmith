import * as P from '@konker.dev/effect-ts-prelude';

import { toFuncSmithError } from '../error';
import type { FileSet, FileSetItem } from '../lib/fileSet';
import type { FileSetMapping } from '../types';
import { FuncSmithContext, FuncSmithContextReader, FuncSmithContextSource } from '../types';

export const source =
  <IF extends FileSetItem, OF extends FileSetItem, R>(sourcePath: string) =>
  (
    next: FileSetMapping<IF, OF, R | FuncSmithContext>
  ): FileSetMapping<IF, OF, Exclude<R, FuncSmithContextSource> | FuncSmithContext | FuncSmithContextReader> =>
  (ifs: FileSet<IF>) =>
    P.pipe(
      P.Effect.Do,
      P.Effect.bind('deps', () => P.Effect.all([FuncSmithContext<IF>(), FuncSmithContextReader])),
      P.Effect.bind('fullSourcePath', ({ deps: [funFuncSmithContext, funcSmithContextReader] }) =>
        funcSmithContextReader.tinyFs.isAbsolute(sourcePath)
          ? P.Effect.succeed(sourcePath)
          : P.pipe(
              funcSmithContextReader.tinyFs.joinPath(funFuncSmithContext.rootDirPath, sourcePath),
              P.Effect.mapError(toFuncSmithError)
            )
      ),
      P.Effect.flatMap(({ fullSourcePath }) =>
        P.pipe(
          next(ifs),
          P.Effect.provideService(FuncSmithContextSource, FuncSmithContextSource.of({ sourcePath: fullSourcePath }))
        )
      )
    );
