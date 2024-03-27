import type { FileSet, FileSetItem } from '../../lib/fileSet';
import type { FrontMatter } from '../FrontMatter/types';

export type TagsOptions = {
  // relDir reference to where the tag pages should be written to
  readonly relDir: string;

  // Filename bas (without extension) for the tags directory index page
  readonly directoryIndexFileBase: string;

  // Layout for the tags directory index page
  readonly directoryIndexLayout: string;

  // Layout for tag pages
  readonly tagLayout: string;

  // Whether to generate pages or just create metadata
  readonly generatePages: boolean;
};

export type TagsItem<IF extends FileSetItem> = IF & {
  frontMatter: FrontMatter<IF>['frontMatter'] & { tags: ReadonlyArray<string> };
};

export type Tags<IF extends FileSetItem> = {
  readonly keys: ReadonlyArray<string>;
  readonly index: Record<string, FileSet<FrontMatter<IF>>>;
};
