// --------------------------------------------------------------------------
import * as P from '@konker.dev/effect-ts-prelude';
import grayMatter from 'gray-matter';

import type { FuncSmithError } from '../error';
import { toFuncSmithError } from '../error';
import type { FrontMatter } from '../plugins/FrontMatter/types';
import type { FileSetItem, FileSetItemFile } from './fileSet';
import { fileSetItemContentsToString } from './fileSet/fileSetItem';

export function isFrontMatter<T extends FileSetItem>(fileSetItem: T): fileSetItem is FrontMatter<T> {
  return 'frontMatter' in fileSetItem && typeof fileSetItem.frontMatter === 'object';
}

export function extractFrontMatter<T extends FileSetItemFile>(
  fileSetItem: T
): P.Effect.Effect<FrontMatter<T>, FuncSmithError> {
  return P.Effect.try({
    try: () => {
      const { content, data } = grayMatter(fileSetItemContentsToString(fileSetItem.contents));
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
