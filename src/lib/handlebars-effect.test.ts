import * as P from '@konker.dev/effect-ts-prelude';
import H from 'handlebars';

import * as unit from './handlebars-effect';

const TEST_HBS_1 = 'Handlebars <b>{{doesWhat}}</b>';
const TEST_HBS_2 = 'Handlebars <b>{{ testHelper doesWhat}}</b>';
const TEST_HBS_3 = 'Handlebars <b>{{ doesWhat}}</b> {{> footer.hbs }}';
const TEST_HELPER = function (s: string) {
  return String(s).toUpperCase();
};
const TEST_PARTIAL = { 'footer.hbs': H.compile('<footer>{{ testHelper footStuff }}</footer>') };
const TEST_CONTEXT = { doesWhat: 'rocks!', footStuff: '(footer stuff)' };

describe('handlebars-effect', () => {
  describe('handlebarsCompile', () => {
    it('should work as expected', () => {
      const actual = P.Effect.runSync(unit.handlebarsCompile(TEST_HBS_1));
      expect(actual.name).toEqual('ret');
    });

    it('should work as expected', () => {
      const actual = P.Effect.runSync(unit.handlebarsCompile(TEST_HBS_2, { testHelper: TEST_HELPER }));
      expect(actual.name).toEqual('ret');
    });
  });

  describe('handlebarsRender', () => {
    it('should work as expected', () => {
      const actual = P.Effect.runSync(
        P.pipe(unit.handlebarsCompile(TEST_HBS_1), P.Effect.flatMap(unit.handlebarsRender(TEST_CONTEXT)))
      );
      expect(actual).toStrictEqual('Handlebars <b>rocks!</b>');
    });
  });

  describe('handlebarsRender2', () => {
    it('should work as expected', () => {
      const actual = P.Effect.runSync(
        P.pipe(
          unit.handlebarsCompile(TEST_HBS_1),
          P.Effect.flatMap((template) => unit.handlebarsRender2(TEST_CONTEXT, template))
        )
      );
      expect(actual).toStrictEqual('Handlebars <b>rocks!</b>');
    });
  });

  describe('handlebars', () => {
    it('should work as expected', () => {
      const actual = P.Effect.runSync(P.pipe(TEST_CONTEXT, unit.handlebars(TEST_HBS_1)));
      expect(actual).toStrictEqual('Handlebars <b>rocks!</b>');
    });

    it('should work as expected', () => {
      const actual = P.Effect.runSync(P.pipe(TEST_CONTEXT, unit.handlebars(TEST_HBS_2, { testHelper: TEST_HELPER })));
      expect(actual).toStrictEqual('Handlebars <b>ROCKS!</b>');
    });

    it('should work as expected', () => {
      const actual = P.Effect.runSync(
        P.pipe(TEST_CONTEXT, unit.handlebars(TEST_HBS_3, { testHelper: TEST_HELPER }, [TEST_PARTIAL]))
      );
      expect(actual).toStrictEqual('Handlebars <b>rocks!</b> <footer>(FOOTER STUFF)</footer>');
    });
  });
});
