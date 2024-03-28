import * as P from '@konker.dev/effect-ts-prelude';

import type { FileSet, FileSetItem } from '../../lib/fileSet';
import type { FileSetMapping } from '../../types';
import { FsDepContext, FsDepReader } from '../../types';
import type { FrontMatter } from '../FrontMatter/types';
import type { SourceContext } from '../Source';
import * as lib from './lib';
import type { Tags, TagsOptions } from './types';

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
export type TagsContext<IF extends FileSetItem> = {
  readonly tags: Tags<FrontMatter<IF>>;
};

export const tags =
  <IF extends FileSetItem, OF extends FileSetItem, R, C extends SourceContext>(
    options: Partial<TagsOptions> = DEFAULT_TAGS_OPTIONS
  ) =>
  (
    next: FileSetMapping<FileSetItem | IF, OF, R>
  ): FileSetMapping<
    FileSetItem | IF,
    OF,
    FsDepReader | Exclude<R, FsDepContext<C & TagsContext<FileSetItem | IF>>> | FsDepContext<C>
  > =>
  (fileSet: FileSet<FileSetItem | IF>) => {
    const safeOptions = { ...DEFAULT_TAGS_OPTIONS, ...options };

    return P.pipe(
      P.Effect.Do,
      P.Effect.bind('fsDepContext', () => FsDepContext<C>()),
      P.Effect.bind('fsDepReader', () => FsDepReader),
      P.Effect.bind('tags', () => lib.createTags(fileSet)),
      P.Effect.bind('updatedFileSet', ({ fsDepContext, fsDepReader, tags }) =>
        lib.createTagsPages(safeOptions, fsDepContext, fsDepReader.tinyFs, tags, fileSet)
      ),
      P.Effect.flatMap(({ fsDepContext, tags, updatedFileSet }) =>
        P.pipe(
          updatedFileSet,
          next,
          P.Effect.provideService(
            FsDepContext<C & TagsContext<FileSetItem | IF>>(),
            FsDepContext<C & TagsContext<FileSetItem | IF>>().of({
              ...fsDepContext,
              tags,
            })
          )
        )
      )
    );
  };
