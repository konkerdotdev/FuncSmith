import * as P from '@konker.dev/effect-ts-prelude';

import type { FileSet, FileSetItem } from '../../lib/fileSet';
import type { FileSetMapping } from '../../types';
import { FsDepMetadata } from '../../types';
import * as lib from './lib';
import type { NavOptions } from './types';

export const DEFAULT_NAV_OPTIONS: NavOptions = {
  navProperty: 'nav',
  sortBy: 'navOrder',
  reverse: false,
} as const;

// --------------------------------------------------------------------------
export const nav =
  <IF extends FileSetItem, OF extends FileSetItem, R>(options: Partial<NavOptions> = DEFAULT_NAV_OPTIONS) =>
  (next: FileSetMapping<IF, OF, R>): FileSetMapping<IF, OF, R | FsDepMetadata> =>
  (fileSet: FileSet<IF>) => {
    const safeOptions = { ...DEFAULT_NAV_OPTIONS, ...options };

    return P.pipe(
      P.Effect.Do,
      P.Effect.bind('fsDepMetadata', () => FsDepMetadata),
      P.Effect.bind('nav', () => lib.createNav(safeOptions, fileSet)),
      P.Effect.flatMap(({ fsDepMetadata, nav }) =>
        P.pipe(
          fileSet,
          next,
          P.Effect.provideService(
            FsDepMetadata,
            FsDepMetadata.of({
              metadata: {
                ...fsDepMetadata.metadata,
                nav,
              },
            })
          )
        )
      )
    );
  };
