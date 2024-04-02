import * as P from '@konker.dev/effect-ts-prelude';

import type { FileSet, FileSetItem } from '../index';

export const ID_PROP = '_id' as const;
export type ID_PROP = typeof ID_PROP;

export const ID_REF = 'IdRef' as const;
export type ID_REF = typeof ID_REF;

export type IdRef = {
  readonly _tag: ID_REF;
  readonly ref: string;
};

// TODO: introduce schema here?
export function isIdRef(x: unknown): x is IdRef {
  return !!x && typeof x === 'object' && '_tag' in x && x._tag === ID_REF;
}

export function idRefCreate(ref: string): IdRef {
  return { _tag: ID_REF, ref };
}

export function idRefCreateFromFileSetItem<IF extends FileSetItem>(fileSetItem: IF): IdRef {
  return { _tag: ID_REF, ref: fileSetItem[ID_PROP] };
}

export const idRefInline =
  <IF extends FileSetItem>(fileSet: FileSet<IF>) =>
  (idRef: IdRef): IF =>
    fileSet.find((f) => f[ID_PROP] === idRef.ref)!;

export const idRefListInline =
  <IF extends FileSetItem>(fileSet: FileSet<IF>) =>
  (list: ReadonlyArray<IdRef>): FileSet<IF> =>
    P.pipe(list, P.Array.map(idRefInline(fileSet)), P.Array.filterUndefined);
