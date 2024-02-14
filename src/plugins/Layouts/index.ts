/* eslint-disable fp/no-nil */
import * as P from '@konker.dev/effect-ts-prelude';

import type { FileSet, FileSetItem, Html } from '../../lib/fileSet';
import type { FileSetMapping } from '../../types';
import { FuncSmithContext, FuncSmithContextEnv, FuncSmithContextMetadata, FuncSmithContextReader } from '../../types';
import { wrapMapping } from '../lib';
import { layoutsLoadTemplates, processFileItem } from './lib';
import type { LayoutsOptions } from './types';

// --------------------------------------------------------------------------
export const DEFAULT_LAYOUTS_OPTIONS: LayoutsOptions = {
  templateEngine: 'handlebars',
  directory: 'layouts',
  defaultLayout: 'layout.hbs',
  globPattern: '**',
  helpers: {},
};

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
