import * as P from '@konker.dev/effect-ts-prelude';
import { MemFsTinyFileSystem } from '@konker.dev/tiny-filesystem-fp/dist/memfs';

import * as fixturesFsFm from '../../test/fixtures/fileset-frontmatter-1';
import { DEFAULT_PERMALINKS_OPTIONS } from './index';
import * as unit from './lib';

const TEST_TFS = MemFsTinyFileSystem();

describe('Permalinks', () => {
  describe('lib', () => {
    describe('mapPermalink', () => {
      it('should work as expected', () => {
        const item = fixturesFsFm.TEST_FILE_SET_FRONT_MATTER_1[1]!;
        const actual = P.Effect.runSync(
          unit.mapPermalink(
            TEST_TFS,
            { match: ['**/*.md'], directoryIndex: 'some-index.html' },
            DEFAULT_PERMALINKS_OPTIONS
          )(item)
        );
        expect(actual.relPath).toEqual('posts/p1/some-index.html');
        expect(actual.link).toEqual('/posts/p1');
        expect(actual.relDir).toEqual('posts/p1');
        expect(actual.fileName).toEqual('some-index.html');
      });

      it('should work as expected with trailing slash', () => {
        const item = fixturesFsFm.TEST_FILE_SET_FRONT_MATTER_1[1]!;
        const actual = P.Effect.runSync(
          unit.mapPermalink(
            TEST_TFS,
            { match: ['**/*.md'], directoryIndex: 'some-index.html', trailingSlash: true },
            DEFAULT_PERMALINKS_OPTIONS
          )(item)
        );
        expect(actual.relPath).toEqual('posts/p1/some-index.html');
        expect(actual.link).toEqual('/posts/p1/');
        expect(actual.relDir).toEqual('posts/p1');
        expect(actual.fileName).toEqual('some-index.html');
      });

      it('should work as expected with index item', () => {
        const item = fixturesFsFm.TEST_FILE_SET_FRONT_MATTER_1[1]!;
        const actual = P.Effect.runSync(
          unit.mapPermalink(TEST_TFS, { match: ['**/*.md'], directoryIndex: 'p1.md' }, DEFAULT_PERMALINKS_OPTIONS)(item)
        );
        expect(actual.relPath).toEqual('posts/p1.md');
        expect(actual.link).toEqual('/posts/p1.md');
        expect(actual.fileName).toEqual('p1.md');
      });

      it('should work as expected with non-matching options', () => {
        const item = fixturesFsFm.TEST_FILE_SET_FRONT_MATTER_1[1]!;
        const actual = P.Effect.runSync(
          unit.mapPermalink(TEST_TFS, { match: ['**/*.pdf'] }, DEFAULT_PERMALINKS_OPTIONS)(item)
        );
        expect(actual.relPath).toEqual('posts/p1.md');
        expect(actual.link).toEqual('/posts/p1.md');
        expect(actual.relDir).toEqual('posts');
        expect(actual.fileName).toEqual('p1.md');
      });

      it('should work as expected with ignored options', () => {
        const item = fixturesFsFm.TEST_FILE_SET_FRONT_MATTER_1[1]!;
        const actual = P.Effect.runSync(
          unit.mapPermalink(TEST_TFS, { match: ['**/*.md'], ignore: ['**/p1.md'] }, DEFAULT_PERMALINKS_OPTIONS)(item)
        );
        expect(actual.relPath).toEqual('posts/p1.md');
        expect(actual.link).toEqual('/posts/p1.md');
        expect(actual.relDir).toEqual('posts');
        expect(actual.fileName).toEqual('p1.md');
      });
    });
  });
});
