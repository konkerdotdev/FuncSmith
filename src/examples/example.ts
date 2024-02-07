/* eslint-disable fp/no-unused-expression */
import * as P from '@konker.dev/effect-ts-prelude';

import * as F from '../index';
import { EMPTY_FILESET } from '../index';
import {
  FuncSmithContextEnvDefault,
  FuncSmithContextMetadataDefault,
  FuncSmithContextReaderLive,
  FuncSmithContextWriterLive,
} from '../layers';

(async () => {
  const pluginStack = P.pipe(
    P.Effect.succeed,
    F.writer(),
    F.layouts({
      templateEngine: 'handlebars',
      directory: 'example-src/layouts',
      helpers: {
        formattedDate: function (date) {
          return new Date(date).toLocaleDateString();
        },
      },
      globPattern: '**/*.html',
    }),
    F.debug('KONK90'),
    F.collections({
      posts: 'posts/*.html',
    }),
    F.rename([[/\.md$/, '.html']]),
    F.markdown(),
    F.identity(),
    F.drafts(),
    F.frontMatter(),
    F.reader(),
    F.metadata({
      siteName: 'My Static Site & Blog',
      siteUrl: 'https://example.com/',
      description: "It's about saying »Hello« to the world.",
      generatorName: 'FuncSmith',
      generatorUrl: 'https://konker.dev/funcsmith/',
    }),
    F.env({
      TEST_SOME_ENV_VAR: 'TEST_SOME_ENV_VAR_VALUE',
    }),
    F.cleaner(),
    F.use(F.sink('example-build')),
    F.source('example-src/src'),
    F.root(__dirname)
  );

  return P.Effect.runPromise(
    P.pipe(
      pluginStack(EMPTY_FILESET()),
      P.Effect.provide(FuncSmithContextMetadataDefault),
      P.Effect.provide(FuncSmithContextEnvDefault),
      // ---
      P.Effect.provide(FuncSmithContextReaderLive),
      P.Effect.provide(FuncSmithContextWriterLive)
    )
  );
})();
