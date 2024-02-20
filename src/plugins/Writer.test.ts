import * as P from '@konker.dev/effect-ts-prelude';
import { fs } from 'memfs';
import { toTreeSync } from 'memfs/lib/print';

import { FuncSmithContextSinkTest, FuncSmithContextWriterTest } from '../layers';
import * as fixturesFsFm from '../test/fixtures/fileset-frontmatter-1';
import { FuncSmithContextSink } from '../types';
import * as unit from './Writer';

describe('plugins', () => {
  describe('Writer', () => {
    it('should return the same value', async () => {
      const pluginStack = P.pipe(P.Effect.succeed, unit.writer());
      const actual = await P.Effect.runPromise(
        P.pipe(
          [...fixturesFsFm.TEST_FILE_SET_FRONT_MATTER_1],
          pluginStack,
          P.Effect.provideService(FuncSmithContextSink, FuncSmithContextSinkTest),
          P.Effect.provide(FuncSmithContextWriterTest)
        )
      );
      expect(actual).toStrictEqual(fixturesFsFm.TEST_FILE_SET_FRONT_MATTER_1);

      // Inspect state of memfs
      expect(toTreeSync(fs)).toMatchSnapshot('plugins-writer-1');
    });
  });
});
