import * as P from '@konker.dev/effect-ts-prelude';

import type { FileSet, FileSetItem } from '../lib/fileSet';
import type { FileSetMapping } from '../types';
import { FuncSmithContextEnv, FuncSmithContextMetadata } from '../types';
import { wrapMapping } from './lib';

export const DEFAULT_DEBUG_PREFIX = 'DEBUG';

export const debugMappingCtor =
  <IF extends FileSetItem>(
    prefix: string = DEFAULT_DEBUG_PREFIX
  ): FileSetMapping<IF, IF, FuncSmithContextEnv | FuncSmithContextMetadata> =>
  (fileSet: FileSet<IF>) =>
    P.pipe(
      P.Effect.all([FuncSmithContextEnv, FuncSmithContextMetadata]),
      P.Effect.flatMap(([funcSmithContextEnv, funcSmithContextMetadata]) =>
        P.pipe(
          P.Effect.succeed(fileSet),
          P.Effect.tap(() => P.Console.log(prefix)),
          P.Effect.tap(() => P.Console.log(funcSmithContextEnv.env)),
          P.Effect.tap(() => P.Console.log(funcSmithContextMetadata.metadata)),
          P.Effect.tap(() => P.Console.log(funcSmithContextMetadata.metadata.collections)),
          P.Effect.tap(P.Console.log)
        )
      )
    );

export const debug = wrapMapping(debugMappingCtor);
