import * as P from '@konker.dev/effect-ts-prelude';

import { idRefCreate } from '../../lib/fileSet/idRefs';
import * as fixturesFsCo from '../../test/fixtures/fileset-collections-1';
import * as unit from './lib';

describe('inlineRefIds', () => {
  describe('inlineContextProps', () => {
    it('should work as expected', () => {
      const TEST_OBJ = {
        _id: 'o2',
        foo: 'o2foo',
        prev: idRefCreate('0000000000001111111111112222222222220021'),
        next: idRefCreate('0000000000001111111111112222222222220023'),
      };

      const actual = P.Effect.runSync(
        unit.inlineContextProps(fixturesFsCo.TEST_FILE_SET_COLLECTIONS_POSTS_1, TEST_OBJ)
      );
      expect(Object.is(actual.prev, fixturesFsCo.TEST_FILE_SET_COLLECTIONS_POSTS_1[1])).toEqual(true);
      expect(Object.is(actual.next, fixturesFsCo.TEST_FILE_SET_COLLECTIONS_POSTS_1[3])).toEqual(true);
    });
  });

  describe('inlineFileSetProps', () => {
    it('should work as expected', () => {
      const actual = P.Effect.runSync(unit.inlineFileSetProps(fixturesFsCo.TEST_FILE_SET_COLLECTIONS_POSTS_1));
      expect(actual).toStrictEqual(fixturesFsCo.TEST_FILE_SET_COLLECTIONS_RESOLVED_POSTS_1);
    });
  });
});
