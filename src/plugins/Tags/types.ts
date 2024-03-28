import type { FileSet, FileSetItem } from '../../lib/fileSet';
import type { FrontMatter } from '../FrontMatter/types';

export type TagsOptions = {
  // Whether to generate pages or just create metadata
  readonly generatePages: boolean;

  // relDir reference to where the tag pages should be written to
  readonly relDir: string;

  // Filename bas (without extension) for the tags directory index page
  readonly fileBaseTagsIndex: string;

  // Layout for the tags directory index page
  readonly layoutTagsIndex: string;

  // Layout for tag pages
  readonly layoutTag: string;

  // Custom extra frontMatter props for tag index page
  readonly extraFrontMatterTagsIndex: Record<string, unknown>;

  // Custom extra frontMatter props for tag pages
  readonly extraFrontMatterTag: Record<string, unknown>;
};

export type TagsItem<IF extends FileSetItem> = IF & {
  frontMatter: FrontMatter<IF>['frontMatter'] & { tags: ReadonlyArray<string> };
};

export type Tags<IF extends FileSetItem> = {
  readonly keys: ReadonlyArray<string>;
  readonly index: Record<string, FileSet<FrontMatter<IF>>>;
};
