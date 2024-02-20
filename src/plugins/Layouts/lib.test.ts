import * as P from '@konker.dev/effect-ts-prelude';

import * as fixturesEn from '../../test/fixtures/env-fixtures';
import * as fixturesFs from '../../test/fixtures/fileset-1';
import * as fixturesFsFm from '../../test/fixtures/fileset-frontmatter-1';
import * as fixturesHb from '../../test/fixtures/handlebars-fixtures';
import * as fixturesMd from '../../test/fixtures/metatdata-fixtures';
import { DEFAULT_LAYOUTS_OPTIONS } from './index';
import * as unit from './lib';

const TEST_TEMPLATE_MAP = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  'foo.hbs': fixturesHb.TEST_HBS_TEMPLATE_1,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  'layout.hbs': fixturesHb.TEST_HBS_TEMPLATE_3,
};

describe('Layouts', () => {
  describe('lib', () => {
    describe('lookupLayoutTemplate', () => {
      it('should work as expected', () => {
        const item = fixturesFsFm.TEST_FILE_SET_FRONT_MATTER_1[1]!;
        const actual = P.Effect.runSync(unit.lookupLayoutTemplate(TEST_TEMPLATE_MAP, DEFAULT_LAYOUTS_OPTIONS, item));
        expect(actual.name).toBeDefined();
      });

      it('should work as expected', () => {
        const item = fixturesFsFm.TEST_FILE_SET_FRONT_MATTER_1[3]!;
        const actual = P.Effect.runSync(unit.lookupLayoutTemplate(TEST_TEMPLATE_MAP, DEFAULT_LAYOUTS_OPTIONS, item));
        expect(actual.name).toBeDefined();
      });

      it('should fail as expected', () => {
        const item = fixturesFsFm.TEST_FILE_SET_FRONT_MATTER_1[2]!;
        const actual = () =>
          P.Effect.runSync(unit.lookupLayoutTemplate(TEST_TEMPLATE_MAP, DEFAULT_LAYOUTS_OPTIONS, item));
        expect(actual).toThrow('Layout not found');
      });
    });

    describe('processFileItem', () => {
      it('should work as expected', () => {
        const item = fixturesFsFm.TEST_FILE_SET_FRONT_MATTER_1[1]!;
        const actual = P.Effect.runSync(
          unit.processFileItem(
            fixturesEn.TEST_ENV_1,
            DEFAULT_LAYOUTS_OPTIONS,
            fixturesMd.TEST_METADATA_1,
            TEST_TEMPLATE_MAP,
            item
          )
        );
        expect(actual.contents).toEqual('Handlebars <b>P1</b>');
      });

      it('should work as expected with non front matter item', () => {
        const item = fixturesFs.TEST_FILE_SET_1[0]!;
        const actual = P.Effect.runSync(
          unit.processFileItem(
            fixturesEn.TEST_ENV_1,
            DEFAULT_LAYOUTS_OPTIONS,
            fixturesMd.TEST_METADATA_1,
            TEST_TEMPLATE_MAP,
            item
          )
        );
        expect(actual.contents).toStrictEqual(item.contents);
      });

      it('should work as expected with no globPattern match', () => {
        const item = fixturesFsFm.TEST_FILE_SET_FRONT_MATTER_1[1]!;
        const actual = P.Effect.runSync(
          unit.processFileItem(
            fixturesEn.TEST_ENV_1,
            { ...DEFAULT_LAYOUTS_OPTIONS, globPattern: '*.banana' },
            fixturesMd.TEST_METADATA_1,
            TEST_TEMPLATE_MAP,
            item
          )
        );
        expect(actual.contents).toStrictEqual(item.contents);
      });
    });

    describe('toTemplateMap', () => {
      it('should work as expected', () => {
        const actual = P.Effect.runSync(
          unit.toTemplateMap(DEFAULT_LAYOUTS_OPTIONS, fixturesHb.TEST_HBS_LAYOUTS_FILE_DATA, [
            fixturesHb.TEST_PARTIAL_SPEC_1,
          ])
        );
        expect(actual['foo.hbs']?.name).toEqual('ret');
        expect(actual['layout.hbs']?.name).toEqual('ret');
      });

      it('should work as expected with default partials', () => {
        const actual = P.Effect.runSync(
          unit.toTemplateMap(DEFAULT_LAYOUTS_OPTIONS, fixturesHb.TEST_HBS_LAYOUTS_FILE_DATA)
        );
        expect(actual['foo.hbs']?.name).toEqual('ret');
        expect(actual['layout.hbs']?.name).toEqual('ret');
      });
    });

    describe('toPartialsList', () => {
      it('should work as expected', () => {
        const actual = P.Effect.runSync(
          unit.toPartialsList(DEFAULT_LAYOUTS_OPTIONS, fixturesHb.TEST_HBS_PARTIALS_FILE_DATA)
        );
        expect(actual).toHaveLength(1);
        expect(actual[0]?.['footer.hbs']?.name).toEqual('ret');
      });
    });
  });
});
