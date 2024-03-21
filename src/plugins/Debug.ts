import * as P from '@konker.dev/effect-ts-prelude';

import type { FileSet, FileSetItem } from '../lib/fileSet';
import type { FileSetMapping } from '../types';
import { FsDepEnv, FsDepMetadata } from '../types';
import { wrapMapping } from './lib';

export type DebugFunc = <IF extends FileSetItem>(
  fsDepEnv: FsDepEnv,
  fsDepMetadata: FsDepMetadata,
  fileSet: FileSet<IF>
) => void;

export const debugMappingCtor =
  <IF extends FileSetItem>(
    debugFunc: DebugFunc = () => P.Effect.none
  ): FileSetMapping<IF, IF, FsDepEnv | FsDepMetadata> =>
  (fileSet: FileSet<IF>) =>
    P.pipe(
      P.Effect.all([FsDepEnv, FsDepMetadata]),
      P.Effect.flatMap(([fsDepEnv, fsDepMetadata]) =>
        P.pipe(
          P.Effect.succeed(fileSet),
          P.Effect.tap(() => debugFunc(fsDepEnv, fsDepMetadata, fileSet))
        )
      )
    );

export const debug = wrapMapping(debugMappingCtor);
