import * as P from '@konker.dev/effect-ts-prelude';

import { FsDepContextDefault, FsDepEnvDefault } from '../layers';
import * as fixturesFsFm from '../test/fixtures/fileset-frontmatter-1';
import * as unit from './Debug';

describe('plugins', () => {
  describe('Debug', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,fp/no-let
    let consoleSpy: jest.SpyInstance;
    beforeEach(() => {
      // eslint-disable-next-line fp/no-mutation
      consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => P.Effect.unit);
    });
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return the same value', async () => {
      const pluginStack = P.pipe(
        P.Effect.succeed,
        unit.debug((env, metadata, fileSet) => {
          console.log('1', env);
          console.log('2', metadata);
          console.log('3', fileSet);
        })
      );
      const actual = await P.Effect.runPromise(
        P.pipe(
          [...fixturesFsFm.TEST_FILE_SET_FRONT_MATTER_1],
          pluginStack,
          P.Effect.provide(FsDepEnvDefault),
          P.Effect.provide(FsDepContextDefault)
        )
      );
      expect(actual).toStrictEqual(fixturesFsFm.TEST_FILE_SET_FRONT_MATTER_1);
      expect(consoleSpy).toHaveBeenCalledTimes(3);
    });

    it('should return the same value with default debug func', async () => {
      const pluginStack = P.pipe(P.Effect.succeed, unit.debug());
      const actual = await P.Effect.runPromise(
        P.pipe(
          [...fixturesFsFm.TEST_FILE_SET_FRONT_MATTER_1],
          pluginStack,
          P.Effect.provide(FsDepEnvDefault),
          P.Effect.provide(FsDepContextDefault)
        )
      );
      expect(actual).toStrictEqual(fixturesFsFm.TEST_FILE_SET_FRONT_MATTER_1);
      expect(consoleSpy).toHaveBeenCalledTimes(0);
    });
  });
});
