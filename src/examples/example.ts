/* eslint-disable fp/no-unused-expression */
import * as P from '@konker.dev/effect-ts-prelude';

import * as F from '../index';
import { FuncSmith } from '../index';
import { FsDepReaderLive, FsDepWriterLive } from '../layers';

(async () => {
  const pluginStack = P.pipe(
    P.Effect.succeed,
    F.writer(),
    F.debug(),
    F.filter(),
    F.layouts({
      templateEngine: 'handlebars',
      layoutsPath: 'example-src/layouts',
      partialsPath: 'example-src/partials',
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
        globPattern: 'posts/*.html',
        sortBy: 'date',
      },
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
    F.sink('example-build'),
    F.source('example-src/src'),
    F.root(__dirname)
  );

  return P.Effect.runPromise(
    P.pipe(FuncSmith(pluginStack), P.Effect.provide(FsDepReaderLive), P.Effect.provide(FsDepWriterLive))
  );
})();
