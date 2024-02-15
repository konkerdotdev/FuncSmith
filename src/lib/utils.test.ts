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
});
