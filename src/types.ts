import * as P from '@konker.dev/effect-ts-prelude';
import type { TinyFileSystem } from '@konker.dev/tiny-filesystem-fp';

import type { FuncSmithError } from './error';
import type { FileSet, FileSetItem } from './lib/fileSet';
import type { FileSinkWriter } from './sink';
import type { FileSourceReader } from './source';

// --------------------------------------------------------------------------
export type FsDepContext<T extends FileSetItem = FileSetItem> = {
  readonly rootDirPath: string;
  readonly fileSet: FileSet<T>;
};
export const FsDepContext = <T extends FileSetItem = FileSetItem>() => P.Context.Tag<FsDepContext<T>>('FsDepContext');

// --------------------------------------------------------------------------
export type FsDepSource = {
  readonly sourcePath: string;
};
export const FsDepSource = P.Context.Tag<FsDepSource>('FsDepSource');

// --------------------------------------------------------------------------
export type FsDepSink = {
  readonly sinkPath: string;
};
export const FsDepSink = P.Context.Tag<FsDepSink>('FsDepSink');

// --------------------------------------------------------------------------
export type FsDepEnv = {
  readonly env: Record<string, unknown>;
};
export const FsDepEnv = P.Context.Tag<FsDepEnv>('FsDepEnv');

// --------------------------------------------------------------------------
export type FsDepMetadata = {
  readonly metadata: Record<string, unknown>;
};
export const FsDepMetadata = P.Context.Tag<FsDepMetadata>('FsDepMetadata');

// --------------------------------------------------------------------------
export type FsDepTinyFileSystem = {
  readonly tinyFs: TinyFileSystem;
};
export const FsDepTinyFileSystem = P.Context.Tag<FsDepTinyFileSystem>('FsDepTinyFileSystem');

// --------------------------------------------------------------------------
export type FsDepReader = {
  readonly tinyFs: TinyFileSystem;
  readonly reader: FileSourceReader<FileSetItem>;
};
export const FsDepReader = P.Context.Tag<FsDepReader>('FsDepReader');

// --------------------------------------------------------------------------
export type FsDepWriter = {
  readonly tinyFs: TinyFileSystem;
  readonly writer: FileSinkWriter<FileSetItem>;
};
export const FsDepWriter = P.Context.Tag<FsDepWriter>('FsDepWriter');

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
  options: OP
) => FileSetInjectionMapping<IF, R1, R2>;
