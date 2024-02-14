import * as P from '@konker.dev/effect-ts-prelude';

import type { FrontMatter } from '../frontMatter';

export enum FileSetItemType {
  File = 'File',
}

export type FileSetItemFile<T = ArrayBuffer | string> = {
  _tag: FileSetItemType.File;
  path: string;
  baseDir: string;
  relPath: string;
  relDir: string;
  fileName: string;
  fileBase: string;
  fileExt: string;
  contents: T;
};

export type FileSetItem<T = ArrayBuffer | string> = FileSetItemFile<T>;

export type FileSet<T extends FileSetItem<C>, C = ArrayBuffer | string> = Array<T>;

// --------------------------------------------------------------------------
export const HtmlString = P.pipe(P.Schema.string, P.Schema.brand(Symbol.for('HtmlString')));
export type HtmlString = P.Schema.Schema.To<typeof HtmlString>;
export type Html<T extends FileSetItem> = FrontMatter<Omit<T, 'contents'>> & {
  readonly contents: HtmlString;
};
