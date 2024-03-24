/* eslint-disable fp/no-unused-expression,fp/no-nil,fp/no-mutation,fp/no-let */
import * as P from '@konker.dev/effect-ts-prelude';
import { fs } from 'memfs';
import { toTreeSync } from 'memfs/lib/print';

import type { FileSetMapping, FuncSmithPlugin } from '../../index';
import * as F from '../../index';
import { FsDepReaderTest, FsDepWriterTest } from '../../layers';
import type { FileSetItem } from '../../lib/fileSet';

describe('funcsmith', () => {
  let env: any;
  let metadata: any;

  function useImpl<IF extends FileSetItem, OF extends FileSetItem, RN, RM>(plugin1: FuncSmithPlugin<IF, OF, RN, RM>) {
    return function (plugin2: FuncSmithPlugin<IF, OF, RN, RM>) {
      return P.flow(plugin1, plugin2);
    };
  }
  // function use<IF extends FileSetItem, OF extends FileSetItem, R>(mapping: FileSetMapping<IF, OF, R>) {
  //   return { use: mapping };
  // }

  const x = F.root(__dirname)(F.source('/tmp/foo')(F.sink('/tmp/www')(P.Effect.succeed)));
  const xx = P.flow(F.root(__dirname), F.source('/tmp/foo'), F.sink('/tmp/www'));
  const xxx = xx(P.Effect.succeed);

  test('integration', async () => {
    const pluginStack = P.flow(
      F.root(__dirname),
      F.source('/tmp/foo'),
      F.sink('/tmp/www'),
      F.cleaner(),
      F.metadata({
        siteName: 'My Static Site & Blog',
        siteUrl: 'https://example.com/',
        description: "It's about saying »Hello« to the world.",
        generatorName: 'funcsmith',
        generatorUrl: 'https://konker.dev/funcsmith/',
      }),
      F.reader(),
      F.frontMatter(),
      F.markdown(),
      F.writer()
    );

    const actual = await P.Effect.runPromise(
      P.pipe(F.FuncSmith2(pluginStack), P.Effect.provide(FsDepReaderTest), P.Effect.provide(FsDepWriterTest))
    );

    expect(actual).toMatchSnapshot('integration-test-1');
    expect(toTreeSync(fs)).toMatchSnapshot('integration-test-1-fs');
    expect(env).toMatchSnapshot('integration-test-env-1-env');
    expect(metadata).toMatchSnapshot('integration-test-env-1-metadata');
  });

  test('integration', async () => {
    const pluginStack = P.pipe(
      P.Effect.succeed,
      F.writer(),
      F.debug((fsDepEnv, fsDepMetadata, fileSet) => {
        console.log('DEBUG', fileSet.length);
        env = fsDepEnv;
        metadata = fsDepMetadata;
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
      F.nav(),
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
    expect(toTreeSync(fs)).toMatchSnapshot('integration-test-1-fs');
    expect(env).toMatchSnapshot('integration-test-env-1-env');
    expect(metadata).toMatchSnapshot('integration-test-env-1-metadata');
  });
});
