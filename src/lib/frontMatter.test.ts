import * as P from '@konker.dev/effect-ts-prelude';

import * as fixturesFs from '../test/fixtures/fileset-1';
import * as unit from './frontMatter';

describe('frontMatter', () => {
  describe('isFrontMatter', () => {
    it('should work as expected', () => {
      expect(unit.isFrontMatter({ frontMatter: { foo: 'bar' } } as any)).toEqual(true);
      expect(unit.isFrontMatter({} as any)).toEqual(false);
    });
  });

  describe('extractFrontMatter', () => {
    it('should work as expected', () => {
      const item = fixturesFs.TEST_FILE_SET_1[9]!;
      const actual = P.Effect.runSync(unit.extractFrontMatter()(item));
      expect(actual).toStrictEqual({
        _id: 'b5867102be1aca22fcd0ca30e236486c4e409b13',
        _tag: 'File',
        baseDir: '/tmp/foo',
        contents: '# P2\np2 content',
        date: new Date('2024-01-02T00:00:00.000Z'),
        draft: true,
        fileBase: 'p2',
        fileExt: '.md',
        fileName: 'p2.md',
        frontMatter: {
          date: new Date('2024-01-02T00:00:00.000Z'),
          layout: 'post.hbs',
          title: 'P2',
          draft: true,
        },
        layout: 'post.hbs',
        path: '/tmp/foo/posts/p2.md',
        relDir: 'posts',
        relPath: 'posts/p2.md',
        link: '/posts/p2.md',
        title: 'P2',
      });
    });

    it('should work as expected with extra frontMatter', () => {
      const item = fixturesFs.TEST_FILE_SET_1[9]!;
      const actual = P.Effect.runSync(unit.extractFrontMatter({ extra: 'EXTRA' })(item));
      expect(actual).toStrictEqual({
        _id: 'b5867102be1aca22fcd0ca30e236486c4e409b13',
        _tag: 'File',
        baseDir: '/tmp/foo',
        contents: '# P2\np2 content',
        date: new Date('2024-01-02T00:00:00.000Z'),
        draft: true,
        fileBase: 'p2',
        fileExt: '.md',
        extra: 'EXTRA',
        fileName: 'p2.md',
        frontMatter: {
          date: new Date('2024-01-02T00:00:00.000Z'),
          layout: 'post.hbs',
          title: 'P2',
          draft: true,
          extra: 'EXTRA',
        },
        layout: 'post.hbs',
        path: '/tmp/foo/posts/p2.md',
        relDir: 'posts',
        relPath: 'posts/p2.md',
        link: '/posts/p2.md',
        title: 'P2',
      });
    });

    it('should work as expected with no front matter', () => {
      const item = fixturesFs.TEST_FILE_SET_1[0]!;
      const actual = P.Effect.runSync(unit.extractFrontMatter()(item));
      expect(actual).toStrictEqual({
        _id: 'e57ec8617d467edfff00943eac189e0ec6eb1875',
        _tag: 'File',
        baseDir: '/tmp/foo',
        contents: 'A',
        fileBase: 'a',
        fileExt: '.txt',
        fileName: 'a.txt',
        frontMatter: {},
        path: '/tmp/foo/a.txt',
        relDir: '.',
        relPath: 'a.txt',
        link: '/a.txt',
      });
    });
  });
});
