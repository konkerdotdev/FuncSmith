import * as P from '@konker.dev/effect-ts-prelude';

import type { FrontMatter } from '../../plugins/FrontMatter/types';
import type { ID_PROP } from './idRefs';

export enum FileSetItemType {
  File = 'File',
}

export type FileSetItemFile<T = ArrayBuffer | string> = {
  readonly _tag: FileSetItemType.File;
  readonly [ID_PROP]: string;
  readonly path: string;
  readonly baseDir: string;
  readonly relPath: string;
  readonly relDir: string;
  readonly link: string;
  readonly fileName: string;
  readonly fileBase: string;
  readonly fileExt: string;
  readonly contents: T;
};

export type FileSetItem<T = ArrayBuffer | string> = FileSetItemFile<T>;

export type FileSet<T extends FileSetItem<C>, C = ArrayBuffer | string> = ReadonlyArray<T>;

// --------------------------------------------------------------------------
export const HtmlString = P.pipe(P.Schema.string, P.Schema.brand(Symbol.for('HtmlString')));
export type HtmlString = P.Schema.Schema.To<typeof HtmlString>;
export type Html<T extends FileSetItem> = FrontMatter<Omit<T, 'contents'>> & {
  readonly contents: HtmlString;
};
