import * as P from '@konker.dev/effect-ts-prelude';
import { MemFsTinyFileSystem } from '@konker.dev/tiny-filesystem-fp/dist/memfs';

import * as fixturesFs from '../test/fixtures/fileset-1';
import fixturesMemFs1 from '../test/fixtures/memfs-1.json';
import { FuncSmithContextFs } from '../types';
import * as unit from './FsFileSourceReader';

const TEST_TFS = MemFsTinyFileSystem(fixturesMemFs1, '/tmp');

describe('source', () => {
  describe('FsFileSourceReader', () => {
    it('should return a FileSet with default glob pattern', async () => {
      const actual = await P.Effect.runPromise(
        P.pipe(
          unit.fsFileSourceReader('/tmp/foo'),
          P.Effect.provideService(
            FuncSmithContextFs,
            FuncSmithContextFs.of({
              tinyFs: TEST_TFS,
            })
          )
        )
      );
      expect(actual).toStrictEqual(fixturesFs.TEST_FILE_SET_1);
    });

    it('should return a FileSet with specific glob pattern', async () => {
      const actual = await P.Effect.runPromise(
        P.pipe(
          unit.fsFileSourceReader('/tmp/foo', '**/*.md'),
          P.Effect.provideService(
            FuncSmithContextFs,
            FuncSmithContextFs.of({
              tinyFs: TEST_TFS,
            })
          )
        )
      );
      expect(actual).toStrictEqual(fixturesFs.TEST_FILE_SET_1.filter((item) => item.path.endsWith('.md')));
    });
  });
});
