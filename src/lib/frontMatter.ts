import * as P from '@konker.dev/effect-ts-prelude';
import grayMatter from 'gray-matter';

import type { FuncSmithError } from '../error';
import { toFuncSmithError } from '../error';
import type { FileSetItem, FileSetItemFile } from './fileSet';

export type FrontMatter<T extends Partial<FileSetItem>> = T & {
  readonly frontMatter: Record<string, unknown>;
};
export function isFrontMatter<T extends FileSetItem>(fileSetItem: T): fileSetItem is FrontMatter<T> {
  return 'frontMatter' in fileSetItem && typeof fileSetItem.frontMatter === 'object';
}

export function extractFrontMatter<T extends FileSetItemFile>(
  fileSetItem: T
): P.Effect.Effect<never, FuncSmithError, FrontMatter<T>> {
  return P.Effect.try({
    try: () => {
      const { content, data } = grayMatter(fileSetItem.contents);
      return {
        ...fileSetItem,
        frontMatter: data,
        contents: content,
      };
    },
    catch: toFuncSmithError,
  });
}
