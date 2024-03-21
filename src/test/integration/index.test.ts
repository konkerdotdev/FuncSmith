/* eslint-disable fp/no-unused-expression,fp/no-nil */
import * as P from '@konker.dev/effect-ts-prelude';
import { fs } from 'memfs';
import { toTreeSync } from 'memfs/lib/print';

import * as F from '../../index';
import { FsDepReaderTest, FsDepWriterTest } from '../../layers';

describe('funcsmith', () => {
  test('integration', async () => {
    const pluginStack = P.pipe(
      P.Effect.succeed,
      F.writer(),
      F.debug((_, __, fileSet) => {
        console.log('DEBUG', fileSet.length);
      }),
      F.filter(),
      F.layouts({
        templateEngine: 'handlebars',
        layoutsPath: '/tmp/layouts',
        partialsPath: '/tmp/partials',
        helpers: {
          formattedDate: function (date) {
            return new Date(date).toLocaleDateString();
          },
          toJSON: function (x) {
            // eslint-disable-next-line fp/no-nil
            return JSON.stringify(x, null, 2);
          },
        },
        globPattern: '**/*.html',
      }),
      F.collections({
        posts: {
          globPattern: 'posts/**/*.html',
          sortBy: 'date',
        },
      }),
      F.permalinks({
        match: ['**/posts/**/*.html'],
        directoryIndex: 'index.html',
        trailingSlash: false,
      }),
      F.rename([[/\.md$/, '.html']]),
      F.markdown(),
      F.drafts(),
      F.identity(),
      F.frontMatter(),
      F.reader(),
      F.metadata({
        siteName: 'My Static Site & Blog',
        siteUrl: 'https://example.com/',
        description: "It's about saying »Hello« to the world.",
        generatorName: 'funcsmith',
        generatorUrl: 'https://konker.dev/funcsmith/',
      }),
      F.env({
        TEST_SOME_ENV_VAR: 'TEST_SOME_ENV_VAR_VALUE',
      }),
      F.cleaner(),
      F.sink('/tmp/www'),
      F.source('/tmp/foo'),
      F.root(__dirname)
    );

    const actual = await P.Effect.runPromise(
      P.pipe(F.FuncSmith(pluginStack), P.Effect.provide(FsDepReaderTest), P.Effect.provide(FsDepWriterTest))
    );

    expect(actual).toMatchSnapshot('integration-test-1');
    expect(toTreeSync(fs)).toMatchSnapshot('integration-test-fs-1');
  });
});
