import * as P from '@konker.dev/effect-ts-prelude';

import { FsDepContextTest, FsDepReaderTest } from '../layers';
import * as fixturesFsFm from '../test/fixtures/fileset-frontmatter-1';
import * as unit from './Source';

describe('plugins', () => {
  describe('Source', () => {
    it('should return the same value with relative', async () => {
      const pluginStack = P.pipe(P.Effect.succeed, unit.source('foo'));
      const actual = await P.Effect.runPromise(
        P.pipe(
          [...fixturesFsFm.TEST_FILE_SET_FRONT_MATTER_1],
          pluginStack,
          P.Effect.provide(FsDepReaderTest),
          P.Effect.provide(FsDepContextTest)
        )
      );
      expect(actual).toStrictEqual(fixturesFsFm.TEST_FILE_SET_FRONT_MATTER_1);
    });

    it('should return the same value with absolute path', async () => {
      const pluginStack = P.pipe(P.Effect.succeed, unit.source('/tmp/foo'));
      const actual = await P.Effect.runPromise(
        P.pipe(
          [...fixturesFsFm.TEST_FILE_SET_FRONT_MATTER_1],
          pluginStack,
          P.Effect.provide(FsDepReaderTest),
          P.Effect.provide(FsDepContextTest)
        )
      );
      expect(actual).toStrictEqual(fixturesFsFm.TEST_FILE_SET_FRONT_MATTER_1);
    });
  });
});
