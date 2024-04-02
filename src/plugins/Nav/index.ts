import * as P from '@konker.dev/effect-ts-prelude';

import type { FileSet, FileSetItem } from '../../lib/fileSet';
import type { IdRef } from '../../lib/fileSet/idRefs';
import type { DefaultContext, FileSetMapping } from '../../types';
import { FsDepContext } from '../../types';
import * as lib from './lib';
import type { NavOptions } from './types';

export const DEFAULT_NAV_OPTIONS: NavOptions = {
  navProperty: 'nav',
  sortBy: 'navOrder',
  reverse: false,
} as const;

// --------------------------------------------------------------------------
export type NavContext = {
  readonly navIndex: ReadonlyArray<IdRef>;
};

export const nav =
  <IF extends FileSetItem, OF extends FileSetItem, R, C extends DefaultContext>(
    options: Partial<NavOptions> = DEFAULT_NAV_OPTIONS
  ) =>
  (
    next: FileSetMapping<IF, OF, R>
  ): FileSetMapping<IF, OF, Exclude<R, FsDepContext<C & NavContext>> | FsDepContext<C>> =>
  (fileSet: FileSet<IF>) => {
    const safeOptions = { ...DEFAULT_NAV_OPTIONS, ...options };

    return P.pipe(
      P.Effect.Do,
      P.Effect.bind('fsDepContext', () => FsDepContext<C>()),
      P.Effect.bind('nav', () => lib.createNav(safeOptions, fileSet)),
      P.Effect.flatMap(({ fsDepContext, nav }) =>
        P.pipe(
          fileSet,
          next,
          P.Effect.provideService(
            FsDepContext<C & NavContext>(),
            FsDepContext<C & NavContext>().of({
              ...fsDepContext,
              navIndex: nav,
            })
          )
        )
      )
    );
  };
