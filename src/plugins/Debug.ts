import * as P from '@konker.dev/effect-ts-prelude';

import type { FileSet, FileSetItem } from '../lib/fileSet';
import type { FileSetMapping } from '../types';
import { FuncSmithContextEnv, FuncSmithContextMetadata } from '../types';

// --------------------------------------------------------------------------
export const debugMapping =
  <IF extends FileSetItem>(prefix: string): FileSetMapping<IF, IF, FuncSmithContextEnv | FuncSmithContextMetadata> =>
  (fileSet: FileSet<IF>) =>
    P.pipe(
      P.Effect.all([FuncSmithContextEnv, FuncSmithContextMetadata]),
      P.Effect.flatMap(([funcSmithContextEnv, funcSmithContextMetadata]) =>
        P.pipe(
          P.Effect.succeed(fileSet),
          P.Effect.tap(() => P.Console.log(prefix)),
          P.Effect.tap(() => P.Console.log(funcSmithContextEnv.env)),
          P.Effect.tap(() => P.Console.log(funcSmithContextMetadata.metadata)),
          P.Effect.tap(P.Console.log)
        )
      )
    );

// --------------------------------------------------------------------------
export const debug =
  <IF extends FileSetItem, OF extends FileSetItem, R>(prefix: string) =>
  (next: FileSetMapping<IF, OF, R>): FileSetMapping<IF, OF, R | FuncSmithContextEnv | FuncSmithContextMetadata> =>
  (fileSet: FileSet<IF>) =>
    P.pipe(fileSet, debugMapping(prefix), P.Effect.flatMap(next));
