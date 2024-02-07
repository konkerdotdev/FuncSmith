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
export type FileSetMappingResult<IF extends FileSetItem, R> = P.Effect.Effect<R, FuncSmithError, FileSet<IF>>;

// --------------------------------------------------------------------------
export type FileSetMapping<IF extends FileSetItem, OF extends FileSetItem, R> = (
  a: FileSet<IF>
) => FileSetMappingResult<OF, R>;

export type FileSetMappingCtor<IF extends FileSetItem, OF extends FileSetItem, R, OP = undefined> = (
  options?: OP
) => FileSetMapping<IF, OF, R>;

// --------------------------------------------------------------------------
export type FileSetInjectionMapping<IF extends FileSetItem, R1, R2> = (
  result: FileSetMappingResult<IF, R1>
) => FileSetMappingResult<IF, R2>;

export type FileSetInjectionMappingCtor<IF extends FileSetItem, R1, R2, OP = undefined> = (
  options?: OP
) => FileSetInjectionMapping<IF, R1, R2>;
