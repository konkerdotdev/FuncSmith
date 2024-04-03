import * as P from '@konker.dev/effect-ts-prelude';

import type { FuncSmithError } from '../../error';
import { toFuncSmithError } from '../../error';
import type { FileSetItem, Html } from '../../lib/fileSet';
import { HtmlString } from '../../lib/fileSet';
import { fileSetItemContentsToString, fileSetItemMatchesPattern } from '../../lib/fileSet/fileSetItem';
import { markdownItRender } from '../../lib/markdownIt-effect';
import type { FrontMatter } from '../FrontMatter/types';
import type { MarkdownOptions } from './types';

export const processFileSetItem =
  <T extends FileSetItem>(options: MarkdownOptions) =>
  (fileSetItem: T | FrontMatter<T>): P.Effect.Effect<T | Html<T>, FuncSmithError> => {
    // FIXME: more idiomatic way to do conditional?
    return fileSetItemMatchesPattern(options.globPattern, fileSetItem)
      ? P.pipe(
          fileSetItemContentsToString(fileSetItem.contents),
          markdownItRender(),
          P.Effect.flatMap(P.Schema.decode(HtmlString)),
          P.Effect.mapError(toFuncSmithError),
          P.Effect.map((htmlContents) => ({
            ...fileSetItem,
            contents: htmlContents,
          }))
        )
      : P.Effect.succeed(fileSetItem);
  };
