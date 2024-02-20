import * as P from '@konker.dev/effect-ts-prelude';

import {
  FuncSmithContextEnvDefault,
  FuncSmithContextMetadataDefault,
  FuncSmithContextReaderTest,
  FuncSmithContextTest,
} from '../../layers';
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
          P.Effect.provide(FuncSmithContextReaderTest),
          P.Effect.provide(FuncSmithContextEnvDefault),
          P.Effect.provide(FuncSmithContextMetadataDefault),
          P.Effect.provide(FuncSmithContextTest)
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
          P.Effect.provide(FuncSmithContextReaderTest),
          P.Effect.provide(FuncSmithContextEnvDefault),
          P.Effect.provide(FuncSmithContextMetadataDefault),
          P.Effect.provide(FuncSmithContextTest)
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
          P.Effect.provide(FuncSmithContextReaderTest),
          P.Effect.provide(FuncSmithContextEnvDefault),
          P.Effect.provide(FuncSmithContextMetadataDefault),
          P.Effect.provide(FuncSmithContextTest)
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
          P.Effect.provide(FuncSmithContextReaderTest),
          P.Effect.provide(FuncSmithContextEnvDefault),
          P.Effect.provide(FuncSmithContextMetadataDefault),
          P.Effect.provide(FuncSmithContextTest)
        )
      );
      expect(actual).toMatchSnapshot('plugin-layouts-1');
    });
  });
});
