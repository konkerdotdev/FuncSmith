import * as P from '@konker.dev/effect-ts-prelude';

import * as fixturesFsFm from '../../test/fixtures/fileset-frontmatter-1';
import * as unit from './lib';

describe('Tags', () => {
  describe('lib', () => {
    describe('isTagsItem', () => {
      it('should work as expected', () => {
        expect(unit.isTagsItem(fixturesFsFm.TEST_FILE_SET_FRONT_MATTER_1[5]!)).toEqual(true);
        expect(unit.isTagsItem(fixturesFsFm.TEST_FILE_SET_FRONT_MATTER_1[6]!)).toEqual(false);
      });
    });

    describe('extractTags', () => {
      it('should work as expected', () => {
        const actual = unit.extractTags([
          fixturesFsFm.TEST_FILE_SET_FRONT_MATTER_1[1]!,
          fixturesFsFm.TEST_FILE_SET_FRONT_MATTER_1[5]!,
        ]);
        expect(actual).toStrictEqual(['tag1', 'tag2', 'tag3']);
      });
    });

    // TODO: test for compileTagsIndex

    describe('createTags', () => {
      it('should work as expected', () => {
        const actual = P.Effect.runSync(
          unit.createTags([
            fixturesFsFm.TEST_FILE_SET_FRONT_MATTER_1[1]!,
            fixturesFsFm.TEST_FILE_SET_FRONT_MATTER_1[5]!,
          ])
        );
        expect(actual).toStrictEqual({
          keys: ['tag1', 'tag2', 'tag3'],
          index: {
            tag1: [
              expect.objectContaining({ relPath: 'posts/p1.md' }),
              expect.objectContaining({ relPath: 'docs/index.doc' }),
            ],
            tag2: [expect.objectContaining({ relPath: 'posts/p1.md' })],
            tag3: [expect.objectContaining({ relPath: 'docs/index.doc' })],
          },
        });
      });
    });

    // TODO: test for createTagPage

    // TODO: test for createTagsPages
  });
});
