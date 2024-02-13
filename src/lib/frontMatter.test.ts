import * as P from '@konker.dev/effect-ts-prelude';

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
      const actual = P.Effect.runSync(unit.extractFrontMatter({ contents: '---\nfoo: bar\n---\nhello world' } as any));
      expect(actual).toStrictEqual({
        contents: 'hello world',
        frontMatter: { foo: 'bar' },
      });
    });

    it('should work as expected', () => {
      const actual = P.Effect.runSync(unit.extractFrontMatter({ contents: 'hello world' } as any));
      expect(actual).toStrictEqual({
        contents: 'hello world',
        frontMatter: {},
      });
    });
  });
});
