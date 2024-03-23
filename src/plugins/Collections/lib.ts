import * as P from '@konker.dev/effect-ts-prelude';
import micromatch from 'micromatch';

import type { FuncSmithError } from '../../error';
import type { FileSet, FileSetItem } from '../../lib/fileSet';
import { isFrontMatter } from '../FrontMatter/lib';
import type { FrontMatter } from '../FrontMatter/types';
import type { Convenience } from '../lib';
import type { CollectionItem, CollectionOptions } from './types';

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
  collection: Array<FrontMatter<IF>>,
  collectionIndexItem: FrontMatter<IF> | undefined
): CollectionItem<IF> {
  return {
    ...item,
    collection: Object.assign(
      { len: collection.length },

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
  options: CollectionOptions,
  fileSet: FileSet<IF | FrontMatter<IF>>
): FileSet<CollectionItem<IF>> {
  // Gather the collection, including any collectionIndex
  const collection: FileSet<FrontMatter<IF>> = fileSet
    .filter((item) => micromatch([item.relPath], [options.globPattern])?.length > 0)
    .filter(isFrontMatter)
    .filter(isNotCollectionExcluded);

  // Pull out a possible collectionIndex
  const collectionIndexItem = collection.find(isCollectionIndex);

  // Remove the collection index and sort
  // eslint-disable-next-line fp/no-mutating-methods
  const sortedCollection = collection.filter(isNotCollectionIndex).sort(collectionSorter(options));

  return sortedCollection.map((item, i) => collectionTransformer(item, i, sortedCollection, collectionIndexItem));
}

export function createAllCollections<IF extends FileSetItem>(
  options: Record<string, CollectionOptions>,
  fileSet: FileSet<IF | FrontMatter<IF>>
): P.Effect.Effect<Record<string, string>, FuncSmithError> {
  return P.pipe(
    Object.entries(options),
    P.Array.foldl((acc, [name, options]) => {
      return {
        ...acc,
        [name]: createCollection(options, fileSet),
      };
    }, {}),
    P.Effect.succeed
  );
}

// --------------------------------------------------------------------------
export function annotateCollectionItems<IF extends FileSetItem>(
  options: CollectionOptions,
  fileSet: FileSet<IF>
): FileSet<IF | CollectionItem<IF>> {
  /*
  // eslint-disable-next-line fp/no-mutating-methods
  const collection = fileSet
    .filter((item, _) => micromatch([item.relPath], [options.globPattern])?.length > 0)
    .filter(isFrontMatter)
    .sort(collectionSorter(options));

  const collectionIndices = collection.map((item) => fileSet.findIndex((i) => i._id === item._id));
  */
  // Gather the collection, including any collectionIndex
  const collection: FileSet<FrontMatter<IF>> = fileSet
    .filter((item) => micromatch([item.relPath], [options.globPattern])?.length > 0)
    .filter(isFrontMatter)
    .filter(isNotCollectionExcluded);

  // Pull out a possible collectionIndex
  const collectionIndexItem = collection.find(isCollectionIndex);

  // Remove the collection index and sort
  // eslint-disable-next-line fp/no-mutating-methods
  const sortedCollection = collection.filter(isNotCollectionIndex).sort(collectionSorter(options));

  const collectionIndices = sortedCollection.map((item) => fileSet.findIndex((i) => i._id === item._id));

  return P.pipe(
    fileSet,
    P.Array.map((item: IF | FrontMatter<IF>, i: number) =>
      collectionIndices.includes(i) && isFrontMatter(item)
        ? collectionTransformer(item, collectionIndices.indexOf(i), sortedCollection, collectionIndexItem)
        : item
    )
  );
}

export function annotateAllCollectionItems<IF extends FileSetItem>(
  allOptions: Record<string, CollectionOptions>,
  fileSet: FileSet<IF>
): FileSet<IF | CollectionItem<IF>> {
  return P.pipe(
    Object.entries(allOptions),
    P.Array.foldl((acc, [_, options]) => {
      return [...annotateCollectionItems(options, acc)];
    }, fileSet)
  );
}
