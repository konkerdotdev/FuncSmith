import * as P from '@konker.dev/effect-ts-prelude';

import type { FileSet, FileSetItem } from '../../lib/fileSet';
import type { FileSetMapping } from '../../types';
import { FuncSmithContextMetadata } from '../../types';
import { annotateAllCollectionItems, createAllCollections, normaliseAllOptions } from './lib';
import type { CollectionOptions, Convenience } from './types';

export const DEFAULT_COLLECTION_OPTIONS: CollectionOptions = {
  globPattern: '**',
  sortBy: 'date',
  reverse: false,
} as const;

// --------------------------------------------------------------------------
/*
TODO: Add some extra options? sort order, reverse, limit, filter
*/
export const collections =
  <IF extends FileSetItem, OF extends FileSetItem, R>(options: Record<string, Convenience<CollectionOptions>> = {}) =>
  (next: FileSetMapping<IF, OF, R>): FileSetMapping<IF, OF, R | FuncSmithContextMetadata> =>
  (fileSet: FileSet<IF>) => {
    const safeOptions = normaliseAllOptions(options, DEFAULT_COLLECTION_OPTIONS);

    return P.pipe(
      P.Effect.Do,
      P.Effect.bind('funcSmithContextMetadata', () => FuncSmithContextMetadata),
      P.Effect.bind('annotatedItems', () => P.Effect.succeed(annotateAllCollectionItems(safeOptions, fileSet))),
      P.Effect.bind('collections', ({ annotatedItems }) => createAllCollections(safeOptions, annotatedItems)),
      P.Effect.flatMap(({ annotatedItems, collections, funcSmithContextMetadata }) =>
        P.pipe(
          annotatedItems,
          next,
          P.Effect.provideService(
            FuncSmithContextMetadata,
            FuncSmithContextMetadata.of({
              metadata: {
                ...funcSmithContextMetadata.metadata,
                collections,
              },
            })
          )
        )
      )
    );
  };
