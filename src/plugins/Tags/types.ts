import type { FileSet, FileSetItem } from '../../lib/fileSet';
import type { FrontMatter } from '../FrontMatter/types';

export type TagsItem<IF extends FileSetItem> = IF & {
  frontMatter: FrontMatter<IF>['frontMatter'] & { tags: ReadonlyArray<string> };
};

export type Tags<IF extends FileSetItem> = {
  readonly keys: ReadonlyArray<string>;
  readonly index: Record<string, FileSet<FrontMatter<IF>>>;
};
