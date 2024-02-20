import * as P from '@konker.dev/effect-ts-prelude';

import { FsDepSinkTest, FsDepWriterTest } from '../layers';
import * as fixturesFsFm from '../test/fixtures/fileset-frontmatter-1';
import { FsDepSink } from '../types';
import * as unit from './Cleaner';

describe('plugins', () => {
  describe('Cleaner', () => {
    it('should return the same value', async () => {
      const pluginStack = P.pipe(P.Effect.succeed, unit.cleaner());
      const actual = await P.Effect.runPromise(
        P.pipe(
          [...fixturesFsFm.TEST_FILE_SET_FRONT_MATTER_1],
          pluginStack,
          P.Effect.provideService(FsDepSink, FsDepSinkTest),
          P.Effect.provide(FsDepWriterTest)
        )
      );
      expect(actual).toStrictEqual(fixturesFsFm.TEST_FILE_SET_FRONT_MATTER_1);
    });
  });
});
