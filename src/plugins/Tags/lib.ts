import * as P from '@konker.dev/effect-ts-prelude';
import type { TinyFileSystem } from '@konker.dev/tiny-filesystem-fp';
import { NodeTinyFileSystem } from '@konker.dev/tiny-filesystem-fp';
import { arrayBufferToString } from '@konker.dev/tiny-filesystem-fp/dist/lib/array';

import type { FuncSmithError } from '../../error';
import { toFuncSmithError } from '../../error';
import type { FileSet, FileSetItem } from '../../lib/fileSet';
import { createFileSetItemFile } from '../../lib/fileSet/fileSetItem';
import { extractFrontMatter, isFrontMatter } from '../../lib/frontMatter';
import { handlebarsCompile, handlebarsRender } from '../../lib/handlebars-effect';
import type { FrontMatter } from '../FrontMatter/types';
import type { SourceContext } from '../Source';
import type { Tags, TagsItem, TagsOptions } from './types';

// --------------------------------------------------------------------------
export const TEMPLATES_DIR = 'templates';
export const TAGS_INDEX_PAGE_CONTENT_TEMPLATE = 'tags-index.md.hbs';
export const TAG_PAGE_CONTENT_TEMPLATE = 'tag.md.hbs';

// --------------------------------------------------------------------------
export function isTagsItem<IF extends FileSetItem>(fileSetItem: IF): fileSetItem is TagsItem<FrontMatter<IF>> {
  return isFrontMatter(fileSetItem) && Array.isArray(fileSetItem.frontMatter?.tags);
}

// --------------------------------------------------------------------------
export function extractTags<IF extends FileSetItem>(fileSet: FileSet<TagsItem<FrontMatter<IF>>>): Tags<IF>['keys'] {
  return P.pipe(
    fileSet,
    P.Array.map((i) => i.frontMatter.tags),
    (keys) => [...new Set(keys.flat()).values()]
  );
}

export function compileTagsIndex<IF extends FileSetItem>(
  keys: Tags<IF>['keys'],
  fileSet: FileSet<TagsItem<FrontMatter<IF>>>
): Tags<IF>['index'] {
  return P.pipe(
    keys as Array<string>,
    P.Array.foldl(
      (acc, val) => ({
        ...acc,
        [val]: fileSet.filter((i) => i.frontMatter?.tags?.includes(val)),
      }),
      {} as Tags<IF>['index']
    )
  );
}

// --------------------------------------------------------------------------
// FIXME: better alternative to __dirname?
export function readTemplate(templateFileName: string) {
  return P.pipe(
    NodeTinyFileSystem.joinPath(__dirname, TEMPLATES_DIR, templateFileName),
    P.Effect.flatMap(NodeTinyFileSystem.readFile),
    P.Effect.map(arrayBufferToString),
    P.Effect.flatMap(handlebarsCompile),
    P.Effect.mapError(toFuncSmithError)
  );
}

// --------------------------------------------------------------------------
export function createTags<IF extends FileSetItem>(
  fileSet: FileSet<IF | FrontMatter<IF>>
): P.Effect.Effect<Tags<FrontMatter<IF>>, FuncSmithError> {
  const tagsItems = fileSet.filter(isTagsItem);
  const keys = extractTags(tagsItems);
  const index = compileTagsIndex(keys, tagsItems);

  return P.pipe({ keys, index }, P.Effect.succeed);
}

// --------------------------------------------------------------------------
export function createTagPage(
  tfs: TinyFileSystem,
  sourcePath: string,
  dirPath: string,
  fileBase: string,
  content: string
): P.Effect.Effect<FrontMatter<FileSetItem>, FuncSmithError> {
  return P.pipe(
    tfs.joinPath(sourcePath, dirPath, `${fileBase}.md`),
    P.Effect.flatMap((path) => createFileSetItemFile(tfs, sourcePath, path, content)),
    P.Effect.flatMap(extractFrontMatter),
    P.Effect.mapError(toFuncSmithError)
  );
}

// --------------------------------------------------------------------------
// FIXME: break this up?
export function createTagsPages<IF extends FileSetItem>(
  options: TagsOptions,
  source: SourceContext,
  tfs: TinyFileSystem,
  tags: Tags<IF>,
  fileSet: FileSet<IF | TagsItem<FrontMatter<IF>>>
): P.Effect.Effect<FileSet<FileSetItem | IF | FrontMatter<IF>>, FuncSmithError> {
  return P.pipe(
    P.Effect.Do,
    P.Effect.bind('tagsIndexPageContentTemplate', () => readTemplate(TAGS_INDEX_PAGE_CONTENT_TEMPLATE)),
    P.Effect.bind('tagPageContentTemplate', () => readTemplate(TAG_PAGE_CONTENT_TEMPLATE)),
    P.Effect.bind('tagsIndexPageContent', ({ tagsIndexPageContentTemplate }) =>
      P.pipe(tagsIndexPageContentTemplate, handlebarsRender({ tags, ...options }), P.Effect.mapError(toFuncSmithError))
    ),
    P.Effect.bind('tagPagesContentMap', ({ tagPageContentTemplate }) =>
      // Map all the tags into a [tag, content] pair
      P.pipe(
        tags.keys,
        P.Array.map((tag) =>
          P.pipe(
            tagPageContentTemplate,
            handlebarsRender({ tags, tag, ...options }),
            P.Effect.map((content) => [tag, content] as [string, string])
          )
        ),
        P.Effect.all,

        // Convert the list of pairs into a map
        P.Effect.map((tagContentList: ReadonlyArray<[string, string]>) =>
          P.pipe(
            tagContentList,
            P.Array.foldl(
              (acc, [tag, content]) => ({
                ...acc,
                [tag]: content,
              }),
              {} as Record<string, string>
            )
          )
        ),

        P.Effect.mapError(toFuncSmithError)
      )
    ),
    P.Effect.bind('tagsIndexPage', ({ tagsIndexPageContent }) =>
      createTagPage(tfs, source.fullSourcePath, options.relDir, options.directoryIndexFileBase, tagsIndexPageContent)
    ),
    P.Effect.bind('tagPages', ({ tagPagesContentMap }) =>
      P.pipe(
        Object.entries(tagPagesContentMap),
        P.Array.map(([tag, content]) => createTagPage(tfs, source.fullSourcePath, options.relDir, tag, content)),
        P.Effect.all
      )
    ),
    P.Effect.map(({ tagPages, tagsIndexPage }) => [...fileSet, tagsIndexPage, ...tagPages])
  );
}
