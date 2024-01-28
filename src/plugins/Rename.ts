import * as P from '@konker.dev/effect-ts-prelude';
import type { TinyFileSystem } from '@konker.dev/tiny-filesystem-fp';

import type { FuncSmithError } from '../error';
import type { FileSet, FileSetItem } from '../lib/fileSet';
import type { RenameSpec } from '../lib/fileSet/fileSetItem';
import { fileSetItemRename } from '../lib/fileSet/fileSetItem';
import type { FileSetMapping } from '../types';
import { FuncSmithContextWriter } from '../types';

export const renameFileSetItem =
  <T extends FileSetItem>(_tfs: TinyFileSystem, specs: Array<RenameSpec>) =>
  (fileSetItem: T): P.Effect.Effect<never, FuncSmithError, T> => {
    return P.pipe(
      specs,
      P.Array.foldl(
        (acc, spec) =>
          P.pipe(
            acc,
            P.Effect.flatMap((acc) => fileSetItemRename(_tfs, spec, acc))
          ),
        P.Effect.succeed(fileSetItem) as P.Effect.Effect<never, FuncSmithError, T>
      )
    );
  };

export const rename =
  <T extends FileSetItem, OF extends T, R>(specs: Array<RenameSpec>) =>
  (next: FileSetMapping<T, OF, R>): FileSetMapping<T, OF, R | FuncSmithContextWriter> =>
  (fileSet: FileSet<T>) =>
    P.pipe(
      FuncSmithContextWriter,
      P.Effect.flatMap((funcSmithContextWriter) =>
        P.pipe(
          fileSet,
          P.Array.map(renameFileSetItem(funcSmithContextWriter.tinyFs, specs)),
          P.Effect.all,
          P.Effect.flatMap(next)
        )
      )
    );
