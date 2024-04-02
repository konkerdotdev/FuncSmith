import * as P from '@konker.dev/effect-ts-prelude';

import type { FileSet, FileSetItem } from '../../lib/fileSet';
import type { IdRef } from '../../lib/fileSet/idRefs';
import type { FileSetMapping } from '../../types';
import { FsDepContext, FsDepReader } from '../../types';
import type { SourceContext } from '../Source';
import * as lib from './lib';
import type { TagsOptions } from './types';

export const DEFAULT_TAGS_OPTIONS: TagsOptions = {
  relDir: 'tags',
  fileBaseTagsIndex: 'index',
  layoutTagsIndex: 'tagsIndex.hbs',
  layoutTag: 'tag.hbs',
  generatePages: true,
  extraFrontMatterTagsIndex: {},
  extraFrontMatterTag: {},
};

// --------------------------------------------------------------------------
export type TagsContext = {
  readonly tags: ReadonlyArray<string>;
  readonly tagsIndex: Record<string, ReadonlyArray<IdRef>>;
};

export const tags =
  <IF extends FileSetItem, OF extends FileSetItem, R, C extends SourceContext>(
    options: Partial<TagsOptions> = DEFAULT_TAGS_OPTIONS
  ) =>
  (
    next: FileSetMapping<FileSetItem | IF, OF, R>
  ): FileSetMapping<FileSetItem | IF, OF, FsDepReader | Exclude<R, FsDepContext<C & TagsContext>> | FsDepContext<C>> =>
  (fileSet: FileSet<FileSetItem | IF>) => {
    const safeOptions = { ...DEFAULT_TAGS_OPTIONS, ...options };

    return P.pipe(
      P.Effect.Do,
      P.Effect.bind('fsDepContext', () => FsDepContext<C>()),
      P.Effect.bind('fsDepReader', () => FsDepReader),
      P.Effect.bind('tagsData', () => lib.createTagsData(fileSet)),
      P.Effect.bind('updatedFileSet', ({ fsDepContext, fsDepReader, tagsData }) =>
        lib.createTagsPages(safeOptions, fsDepContext, fsDepReader.tinyFs, tagsData, fileSet)
      ),
      P.Effect.flatMap(({ fsDepContext, tagsData, updatedFileSet }) =>
        P.pipe(
          updatedFileSet,
          next,
          P.Effect.provideService(
            FsDepContext<C & TagsContext>(),
            FsDepContext<C & TagsContext>().of({
              ...fsDepContext,
              tags: tagsData.keys,
              tagsIndex: tagsData.index,
            })
          )
        )
      )
    );
  };
