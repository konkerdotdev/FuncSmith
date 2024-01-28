import * as P from '@konker.dev/effect-ts-prelude';

import * as unit from './handlebars-effect';

const TEST_HBS_1 = 'Handlebars <b>{{doesWhat}}</b>';
const TEST_HBS_2 = 'Handlebars <b>{{ testHelper doesWhat}}</b>';
const TEST_HELPER = function (s: string) {
  return String(s).toUpperCase();
};

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
        P.pipe(
          unit.handlebarsCompile(TEST_HBS_1),
          P.Effect.flatMap((template) => unit.handlebarsRender(template, { doesWhat: 'rocks!' }))
        )
      );
      expect(actual).toStrictEqual('Handlebars <b>rocks!</b>');
    });
  });

  describe('handlebarsRenderK', () => {
    it('should work as expected', () => {
      const actual = P.Effect.runSync(
        P.pipe(unit.handlebarsCompile(TEST_HBS_1), P.Effect.flatMap(unit.handlebarsRenderK({ doesWhat: 'rocks!' })))
      );
      expect(actual).toStrictEqual('Handlebars <b>rocks!</b>');
    });
  });

  describe('handlebars', () => {
    it('should work as expected', () => {
      const actual = P.Effect.runSync(P.pipe({ doesWhat: 'rocks!' }, unit.handlebars(TEST_HBS_1)));
      expect(actual).toStrictEqual('Handlebars <b>rocks!</b>');
    });

    it('should work as expected', () => {
      const actual = P.Effect.runSync(
        P.pipe({ doesWhat: 'rocks!' }, unit.handlebars(TEST_HBS_2, { testHelper: TEST_HELPER }))
      );
      expect(actual).toStrictEqual('Handlebars <b>ROCKS!</b>');
    });
  });
});
