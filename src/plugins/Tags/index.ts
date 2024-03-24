import * as P from '@konker.dev/effect-ts-prelude';

import type { FileSet, FileSetItem } from '../../lib/fileSet';
import type { FileSetMapping } from '../../types';
import { FsDepMetadata } from '../../types';
import * as lib from './lib';

// --------------------------------------------------------------------------
export const tags =
  <IF extends FileSetItem, OF extends FileSetItem, R>() =>
  (next: FileSetMapping<IF, OF, R>): FileSetMapping<IF, OF, R | FsDepMetadata> =>
  (fileSet: FileSet<IF>) => {
    return P.pipe(
      P.Effect.Do,
      P.Effect.bind('fsDepMetadata', () => FsDepMetadata),
      P.Effect.bind('tags', () => lib.createTags(fileSet)),
      P.Effect.flatMap(({ fsDepMetadata, tags }) =>
        P.pipe(
          fileSet,
          next,
          P.Effect.provideService(
            FsDepMetadata,
            FsDepMetadata.of({
              metadata: {
                ...fsDepMetadata.metadata,
                tags,
              },
            })
          )
        )
      )
    );
  };
