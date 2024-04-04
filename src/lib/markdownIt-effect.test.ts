import * as P from '@konker.dev/effect-ts-prelude';

import * as unit from './markdownIt-effect';

const TEST_MD = `Hello *world*`;
const TEST_MD_CODE_1 = '```js\nconsole.log("FOO");\n```';
const TEST_MD_CODE_2 =
  '```malbolge\n(=<`#9]~6ZY327Uv4-QsqpMn&+Ij"\'E%e{Ab~w=_:]Kw%o44Uqp0/Q?xNvL:`H%c#DD2^WV>gY;dts76qKJImZk\n```';

describe('markdownIt-effect', () => {
  describe('markdownItRender', () => {
    it('should work as expected', async () => {
      const actual = await P.Effect.runPromise(P.pipe(TEST_MD, unit.markdownItRender()));
      expect(actual).toStrictEqual('<p>Hello <em>world</em></p>\n');
    });

    it('should work as expected with code', async () => {
      const actual = await P.Effect.runPromise(P.pipe(TEST_MD_CODE_1, unit.markdownItRender()));
      expect(actual).toStrictEqual(
        '<pre><code class="hljs language-js"><span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">&quot;FOO&quot;</span>);\n</code></pre>\n'
      );
    });

    it('should work as expected with unrecognized code', async () => {
      const actual = await P.Effect.runPromise(P.pipe(TEST_MD_CODE_2, unit.markdownItRender()));
      expect(actual).toStrictEqual(
        '<pre><code class="hljs language-malbolge">(=&lt;`#9]~6ZY327Uv4-QsqpMn&amp;+Ij&quot;\'E%e{Ab~w=_:]Kw%o44Uqp0/Q?xNvL:`H%c#DD2^WV&gt;gY;dts76qKJImZk\n</code></pre>\n'
      );
    });
  });
});
