import * as P from '@konker.dev/effect-ts-prelude';

import { FuncSmithContextMetadataDefault } from '../../layers';
import * as fixturesFsFm from '../../test/fixtures/fileset-frontmatter-1';
import * as unit from './index';

describe('plugins', () => {
  describe('Collections', () => {
    it('should return the expected value', async () => {
      const pluginStack = P.pipe(P.Effect.succeed, unit.collections());
      const actual = await P.Effect.runPromise(
        P.pipe(
          [...fixturesFsFm.TEST_FILE_SET_FRONT_MATTER_1],
          pluginStack,
          P.Effect.provide(FuncSmithContextMetadataDefault)
        )
      );
      expect(actual).toMatchSnapshot('plugin-collections-1');
    });
  });
});
