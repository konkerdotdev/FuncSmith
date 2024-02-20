/* eslint-disable @typescript-eslint/naming-convention */
import * as P from '@konker.dev/effect-ts-prelude';
import { MemFsTinyFileSystem, NodeTinyFileSystem } from '@konker.dev/tiny-filesystem-fp';

import { EMPTY_FILESET, FuncSmithContextSink, FuncSmithContextSource } from './index';
import type { FileSet, FileSetItem } from './lib/fileSet';
import { fsFileSinkWriter } from './sink/FsFileSinkWriter';
import { fsFileSourceReader } from './source/FsFileSourceReader';
import memFs1 from './test/fixtures/memfs-1.json';
import {
  FuncSmithContext,
  FuncSmithContextEnv,
  FuncSmithContextFs,
  FuncSmithContextMetadata,
  FuncSmithContextReader,
  FuncSmithContextWriter,
} from './types';

// --------------------------------------------------------------------------
export const FuncSmithContextFsLive = P.Layer.succeed(
  FuncSmithContextFs,
  FuncSmithContextFs.of({
    tinyFs: NodeTinyFileSystem,
  })
);
export const FuncSmithContextFsTest = P.Layer.succeed(
  FuncSmithContextFs,
  FuncSmithContextFs.of({
    tinyFs: MemFsTinyFileSystem(memFs1, '/tmp'),
  })
);

// --------------------------------------------------------------------------
export const FuncSmithContextSourceTest = FuncSmithContextSource.of({
  sourcePath: '/tmp/foo',
});

export const FuncSmithContextSinkTest = FuncSmithContextSink.of({
  sinkPath: '/tmp/build',
});

// --------------------------------------------------------------------------
export const FuncSmithContextReaderLayer = P.Layer.effect(
  FuncSmithContextReader,
  P.Effect.map(FuncSmithContextFs, (funcSmithContextFs) =>
    FuncSmithContextReader.of({
      tinyFs: funcSmithContextFs.tinyFs,
      reader: (sourcePath: string, globPattern: string | undefined) =>
        P.pipe(
          fsFileSourceReader(sourcePath, globPattern),
          P.Effect.provideService(FuncSmithContextFs, funcSmithContextFs)
        ),
    })
  )
);
export const FuncSmithContextReaderLive = P.pipe(FuncSmithContextReaderLayer, P.Layer.provide(FuncSmithContextFsLive));
export const FuncSmithContextReaderTest = P.pipe(FuncSmithContextReaderLayer, P.Layer.provide(FuncSmithContextFsTest));

// --------------------------------------------------------------------------
export const FuncSmithContextWriterLayer = P.Layer.effect(
  FuncSmithContextWriter,
  P.Effect.map(FuncSmithContextFs, (funcSmithContextFs) =>
    FuncSmithContextWriter.of({
      tinyFs: funcSmithContextFs.tinyFs,
      writer: (sinkPath: string, fileSet: FileSet<FileSetItem>) =>
        P.pipe(fsFileSinkWriter(sinkPath, fileSet), P.Effect.provideService(FuncSmithContextFs, funcSmithContextFs)),
    })
  )
);

export const FuncSmithContextWriterLive = P.pipe(FuncSmithContextWriterLayer, P.Layer.provide(FuncSmithContextFsLive));
export const FuncSmithContextWriterTest = P.pipe(FuncSmithContextWriterLayer, P.Layer.provide(FuncSmithContextFsTest));

// --------------------------------------------------------------------------
export const FuncSmithContextEnvDefault = P.Layer.succeed(
  FuncSmithContextEnv,
  FuncSmithContextEnv.of({
    env: {},
  })
);

// --------------------------------------------------------------------------
export const FuncSmithContextMetadataDefault = P.Layer.succeed(
  FuncSmithContextMetadata,
  FuncSmithContextMetadata.of({
    metadata: {},
  })
);

export const FuncSmithContextMetadataTest = P.Layer.succeed(
  FuncSmithContextMetadata,
  FuncSmithContextMetadata.of({
    metadata: {
      testMetaDataName1: 'testMetaDataValue1',
    },
  })
);

// --------------------------------------------------------------------------
export const FuncSmithContextTest = P.Layer.succeed(
  FuncSmithContext(),
  FuncSmithContext().of({
    rootDirPath: '/tmp',
    fileSet: EMPTY_FILESET(),
  })
);
