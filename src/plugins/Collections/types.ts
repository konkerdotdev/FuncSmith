import type { FileSetItem } from '../../lib/fileSet';

export type CollectionRef = {
  readonly title: string | undefined;
  readonly relPath: string;
};

export type CollectionItem<T extends FileSetItem> = T & {
  readonly collection: {
    readonly len: number;
    readonly previous?: CollectionRef;
    readonly next?: CollectionRef;
  };
};

export type CollectionOptions = {
  readonly globPattern: string;
  readonly sortBy: string;
  readonly reverse: boolean;
};
