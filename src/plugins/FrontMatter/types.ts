import type { FileSetItem } from '../../lib/fileSet';

export type FrontMatter<T extends Partial<FileSetItem>> = T & {
  readonly frontMatter: Record<string, unknown>;
};

export type FrontMatterOptions = {
  readonly globPattern: string;
};
