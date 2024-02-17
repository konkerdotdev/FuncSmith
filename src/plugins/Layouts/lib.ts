/* eslint-disable fp/no-nil */
import * as P from '@konker.dev/effect-ts-prelude';
import type * as H from 'handlebars';

import type { FuncSmithError } from '../../error';
import { toFuncSmithError } from '../../error';
import type { FileSetItem } from '../../lib/fileSet';
import {
  fileSetItemContentsToString,
  fileSetItemMatchesPattern,
  isFileSetItemFile,
} from '../../lib/fileSet/fileSetItem';
import { handlebarsCompile, handlebarsRender } from '../../lib/handlebars-effect';
import { isFrontMatter } from '../FrontMatter/lib';
import type { FrontMatter } from '../FrontMatter/types';
import type { LayoutsOptions } from './types';

// --------------------------------------------------------------------------
export function getLayoutTemplate<T extends FrontMatter<FileSetItem>>(
  templateMap: Record<string, H.TemplateDelegate>,
  options: LayoutsOptions,
  fileSetItem: T
): P.Effect.Effect<never, FuncSmithError, H.TemplateDelegate> {
  const layout: string = String(fileSetItem.frontMatter['layout']) ?? options.defaultLayout;
  const ret = templateMap[layout];
  return ret ? P.Effect.succeed(ret) : P.Effect.fail(toFuncSmithError(`Layout not found: ${layout}`));
}

// --------------------------------------------------------------------------
export function processFileItem<T extends FileSetItem>(
  env: Record<string, unknown>,
  options: LayoutsOptions,
  metadata: Record<string, unknown>,
  templateMap: Record<string, H.TemplateDelegate>,
  fileSetItem: T
): P.Effect.Effect<never, FuncSmithError, T> {
  return isFrontMatter(fileSetItem)
    ? // FIXME: more idiomatic way to do conditional?
      fileSetItemMatchesPattern(options.globPattern, fileSetItem)
      ? P.pipe(
          getLayoutTemplate(templateMap, options, fileSetItem),
          P.Effect.flatMap(handlebarsRender({ ...env, ...metadata, ...fileSetItem, ...fileSetItem.frontMatter })),
          P.Effect.mapError(toFuncSmithError),
          P.Effect.map((contents) => ({ ...fileSetItem, contents }))
        )
      : P.Effect.succeed(fileSetItem)
    : P.Effect.succeed(fileSetItem);
}

// --------------------------------------------------------------------------
export function toTemplateMap(
  options: LayoutsOptions,
  data: Array<FileSetItem> = [],
  partials: Array<Record<string, H.TemplateDelegate>> = []
) {
  return P.pipe(
    data.filter(isFileSetItemFile),
    P.Array.foldl(
      (acc: P.Effect.Effect<never, FuncSmithError, Record<string, H.TemplateDelegate>>, fileSetItem: FileSetItem) =>
        P.pipe(
          P.Effect.Do,
          P.Effect.bind('template', () =>
            handlebarsCompile(fileSetItemContentsToString(fileSetItem.contents), options.helpers, partials)
          ),
          P.Effect.flatMap(({ template }) =>
            P.pipe(
              acc,
              P.Effect.map((templateMap) => ({
                ...templateMap,
                [fileSetItem.fileName]: template,
              }))
            )
          ),
          P.Effect.mapError(toFuncSmithError)
        ),
      P.Effect.succeed({})
    )
  );
}

// --------------------------------------------------------------------------
export function toPartialsList(
  options: LayoutsOptions,
  data: Array<FileSetItem> = []
): P.Effect.Effect<never, FuncSmithError, Array<Record<string, H.TemplateDelegate>>> {
  return P.pipe(
    toTemplateMap(options, data),
    P.Effect.map((templateMap) => Object.entries(templateMap).map(([key, template]) => ({ [key]: template })))
  );
}
