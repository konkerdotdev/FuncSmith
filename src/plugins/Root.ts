import * as P from '@konker.dev/effect-ts-prelude';

import { EMPTY_FILESET } from '../index';
import type { FileSet, FileSetItem } from '../lib/fileSet';
import type { FileSetMapping } from '../types';
import { FuncSmithContext } from '../types';

export const root =
  <T extends FileSetItem, R>(rootDirPath: string) =>
  (next: FileSetMapping<T, T, R>): FileSetMapping<T, T, Exclude<R, FuncSmithContext<T>>> =>
  (ifs: FileSet<T>) =>
    P.pipe(
      next(ifs),
      P.Effect.provideService(
        FuncSmithContext<T>(),
        FuncSmithContext<T>().of({ fileSet: EMPTY_FILESET<T>(), rootDirPath })
      )
    );
