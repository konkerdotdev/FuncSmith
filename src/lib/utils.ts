import * as P from '@konker.dev/effect-ts-prelude';
import { toTinyError } from '@konker.dev/tiny-error-fp';
import { stringToUint8Array } from '@konker.dev/tiny-filesystem-fp/dist/lib/array';
import * as crypto from 'crypto';

// --------------------------------------------------------------------------
export const ERROR_TAG = 'GeneralError';
export type ERROR_TAG = typeof ERROR_TAG;

export const toGeneralError = toTinyError<ERROR_TAG>(ERROR_TAG);
export type GeneralError = ReturnType<typeof toGeneralError>;

// --------------------------------------------------------------------------
export function hashHex(s: string): P.Effect.Effect<string, GeneralError> {
  return P.pipe(
    P.Effect.tryPromise({
      try: async () => crypto.subtle.digest('SHA-1', stringToUint8Array(s)),
      catch: toGeneralError,
    }),
    P.Effect.map((buffer) => [...new Uint8Array(buffer)].map((x) => x.toString(16).padStart(2, '0')).join(''))
  );
}

// --------------------------------------------------------------------------
export function arrayMapInPlace<A, B>(
  aa: ReadonlyArray<A>,
  fn: (a: A, i: number, arr: ReadonlyArray<A | B>) => B
): ReadonlyArray<A | B> {
  return aa.reduce(
    (acc: ReadonlyArray<A | B>, val: A, i: number, arr: ReadonlyArray<A>) =>
      acc
        .slice(0, i)
        .concat(fn(val, i, acc))
        .concat(arr.slice(i + 1)),
    aa as ReadonlyArray<A>
  );
}

// --------------------------------------------------------------------------S
export { arrayBufferToString, stringToUint8Array } from '@konker.dev/tiny-filesystem-fp/dist/lib/array';
