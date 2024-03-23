import * as P from '@konker.dev/effect-ts-prelude';

import type { FuncSmithError } from '../../error';
import type { FileSet, FileSetItem } from '../../lib/fileSet';
import { isFrontMatter } from '../FrontMatter/lib';
import type { FrontMatter } from '../FrontMatter/types';
import type { NavItem, NavOptions } from './types';

// --------------------------------------------------------------------------
export function isNavItem<T extends FileSetItem>(options: NavOptions) {
  return function (fileSetItem: T): fileSetItem is FrontMatter<T> {
    return isFrontMatter(fileSetItem) && fileSetItem.frontMatter?.[options.navProperty] === true;
  };
}

// --------------------------------------------------------------------------
export const navSorter =
  <IF extends FileSetItem>(options: NavOptions) =>
  (a: FrontMatter<IF>, b: FrontMatter<IF>) => {
    if ((a.frontMatter[options.sortBy] as string) < (b.frontMatter[options.sortBy] as string)) {
      return options.reverse ? 1 : -1;
    }
    if ((a.frontMatter[options.sortBy] as string) > (b.frontMatter[options.sortBy] as string)) {
      return options.reverse ? -1 : 1;
    }
    return 0;
  };

// --------------------------------------------------------------------------
export function createNav<IF extends FileSetItem>(
  options: NavOptions,
  fileSet: FileSet<IF | FrontMatter<IF>>
): P.Effect.Effect<FileSet<NavItem<FrontMatter<IF>>>, FuncSmithError> {
  return P.pipe(
    // eslint-disable-next-line fp/no-mutating-methods
    fileSet.filter(isNavItem(options)).sort(navSorter(options)),
    P.Array.map((i) => ({ ...i, nav: true })),
    P.Effect.succeed
  );
}
