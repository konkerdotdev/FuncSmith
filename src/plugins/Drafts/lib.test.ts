import { TEST_FILE_SET_1 } from '../../test/fixtures/fileset-1';
import { DEFAULT_DRAFTS_OPTIONS } from './index';
import * as unit from './lib';

describe('Drafts', () => {
  describe('lib', () => {
    describe('draftsShouldKeep', () => {
      const item = TEST_FILE_SET_1[0]!;
      const itemT = {
        ...TEST_FILE_SET_1[0]!,
        frontMatter: { draft: true },
      };
      const itemF = {
        ...TEST_FILE_SET_1[0]!,
        frontMatter: { draft: false },
      };

      it('should work as expected', () => {
        expect(unit.draftsShouldKeep({ default: false, include: false }, DEFAULT_DRAFTS_OPTIONS)(item)).toEqual(true);
        expect(unit.draftsShouldKeep({ default: false, include: false }, DEFAULT_DRAFTS_OPTIONS)(itemT)).toEqual(false);
        expect(unit.draftsShouldKeep({ default: false, include: false }, DEFAULT_DRAFTS_OPTIONS)(itemF)).toEqual(true);

        expect(unit.draftsShouldKeep({}, DEFAULT_DRAFTS_OPTIONS)(item)).toEqual(true);
        expect(unit.draftsShouldKeep({}, DEFAULT_DRAFTS_OPTIONS)(itemT)).toEqual(false);
        expect(unit.draftsShouldKeep({}, DEFAULT_DRAFTS_OPTIONS)(itemF)).toEqual(true);

        expect(unit.draftsShouldKeep({ default: false, include: true }, DEFAULT_DRAFTS_OPTIONS)(item)).toEqual(false);
        expect(unit.draftsShouldKeep({ default: false, include: true }, DEFAULT_DRAFTS_OPTIONS)(itemT)).toEqual(true);
        expect(unit.draftsShouldKeep({ default: false, include: true }, DEFAULT_DRAFTS_OPTIONS)(itemF)).toEqual(false);

        expect(unit.draftsShouldKeep({ default: true, include: false }, DEFAULT_DRAFTS_OPTIONS)(item)).toEqual(false);
        expect(unit.draftsShouldKeep({ default: true, include: false }, DEFAULT_DRAFTS_OPTIONS)(itemT)).toEqual(false);
        expect(unit.draftsShouldKeep({ default: true, include: false }, DEFAULT_DRAFTS_OPTIONS)(itemF)).toEqual(true);

        expect(unit.draftsShouldKeep({ default: true, include: true }, DEFAULT_DRAFTS_OPTIONS)(item)).toEqual(true);
        expect(unit.draftsShouldKeep({ default: true, include: true }, DEFAULT_DRAFTS_OPTIONS)(itemT)).toEqual(true);
        expect(unit.draftsShouldKeep({ default: true, include: true }, DEFAULT_DRAFTS_OPTIONS)(itemF)).toEqual(false);
      });
    });
  });
});
