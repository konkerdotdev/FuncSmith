/* eslint-disable fp/no-mutating-methods,fp/no-unused-expression */
import * as P from '@konker.dev/effect-ts-prelude';
import * as E from '@konker.dev/tiny-event-fp';
import type { TreeCrawlerData, TreeCrawlerEvent } from '@konker.dev/tiny-treecrawler-fp';
import { MapTreeCrawlerAccumulator } from '@konker.dev/tiny-treecrawler-fp/dist/accumulator/MapTreeCrawlerAccumultor';
import { BreadthFirstTreeCrawler } from '@konker.dev/tiny-treecrawler-fp/dist/crawler/breadth-first-tree-crawler';
import { TrueDirectoryFilter } from '@konker.dev/tiny-treecrawler-fp/dist/filter/directory/true-directory-filter';
import { GlobFileFilter } from '@konker.dev/tiny-treecrawler-fp/dist/filter/file/glob-file-filter';
import { TrueFileFilter } from '@konker.dev/tiny-treecrawler-fp/dist/filter/file/true-file-filter';
import { NoopTreeCrawlerDirectoryHandler } from '@konker.dev/tiny-treecrawler-fp/dist/handler/directory/noop-directory-handler';
import { DefaultTreeCrawlerFileHandler } from '@konker.dev/tiny-treecrawler-fp/dist/handler/file/default-file-handler';

import type { FuncSmithError } from '../error';
import { toFuncSmithError } from '../error';
import type { FileSet, FileSetItem } from '../lib/fileSet';
import { toFileSystemItemList } from '../lib/fileSet/fileSetItem';
import { FsDepTinyFileSystem } from '../types';

export const fsFileSourceReader = (
  sourcePath: string,
  globPattern?: string
): P.Effect.Effect<FsDepTinyFileSystem, FuncSmithError, FileSet<FileSetItem>> => {
  // Read in the file system at the given path, and convert to a list of FileItems
  return P.pipe(
    P.Effect.Do,
    P.Effect.bind('accumulator', () =>
      P.Effect.succeed(MapTreeCrawlerAccumulator<TreeCrawlerData>((_event, data): TreeCrawlerData => data))
    ),
    P.Effect.bind('events', ({ accumulator }) =>
      P.pipe(
        E.createTinyEventDispatcher<TreeCrawlerEvent, TreeCrawlerData>(),
        P.Effect.flatMap(
          E.addStarListener((_eventType: TreeCrawlerEvent, eventData?: TreeCrawlerData) => {
            accumulator.push(_eventType, eventData);
            return P.Effect.unit;
          })
        )
      )
    ),
    P.Effect.bind('tfs', () =>
      P.pipe(
        FsDepTinyFileSystem,
        P.Effect.map((deps) => deps.tinyFs)
      )
    ),
    P.Effect.flatMap(({ accumulator, events, tfs }) =>
      P.pipe(
        sourcePath,
        BreadthFirstTreeCrawler(
          tfs,
          events,
          [globPattern ? GlobFileFilter(globPattern) : TrueFileFilter, TrueDirectoryFilter],
          [DefaultTreeCrawlerFileHandler, NoopTreeCrawlerDirectoryHandler]
        ),
        P.Effect.flatMap(() => accumulator.data()),
        P.Effect.flatMap(toFileSystemItemList(tfs, sourcePath))
      )
    ),
    P.Effect.mapError(toFuncSmithError)
  );
};
