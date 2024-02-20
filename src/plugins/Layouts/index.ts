/* eslint-disable fp/no-nil */
import * as P from '@konker.dev/effect-ts-prelude';

import { toFuncSmithError } from '../../error';
import type { FileSet, FileSetItem, Html } from '../../lib/fileSet';
import type { FileSetMapping } from '../../types';
import { FuncSmithContext, FuncSmithContextEnv, FuncSmithContextMetadata, FuncSmithContextReader } from '../../types';
import { wrapMapping } from '../lib';
import { processFileItem, toPartialsList, toTemplateMap } from './lib';
import type { LayoutsOptions } from './types';

// --------------------------------------------------------------------------
export const DEFAULT_LAYOUTS_OPTIONS: LayoutsOptions = {
  templateEngine: 'handlebars',
  layoutsPath: 'layouts',
  partialsPath: undefined,
  defaultLayout: 'layout.hbs',
  globPattern: '**',
  helpers: {},
} as const;

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
      P.Effect.bind('layoutsFullPath', ({ deps: [funcSmithContext, __, ___, funcSmithContextReader] }) =>
        funcSmithContextReader.tinyFs.isAbsolute(safeOptions.layoutsPath)
          ? P.Effect.succeed(safeOptions.layoutsPath)
          : P.pipe(
              funcSmithContextReader.tinyFs.joinPath(funcSmithContext.rootDirPath, safeOptions.layoutsPath),
              P.Effect.mapError(toFuncSmithError)
            )
      ),
      P.Effect.bind('partialsFullPath', ({ deps: [funcSmithContext, __, ___, funcSmithContextReader] }) =>
        safeOptions.partialsPath
          ? funcSmithContextReader.tinyFs.isAbsolute(safeOptions.partialsPath)
            ? P.Effect.succeed(options.partialsPath)
            : P.pipe(
                funcSmithContextReader.tinyFs.joinPath(funcSmithContext.rootDirPath, safeOptions.partialsPath),
                P.Effect.mapError(toFuncSmithError)
              )
          : P.Effect.succeed(undefined)
      ),
      P.Effect.bind('layoutsFileSet', ({ deps: [_, __, ___, funcSmithContextReader], layoutsFullPath }) =>
        P.pipe(funcSmithContextReader.reader(layoutsFullPath), P.Effect.mapError(toFuncSmithError))
      ),
      P.Effect.bind('partialsFileSet', ({ deps: [_, __, ___, funcSmithContextReader], partialsFullPath }) =>
        partialsFullPath
          ? P.pipe(funcSmithContextReader.reader(partialsFullPath), P.Effect.mapError(toFuncSmithError))
          : P.Effect.succeed([])
      ),
      P.Effect.bind('partialsList', ({ partialsFileSet }) => toPartialsList(safeOptions, partialsFileSet)),
      P.Effect.bind('templateMap', ({ layoutsFileSet, partialsList }) =>
        toTemplateMap(safeOptions, layoutsFileSet, partialsList)
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
