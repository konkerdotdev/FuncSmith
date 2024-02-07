import * as P from '@konker.dev/effect-ts-prelude';

import type { FileSet, FileSetItem } from './index';

export type FileSetViewTransform<IF extends FileSetItem, OF extends FileSetItem> = (
  item: IF,
  i: number,
  indices: Array<number>
) => OF;

export const identityFileSetViewTransform = <IF extends FileSetItem>(item: IF): IF => item;

const arrayViewGetTrap =
  <IF extends FileSetItem, OF extends FileSetItem>(indices: Array<number>, transform: FileSetViewTransform<IF, OF>) =>
  (target: Array<unknown>, prop: symbol, receiver: unknown) => {
    // Handle array iterator interface
    if (prop === Symbol.iterator) {
      return indices[Symbol.iterator];
    }

    // Handle mutations - these are NOOPs
    const strProp = String(prop);
    const mutations = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];
    if (mutations.includes(strProp)) {
      return () => target;
    }

    // Handle length
    if (strProp === 'length') {
      return indices.length;
    }

    // Special indices accessor
    if (strProp === 'indices') {
      return indices;
    }

    // Handle index array access
    const numProp = Number(strProp);
    if (Number.isInteger(numProp)) {
      if (numProp < indices.length) {
        return P.pipe(Reflect.get(target, indices[numProp]!, receiver) as IF, (item: IF) =>
          transform(item, numProp, indices)
        );
      }
      // eslint-disable-next-line fp/no-nil
      return undefined;
    }

    // Forward everything else
    return Reflect.get(target, prop, receiver);
  };

export const fileSetView =
  (indices: Array<number>) =>
  <IF extends FileSetItem>(fileSet: FileSet<IF>): FileSet<IF> => {
    // eslint-disable-next-line fp/no-proxy
    const ret = new Proxy(fileSet, {
      get: arrayViewGetTrap(indices, identityFileSetViewTransform),
    });
    return ret as FileSet<IF>;
  };

export const fileSetViewWithTransform =
  <IF extends FileSetItem, OF extends FileSetItem>(indices: Array<number>, transform: FileSetViewTransform<IF, OF>) =>
  (fileSet: FileSet<IF>): FileSet<OF> => {
    // eslint-disable-next-line fp/no-proxy
    const ret = new Proxy(fileSet, {
      get: arrayViewGetTrap(indices, transform),
    });
    return ret as unknown as FileSet<OF>;
  };
