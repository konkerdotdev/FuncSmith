/* eslint-disable @typescript-eslint/naming-convention */
import * as P from '@konker.dev/effect-ts-prelude';
import { MemFsTinyFileSystem, NodeTinyFileSystem } from '@konker.dev/tiny-filesystem-fp';

import type { DefaultContext } from './index';
import { FsDepSink, FsDepSource } from './index';
import type { FileSet, FileSetItem } from './lib/fileSet';
import { fsFileSinkWriter } from './sink/FsFileSinkWriter';
import { fsFileSourceReader } from './source/FsFileSourceReader';
import memFs1 from './test/fixtures/memfs-1.json';
import { FsDepContext, FsDepEnv, FsDepReader, FsDepTinyFileSystem, FsDepWriter } from './types';

// --------------------------------------------------------------------------
export const FsDepTinyFileSystemLive = P.Layer.succeed(
  FsDepTinyFileSystem,
  FsDepTinyFileSystem.of({
    tinyFs: NodeTinyFileSystem,
  })
);
export const FsDepTinyFileSystemTest = P.Layer.succeed(
  FsDepTinyFileSystem,
  FsDepTinyFileSystem.of({
    tinyFs: MemFsTinyFileSystem(memFs1, '/tmp'),
  })
);

// --------------------------------------------------------------------------
export const FsDepSourceTest = FsDepSource.of({
  sourcePath: '/tmp/foo',
});

export const FsDepSinkTest = FsDepSink.of({
  sinkPath: '/tmp/build',
});

// --------------------------------------------------------------------------
export const FsDepReaderLayer = P.Layer.effect(
  FsDepReader,
  P.Effect.map(FsDepTinyFileSystem, (fsDepTinyFileSystem) =>
    FsDepReader.of({
      tinyFs: fsDepTinyFileSystem.tinyFs,
      reader: (sourcePath: string, globPattern: string | undefined) =>
        P.pipe(
          fsFileSourceReader(sourcePath, globPattern),
          P.Effect.provideService(FsDepTinyFileSystem, fsDepTinyFileSystem)
        ),
    })
  )
);
export const FsDepReaderLive = P.pipe(FsDepReaderLayer, P.Layer.provide(FsDepTinyFileSystemLive));
export const FsDepReaderTest = P.pipe(FsDepReaderLayer, P.Layer.provide(FsDepTinyFileSystemTest));
export const FsDepReaderDefault = FsDepReaderLive;

// --------------------------------------------------------------------------
export const FsDepWriterLayer = P.Layer.effect(
  FsDepWriter,
  P.Effect.map(FsDepTinyFileSystem, (fsDepTinyFileSystem) =>
    FsDepWriter.of({
      tinyFs: fsDepTinyFileSystem.tinyFs,
      writer: (sinkPath: string, fileSet: FileSet<FileSetItem>) =>
        P.pipe(fsFileSinkWriter(sinkPath, fileSet), P.Effect.provideService(FsDepTinyFileSystem, fsDepTinyFileSystem)),
    })
  )
);

export const FsDepWriterLive = P.pipe(FsDepWriterLayer, P.Layer.provide(FsDepTinyFileSystemLive));
export const FsDepWriterTest = P.pipe(FsDepWriterLayer, P.Layer.provide(FsDepTinyFileSystemTest));
export const FsDepWriterDefault = FsDepWriterLive;

// --------------------------------------------------------------------------
export const FsDepEnvDefault = P.Layer.succeed(
  FsDepEnv,
  FsDepEnv.of({
    env: {},
  })
);

// --------------------------------------------------------------------------
export const FsDepContextDefault = P.Layer.succeed(FsDepContext<DefaultContext>(), FsDepContext().of({}));
