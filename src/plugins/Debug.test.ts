import * as P from '@konker.dev/effect-ts-prelude';

import { FsDepEnvDefault, FsDepMetadataDefault } from '../layers';
import * as fixturesFsFm from '../test/fixtures/fileset-frontmatter-1';
import * as unit from './Debug';

describe('plugins', () => {
  describe('Debug', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,fp/no-let
    let consoleSpy: jest.SpyInstance;
    beforeEach(() => {
      // eslint-disable-next-line fp/no-mutation
      consoleSpy = jest.spyOn(P.Console, 'log').mockImplementation(() => P.Effect.unit);
    });
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return the same value', async () => {
      const pluginStack = P.pipe(P.Effect.succeed, unit.debug());
      const actual = await P.Effect.runPromise(
        P.pipe(
          [...fixturesFsFm.TEST_FILE_SET_FRONT_MATTER_1],
          pluginStack,
          P.Effect.provide(FsDepEnvDefault),
          P.Effect.provide(FsDepMetadataDefault)
        )
      );
      expect(actual).toStrictEqual(fixturesFsFm.TEST_FILE_SET_FRONT_MATTER_1);
      expect(consoleSpy).toHaveBeenCalledTimes(5);
    });
  });
});
