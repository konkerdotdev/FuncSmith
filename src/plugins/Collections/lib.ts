import * as P from '@konker.dev/effect-ts-prelude';
import micromatch from 'micromatch';

import type { FuncSmithError } from '../../error';
import type { FileSet, FileSetItem } from '../../lib/fileSet';
import type { IdRef } from '../../lib/fileSet/idRefs';
import { idRefCreateFromFileSetItem } from '../../lib/fileSet/idRefs';
import { isFrontMatter } from '../../lib/frontMatter';
import type { FrontMatter } from '../FrontMatter/types';
import type { Convenience } from '../lib';
import type { Collection, CollectionItem, CollectionOptions } from './types';

// --------------------------------------------------------------------------
export function isCollectionIndex<T extends FileSetItem>(fileSetItem: T): fileSetItem is FrontMatter<T> {
  return isFrontMatter(fileSetItem) && fileSetItem.frontMatter?.collectionIndex === true;
}

export function isNotCollectionIndex<T extends FileSetItem>(fileSetItem: T): fileSetItem is FrontMatter<T> {
  return !isCollectionIndex(fileSetItem);
}

export function isCollectionExcluded<T extends FileSetItem>(fileSetItem: T): fileSetItem is FrontMatter<T> {
  return isFrontMatter(fileSetItem) && fileSetItem.frontMatter?.collectionExclude === true;
}

export function isNotCollectionExcluded<T extends FileSetItem>(fileSetItem: T): fileSetItem is FrontMatter<T> {
  return !isCollectionExcluded(fileSetItem);
}

// --------------------------------------------------------------------------
export function normalizeOptions(
  options: Convenience<CollectionOptions>,
  defaultOptions: CollectionOptions
): CollectionOptions {
  return typeof options === 'string' ? { ...defaultOptions, globPattern: options } : { ...defaultOptions, ...options };
}

export function normalizeAllOptions(
  options: Record<string, Convenience<CollectionOptions>>,
  defaultOptions: CollectionOptions
): Record<string, CollectionOptions> {
  return Object.fromEntries(
    Object.entries(options).map(([key, value]) => [key, normalizeOptions(value, defaultOptions)])
  );
}

// --------------------------------------------------------------------------
export const collectionSorter =
  <IF extends FileSetItem>(options: CollectionOptions) =>
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
export function collectionTransformer<IF extends FileSetItem>(
  item: FrontMatter<IF>,
  i: number,
  collectionName: string,
  collection: ReadonlyArray<IdRef>,
  collectionIndexItem: IdRef | undefined
): CollectionItem<FrontMatter<IF>> {
  return {
    ...item,
    collection: Object.assign(
      { name: collectionName, len: collection.length },

      // Add an index property if there is an index file
      collectionIndexItem ? { index: collectionIndexItem } : {},

      // Add a previous property if this is not an index file, and this is not the first item
      i > 0 ? { previous: collection[i - 1]! } : {},

      // Add a next property if this is not an index file, and this is not the last item
      i < collection.length - 1 ? { next: collection[i + 1]! } : {}
    ),
  };
}

// --------------------------------------------------------------------------
export function createCollection<IF extends FileSetItem>(
  collectionName: string,
  options: CollectionOptions,
  fileSet: FileSet<IF | FrontMatter<IF>>
): Collection {
  // Gather the collection items, including any collectionIndex
  const collectionItems: FileSet<FrontMatter<IF>> = fileSet
    .filter((item) => micromatch([item.relPath], [options.globPattern])?.length > 0)
    .filter(isFrontMatter)
    .filter(isNotCollectionExcluded);

  // Pull out a possible collectionIndex
  const collectionIndexItem = collectionItems.find(isCollectionIndex);

  // Remove the collection index and sort
  // eslint-disable-next-line fp/no-mutating-methods
  const sortedCollectionItems = collectionItems.filter(isNotCollectionIndex).sort(collectionSorter(options));

  return {
    name: collectionName,
    // eslint-disable-next-line fp/no-nil
    collectionIndexItem: collectionIndexItem ? idRefCreateFromFileSetItem(collectionIndexItem) : undefined,
    items: sortedCollectionItems.map(idRefCreateFromFileSetItem),
  };
}

export function createAllCollections<IF extends FileSetItem>(
  options: Record<string, CollectionOptions>,
  fileSet: FileSet<IF | FrontMatter<IF>>
): P.Effect.Effect<Record<string, Collection>, FuncSmithError> {
  return P.pipe(
    Object.entries(options),
    P.Array.foldl((acc, [name, options]) => {
      return {
        ...acc,
        [name]: createCollection(name, options, fileSet),
      };
    }, {}),
    P.Effect.succeed
  );
}

// --------------------------------------------------------------------------
export function annotateCollectionItems<IF extends FileSetItem>(
  collection: Collection,
  fileSet: FileSet<IF>
): FileSet<IF | CollectionItem<FrontMatter<IF>>> {
  const collectionIndices = collection.items.map((item) => fileSet.findIndex((i) => i._id === item.ref));

  return P.pipe(
    fileSet,
    P.Array.map((item: IF | FrontMatter<IF>, i: number) =>
      collectionIndices.includes(i) && isFrontMatter(item)
        ? collectionTransformer<IF>(
            item,
            collectionIndices.indexOf(i),
            collection.name,
            collection.items,
            collection.collectionIndexItem
          )
        : item
    )
  );
}

export function annotateAllCollectionItems<IF extends FileSetItem>(
  collections: Record<string, Collection>,
  fileSet: FileSet<IF>
): P.Effect.Effect<FileSet<IF | CollectionItem<IF>>, FuncSmithError> {
  return P.pipe(
    Object.values(collections),
    P.Array.foldl((acc, collection) => {
      return [...annotateCollectionItems(collection, acc)];
    }, fileSet),
    P.Effect.succeed
  );
}
