import * as P from '@konker.dev/effect-ts-prelude';

import * as fixtures from '../test/fixtures/handlebars-fixtures';
import * as unit from './handlebars-effect';

const TEST_CONTEXT = { title: 'rocks!', footStuff: '(footer stuff)' };

describe('handlebars-effect', () => {
  describe('handlebarsCompile', () => {
    it('should work as expected', () => {
      const actual = P.Effect.runSync(unit.handlebarsCompile(fixtures.TEST_HBS_TEMPLATE_S_1));
      expect(actual.name).toEqual('ret');
    });

    it('should work as expected', () => {
      const actual = P.Effect.runSync(
        unit.handlebarsCompile(fixtures.TEST_HBS_TEMPLATE_S_2, { testHelper: fixtures.TEST_HELPER })
      );
      expect(actual.name).toEqual('ret');
    });
  });

  describe('handlebarsRender', () => {
    it('should work as expected', () => {
      const actual = P.Effect.runSync(
        P.pipe(
          unit.handlebarsCompile(fixtures.TEST_HBS_TEMPLATE_S_1),
          P.Effect.flatMap(unit.handlebarsRender(TEST_CONTEXT))
        )
      );
      expect(actual).toStrictEqual('Handlebars <b>rocks!</b>');
    });
  });

  describe('handlebarsRender2', () => {
    it('should work as expected', () => {
      const actual = P.Effect.runSync(
        P.pipe(
          unit.handlebarsCompile(fixtures.TEST_HBS_TEMPLATE_S_1),
          P.Effect.flatMap((template) => unit.handlebarsRender2(TEST_CONTEXT, template))
        )
      );
      expect(actual).toStrictEqual('Handlebars <b>rocks!</b>');
    });
  });

  describe('handlebars', () => {
    it('should work as expected', () => {
      const actual = P.Effect.runSync(P.pipe(TEST_CONTEXT, unit.handlebars(fixtures.TEST_HBS_TEMPLATE_S_1)));
      expect(actual).toStrictEqual('Handlebars <b>rocks!</b>');
    });

    it('should work as expected', () => {
      const actual = P.Effect.runSync(
        P.pipe(TEST_CONTEXT, unit.handlebars(fixtures.TEST_HBS_TEMPLATE_S_2, { testHelper: fixtures.TEST_HELPER }))
      );
      expect(actual).toStrictEqual('Handlebars <b>ROCKS!</b>');
    });

    it('should work as expected', () => {
      const actual = P.Effect.runSync(
        P.pipe(
          TEST_CONTEXT,
          unit.handlebars(fixtures.TEST_HBS_TEMPLATE_S_3, { testHelper: fixtures.TEST_HELPER }, [
            fixtures.TEST_PARTIAL_SPEC_1,
          ])
        )
      );
      expect(actual).toStrictEqual('Handlebars <b>rocks!</b> <footer>(FOOTER STUFF)</footer>');
    });
  });
});
