import * as P from '@konker.dev/effect-ts-prelude';
import type { TinyFileSystem } from '@konker.dev/tiny-filesystem-fp';

import type { FuncSmithError } from '../../error';
import type { FileSetItem } from '../../lib/fileSet';
import type { RenameSpec } from '../../lib/fileSet/fileSetItem';
import { fileSetItemRename } from '../../lib/fileSet/fileSetItem';

export const renameFileSetItem =
  <T extends FileSetItem>(tfs: TinyFileSystem, specs: Array<RenameSpec>) =>
  (fileSetItem: T): P.Effect.Effect<never, FuncSmithError, T> => {
    return P.pipe(
      specs,
      P.Array.foldl(
        (acc, spec) =>
          P.pipe(
            acc,
            P.Effect.flatMap((acc) => fileSetItemRename(tfs, spec, acc))
          ),
        P.Effect.succeed(fileSetItem) as P.Effect.Effect<never, FuncSmithError, T>
      )
    );
  };
