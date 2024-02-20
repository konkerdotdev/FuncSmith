import * as P from '@konker.dev/effect-ts-prelude';

import { FuncSmithContextWriterTest } from '../../layers';
import * as fixturesFsFm from '../../test/fixtures/fileset-frontmatter-1';
import * as unit from './index';

describe('plugins', () => {
  describe('Rename', () => {
    it('should return the expected value with default options', async () => {
      const pluginStack = P.pipe(P.Effect.succeed, unit.rename());
      const actual = await P.Effect.runPromise(
        P.pipe(
          [...fixturesFsFm.TEST_FILE_SET_FRONT_MATTER_1],
          pluginStack,
          P.Effect.provide(FuncSmithContextWriterTest)
        )
      );
      expect(actual).toMatchSnapshot('plugin-rename-1');
    });
  });
});
