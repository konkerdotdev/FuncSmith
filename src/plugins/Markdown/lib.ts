import * as P from '@konker.dev/effect-ts-prelude';

import type { FuncSmithError } from '../../error';
import { toFuncSmithError } from '../../error';
import { commonMarkParse, commonMarkRender } from '../../lib/commonMark-effect';
import type { FileSetItem, Html } from '../../lib/fileSet';
import { HtmlString } from '../../lib/fileSet';
import { fileSetItemContentsToString, fileSetItemMatchesPattern } from '../../lib/fileSet/fileSetItem';
import type { FrontMatter } from '../FrontMatter/types';
import type { MarkdownOptions } from './types';

export const processFileSetItem =
  <T extends FileSetItem>(options: MarkdownOptions) =>
  (fileSetItem: T | FrontMatter<T>): P.Effect.Effect<never, FuncSmithError, T | Html<T>> => {
    // FIXME: more idiomatic way to do conditional?
    return fileSetItemMatchesPattern(options.globPattern, fileSetItem)
      ? P.pipe(
          fileSetItemContentsToString(fileSetItem.contents),
          commonMarkParse(),
          P.Effect.flatMap(commonMarkRender()),
          P.Effect.flatMap(P.Schema.decode(HtmlString)),
          P.Effect.mapError(toFuncSmithError),
          P.Effect.map((htmlContents) => ({
            ...fileSetItem,
            contents: htmlContents,
          }))
        )
      : P.Effect.succeed(fileSetItem);
  };
