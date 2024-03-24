import * as P from '@konker.dev/effect-ts-prelude';

import * as unit from './markdownIt-effect';

const TEST_MD = `Hello *world*`;
const TEST_MD_CODE = '```js\nconsole.log("FOO");```';

describe('markdownIt-effect', () => {
  describe('markdownItRender', () => {
    it('should work as expected', async () => {
      const actual = await P.Effect.runPromise(P.pipe(TEST_MD, unit.markdownItRender()));
      expect(actual).toStrictEqual('<p>Hello <em>world</em></p>\n');
    });

    it('should work as expected', async () => {
      const actual = await P.Effect.runPromise(P.pipe(TEST_MD_CODE, unit.markdownItRender()));
      expect(actual).toStrictEqual('<p>Hello <em>world</em></p>\n');
    });
  });
});
