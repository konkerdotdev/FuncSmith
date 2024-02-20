import { TEST_FILE_SET_1 } from '../../test/fixtures/fileset-1';
import { DEFAULT_FILTER_OPTIONS } from './index';
import * as unit from './lib';

describe('Filter', () => {
  describe('lib', () => {
    describe('filterShouldKeep', () => {
      const item = TEST_FILE_SET_1[0]!;

      it('should work as expected', () => {
        expect(unit.filterShouldKeep({ drop: [], keep: [] }, DEFAULT_FILTER_OPTIONS)(item)).toEqual(true);
        expect(unit.filterShouldKeep({ drop: ['**'], keep: [] }, DEFAULT_FILTER_OPTIONS)(item)).toEqual(false);
        expect(unit.filterShouldKeep({ drop: [], keep: ['**'] }, DEFAULT_FILTER_OPTIONS)(item)).toEqual(true);
        expect(unit.filterShouldKeep({ drop: ['**'], keep: ['**'] }, DEFAULT_FILTER_OPTIONS)(item)).toEqual(true);
        expect(unit.filterShouldKeep({}, DEFAULT_FILTER_OPTIONS)(item)).toEqual(true);
      });
    });
  });
});
