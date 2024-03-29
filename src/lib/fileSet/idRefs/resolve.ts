import { arrayMapInPlace } from '../../utils';
import type { FileSet, FileSetItem } from '../index';
import { idRefInline, isIdRef } from './index';

export function crawlArray<IF extends FileSetItem, T = unknown>(fs: FileSet<IF>, a: ReadonlyArray<unknown>): T {
  return a.map((i) => crawl(fs, i)) as T;
}

export function crawlArrayInPlace<IF extends FileSetItem, T = unknown>(fs: FileSet<IF>, a: ReadonlyArray<unknown>): T {
  // eslint-disable-next-line fp/no-loops,fp/no-nil
  for (const i in a) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    // eslint-disable-next-line fp/no-mutation
    a[i] = crawlInPlace(fs, a[i]);
  }
  return a as T;
}

export function crawlObject<IF extends FileSetItem, T = unknown>(fs: FileSet<IF>, o: Record<string, unknown>): T {
  const entries = Object.entries(o);
  return entries.reduce(
    (acc, [key, val]) => {
      // eslint-disable-next-line fp/no-mutation
      acc[key] = crawl(fs, val);
      return acc;
    },
    {} as Record<string, unknown>
  ) as T;
}

export function crawlObjectInPlace<IF extends FileSetItem, T = unknown>(
  fs: FileSet<IF>,
  o: Record<string, unknown>
): T {
  const entries = Object.entries(o);
  return entries.reduce((_acc, [key, val]) => {
    // eslint-disable-next-line fp/no-mutation
    o[key] = crawlInPlace(fs, val);
    return o;
  }, o) as T;
}

export function crawl<IF extends FileSetItem>(fs: FileSet<IF>, x: unknown): unknown {
  if (!x) {
    return x;
  }
  if (isIdRef(x)) {
    return idRefInline(fs)(x);
  }
  if (Array.isArray(x)) {
    return crawlArray(fs, x);
  }
  if (Object.getPrototypeOf(x) === Object.prototype) {
    return crawlObject(fs, x as Record<string, unknown>);
  }
  return x;
}

export function crawlInPlace<IF extends FileSetItem>(fs: FileSet<IF>, x: unknown): unknown {
  if (!x) {
    return x;
  }
  if (isIdRef(x)) {
    return idRefInline(fs)(x);
  }
  if (Array.isArray(x)) {
    return crawlArrayInPlace(fs, x);
  }
  if (Object.getPrototypeOf(x) === Object.prototype) {
    return crawlObjectInPlace(fs, x as Record<string, unknown>);
  }
  return x;
}

export function resolveRefsFileSet<IF extends FileSetItem>(fs: FileSet<IF>) {
  return arrayMapInPlace<IF, IF>(fs, (item, _i, arr) => crawlObjectInPlace<IF, IF>(arr, item));
}

export const resolveRefsObject =
  <IF extends FileSetItem, T extends Record<string, unknown>>(fs: FileSet<IF>) =>
  (o: T) =>
    crawlObjectInPlace<IF, T>(fs, o);
