import * as P from '@konker.dev/effect-ts-prelude';
import grayMatter from 'gray-matter';
import micromatch from 'micromatch';

import type { FuncSmithError } from '../../error';
import { toFuncSmithError } from '../../error';
import type { FileSetItem, FileSetItemFile } from '../../lib/fileSet';
import { contentsToArrayBuffer } from '../../lib/fileSet/fileSetItem';
import type { FrontMatter } from './types';

// --------------------------------------------------------------------------
export function isFrontMatter<T extends FileSetItem>(fileSetItem: T): fileSetItem is FrontMatter<T> {
  return 'frontMatter' in fileSetItem && typeof fileSetItem.frontMatter === 'object';
}

// --------------------------------------------------------------------------
export function extractFrontMatter<T extends FileSetItemFile>(
  fileSetItem: T
): P.Effect.Effect<never, FuncSmithError, FrontMatter<T>> {
  return P.Effect.try({
    try: () => {
      const { content, data } = grayMatter(contentsToArrayBuffer(fileSetItem.contents));
      return {
        ...fileSetItem,
        ...data,
        frontMatter: data,
        contents: content,
      };
    },
    catch: toFuncSmithError,
  });
}

// --------------------------------------------------------------------------
export const processItemFrontMatter =
  <T extends FileSetItem>(globPattern: string) =>
  (item: T): P.Effect.Effect<never, FuncSmithError, T | FrontMatter<T>> =>
    micromatch.some([item.relPath], [globPattern]) ? extractFrontMatter(item) : P.Effect.succeed(item);
