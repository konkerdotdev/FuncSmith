import * as P from '@konker.dev/effect-ts-prelude';
import { MemFsTinyFileSystem } from '@konker.dev/tiny-filesystem-fp';

import * as fixturesFsFm from '../../test/fixtures/fileset-frontmatter-1';
import * as unit from './lib';

const TEST_TFS = MemFsTinyFileSystem();

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

    describe('createTagPage', () => {
      it('should work as expected', async () => {
        const actual = await P.Effect.runPromise(
          unit.createTagPage(TEST_TFS, '/tmp', 'tags', 'index', '---\nfoo: 123\n---\nINDEX-CONTENTS')
        );
        expect(actual).toStrictEqual({
          _id: 'd4d18a98cfda571f501ce060407e30c789e54cd5',
          _tag: 'File',
          baseDir: '/tmp',
          contents: 'INDEX-CONTENTS',
          fileBase: 'index',
          fileExt: '.md',
          fileName: 'index.md',
          foo: 123,
          frontMatter: {
            foo: 123,
          },
          link: '/tags/index.md',
          path: '/tmp/tags/index.md',
          relDir: 'tags',
          relPath: 'tags/index.md',
        });
      });

      it('should work as expected with extra frontMatter', async () => {
        const actual = await P.Effect.runPromise(
          unit.createTagPage(TEST_TFS, '/tmp', 'tags', 'index', '---\nfoo: 123\n---\nINDEX-CONTENTS', { bar: 456 })
        );
        expect(actual).toStrictEqual({
          _id: 'd4d18a98cfda571f501ce060407e30c789e54cd5',
          _tag: 'File',
          baseDir: '/tmp',
          contents: 'INDEX-CONTENTS',
          fileBase: 'index',
          fileExt: '.md',
          fileName: 'index.md',
          foo: 123,
          bar: 456,
          frontMatter: {
            foo: 123,
            bar: 456,
          },
          link: '/tags/index.md',
          path: '/tmp/tags/index.md',
          relDir: 'tags',
          relPath: 'tags/index.md',
        });
      });
    });

    // TODO: test for createTagsPages
  });
});
