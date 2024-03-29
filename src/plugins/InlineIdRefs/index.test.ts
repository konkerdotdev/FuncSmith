import * as P from '@konker.dev/effect-ts-prelude';

import { FsDepContextDefault } from '../../layers';
import * as fixturesFsFm from '../../test/fixtures/fileset-frontmatter-1';
import * as unit from './index';

describe('plugins', () => {
  describe('InlineIdRefs', () => {
    it('should return the expected value', async () => {
      const pluginStack = P.pipe(P.Effect.succeed, unit.inlineIdRefs());
      const actual = await P.Effect.runPromise(
        P.pipe([...fixturesFsFm.TEST_FILE_SET_FRONT_MATTER_1], pluginStack, P.Effect.provide(FsDepContextDefault))
      );
      expect(actual).toMatchSnapshot('plugin-inline-id-refs-1');
    });
  });
});
