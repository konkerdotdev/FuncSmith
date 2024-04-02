/* eslint-disable @typescript-eslint/ban-ts-comment,fp/no-mutation */
import * as P from '@konker.dev/effect-ts-prelude';

import * as unit from './utils';

describe('utils', () => {
  describe('hashHex', () => {
    it('should work as expected', async () => {
      const expected = '64345b3710724e959b05583b891e6b39920d6273';
      const actual = await P.Effect.runPromise(unit.hashHex('konker'));
      expect(actual).toEqual(expected);
    });
  });

  describe('arrayMapInPlace', () => {
    it('should work as expected', () => {
      const actual = unit.arrayMapInPlace([1, 2, 3], (x) => x * 2);
      expect(actual).toStrictEqual([2, 4, 6]);
    });

    it('should work as expected', () => {
      const actual = unit.arrayMapInPlace([1, 2, 3], (x, i) => x * 2 + i);
      expect(actual).toStrictEqual([2, 5, 8]);
    });

    it('should work as expected', () => {
      const actual = unit.arrayMapInPlace([1, 2, 3], (x, _i, arr) => {
        return { b: x * 2, arr };
      });
      expect(actual).toStrictEqual([
        { b: 2, arr: [1, 2, 3] },
        { b: 4, arr: [{ b: 2, arr: [1, 2, 3] }, 2, 3] },
        { b: 6, arr: [{ b: 2, arr: [1, 2, 3] }, { b: 4, arr: [{ b: 2, arr: [1, 2, 3] }, 2, 3] }, 3] },
      ]);
    });

    it('should work as expected', () => {
      const aa = [
        { _id: 'o1', next: 'o2' },
        { _id: 'o2', prev: 'o1', next: 'o3' },
        { _id: 'o3', prev: 'o2' },
      ];
      const expected = [...aa];
      // @ts-expect-error
      expected[0].next = aa[1];
      // @ts-expect-error
      expected[1].prev = aa[0];
      // @ts-expect-error
      expected[1].next = aa[2];
      // @ts-expect-error
      expected[2].prev = aa[1];

      const actual = unit.arrayMapInPlace(aa, (x, _i, arr) => {
        // @ts-expect-error
        if (x.next) x.next = arr.find((y) => y._id === x._id)!;
        // @ts-expect-error
        if (x.prev) x.prev = arr.find((y) => y._id === x._id)!;
        return x;
      });
      expect(actual).toStrictEqual(expected);
    });
  });

  describe('stringToUint8Array', () => {
    it('should work as expected', () => {
      expect(unit.stringToUint8Array('hello')).toEqual(new Uint8Array([104, 101, 108, 108, 111]));
      expect(unit.stringToUint8Array('Emoji 🤯')).toEqual(
        new Uint8Array([69, 109, 111, 106, 105, 32, 240, 159, 164, 175])
      );
    });
  });

  describe('arrayBufferToString', () => {
    it('should work as expected', () => {
      expect(unit.arrayBufferToString(new Uint8Array([104, 101, 108, 108, 111]))).toEqual('hello');
      expect(unit.arrayBufferToString(new Uint8Array([69, 109, 111, 106, 105, 32, 240, 159, 164, 175]))).toEqual(
        'Emoji 🤯'
      );
    });
  });
});
