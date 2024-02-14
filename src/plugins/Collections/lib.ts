import * as P from '@konker.dev/effect-ts-prelude';
import micromatch from 'micromatch';

import type { FuncSmithError } from '../../error';
import type { FileSet, FileSetItem } from '../../lib/fileSet';
import { fileSetViewWithTransform } from '../../lib/fileSet/fileSetView';
import type { Collection, CollectionOptions, Convenience } from './types';

// --------------------------------------------------------------------------
export function normalizeOptions(
  options: Convenience<Partial<CollectionOptions>>,
  defaultOptions: CollectionOptions
): CollectionOptions {
  return typeof options === 'string' ? { ...defaultOptions, globPattern: options } : { ...defaultOptions, ...options };
}

export function normaliseAllOptions(
  options: Record<string, Convenience<Partial<CollectionOptions>>>,
  defaultOptions: CollectionOptions
): Record<string, CollectionOptions> {
  return Object.fromEntries(
    Object.entries(options).map(([key, value]) => [key, normalizeOptions(value, defaultOptions)])
  );
}

// --------------------------------------------------------------------------
export function collectionTransformer<IF extends FileSetItem>(
  item: IF,
  i: number,
  indices: Array<number>
): Collection<IF> {
  return {
    ...item,
    collection: Object.assign(
      {
        len: indices.length,
      },
      i > 0 ? { previous: i - 1 } : {},
      i < indices.length - 1 ? { next: i + 1 } : {}
    ),
  };
}

// --------------------------------------------------------------------------
export function createCollectionInline<IF extends FileSetItem>(
  options: CollectionOptions,
  fileSet: FileSet<IF>
): Array<Collection<IF>> {
  const collection = fileSet.filter((item) => micromatch([item.relPath], [options.globPattern])?.length > 0);
  return collection.map((item, i) =>
    collectionTransformer(
      item,
      i,
      collection.map((_, i) => i)
    )
  );
}

// --------------------------------------------------------------------------
export function createCollection<IF extends FileSetItem>(
  options: CollectionOptions,
  fileSet: FileSet<IF>
): FileSet<Collection<IF>> {
  const collectionIndices = fileSet
    .map((item, i) => (micromatch([item.relPath], [options.globPattern])?.length > 0 ? i : -1))
    .filter((i) => i !== -1);

  return P.pipe(fileSet, fileSetViewWithTransform(collectionIndices, collectionTransformer));
}

// --------------------------------------------------------------------------
export function createAllCollections<IF extends FileSetItem>(
  options: Record<string, CollectionOptions>,
  fileSet: FileSet<IF>
): P.Effect.Effect<never, FuncSmithError, Record<string, string>> {
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
export function createAllCollectionsInline<IF extends FileSetItem>(
  options: Record<string, CollectionOptions>,
  fileSet: FileSet<IF>
): P.Effect.Effect<never, FuncSmithError, Record<string, string>> {
  return P.pipe(
    Object.entries(options),
    P.Array.foldl((acc, [name, options]) => {
      return {
        ...acc,
        [name]: createCollectionInline(options, fileSet),
      };
    }, {}),
    P.Effect.succeed
  );
}

// --------------------------------------------------------------------------
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

// --------------------------------------------------------------------------
export function annotateAllCollectionItems<IF extends FileSetItem>(
  allOptions: Record<string, CollectionOptions>,
  fileSet: FileSet<IF>
): FileSet<IF | Collection<IF>> {
  return P.pipe(
    Object.entries(allOptions),
    P.Array.foldl((acc, [_, options]) => {
      return [...annotateCollectionItems(options, acc)];
    }, fileSet)
  );
}
