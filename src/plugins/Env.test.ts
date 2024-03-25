import * as P from '@konker.dev/effect-ts-prelude';

import * as fixturesFsFm from '../test/fixtures/fileset-frontmatter-1';
import * as unit from './Env';

describe('plugins', () => {
  describe('Env', () => {
    it('should return the same value', async () => {
      const pluginStack = P.pipe(
        P.Effect.succeed,
        unit.env({
          env: 'test',
        })
      );
      const actual = await P.Effect.runPromise(P.pipe([...fixturesFsFm.TEST_FILE_SET_FRONT_MATTER_1], pluginStack));
      expect(actual).toStrictEqual(fixturesFsFm.TEST_FILE_SET_FRONT_MATTER_1);
    });
  });
});
