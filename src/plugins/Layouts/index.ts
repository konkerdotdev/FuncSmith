/* eslint-disable fp/no-nil */
import * as P from '@konker.dev/effect-ts-prelude';

import { toFuncSmithError } from '../../error';
import type { FileSet, FileSetItem, Html } from '../../lib/fileSet';
import type { FileSetMapping } from '../../types';
import { FsDepContext, FsDepEnv, FsDepReader } from '../../types';
import { wrapMapping } from '../lib';
import type { RootContext } from '../Root';
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
  <IF extends FileSetItem, C extends RootContext>(
    options: Partial<LayoutsOptions> = DEFAULT_LAYOUTS_OPTIONS
  ): FileSetMapping<IF, IF | Html<IF>, FsDepContext<C> | FsDepEnv | FsDepReader> =>
  (fileSet: FileSet<IF>) => {
    const safeOptions = { ...DEFAULT_LAYOUTS_OPTIONS, ...options };

    return P.pipe(
      P.Effect.Do,
      P.Effect.bind('fsDepContext', () => FsDepContext<C>()),
      P.Effect.bind('fsDepEnv', () => FsDepEnv),
      P.Effect.bind('fsDepReader', () => FsDepReader),
      P.Effect.bind('layoutsFullPath', ({ fsDepContext, fsDepReader }) =>
        fsDepReader.tinyFs.isAbsolute(safeOptions.layoutsPath)
          ? P.Effect.succeed(safeOptions.layoutsPath)
          : P.pipe(
              fsDepReader.tinyFs.joinPath(fsDepContext.rootDirPath, safeOptions.layoutsPath),
              P.Effect.mapError(toFuncSmithError)
            )
      ),
      P.Effect.bind('partialsFullPath', ({ fsDepContext, fsDepReader }) =>
        safeOptions.partialsPath
          ? fsDepReader.tinyFs.isAbsolute(safeOptions.partialsPath)
            ? P.Effect.succeed(options.partialsPath)
            : P.pipe(
                fsDepReader.tinyFs.joinPath(fsDepContext.rootDirPath, safeOptions.partialsPath),
                P.Effect.mapError(toFuncSmithError)
              )
          : P.Effect.succeed(undefined)
      ),
      P.Effect.bind('layoutsFileSet', ({ fsDepReader, layoutsFullPath }) =>
        P.pipe(fsDepReader.reader(layoutsFullPath), P.Effect.mapError(toFuncSmithError))
      ),
      P.Effect.bind('partialsFileSet', ({ fsDepReader, partialsFullPath }) =>
        partialsFullPath
          ? P.pipe(fsDepReader.reader(partialsFullPath), P.Effect.mapError(toFuncSmithError))
          : P.Effect.succeed([])
      ),
      P.Effect.bind('partialsList', ({ partialsFileSet }) => toPartialsList(safeOptions, partialsFileSet)),
      P.Effect.bind('templateMap', ({ layoutsFileSet, partialsList }) =>
        toTemplateMap(safeOptions, layoutsFileSet, partialsList)
      ),
      P.Effect.flatMap(({ fsDepContext, fsDepEnv, templateMap }) =>
        P.pipe(
          fileSet,
          P.Array.map((fileSetItem) =>
            processFileItem(fsDepEnv.env, safeOptions, fsDepContext, templateMap, fileSetItem)
          ),
          P.Effect.all
        )
      )
    );
  };

export const layouts = wrapMapping(layoutsMappingCtor);
