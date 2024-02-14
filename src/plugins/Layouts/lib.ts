/* eslint-disable fp/no-nil */
import * as P from '@konker.dev/effect-ts-prelude';
import * as E from '@konker.dev/tiny-event-fp';
import type { TinyFileSystem } from '@konker.dev/tiny-filesystem-fp';
import type { TreeCrawlerData, TreeCrawlerEvent } from '@konker.dev/tiny-treecrawler-fp';
import { MapTreeCrawlerAccumulator } from '@konker.dev/tiny-treecrawler-fp/dist/accumulator/MapTreeCrawlerAccumultor';
import { BreadthFirstTreeCrawler } from '@konker.dev/tiny-treecrawler-fp/dist/crawler/breadth-first-tree-crawler';
import { FalseDirectoryFilter } from '@konker.dev/tiny-treecrawler-fp/dist/filter/directory/false-directory-filter';
import { TrueFileFilter } from '@konker.dev/tiny-treecrawler-fp/dist/filter/file/true-file-filter';
import { NoopTreeCrawlerDirectoryHandler } from '@konker.dev/tiny-treecrawler-fp/dist/handler/directory/noop-directory-handler';
import { DefaultTreeCrawlerFileHandler } from '@konker.dev/tiny-treecrawler-fp/dist/handler/file/default-file-handler';
import type * as H from 'handlebars';

import type { FuncSmithError } from '../../error';
import { toFuncSmithError } from '../../error';
import type { FileSetItem } from '../../lib/fileSet';
import {
  contentsToArrayBuffer,
  fileSetItemMatchesPattern,
  isFileItem,
  toFileSystemItemList,
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
export function toTemplateMap(options: LayoutsOptions, data: Array<FileSetItem>) {
  return P.pipe(
    data.filter(isFileItem),
    P.Array.foldl(
      (acc: P.Effect.Effect<never, FuncSmithError, Record<string, H.TemplateDelegate>>, fileSetItem: FileSetItem) =>
        P.pipe(
          P.Effect.Do,
          P.Effect.bind('template', () =>
            handlebarsCompile(contentsToArrayBuffer(fileSetItem.contents), options.helpers)
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
export function layoutsLoadTemplates(
  tfs: TinyFileSystem,
  rootDirPath: string,
  options: LayoutsOptions
): P.Effect.Effect<never, FuncSmithError, Record<string, H.TemplateDelegate>> {
  return P.pipe(
    P.Effect.Do,
    P.Effect.bind('fullPath', () =>
      tfs.isAbsolute(options.directory)
        ? P.Effect.succeed(options.directory)
        : P.pipe(tfs.joinPath(rootDirPath, options.directory), P.Effect.mapError(toFuncSmithError))
    ),
    P.Effect.bind('accumulator', () =>
      P.Effect.succeed(MapTreeCrawlerAccumulator<TreeCrawlerData>((_event, data): TreeCrawlerData => data))
    ),
    P.Effect.bind('events', ({ accumulator }) =>
      P.pipe(
        E.createTinyEventDispatcher<TreeCrawlerEvent, TreeCrawlerData>(),
        P.Effect.flatMap(
          E.addStarListener((_eventType: TreeCrawlerEvent, eventData?: TreeCrawlerData) => {
            // eslint-disable-next-line fp/no-mutating-methods,fp/no-unused-expression
            accumulator.push(_eventType, eventData);
            return P.Effect.unit;
          })
        ),
        P.Effect.mapError(toFuncSmithError)
      )
    ),
    P.Effect.flatMap(({ accumulator, events, fullPath }) =>
      P.pipe(
        fullPath,
        BreadthFirstTreeCrawler(
          tfs,
          events,
          [TrueFileFilter, FalseDirectoryFilter],
          [DefaultTreeCrawlerFileHandler, NoopTreeCrawlerDirectoryHandler]
        ),
        P.Effect.flatMap(() => accumulator.data()),
        P.Effect.flatMap(toFileSystemItemList(tfs, options.directory)),
        P.Effect.flatMap((data) => toTemplateMap(options, data)),
        P.Effect.mapError(toFuncSmithError)
      )
    )
  );
}
