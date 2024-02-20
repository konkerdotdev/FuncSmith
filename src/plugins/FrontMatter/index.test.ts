import * as P from '@konker.dev/effect-ts-prelude';

import * as fixturesFs from '../../test/fixtures/fileset-1';
import * as unit from './index';

describe('plugins', () => {
  describe('FrontMatter', () => {
    it('should return the expected value', async () => {
      const pluginStack = P.pipe(P.Effect.succeed, unit.frontMatter());
      const actual = await P.Effect.runPromise(P.pipe([...fixturesFs.TEST_FILE_SET_1], pluginStack));
      expect(actual).toMatchSnapshot('plugin-front-matter-1');
    });
  });
});
