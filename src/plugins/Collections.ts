import * as P from '@konker.dev/effect-ts-prelude';
import micromatch from 'micromatch';

import type { FuncSmithError } from '../error';
import type { FileSet, FileSetItem } from '../lib/fileSet';
import type { FrontMatter } from '../lib/frontMatter';
import type { FileSetMapping } from '../types';
import { FuncSmithContextMetadata } from '../types';

// --------------------------------------------------------------------------
export type Collection<T extends FileSetItem> = T & {
  readonly len: number;
  readonly previous?: FileSetItem;
  readonly next?: FileSetItem;
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

export function createCollection<IF extends FrontMatter<FileSetItem>>(
  options: CollectionOptions,
  fileSet: FileSet<IF>
): Array<Collection<IF>> {
  const collection = fileSet.filter((item) => micromatch([item.relPath], [options.globPattern])?.length > 0);
  return collection.map((item) => ({
    ...item,
    len: fileSet.length,
  }));
}

export function createCollections<IF extends FrontMatter<FileSetItem>>(
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

export const collections =
  <IF extends FrontMatter<FileSetItem>, OF extends IF, R>(
    _options: Record<string, Convenience<Partial<CollectionOptions>>> = {}
  ) =>
  (next: FileSetMapping<IF, OF, R>): FileSetMapping<IF, OF, R | FuncSmithContextMetadata> =>
  (fileSet: FileSet<IF>) =>
    P.pipe(
      P.Effect.Do,
      P.Effect.bind('funcSmithContextMetadata', () => FuncSmithContextMetadata),
      P.Effect.bind('collections', () => createCollections(_options, fileSet)),
      P.Effect.flatMap(({ collections, funcSmithContextMetadata }) =>
        P.pipe(
          next(fileSet),
          P.Effect.provideService(
            FuncSmithContextMetadata,
            FuncSmithContextMetadata.of({
              metadata: {
                ...funcSmithContextMetadata.metadata,
                ...collections,
              },
            })
          )
        )
      )
    );
