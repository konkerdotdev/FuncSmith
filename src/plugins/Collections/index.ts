import * as P from '@konker.dev/effect-ts-prelude';

import type { FileSet, FileSetItem } from '../../lib/fileSet';
import type { FileSetMapping } from '../../types';
import { FsDepMetadata } from '../../types';
import type { Convenience } from '../lib';
import { annotateAllCollectionItems, createAllCollections, normalizeAllOptions } from './lib';
import type { CollectionOptions } from './types';

export const DEFAULT_COLLECTION_OPTIONS: CollectionOptions = {
  globPattern: '**',
  sortBy: 'date',
  reverse: false,
  directoryIndex: 'index.html',
} as const;

// --------------------------------------------------------------------------
/*
TODO: Add some extra options? sort order, reverse, limit, filter
*/
export const collections =
  <IF extends FileSetItem, OF extends FileSetItem, R>(options: Record<string, Convenience<CollectionOptions>> = {}) =>
  (next: FileSetMapping<IF, OF, R>): FileSetMapping<IF, OF, R | FsDepMetadata> =>
  (fileSet: FileSet<IF>) => {
    const safeOptions = normalizeAllOptions(options, DEFAULT_COLLECTION_OPTIONS);

    return P.pipe(
      P.Effect.Do,
      P.Effect.bind('fsDepMetadata', () => FsDepMetadata),
      P.Effect.bind('annotatedItems', () => P.Effect.succeed(annotateAllCollectionItems(safeOptions, fileSet))),
      P.Effect.bind('collections', ({ annotatedItems }) => createAllCollections(safeOptions, annotatedItems)),
      P.Effect.flatMap(({ annotatedItems, collections, fsDepMetadata }) =>
        P.pipe(
          annotatedItems,
          next,
          P.Effect.provideService(
            FsDepMetadata,
            FsDepMetadata.of({
              metadata: {
                ...fsDepMetadata.metadata,
                collections,
              },
            })
          )
        )
      )
    );
  };
