import * as P from '@konker.dev/effect-ts-prelude';

import * as fixturesFsFm from '../../test/fixtures/fileset-frontmatter-1';
import { DEFAULT_MARKDOWN_OPTIONS } from './index';
import * as unit from './lib';

describe('Markdown', () => {
  describe('lib', () => {
    describe('processFileSetItem', () => {
      it('should work as expected', () => {
        const item = fixturesFsFm.TEST_FILE_SET_FRONT_MATTER_1[1]!;
        const actual = P.Effect.runSync(unit.processFileSetItem(DEFAULT_MARKDOWN_OPTIONS)(item));
        expect(actual.contents).toEqual('<p>p1 content</p>\n');
      });

      it('should work as expected with non-matching globPattern', () => {
        const item = fixturesFsFm.TEST_FILE_SET_FRONT_MATTER_1[1]!;
        const actual = P.Effect.runSync(
          unit.processFileSetItem({ ...DEFAULT_MARKDOWN_OPTIONS, globPattern: '*.pdf' })(item)
        );
        expect(actual.contents).toEqual('p1 content');
      });
    });
  });
});
