import * as P from '@konker.dev/effect-ts-prelude';
import micromatch from 'micromatch';

import type { FuncSmithError } from '../error';
import type { FileSet, FileSetItem } from '../lib/fileSet';
import { fileSetViewWithTransform } from '../lib/fileSet/fileSetView';
import type { FileSetMapping } from '../types';
import { FuncSmithContextMetadata } from '../types';

/*
TODO: Add some extra options? sort order, reverse, limit, filter
TODO: Remove fileSetView and just: 1) annotateCollectionItems, 2) copy annotated posts into metadata?
TODO: Refactor next/previous to be actually useful for rendering?
TODO: Split into dir with separate lib module(s)?
*/

// --------------------------------------------------------------------------
export type Collection<T extends FileSetItem> = T & {
  readonly collection: {
    readonly len: number;
    readonly previous?: number;
    readonly next?: number;
  };
};

// --------------------------------------------------------------------------
export type CollectionOptions = {
  readonly globPattern: string;
  readonly sortBy: string;
  readonly reverse: boolean;
};
export type Convenience<T extends Partial<CollectionOptions>> = string | T;

export const DEFAULT_COLLECTION_OPTIONS: CollectionOptions = {
  globPattern: '**',
  sortBy: 'date',
  reverse: false,
} as const;

// --------------------------------------------------------------------------
export function normalizeOptions(options: Convenience<Partial<CollectionOptions>>): CollectionOptions {
  return typeof options === 'string'
    ? { ...DEFAULT_COLLECTION_OPTIONS, globPattern: options }
    : { ...DEFAULT_COLLECTION_OPTIONS, ...options };
}

export function createCollection0<IF extends FileSetItem>(
  options: CollectionOptions,
  fileSet: FileSet<IF>
): Array<Collection<IF>> {
  const collection = fileSet.filter((item) => micromatch([item.relPath], [options.globPattern])?.length > 0);
  return collection.map((item) => ({
    ...item,
    collection: {
      len: fileSet.length,
    },
  }));
}

export const collectionTransformer = <IF extends FileSetItem>(
  item: IF,
  i: number,
  indices: Array<number>
): Collection<IF> => ({
  ...item,
  collection: Object.assign(
    {
      len: indices.length,
    },
    i > 0 ? { previous: i - 1 } : {},
    i < indices.length - 1 ? { next: i + 1 } : {}
  ),
});

export function createCollection<IF extends FileSetItem>(
  options: CollectionOptions,
  fileSet: FileSet<IF>
): FileSet<Collection<IF>> {
  const collectionIndices = fileSet
    .map((item, i) => (micromatch([item.relPath], [options.globPattern])?.length > 0 ? i : -1))
    .filter((i) => i !== -1);

  return P.pipe(fileSet, fileSetViewWithTransform(collectionIndices, collectionTransformer));
}

export function createCollections<IF extends FileSetItem>(
  options: Record<string, Convenience<Partial<CollectionOptions>>>,
  fileSet: FileSet<IF>
): P.Effect.Effect<never, FuncSmithError, Record<string, string>> {
  return P.pipe(
    Object.entries(options),
    P.Array.foldl((acc, [name, options]) => {
      return {
        ...acc,
        [name]: createCollection(normalizeOptions(options), fileSet),
      };
    }, {}),
    P.Effect.succeed
  );
}

export function annotateCollectionItems<IF extends FileSetItem>(
  options: CollectionOptions,
  fileSet: FileSet<IF>
): FileSet<IF | Collection<IF>> {
  const collectionIndices = fileSet
    .map((item, i) => (micromatch([item.relPath], [options.globPattern])?.length > 0 ? i : -1))
    .filter((i) => i !== -1);

  return P.pipe(
    fileSet,
    P.Array.map((item: IF, i: number) =>
      collectionIndices.includes(i)
        ? collectionTransformer(item, collectionIndices.indexOf(i), collectionIndices)
        : item
    )
  );
}

export function annotateAllCollectionItems<IF extends FileSetItem>(
  allOptions: Record<string, Convenience<Partial<CollectionOptions>>>,
  fileSet: FileSet<IF>
): FileSet<IF | Collection<IF>> {
  return P.pipe(
    Object.entries(allOptions),
    P.Array.foldl((acc, [_, options]) => {
      return [...annotateCollectionItems(normalizeOptions(options), acc)];
    }, fileSet)
  );
}

// --------------------------------------------------------------------------
export const collections =
  <IF extends FileSetItem, OF extends FileSetItem, R>(
    options: Record<string, Convenience<Partial<CollectionOptions>>> = {}
  ) =>
  (next: FileSetMapping<IF, OF, R>): FileSetMapping<IF, OF, R | FuncSmithContextMetadata> =>
  (fileSet: FileSet<IF>) =>
    P.pipe(
      P.Effect.Do,
      P.Effect.bind('funcSmithContextMetadata', () => FuncSmithContextMetadata),
      P.Effect.bind('collections', () => createCollections(options, fileSet)),
      P.Effect.flatMap(({ collections, funcSmithContextMetadata }) =>
        P.pipe(
          annotateAllCollectionItems(options, fileSet),
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
