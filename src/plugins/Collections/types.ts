import type { FileSetItem } from '../../lib/fileSet';

export type Collection<T extends FileSetItem> = T & {
  readonly collection: {
    readonly len: number;
    readonly previous?: number;
    readonly next?: number;
  };
};

export type CollectionOptions = {
  readonly globPattern: string;
  readonly sortBy: string;
  readonly reverse: boolean;
};

export type Convenience<T extends Partial<CollectionOptions>> = string | T;
