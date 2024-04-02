import type { FileSetItem } from '../../lib/fileSet';
import type { IdRef } from '../../lib/fileSet/idRefs';

export type CollectionItem<T extends FileSetItem> = T & {
  readonly collection: {
    readonly len: number;
    readonly name: string;
    readonly index?: IdRef;
    readonly previous?: IdRef;
    readonly next?: IdRef;
  };
};

export type CollectionOptions = {
  readonly globPattern: string;
  readonly sortBy: string;
  readonly reverse: boolean;
};

export type Collection = {
  readonly name: string;
  readonly collectionIndexItem: IdRef | undefined;
  readonly items: ReadonlyArray<IdRef>;
};
