import * as P from '@konker.dev/effect-ts-prelude';
import { MemFsTinyFileSystem } from '@konker.dev/tiny-filesystem-fp/dist/memfs';

import * as fileSetItemLib from '../lib/fileSet/fileSetItem';
import * as fixturesFs from '../test/fixtures/fileset-1';
import fixturesMemFs1 from '../test/fixtures/memfs-1.json';
import { FsDepTinyFileSystem } from '../types';
import * as unit from './FsFileSinkWriter';

const TEST_TFS = MemFsTinyFileSystem(fixturesMemFs1, '/tmp');
import { fs } from 'memfs';
import { toTreeSync } from 'memfs/lib/print';

describe('sink', () => {
  describe('FsFileSinkWriter', () => {
    beforeEach(() => {
      jest.spyOn(fileSetItemLib, 'isFileSetItemFile').mockReturnValueOnce(false);
    });
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should write files to the file system', async () => {
      const sinkPath = '/tmp/foo';
      await P.Effect.runPromise(
        P.pipe(
          unit.fsFileSinkWriter(sinkPath, fixturesFs.TEST_FILE_SET_1),
          P.Effect.provideService(
            FsDepTinyFileSystem,
            FsDepTinyFileSystem.of({
              tinyFs: TEST_TFS,
            })
          )
        )
      );

      // Inspect state of memfs
      expect(toTreeSync(fs)).toMatchSnapshot('fsFileSinkWriter_memfs_tree_1');
    });
  });
});
