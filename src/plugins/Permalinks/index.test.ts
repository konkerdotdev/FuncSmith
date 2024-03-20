import * as P from '@konker.dev/effect-ts-prelude';

import { FsDepWriterTest } from '../../layers';
import * as fixturesFsFm from '../../test/fixtures/fileset-frontmatter-1';
import * as unit from './index';

describe('plugins', () => {
  describe('Permalinks', () => {
    it('should return the expected value with default options', async () => {
      const pluginStack = P.pipe(P.Effect.succeed, unit.permalinks());
      const actual = await P.Effect.runPromise(
        P.pipe([...fixturesFsFm.TEST_FILE_SET_FRONT_MATTER_1], pluginStack, P.Effect.provide(FsDepWriterTest))
      );
      expect(actual).toMatchSnapshot('plugin-permalinks-1');
    });

    it('should return the expected value with default options', async () => {
      const pluginStack = P.pipe(
        P.Effect.succeed,
        unit.permalinks({
          match: ['**/*.md'],
          ignore: ['**/p1.md'],
          directoryIndex: 'index.md',
        })
      );
      const actual = await P.Effect.runPromise(
        P.pipe([...fixturesFsFm.TEST_FILE_SET_FRONT_MATTER_1], pluginStack, P.Effect.provide(FsDepWriterTest))
      );
      expect(actual).toMatchSnapshot('plugin-permalinks-2');
    });
  });
});
