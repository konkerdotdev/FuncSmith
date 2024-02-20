import * as P from '@konker.dev/effect-ts-prelude';
import { MemFsTinyFileSystem } from '@konker.dev/tiny-filesystem-fp/dist/memfs';

import * as fixturesFsFm from '../../test/fixtures/fileset-frontmatter-1';
import * as unit from './lib';

const TEST_TFS = MemFsTinyFileSystem();

describe('Rename', () => {
  describe('lib', () => {
    describe('renameFileSetItem', () => {
      it('should work as expected', () => {
        const item = fixturesFsFm.TEST_FILE_SET_FRONT_MATTER_1[1]!;
        const actual = P.Effect.runSync(unit.renameFileSetItem(TEST_TFS, [[/\.md$/, '.html']])(item));
        expect(actual.fileName).toEqual('p1.html');
      });

      it('should work as expected with non-matching rename spec', () => {
        const item = fixturesFsFm.TEST_FILE_SET_FRONT_MATTER_1[1]!;
        const actual = P.Effect.runSync(unit.renameFileSetItem(TEST_TFS, [[/\.pdf$/, '.html']])(item));
        expect(actual.fileName).toEqual('p1.md');
      });
    });
  });
});
