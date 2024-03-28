import * as P from '@konker.dev/effect-ts-prelude';

import type { FileSet, FileSetItem } from '../../lib/fileSet';
import type { DefaultContext, FileSetMapping } from '../../types';
import { FsDepContext } from '../../types';
import type { FrontMatter } from '../FrontMatter/types';
import * as lib from './lib';
import type { NavItem, NavOptions } from './types';

export const DEFAULT_NAV_OPTIONS: NavOptions = {
  navProperty: 'nav',
  sortBy: 'navOrder',
  reverse: false,
} as const;

// --------------------------------------------------------------------------
export type NavContext<IF extends FileSetItem> = {
  readonly navIndex: FileSet<NavItem<FrontMatter<IF>>>;
};

export const nav =
  <IF extends FileSetItem, OF extends FileSetItem, R, C extends DefaultContext>(
    options: Partial<NavOptions> = DEFAULT_NAV_OPTIONS
  ) =>
  (
    next: FileSetMapping<IF, OF, R>
  ): FileSetMapping<IF, OF, Exclude<R, FsDepContext<C & NavContext<IF>>> | FsDepContext<C>> =>
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
            FsDepContext<C & NavContext<IF>>(),
            FsDepContext<C & NavContext<IF>>().of({
              ...fsDepContext,
              navIndex: nav,
            })
          )
        )
      )
    );
  };
