import * as P from '@konker.dev/effect-ts-prelude';

import * as fixturesFsFm from '../../test/fixtures/fileset-frontmatter-1';
import * as unit from './index';

describe('plugins', () => {
  describe('Drafts', () => {
    it('should return the expected value', async () => {
      const pluginStack = P.pipe(P.Effect.succeed, unit.drafts());
      const actual = await P.Effect.runPromise(P.pipe([...fixturesFsFm.TEST_FILE_SET_FRONT_MATTER_1], pluginStack));
      expect(actual).toMatchSnapshot('plugin-drafts-1');
    });
  });
});
