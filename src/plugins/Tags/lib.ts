import * as P from '@konker.dev/effect-ts-prelude';

import type { FuncSmithError } from '../../error';
import type { FileSet, FileSetItem } from '../../lib/fileSet';
import { isFrontMatter } from '../FrontMatter/lib';
import type { FrontMatter } from '../FrontMatter/types';
import type { Tags, TagsItem } from './types';

// --------------------------------------------------------------------------
export function isTagsItem<IF extends FileSetItem>(fileSetItem: IF): fileSetItem is TagsItem<FrontMatter<IF>> {
  return isFrontMatter(fileSetItem) && Array.isArray(fileSetItem.frontMatter?.tags);
}

// --------------------------------------------------------------------------
export function extractTags<IF extends FileSetItem>(fileSet: FileSet<TagsItem<FrontMatter<IF>>>): Tags<IF>['keys'] {
  return P.pipe(
    fileSet,
    P.Array.map((i) => i.frontMatter.tags),
    (keys) => [...new Set(keys.flat()).values()]
  );
}

export function compileTagsIndex<IF extends FileSetItem>(
  keys: Tags<IF>['keys'],
  fileSet: FileSet<TagsItem<FrontMatter<IF>>>
): Tags<IF>['index'] {
  return P.pipe(
    keys as Array<string>,
    P.Array.foldl(
      (acc, val) => ({
        ...acc,
        [val]: fileSet.filter((i) => i.frontMatter?.tags?.includes(val)),
      }),
      {} as Tags<IF>['index']
    )
  );
}

// --------------------------------------------------------------------------
export function createTags<IF extends FileSetItem>(
  fileSet: FileSet<IF | FrontMatter<IF>>
): P.Effect.Effect<Tags<FrontMatter<IF>>, FuncSmithError> {
  const tagsItems = fileSet.filter(isTagsItem);
  const keys = extractTags(tagsItems);
  const index = compileTagsIndex(keys, tagsItems);

  return P.pipe({ keys, index }, P.Effect.succeed);
}
