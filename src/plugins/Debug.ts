import * as P from '@konker.dev/effect-ts-prelude';

import type { FileSet, FileSetItem } from '../lib/fileSet';
import type { DefaultContext, FileSetMapping } from '../types';
import { FsDepContext, FsDepEnv } from '../types';
import { wrapMapping } from './lib';

export type DebugFunc = <IF extends FileSetItem, C extends DefaultContext>(
  fsDepEnv: FsDepEnv,
  fsDepContext: FsDepContext<C>,
  fileSet: FileSet<IF>
) => void;

export const debugMappingCtor =
  <IF extends FileSetItem, C extends DefaultContext>(
    debugFunc: DebugFunc = () => P.Effect.none
  ): FileSetMapping<IF, IF, FsDepEnv | FsDepContext<C>> =>
  (fileSet: FileSet<IF>) =>
    P.pipe(
      P.Effect.all([FsDepEnv, FsDepContext<C>()]),
      P.Effect.flatMap(([fsDepEnv, fsDepContext]) =>
        P.pipe(
          P.Effect.succeed(fileSet),
          P.Effect.tap(() => debugFunc(fsDepEnv, fsDepContext, fileSet))
        )
      )
    );

export const debug = wrapMapping(debugMappingCtor);
