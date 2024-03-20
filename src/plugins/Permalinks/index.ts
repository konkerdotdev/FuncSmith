import * as P from '@konker.dev/effect-ts-prelude';

import type { FileSet, FileSetItem } from '../../lib/fileSet';
import type { FileSetMapping } from '../../types';
import { FsDepWriter } from '../../types';
import { wrapMapping } from '../lib';
import { mapPermalink } from './lib';
import type { PermalinksOptions } from './types';

// ---------------------------------a-----------------------------------------
export const DEFAULT_PERMALINKS_OPTIONS: PermalinksOptions = {
  match: ['**/*.html'],
  ignore: ['404.html'],
  directoryIndex: 'index.html',
  trailingSlash: false,
  duplicatesError: true,
} as const;

// --------------------------------------------------------------------------
export const permalinksMappingCtor =
  <IF extends FileSetItem>(
    options: Partial<PermalinksOptions> = DEFAULT_PERMALINKS_OPTIONS
  ): FileSetMapping<IF, IF, FsDepWriter> =>
  (fileSet: FileSet<IF>) =>
    P.pipe(
      FsDepWriter,
      P.Effect.flatMap((fsDepWriter) =>
        P.pipe(
          fileSet,
          P.Array.map(mapPermalink(fsDepWriter.tinyFs, options, DEFAULT_PERMALINKS_OPTIONS)),
          // TODO: parallel sequence?
          P.Effect.all
        )
      )
      // TODO: check for duplicates
    );

export const permalinks = wrapMapping(permalinksMappingCtor);
