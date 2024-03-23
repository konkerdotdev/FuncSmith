import type { FileSetItem } from '../../lib/fileSet';
import type { FrontMatter } from '../FrontMatter/types';

// export type CollectionRef = {
//   readonly title: string | undefined;
//   readonly link: string;
// };

export type CollectionItem<T extends FileSetItem> = T & {
  readonly collection: {
    readonly len: number;
    readonly index?: FrontMatter<T>;
    readonly previous?: FrontMatter<T>;
    readonly next?: FrontMatter<T>;
  };
};

export type CollectionOptions = {
  readonly globPattern: string;
  readonly sortBy: string;
  readonly reverse: boolean;
};
