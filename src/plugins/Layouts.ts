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

import type { FuncSmithError } from '../error';
import { toFuncSmithError } from '../error';
import type { FileSet, FileSetItem, Html } from '../lib/fileSet';
import {
  contentsToArrayBuffer,
  fileSetItemMatchesPattern,
  isFileItem,
  toFileSystemItemList,
} from '../lib/fileSet/fileSetItem';
import type { FrontMatter } from '../lib/frontMatter';
import { isFrontMatter } from '../lib/frontMatter';
import { handlebarsCompile, handlebarsRenderK } from '../lib/handlebars-effect';
import type { FileSetMapping } from '../types';
import { FuncSmithContext, FuncSmithContextEnv, FuncSmithContextMetadata, FuncSmithContextReader } from '../types';
import { wrapMapping } from './lib';

// --------------------------------------------------------------------------
export type LayoutsOptions = {
  readonly templateEngine: string;
  readonly directory: string;
  readonly defaultLayout: string;
  readonly globPattern: string;
  readonly helpers: Record<string, H.HelperDelegate>;
};

export const DEFAULT_LAYOUTS_OPTIONS: LayoutsOptions = {
  templateEngine: 'handlebars',
  directory: 'layouts',
  defaultLayout: 'layout.hbs',
  globPattern: '**',
  helpers: {},
};

// --------------------------------------------------------------------------
export function getLayoutTemplate<T extends FrontMatter<FileSetItem>>(
  templateMap: Record<string, H.TemplateDelegate>,
  options: LayoutsOptions,
  fileSetItem: T
): P.Effect.Effect<never, FuncSmithError, H.TemplateDelegate> {
  const layout: string = String(fileSetItem.frontMatter['layout']) ?? options.defaultLayout;
  const ret = templateMap[layout] ?? templateMap[DEFAULT_LAYOUTS_OPTIONS.defaultLayout];
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
          P.Effect.flatMap(handlebarsRenderK({ ...env, ...metadata, ...fileSetItem, ...fileSetItem.frontMatter })),
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
          )
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

// --------------------------------------------------------------------------
export const layoutsMappingCtor =
  <IF extends FileSetItem>(
    options: Partial<LayoutsOptions> = DEFAULT_LAYOUTS_OPTIONS
  ): FileSetMapping<
    IF,
    IF | Html<IF>,
    FuncSmithContext<IF> | FuncSmithContextEnv | FuncSmithContextMetadata | FuncSmithContextReader
  > =>
  (fileSet: FileSet<IF>) => {
    const safeOptions = { ...DEFAULT_LAYOUTS_OPTIONS, ...options };

    return P.pipe(
      P.Effect.Do,
      P.Effect.bind('deps', () =>
        P.Effect.all([FuncSmithContext<IF>(), FuncSmithContextEnv, FuncSmithContextMetadata, FuncSmithContextReader])
      ),
      P.Effect.bind('templateMap', ({ deps: [funcSmithContext, _, __, funcSmithContextReader] }) =>
        layoutsLoadTemplates(funcSmithContextReader.tinyFs, funcSmithContext.rootDirPath, safeOptions)
      ),
      P.Effect.flatMap(
        ({ deps: [_, funcSmithContextEnv, funcSmithContextMetadata, _funcSmithContextReader], templateMap }) =>
          P.pipe(
            fileSet,
            P.Array.map((fileSetItem) =>
              processFileItem(
                funcSmithContextEnv.env,
                safeOptions,
                funcSmithContextMetadata.metadata,
                templateMap,
                fileSetItem
              )
            ),
            P.Effect.all
          )
      )
    );
  };

export const layouts = wrapMapping(layoutsMappingCtor);
