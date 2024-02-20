import * as P from '@konker.dev/effect-ts-prelude';

import { FsDepContextTest, FsDepEnvDefault, FsDepMetadataDefault, FsDepReaderTest } from '../../layers';
import * as fixturesFsFm from '../../test/fixtures/fileset-frontmatter-1';
import * as unit from './index';

describe('plugins', () => {
  describe('Layouts', () => {
    it('should return the expected value with default options', async () => {
      const pluginStack = P.pipe(P.Effect.succeed, unit.layouts());
      const actual = await P.Effect.runPromise(
        P.pipe(
          [...fixturesFsFm.TEST_FILE_SET_FRONT_MATTER_1],
          pluginStack,
          P.Effect.provide(FsDepReaderTest),
          P.Effect.provide(FsDepEnvDefault),
          P.Effect.provide(FsDepMetadataDefault),
          P.Effect.provide(FsDepContextTest)
        )
      );
      expect(actual).toMatchSnapshot('plugin-layouts-1');
    });

    it('should return the expected value with specific options, absolute layouts path', async () => {
      const pluginStack = P.pipe(
        P.Effect.succeed,
        unit.layouts({
          layoutsPath: '/tmp/layouts',
        })
      );
      const actual = await P.Effect.runPromise(
        P.pipe(
          [...fixturesFsFm.TEST_FILE_SET_FRONT_MATTER_1],
          pluginStack,
          P.Effect.provide(FsDepReaderTest),
          P.Effect.provide(FsDepEnvDefault),
          P.Effect.provide(FsDepMetadataDefault),
          P.Effect.provide(FsDepContextTest)
        )
      );
      expect(actual).toMatchSnapshot('plugin-layouts-1');
    });

    it('should return the expected value with specific options relative partials path', async () => {
      const pluginStack = P.pipe(
        P.Effect.succeed,
        unit.layouts({
          partialsPath: 'partials',
        })
      );
      const actual = await P.Effect.runPromise(
        P.pipe(
          [...fixturesFsFm.TEST_FILE_SET_FRONT_MATTER_1],
          pluginStack,
          P.Effect.provide(FsDepReaderTest),
          P.Effect.provide(FsDepEnvDefault),
          P.Effect.provide(FsDepMetadataDefault),
          P.Effect.provide(FsDepContextTest)
        )
      );
      expect(actual).toMatchSnapshot('plugin-layouts-1');
    });

    it('should return the expected value with specific options absolute partials path', async () => {
      const pluginStack = P.pipe(
        P.Effect.succeed,
        unit.layouts({
          layoutsPath: '/tmp/layouts',
          partialsPath: '/tmp/partials',
        })
      );
      const actual = await P.Effect.runPromise(
        P.pipe(
          [...fixturesFsFm.TEST_FILE_SET_FRONT_MATTER_1],
          pluginStack,
          P.Effect.provide(FsDepReaderTest),
          P.Effect.provide(FsDepEnvDefault),
          P.Effect.provide(FsDepMetadataDefault),
          P.Effect.provide(FsDepContextTest)
        )
      );
      expect(actual).toMatchSnapshot('plugin-layouts-1');
    });
  });
});
