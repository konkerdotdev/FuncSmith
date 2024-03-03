import * as P from '@konker.dev/effect-ts-prelude';
import micromatch from 'micromatch';

import type { FuncSmithError } from '../../error';
import type { FileSet, FileSetItem } from '../../lib/fileSet';
import { isFrontMatter } from '../FrontMatter/lib';
import type { FrontMatter } from '../FrontMatter/types';
import type { CollectionItem, CollectionOptions, Convenience } from './types';

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
  collection: Array<FrontMatter<IF>>
): CollectionItem<IF> {
  return {
    ...item,
    collection: Object.assign(
      {
        len: collection.length,
      },
      i > 0
        ? {
            previous: {
              title: collection[i - 1]?.frontMatter.title as string | undefined,
              // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
              relPath: collection[i - 1]?.relPath!,
            },
          }
        : {},
      i < collection.length - 1
        ? {
            next: {
              title: collection[i + 1]?.frontMatter.title as string | undefined,
              // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
              relPath: collection[i + 1]?.relPath!,
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
    .sort(collectionSorter(options));

  return collection.map((item, i) => collectionTransformer(item, i, collection));
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
        ? collectionTransformer(item, collectionIndices.indexOf(i), collection)
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
