import type { FileSet } from '../index';
import * as unit from './index';
import { ID_REF } from './index';

const TEST_FILESET_1: FileSet<any> = [
  { [unit.ID_PROP]: 'ID1', title: 'ONE' },
  { [unit.ID_PROP]: 'ID2', title: 'TWO' },
  { [unit.ID_PROP]: 'ID3', title: 'THREE' },
];

describe('fileSet idRefs', () => {
  describe('idRefCreate', () => {
    it('should work as expected', () => {
      const actual = unit.idRefCreate('ID1');
      expect(actual).toStrictEqual({ _tag: ID_REF, ref: 'ID1' });
    });
  });

  describe('idRefInline', () => {
    it('should work as expected', () => {
      const idRef: unit.IdRef = unit.idRefCreate('ID1');
      const actual = unit.idRefInline(TEST_FILESET_1)(idRef);
      expect(actual).toStrictEqual({ _id: 'ID1', title: 'ONE' });
    });

    it('should work as expected with undefined refs', () => {
      const idRef: unit.IdRef = unit.idRefCreate('NOT_THERE');
      const actual = unit.idRefInline(TEST_FILESET_1)(idRef);
      expect(actual).toStrictEqual(undefined);
    });
  });

  describe('idRefListInline', () => {
    it('should work as expected', () => {
      const list = ['ID1', 'ID3'].map(unit.idRefCreate);
      const actual = unit.idRefListInline(TEST_FILESET_1)(list);
      expect(actual).toStrictEqual([
        { _id: 'ID1', title: 'ONE' },
        { _id: 'ID3', title: 'THREE' },
      ]);
    });

    it('should work as expected with undefined refs', () => {
      const list = ['ID1', 'NOT_THERE', 'ID3'].map(unit.idRefCreate);
      const actual = unit.idRefListInline(TEST_FILESET_1)(list);
      expect(actual).toStrictEqual([
        { _id: 'ID1', title: 'ONE' },
        { _id: 'ID3', title: 'THREE' },
      ]);
    });

    it('should work as expected with empty list', () => {
      const list: ReadonlyArray<unit.IdRef> = [];
      const actual = unit.idRefListInline(TEST_FILESET_1)(list);
      expect(actual).toStrictEqual([]);
    });
  });
});
