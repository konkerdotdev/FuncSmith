/* eslint-disable fp/no-nil */
import * as P from '@konker.dev/effect-ts-prelude';

import { toFuncSmithError } from '../../error';
import type { FileSet, FileSetItem, Html } from '../../lib/fileSet';
import type { FileSetMapping } from '../../types';
import { FsDepContext, FsDepEnv, FsDepMetadata, FsDepReader } from '../../types';
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
  ): FileSetMapping<IF, IF | Html<IF>, FsDepContext<IF> | FsDepEnv | FsDepMetadata | FsDepReader> =>
  (fileSet: FileSet<IF>) => {
    const safeOptions = { ...DEFAULT_LAYOUTS_OPTIONS, ...options };

    return P.pipe(
      P.Effect.Do,
      P.Effect.bind('deps', () => P.Effect.all([FsDepContext<IF>(), FsDepEnv, FsDepMetadata, FsDepReader])),
      P.Effect.bind('layoutsFullPath', ({ deps: [fsDepContext, _, __, fsDepReader] }) =>
        fsDepReader.tinyFs.isAbsolute(safeOptions.layoutsPath)
          ? P.Effect.succeed(safeOptions.layoutsPath)
          : P.pipe(
              fsDepReader.tinyFs.joinPath(fsDepContext.rootDirPath, safeOptions.layoutsPath),
              P.Effect.mapError(toFuncSmithError)
            )
      ),
      P.Effect.bind('partialsFullPath', ({ deps: [fsDepContext, _fsDepEnv, _fsDepMetadata, fsDepReader] }) =>
        safeOptions.partialsPath
          ? fsDepReader.tinyFs.isAbsolute(safeOptions.partialsPath)
            ? P.Effect.succeed(options.partialsPath)
            : P.pipe(
                fsDepReader.tinyFs.joinPath(fsDepContext.rootDirPath, safeOptions.partialsPath),
                P.Effect.mapError(toFuncSmithError)
              )
          : P.Effect.succeed(undefined)
      ),
      P.Effect.bind(
        'layoutsFileSet',
        ({ deps: [_fsDepContext, _fsDepEnv, _fsDepMetadata, fsDepReader], layoutsFullPath }) =>
          P.pipe(fsDepReader.reader(layoutsFullPath), P.Effect.mapError(toFuncSmithError))
      ),
      P.Effect.bind(
        'partialsFileSet',
        ({ deps: [_fsDepContext, _fsDepEnv, _fsDepMetadata, fsDepReader], partialsFullPath }) =>
          partialsFullPath
            ? P.pipe(fsDepReader.reader(partialsFullPath), P.Effect.mapError(toFuncSmithError))
            : P.Effect.succeed([])
      ),
      P.Effect.bind('partialsList', ({ partialsFileSet }) => toPartialsList(safeOptions, partialsFileSet)),
      P.Effect.bind('templateMap', ({ layoutsFileSet, partialsList }) =>
        toTemplateMap(safeOptions, layoutsFileSet, partialsList)
      ),
      P.Effect.flatMap(({ deps: [_fsDepContext, fsDepEnv, fsDepMetadata, _fsDepReader], templateMap }) =>
        P.pipe(
          fileSet,
          P.Array.map((fileSetItem) =>
            processFileItem(fsDepEnv.env, safeOptions, fsDepMetadata.metadata, templateMap, fileSetItem)
          ),
          P.Effect.all
        )
      )
    );
  };

export const layouts = wrapMapping(layoutsMappingCtor);
