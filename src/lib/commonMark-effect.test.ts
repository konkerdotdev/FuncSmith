import * as P from '@konker.dev/effect-ts-prelude';

import * as unit from './commonMark-effect';

const TEST_MD = 'Hello *world*';

describe('commonMark-effect', () => {
  describe('commonMarkParse', () => {
    it('should work as expected', () => {
      const actual = P.Effect.runSync(P.pipe(TEST_MD, unit.commonMarkParse()));
      expect(actual.type).toEqual('document');
    });
  });

  describe('commonMarkRender', () => {
    it('should work as expected', () => {
      const actual = P.Effect.runSync(
        P.pipe(TEST_MD, unit.commonMarkParse(), P.Effect.flatMap(unit.commonMarkRender()))
      );
      expect(actual).toStrictEqual('<p>Hello <em>world</em></p>\n');
    });
  });
});
