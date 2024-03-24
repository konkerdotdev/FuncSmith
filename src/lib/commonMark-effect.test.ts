import * as P from '@konker.dev/effect-ts-prelude';

import * as unit from './commonMark-effect';

const TEST_MD = 'Hello *world*';

describe('commonMark-effect', () => {
  describe('commonMarkRender', () => {
    it('should work as expected', () => {
      const actual = P.Effect.runSync(P.pipe(TEST_MD, unit.commonMarkRender()));
      expect(actual).toStrictEqual('<p>Hello <em>world</em></p>\n');
    });
  });
});
