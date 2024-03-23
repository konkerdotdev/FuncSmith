import type { FileSetItem } from '../../lib/fileSet';

export type NavItem<T extends FileSetItem> = T & {
  readonly nav: boolean;
};

export type NavOptions = {
  readonly navProperty: string;
  readonly sortBy: string;
  readonly reverse: boolean;
};
