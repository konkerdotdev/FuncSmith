/* eslint-disable fp/no-unused-expression,fp/no-nil,fp/no-mutation,fp/no-let */
import * as P from '@konker.dev/effect-ts-prelude';
import { fs } from 'memfs';
import { toTreeSync } from 'memfs/lib/print';

import * as F from '../../index';
import { FsDepContextDefault, FsDepReaderTest, FsDepWriterTest } from '../../layers';

describe('funcsmith', () => {
  let env: any;
  let context: any;

  test('integration', async () => {
    const pluginStack = P.pipe(
      P.Effect.succeed,
      F.writer(),
      F.debug((fsDepEnv, fsDepContext, fileSet) => {
        console.log('DEBUG', fileSet.length);
        env = fsDepEnv;
        context = fsDepContext;
      }),
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
      F.inlineIdRefs(),
      F.filter(),
      F.nav(),
      F.tags(),
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
      F.frontMatter(),
      F.reader(),
      // F.cleaner(),
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
      F.sink('/tmp/www'),
      F.source('/tmp/foo'),
      F.root('/tmp')
    );

    const actual = await P.Effect.runPromise(
      P.pipe(
        F.FuncSmith(pluginStack),
        P.Effect.provide(FsDepContextDefault),
        P.Effect.provide(FsDepReaderTest),
        P.Effect.provide(FsDepWriterTest)
      )
    );

    expect(actual).toMatchSnapshot('integration-test-1');
    expect(toTreeSync(fs)).toMatchSnapshot('integration-test-1-fs');
    expect(env).toMatchSnapshot('integration-test-env-1-env');
    expect(context).toMatchSnapshot('integration-test-env-1-context');
  });
});
