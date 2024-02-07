import * as P from '@konker.dev/effect-ts-prelude';

import type { FuncSmithError } from '../error';
import { toFuncSmithError } from '../error';
import { commonmarkParse, commonmarkRender } from '../lib/commonmark-effect';
import type { FileSet, FileSetItem, Html } from '../lib/fileSet';
import { HtmlString } from '../lib/fileSet';
import { fileSetItemMatchesPattern } from '../lib/fileSet/fileSetItem';
import type { FrontMatter } from '../lib/frontMatter';
import { type FileSetMapping, FuncSmithContextEnv, FuncSmithContextMetadata } from '../types';

export type MarkdownOptions = {
  readonly globPattern: string;
};
export const DEFAULT_MARKDOWN_OPTIONS: MarkdownOptions = {
  globPattern: '**/*.html',
};

// --------------------------------------------------------------------------
export const processFileSetItem =
  <T extends FrontMatter<FileSetItem>>(options: MarkdownOptions) =>
  (fileSetItem: T): P.Effect.Effect<never, FuncSmithError, T | Html<T>> => {
    // FIXME: more idiomatic way to do conditional?
    return fileSetItemMatchesPattern(options.globPattern, fileSetItem)
      ? P.pipe(
          fileSetItem.contents,
          commonmarkParse(),
          P.Effect.flatMap(commonmarkRender()),
          P.Effect.flatMap(P.Schema.decode(HtmlString)),
          P.Effect.mapError(toFuncSmithError),
          P.Effect.map((htmlContents) => ({
            ...fileSetItem,
            contents: htmlContents,
          }))
        )
      : P.Effect.succeed(fileSetItem);
  };

// --------------------------------------------------------------------------
/**
 * Basic Markdown mapping, (see: metalsmith)
 * Should read in and parse a set of source files which are in Markdown format
 * substituting / adding to the content a parsed record derived from the file contents.
 * Any kind of error in parsing, file access, etc. is fatal
 */
export const markdownMapping =
  <IF extends FrontMatter<FileSetItem>>(
    options: Partial<MarkdownOptions> = DEFAULT_MARKDOWN_OPTIONS
  ): FileSetMapping<IF, IF | Html<IF>, FuncSmithContextEnv | FuncSmithContextMetadata> =>
  (fileSet: FileSet<IF>) =>
    P.pipe(
      P.Effect.all([FuncSmithContextEnv, FuncSmithContextMetadata]),
      P.Effect.flatMap(([_funcSmithContextEnv, _funcSmithContextMetadata]) =>
        P.pipe(fileSet, P.Array.map(processFileSetItem({ ...DEFAULT_MARKDOWN_OPTIONS, ...options })), P.Effect.all)
      )
    );

// --------------------------------------------------------------------------
export const markdown =
  <IF extends FrontMatter<FileSetItem>, OF extends FileSetItem, R>(
    options: Partial<MarkdownOptions> = DEFAULT_MARKDOWN_OPTIONS
  ) =>
  (
    next: FileSetMapping<IF | Html<IF>, OF, R>
  ): FileSetMapping<IF, OF, R | FuncSmithContextEnv | FuncSmithContextMetadata> =>
  (fileSet: FileSet<IF>) =>
    P.pipe(fileSet, markdownMapping(options), P.Effect.flatMap(next));
