import * as P from '@konker.dev/effect-ts-prelude';

import { FuncSmithContextReaderTest, FuncSmithContextSourceTest } from '../layers';
import * as fixturesFs from '../test/fixtures/fileset-1';
import { FuncSmithContextSource } from '../types';
import * as unit from './Reader';

describe('plugins', () => {
  describe('Reader', () => {
    it('should return the same value', async () => {
      const pluginStack = P.pipe(P.Effect.succeed, unit.reader());
      const actual = await P.Effect.runPromise(
        P.pipe(
          [],
          pluginStack,
          P.Effect.provideService(FuncSmithContextSource, FuncSmithContextSourceTest),
          P.Effect.provide(FuncSmithContextReaderTest)
        )
      );
      expect(actual).toStrictEqual(fixturesFs.TEST_FILE_SET_1);
    });
  });
});
