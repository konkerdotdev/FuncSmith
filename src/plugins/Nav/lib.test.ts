import * as P from '@konker.dev/effect-ts-prelude';

import { idRefCreate } from '../../lib/fileSet/idRefs';
import * as fixturesFsFm from '../../test/fixtures/fileset-frontmatter-1';
import { DEFAULT_NAV_OPTIONS } from './index';
import * as unit from './lib';

describe('Nav', () => {
  describe('lib', () => {
    describe('isNavItem', () => {
      it('should work as expected', () => {
        expect(unit.isNavItem(DEFAULT_NAV_OPTIONS)(fixturesFsFm.TEST_FILE_SET_FRONT_MATTER_1[5]!)).toEqual(true);
        expect(unit.isNavItem(DEFAULT_NAV_OPTIONS)(fixturesFsFm.TEST_FILE_SET_FRONT_MATTER_1[6]!)).toEqual(false);
      });
    });

    describe('navSorter', () => {
      it('should work as expected', () => {
        const item1 = fixturesFsFm.TEST_FILE_SET_FRONT_MATTER_1[1]!;
        const item2 = fixturesFsFm.TEST_FILE_SET_FRONT_MATTER_1[5]!;
        expect(unit.navSorter(DEFAULT_NAV_OPTIONS)(item1, item2)).toEqual(-1);
        expect(unit.navSorter(DEFAULT_NAV_OPTIONS)(item2, item1)).toEqual(1);
        expect(unit.navSorter(DEFAULT_NAV_OPTIONS)(item1, item1)).toEqual(0);
      });

      it('should work as expected with reverse', () => {
        const item1 = fixturesFsFm.TEST_FILE_SET_FRONT_MATTER_1[1]!;
        const item2 = fixturesFsFm.TEST_FILE_SET_FRONT_MATTER_1[5]!;
        expect(unit.navSorter({ ...DEFAULT_NAV_OPTIONS, reverse: true })(item1, item2)).toEqual(1);
        expect(unit.navSorter({ ...DEFAULT_NAV_OPTIONS, reverse: true })(item2, item1)).toEqual(-1);
        expect(unit.navSorter({ ...DEFAULT_NAV_OPTIONS, reverse: true })(item1, item1)).toEqual(0);
      });
    });

    describe('createNav', () => {
      it('should work as expected', () => {
        const actual = P.Effect.runSync(
          unit.createNav(DEFAULT_NAV_OPTIONS, [...fixturesFsFm.TEST_FILE_SET_FRONT_MATTER_1])
        );
        expect(actual).toStrictEqual([
          idRefCreate('0000000000001111111111112222222222220021'),
          idRefCreate('0000000000001111111111112222222222220030'),
        ]);
      });
    });
  });
});
