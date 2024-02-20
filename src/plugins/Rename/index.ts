import * as P from '@konker.dev/effect-ts-prelude';

import type { FileSet, FileSetItem } from '../../lib/fileSet';
import type { RenameSpec } from '../../lib/fileSet/fileSetItem';
import type { FileSetMapping } from '../../types';
import { FsDepWriter } from '../../types';
import { wrapMapping } from '../lib';
import { renameFileSetItem } from './lib';

export const renameMappingCtor =
  <IF extends FileSetItem>(specs: Array<RenameSpec> = []): FileSetMapping<IF, IF, FsDepWriter> =>
  (fileSet: FileSet<IF>) =>
    P.pipe(
      FsDepWriter,
      P.Effect.flatMap((fsDepWriter) =>
        P.pipe(fileSet, P.Array.map(renameFileSetItem(fsDepWriter.tinyFs, specs)), P.Effect.all)
      )
    );

export const rename = wrapMapping(renameMappingCtor);
