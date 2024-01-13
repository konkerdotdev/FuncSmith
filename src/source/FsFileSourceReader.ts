import * as P from '@konker.dev/effect-ts-prelude';
import { NodeTinyFileSystem } from '@konker.dev/tiny-filesystem-fp/dist/node';

import type { Environment } from '../index';
import type { FileItem, FileSet } from '../mappings';
import { FILE_ITEM_TYPE_FILE } from '../mappings';
import type { FileSource, FileSourceReader } from './index';

export const fsFileSourceReader: FileSourceReader = <D extends Environment>(
  fs: FileSource
): P.Effect.Effect<D, Error, FileSet> => {
  // Read in the file system at the given path, and convert to a list of FileItems
  const dataAccessor = NodeTinyFileSystem;
  return P.pipe(
    NodeTinyFileSystem.listFiles(fs.path),
    (x) => x,
    P.Effect.map(
      P.Array.map(
        (path: Ref): FileItem => ({
          name: path,
          type: FILE_ITEM_TYPE_FILE,
          content: Buffer.from('UNKNOWN'),
        })
      )
    )
  );
};
