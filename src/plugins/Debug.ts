import * as P from '@konker.dev/effect-ts-prelude';

import type { FileSet, FileSetItem } from '../lib/fileSet';
import type { FileSetMapping } from '../types';
import { FsDepEnv, FsDepMetadata } from '../types';
import { wrapMapping } from './lib';

export const DEFAULT_DEBUG_PREFIX = 'DEBUG';

export const debugMappingCtor =
  <IF extends FileSetItem>(prefix: string = DEFAULT_DEBUG_PREFIX): FileSetMapping<IF, IF, FsDepEnv | FsDepMetadata> =>
  (fileSet: FileSet<IF>) =>
    P.pipe(
      P.Effect.all([FsDepEnv, FsDepMetadata]),
      P.Effect.flatMap(([fsDepEnv, fsDepMetadata]) =>
        P.pipe(
          P.Effect.succeed(fileSet),
          P.Effect.tap(() => P.Console.log(prefix)),
          P.Effect.tap(() => P.Console.log(fsDepEnv.env)),
          P.Effect.tap(() => P.Console.log(fsDepMetadata.metadata)),
          P.Effect.tap(() => P.Console.log(fsDepMetadata.metadata.collections)),
          P.Effect.tap(P.Console.log)
        )
      )
    );

export const debug = wrapMapping(debugMappingCtor);
