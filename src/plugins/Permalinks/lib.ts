import * as P from '@konker.dev/effect-ts-prelude';
import type { TinyFileSystem } from '@konker.dev/tiny-filesystem-fp';
import micromatch from 'micromatch';

import type { FuncSmithError } from '../../error';
import { toFuncSmithError } from '../../error';
import type { FileSetItem } from '../../lib/fileSet';
import { fileSetSetFileName, fileSetSetRelDir } from '../../lib/fileSet/fileSetItem';
import type { PermalinksOptions } from './types';

export const mapPermalink =
  <T extends FileSetItem>(
    tfs: TinyFileSystem,
    options: Partial<PermalinksOptions>,
    defaultOptions: PermalinksOptions
  ) =>
  (item: T): P.Effect.Effect<T, FuncSmithError> => {
    const safeOptions: PermalinksOptions = { ...defaultOptions, ...options };

    // Check that this item matches and is not ignored
    const matched = micromatch.some([item.relPath], safeOptions.match);
    const ignored = micromatch.some([item.relPath], safeOptions.ignore);
    if (!matched || ignored) {
      return P.Effect.succeed(item);
    }

    // Skip this item if it is already a directory index
    if (item.fileName === safeOptions.directoryIndex) {
      return P.Effect.succeed(item);
    }

    // Set the relDir, then the fileName
    return P.pipe(
      P.Effect.Do,
      P.Effect.bind('newRelDir', () => tfs.joinPath(item.relDir, item.fileBase)),
      P.Effect.bind('itemRelDir', ({ newRelDir }) => fileSetSetRelDir(tfs, newRelDir, item)),
      P.Effect.bind('itemFileName', ({ itemRelDir }) =>
        fileSetSetFileName(tfs, safeOptions.directoryIndex, itemRelDir)
      ),
      P.Effect.bind('link', ({ newRelDir }) =>
        tfs.joinPath(tfs.PATH_SEP, newRelDir, safeOptions.trailingSlash ? tfs.PATH_SEP : '')
      ),
      P.Effect.map(({ itemFileName, link }) => ({ ...itemFileName, link })),
      P.Effect.mapError(toFuncSmithError)
    );
  };
