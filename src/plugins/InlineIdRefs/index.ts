import * as P from '@konker.dev/effect-ts-prelude';

import type { FileSet, FileSetItem } from '../../lib/fileSet';
import type { DefaultContext, FileSetMapping } from '../../types';
import { FsDepContext } from '../../types';
import * as lib from './lib';

// --------------------------------------------------------------------------
export const inlineIdRefs =
  <IF extends FileSetItem, OF extends FileSetItem, R, C extends DefaultContext>() =>
  (next: FileSetMapping<IF, OF, R>): FileSetMapping<IF, OF, Exclude<R, FsDepContext<C>> | FsDepContext<C>> =>
  (fileSet: FileSet<IF>) => {
    return P.pipe(
      P.Effect.Do,
      P.Effect.bind('fsDepContext', () => FsDepContext<C>()),
      P.Effect.bind('inlinedFileSet', () => lib.inlineFileSetProps(fileSet)),
      P.Effect.bind('inlinedContext', ({ fsDepContext, inlinedFileSet }) =>
        lib.inlineContextProps(inlinedFileSet, fsDepContext)
      ),
      P.Effect.flatMap(({ inlinedContext, inlinedFileSet }) =>
        P.pipe(
          inlinedFileSet,
          next,
          P.Effect.provideService(
            FsDepContext<C>(),
            FsDepContext<C>().of({
              ...inlinedContext,
            })
          )
        )
      )
    );
  };
