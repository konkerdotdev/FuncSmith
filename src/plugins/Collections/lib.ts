import * as P from '@konker.dev/effect-ts-prelude';
import micromatch from 'micromatch';

import type { FuncSmithError } from '../../error';
import type { FileSet, FileSetItem } from '../../lib/fileSet';
import { isFrontMatter } from '../FrontMatter/lib';
import type { FrontMatter } from '../FrontMatter/types';
import type { Convenience } from '../lib';
import type { CollectionItem, CollectionOptions } from './types';

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
    // Ensure that directoryIndex is first
    if (options.directoryIndex && a.fileName === options.directoryIndex) {
      return 1;
    }
    if (options.directoryIndex && b.fileName === options.directoryIndex) {
      return -1;
    }

    // Otherwise sort by the sortBy field
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
  options: CollectionOptions,
  item: FrontMatter<IF>,
  i: number,
  collection: Array<FrontMatter<IF>>
): CollectionItem<IF> {
  // Check if there is an index file for the collection.
  // If so, basically this will be skipped in the logic below
  const indexItem = options.directoryIndex ? collection.find((i) => i.fileName === options.directoryIndex) : false;
  const indexItemIndex = options.directoryIndex
    ? collection.findIndex((i) => i.fileName === options.directoryIndex)
    : false;

  return {
    ...item,
    collection: Object.assign(
      {
        len: collection.length,
      },
      // Add an index property if there is an index file
      indexItem
        ? {
            index: {
              title: indexItem.frontMatter.title as string,
              link: indexItem.link,
            },
          }
        : {},
      // Add a previous property if this is not an index file, and this is not the first item
      i !== indexItemIndex && i > 0 && i - 1 !== indexItemIndex
        ? {
            previous: {
              title: collection[i - 1]?.frontMatter.title as string | undefined,
              // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
              link: collection[i - 1]?.link!,
            },
          }
        : {},
      // Add a next property if this is not an index file, and this is not the last item
      i !== indexItemIndex && i < collection.length - 1
        ? {
            next: {
              title: collection[i + 1]?.frontMatter.title as string | undefined,
              // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
              link: collection[i + 1]?.link!,
            },
          }
        : {}
    ),
  };
}

// --------------------------------------------------------------------------
export function createCollection<IF extends FileSetItem>(
  options: CollectionOptions,
  fileSet: FileSet<IF | FrontMatter<IF>>
): FileSet<CollectionItem<IF>> {
  // eslint-disable-next-line fp/no-mutating-methods
  const collection: FileSet<FrontMatter<IF>> = fileSet
    .filter((item) => micromatch([item.relPath], [options.globPattern])?.length > 0)
    .filter(isFrontMatter)
    .filter((item) => !options.directoryIndex || item.fileName !== options.directoryIndex)
    .sort(collectionSorter(options));

  return collection.map((item, i) => collectionTransformer(options, item, i, collection));
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
  // eslint-disable-next-line fp/no-mutating-methods
  const collection = fileSet
    .filter((item, _) => micromatch([item.relPath], [options.globPattern])?.length > 0)
    .filter(isFrontMatter)
    .sort(collectionSorter(options));

  const collectionIndices = collection.map((item) => fileSet.findIndex((i) => i._id === item._id));

  return P.pipe(
    fileSet,
    P.Array.map((item: IF | FrontMatter<IF>, i: number) =>
      collectionIndices.includes(i) && isFrontMatter(item)
        ? collectionTransformer(options, item, collectionIndices.indexOf(i), collection)
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
