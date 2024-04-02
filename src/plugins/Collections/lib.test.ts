import * as P from '@konker.dev/effect-ts-prelude';

import * as fixturesCo from '../../test/fixtures/collections-fixtures-1';
import * as fixturesFsCo from '../../test/fixtures/fileset-collections-1';
import * as fixturesFsFm from '../../test/fixtures/fileset-frontmatter-1';
import { DEFAULT_COLLECTION_OPTIONS } from './index';
import * as unit from './lib';

describe('Collections', () => {
  describe('lib', () => {
    describe('isCollectionIndex', () => {
      it('should work as expected', () => {
        expect(unit.isCollectionIndex(fixturesFsFm.TEST_FILE_SET_FRONT_MATTER_1[5]!)).toEqual(true);
        expect(unit.isCollectionIndex(fixturesFsFm.TEST_FILE_SET_FRONT_MATTER_1[6]!)).toEqual(false);
      });
    });

    describe('isNotCollectionIndex', () => {
      it('should work as expected', () => {
        expect(unit.isNotCollectionIndex(fixturesFsFm.TEST_FILE_SET_FRONT_MATTER_1[5]!)).toEqual(false);
        expect(unit.isNotCollectionIndex(fixturesFsFm.TEST_FILE_SET_FRONT_MATTER_1[6]!)).toEqual(true);
      });
    });

    describe('isCollectionExcluded', () => {
      it('should work as expected', () => {
        expect(unit.isCollectionExcluded(fixturesFsFm.TEST_FILE_SET_FRONT_MATTER_1[9]!)).toEqual(true);
        expect(unit.isCollectionExcluded(fixturesFsFm.TEST_FILE_SET_FRONT_MATTER_1[8]!)).toEqual(false);
      });
    });

    describe('isNotCollectionExcluded', () => {
      it('should work as expected', () => {
        expect(unit.isNotCollectionExcluded(fixturesFsFm.TEST_FILE_SET_FRONT_MATTER_1[9]!)).toEqual(false);
        expect(unit.isNotCollectionExcluded(fixturesFsFm.TEST_FILE_SET_FRONT_MATTER_1[8]!)).toEqual(true);
      });
    });

    describe('normalizeOptions', () => {
      it('should work as expected', () => {
        const actual = unit.normalizeOptions({ reverse: true }, DEFAULT_COLLECTION_OPTIONS);
        expect(actual).toStrictEqual({
          globPattern: '**',
          reverse: true,
          sortBy: 'date',
        });
      });

      it('should work as expected with "convenience" options', () => {
        const actual = unit.normalizeOptions('**/*.doc', DEFAULT_COLLECTION_OPTIONS);
        expect(actual).toStrictEqual({
          globPattern: '**/*.doc',
          reverse: false,
          sortBy: 'date',
        });
      });
    });

    describe('normalizeAllOptions', () => {
      it('should work as expected', () => {
        const actual = unit.normalizeAllOptions(
          { posts: { reverse: true }, docs: '**/*.doc' },
          DEFAULT_COLLECTION_OPTIONS
        );
        expect(actual).toStrictEqual({
          posts: {
            globPattern: '**',
            reverse: true,
            sortBy: 'date',
          },
          docs: {
            globPattern: '**/*.doc',
            reverse: false,
            sortBy: 'date',
          },
        });
      });
    });

    describe('collectionSorter', () => {
      it('should work as expected', () => {
        const item1 = fixturesFsFm.TEST_FILE_SET_FRONT_MATTER_1[1]!;
        const item2 = fixturesFsFm.TEST_FILE_SET_FRONT_MATTER_1[2]!;
        expect(unit.collectionSorter(DEFAULT_COLLECTION_OPTIONS)(item1, item2)).toEqual(-1);
        expect(unit.collectionSorter(DEFAULT_COLLECTION_OPTIONS)(item2, item1)).toEqual(1);
        expect(unit.collectionSorter(DEFAULT_COLLECTION_OPTIONS)(item1, item1)).toEqual(0);
      });

      it('should work as expected with reverse', () => {
        const item1 = fixturesFsFm.TEST_FILE_SET_FRONT_MATTER_1[1]!;
        const item2 = fixturesFsFm.TEST_FILE_SET_FRONT_MATTER_1[2]!;
        expect(unit.collectionSorter({ ...DEFAULT_COLLECTION_OPTIONS, reverse: true })(item1, item2)).toEqual(1);
        expect(unit.collectionSorter({ ...DEFAULT_COLLECTION_OPTIONS, reverse: true })(item2, item1)).toEqual(-1);
        expect(unit.collectionSorter({ ...DEFAULT_COLLECTION_OPTIONS, reverse: true })(item1, item1)).toEqual(0);
      });
    });

    describe('createCollection', () => {
      it('should work as expected', () => {
        const actual = unit.createCollection('posts', { globPattern: 'posts/*.md', reverse: false, sortBy: 'date' }, [
          ...fixturesFsFm.TEST_FILE_SET_FRONT_MATTER_1,
        ]);
        expect(actual).toStrictEqual({
          name: 'posts',
          items: fixturesCo.TEST_COLLECTIONS_FIXTURES_COLLECTION_POSTS_1,
          collectionIndexItem: undefined,
        });
      });

      it('should work as expected with collectionIndex', () => {
        const actual = unit.createCollection('docs', { globPattern: 'docs/*.doc', reverse: false, sortBy: 'date' }, [
          ...fixturesFsFm.TEST_FILE_SET_FRONT_MATTER_1,
        ]);
        expect(actual).toStrictEqual({
          name: 'docs',
          items: fixturesCo.TEST_COLLECTIONS_FIXTURES_COLLECTION_DOCS_1,
          collectionIndexItem: fixturesCo.TEST_COLLECTIONS_FIXTURES_INDEX_DOCS_1,
        });
      });
    });

    describe('createAllCollections', () => {
      it('should work as expected', () => {
        const actual = P.Effect.runSync(
          unit.createAllCollections(
            {
              posts: { globPattern: 'posts/*.md', reverse: false, sortBy: 'date' },
              docs: { globPattern: 'docs/*.doc', reverse: false, sortBy: 'date' },
            },
            [...fixturesFsFm.TEST_FILE_SET_FRONT_MATTER_1]
          )
        );
        expect(actual).toStrictEqual({
          posts: {
            name: 'posts',
            items: fixturesCo.TEST_COLLECTIONS_FIXTURES_COLLECTION_POSTS_1,
            collectionIndexItem: undefined,
          },
          docs: {
            name: 'docs',
            items: fixturesCo.TEST_COLLECTIONS_FIXTURES_COLLECTION_DOCS_1,
            collectionIndexItem: fixturesCo.TEST_COLLECTIONS_FIXTURES_INDEX_DOCS_1,
          },
        });
      });
    });

    describe('annotateCollectionItems', () => {
      it('should work as expected', () => {
        const actual = unit.annotateCollectionItems(
          {
            name: 'posts',
            items: fixturesCo.TEST_COLLECTIONS_FIXTURES_COLLECTION_POSTS_1,
            collectionIndexItem: undefined,
          },
          [...fixturesFsFm.TEST_FILE_SET_FRONT_MATTER_1]
        );
        expect(actual).toStrictEqual(fixturesFsCo.TEST_FILE_SET_COLLECTIONS_POSTS_1);
      });
    });

    describe('annotateAllCollectionItems', () => {
      it('should work as expected', () => {
        const actual = P.Effect.runSync(
          unit.annotateAllCollectionItems(
            {
              posts: {
                name: 'posts',
                items: fixturesCo.TEST_COLLECTIONS_FIXTURES_COLLECTION_POSTS_1,
                collectionIndexItem: undefined,
              },
              docs: {
                name: 'docs',
                items: fixturesCo.TEST_COLLECTIONS_FIXTURES_COLLECTION_DOCS_1,
                collectionIndexItem: fixturesCo.TEST_COLLECTIONS_FIXTURES_INDEX_DOCS_1,
              },
            },
            [...fixturesFsFm.TEST_FILE_SET_FRONT_MATTER_1]
          )
        );
        expect(actual).toStrictEqual(fixturesFsCo.TEST_FILE_SET_COLLECTIONS_POSTS_DOCS_1);
      });
    });
  });
});
