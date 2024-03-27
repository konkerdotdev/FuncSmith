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
