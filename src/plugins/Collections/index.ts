import * as P from '@konker.dev/effect-ts-prelude';

import type { FileSet, FileSetItem } from '../../lib/fileSet';
import type { DefaultContext, FileSetMapping } from '../../types';
import { FsDepContext } from '../../types';
import type { Convenience } from '../lib';
import * as lib from './lib';
import type { Collection, CollectionOptions } from './types';

export const DEFAULT_COLLECTION_OPTIONS: CollectionOptions = {
  globPattern: '**',
  sortBy: 'date',
  reverse: false,
} as const;

export type CollectionsContext<IF extends FileSetItem> = {
  readonly collections: Record<string, Collection<IF>>;
};

// --------------------------------------------------------------------------
/*
TODO: Add some extra options? sort order, reverse, limit, filter
*/
export const collections =
  <IF extends FileSetItem, OF extends FileSetItem, R, C extends DefaultContext>(
    options: Record<string, Convenience<CollectionOptions>> = {}
  ) =>
  (next: FileSetMapping<IF, OF, R>): FileSetMapping<IF, OF, R | FsDepContext<C>> =>
  (fileSet: FileSet<IF>) => {
    const safeOptions = lib.normalizeAllOptions(options, DEFAULT_COLLECTION_OPTIONS);

    return P.pipe(
      P.Effect.Do,
      P.Effect.bind('fsDepContext', () => FsDepContext<C>()),
      P.Effect.bind('collections', () => lib.createAllCollections(safeOptions, fileSet)),
      P.Effect.bind('annotatedItems', ({ collections }) => lib.annotateAllCollectionItems(collections, fileSet)),
      P.Effect.flatMap(({ annotatedItems, collections, fsDepContext }) =>
        P.pipe(
          annotatedItems,
          next,
          P.Effect.provideService(
            FsDepContext<C & CollectionsContext<IF>>(),
            FsDepContext<C & CollectionsContext<IF>>().of({
              ...fsDepContext,
              collections,
            })
          )
        )
      )
    );
  };
