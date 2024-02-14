import * as P from '@konker.dev/effect-ts-prelude';

import type { FileSet, FileSetItem } from '../../lib/fileSet';
import type { RenameSpec } from '../../lib/fileSet/fileSetItem';
import type { FileSetMapping } from '../../types';
import { FuncSmithContextWriter } from '../../types';
import { wrapMapping } from '../lib';
import { renameFileSetItem } from './lib';

export const renameMappingCtor =
  <IF extends FileSetItem>(specs: Array<RenameSpec> = []): FileSetMapping<IF, IF, FuncSmithContextWriter> =>
  (fileSet: FileSet<IF>) =>
    P.pipe(
      FuncSmithContextWriter,
      P.Effect.flatMap((funcSmithContextWriter) =>
        P.pipe(fileSet, P.Array.map(renameFileSetItem(funcSmithContextWriter.tinyFs, specs)), P.Effect.all)
      )
    );

export const rename = wrapMapping(renameMappingCtor);
