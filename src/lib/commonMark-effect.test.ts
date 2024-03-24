import * as P from '@konker.dev/effect-ts-prelude';

import * as unit from './commonMark-effect';

const TEST_MD = 'Hello *world*';
const TEST_MD_CODE = '```js\nconsole.log("FOO");\n```';

describe('commonMark-effect', () => {
  describe('commonMarkRender', () => {
    it('should work as expected', () => {
      const actual = P.Effect.runSync(P.pipe(TEST_MD, unit.commonMarkRender()));
      expect(actual).toStrictEqual('<p>Hello <em>world</em></p>\n');
    });

    it('should work as expected with code', async () => {
      const actual = await P.Effect.runPromise(P.pipe(TEST_MD_CODE, unit.commonMarkRender()));
      expect(actual).toStrictEqual('<pre><code class="language-js">console.log(&quot;FOO&quot;);\n</code></pre>\n');
    });
  });
});
