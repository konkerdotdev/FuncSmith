import * as P from '@konker.dev/effect-ts-prelude';
import type { TinyFileSystem } from '@konker.dev/tiny-filesystem-fp';

import type { FuncSmithError } from './error';
import type { FileSet, FileSetItem } from './lib/fileSet';
import type { FileSinkWriter } from './sink';
import type { FileSourceReader } from './source';

// --------------------------------------------------------------------------
export type FuncSmithContext<T extends FileSetItem = FileSetItem> = {
  readonly rootDirPath: string;
  readonly fileSet: FileSet<T>;
};
export const FuncSmithContext = <T extends FileSetItem = FileSetItem>() =>
  P.Context.Tag<FuncSmithContext<T>>('FuncSmithContext');

// --------------------------------------------------------------------------
export type FuncSmithContextSource = {
  readonly sourcePath: string; //FIXME: DirectoryPath;
};
export const FuncSmithContextSource = P.Context.Tag<FuncSmithContextSource>('FuncSmithContextSource');

// --------------------------------------------------------------------------
export type FuncSmithContextSink = {
  readonly sinkPath: string; //FIXME: DirectoryPath;
};
export const FuncSmithContextSink = P.Context.Tag<FuncSmithContextSink>('FuncSmithContextSink');

// --------------------------------------------------------------------------
export type FuncSmithContextEnv = {
  readonly env: Record<string, unknown>;
};
export const FuncSmithContextEnv = P.Context.Tag<FuncSmithContextEnv>('FuncSmithContextEnv');

// --------------------------------------------------------------------------
export type FuncSmithContextMetadata = {
  readonly metadata: Record<string, unknown>;
};
export const FuncSmithContextMetadata = P.Context.Tag<FuncSmithContextMetadata>('FuncSmithContextMetadata');

// --------------------------------------------------------------------------
export type FuncSmithContextFs = {
  readonly tinyFs: TinyFileSystem;
};
export const FuncSmithContextFs = P.Context.Tag<FuncSmithContextFs>('FuncSmithContextFs');

// --------------------------------------------------------------------------
export type FuncSmithContextReader = {
  readonly tinyFs: TinyFileSystem;
  readonly reader: FileSourceReader<FileSetItem>;
};
export const FuncSmithContextReader = P.Context.Tag<FuncSmithContextReader>('FuncSmithContextReader');

// --------------------------------------------------------------------------
export type FuncSmithContextWriter = {
  readonly tinyFs: TinyFileSystem;
  readonly writer: FileSinkWriter<FileSetItem>;
};
export const FuncSmithContextWriter = P.Context.Tag<FuncSmithContextWriter>('FuncSmithContextWriter');

// --------------------------------------------------------------------------
export type FileSetMapping<IF extends FileSetItem, OF extends FileSetItem, R = never> = (
  a: FileSet<IF>
) => P.Effect.Effect<R, FuncSmithError, FileSet<OF>>;

export type FuncSmithPlugin<
  IF extends FileSetItem,
  OF extends FileSetItem,
  NIF extends FileSetItem = IF,
  R1 = never,
  R2 = R1,
> = (next: FileSetMapping<NIF, OF, R2 | FuncSmithContext>) => FileSetMapping<IF, OF, R1 | FuncSmithContext>;
