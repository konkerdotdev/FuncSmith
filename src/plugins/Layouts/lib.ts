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
import type { DefaultContext } from '../../types';
import { isFrontMatter } from '../FrontMatter/lib';
import type { FrontMatter } from '../FrontMatter/types';
import type { LayoutsOptions } from './types';

// --------------------------------------------------------------------------
export function lookupLayoutTemplate<T extends FrontMatter<FileSetItem>>(
  templateMap: Record<string, H.TemplateDelegate>,
  options: LayoutsOptions,
  fileSetItem: T
): P.Effect.Effect<H.TemplateDelegate, FuncSmithError> {
  const layoutName = String(fileSetItem.frontMatter['layout'] ?? options.defaultLayout);
  const ret = templateMap[layoutName];
  return ret ? P.Effect.succeed(ret) : P.Effect.fail(toFuncSmithError(`Layout not found: ${layoutName}`));
}

// --------------------------------------------------------------------------
export function processFileItem<T extends FileSetItem, C extends DefaultContext>(
  env: Record<string, unknown>,
  options: LayoutsOptions,
  context: C,
  templateMap: Record<string, H.TemplateDelegate>,
  fileSetItem: T
): P.Effect.Effect<T, FuncSmithError> {
  return isFrontMatter(fileSetItem)
    ? // FIXME: more idiomatic way to do conditional?
      fileSetItemMatchesPattern(options.globPattern, fileSetItem)
      ? P.pipe(
          lookupLayoutTemplate(templateMap, options, fileSetItem),
          P.Effect.flatMap(handlebarsRender({ ...env, ...context, ...fileSetItem, ...fileSetItem.frontMatter })),
          P.Effect.mapError(toFuncSmithError),
          P.Effect.map((contents) => ({ ...fileSetItem, contents }))
        )
      : P.Effect.succeed(fileSetItem)
    : P.Effect.succeed(fileSetItem);
}

// --------------------------------------------------------------------------
export function toTemplateMap(
  options: LayoutsOptions,
  data: ReadonlyArray<FileSetItem>,
  partials: ReadonlyArray<Record<string, H.TemplateDelegate>> = []
) {
  return P.pipe(
    data.filter(isFileSetItemFile),
    P.Array.foldl(
      (acc: P.Effect.Effect<Record<string, H.TemplateDelegate>, FuncSmithError>, fileSetItem: FileSetItem) =>
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
  data: ReadonlyArray<FileSetItem>
): P.Effect.Effect<Array<Record<string, H.TemplateDelegate>>, FuncSmithError> {
  return P.pipe(
    toTemplateMap(options, data),
    P.Effect.map((templateMap) => Object.entries(templateMap).map(([key, template]) => ({ [key]: template })))
  );
}
