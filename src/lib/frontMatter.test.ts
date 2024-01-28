// import * as P from '@konker.dev/effect-ts-prelude';

import * as unit from './frontMatter';

describe('frontMatter', () => {
  describe('extractFrontMatter', () => {
    it('should work as expected', () => {
      const actual = unit.extractFrontMatter({ contents: ['---\nfoo: bar\n---\nhello world'] } as any);
      expect(actual).toStrictEqual({
        contents: ['hello world'],
        frontMatter: { fm: 'foo: bar' },
      });
    });

    it('should work as expected', () => {
      const actual = unit.extractFrontMatter({ contents: ['hello world'] } as any);
      expect(actual).toStrictEqual({
        contents: ['hello world'],
        frontMatter: {},
      });
    });
  });
});
