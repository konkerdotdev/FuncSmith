import * as P from '@konker.dev/effect-ts-prelude';

import * as unit from './commonmark-effect';

const TEST_MD = 'Hello *world*';

describe('commonmark-effect', () => {
  describe('commonmarkParse', () => {
    it('should work as expected', () => {
      const actual = P.Effect.runSync(P.pipe(TEST_MD, unit.commonmarkParse()));
      expect(actual.type).toEqual('document');
    });
  });

  describe('commonmarkRender', () => {
    it('should work as expected', () => {
      const actual = P.Effect.runSync(
        P.pipe(TEST_MD, unit.commonmarkParse(), P.Effect.flatMap(unit.commonmarkRender()))
      );
      expect(actual).toStrictEqual('<p>Hello <em>world</em></p>\n');
    });
  });
});
