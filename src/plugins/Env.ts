import * as P from '@konker.dev/effect-ts-prelude';

import type { FileSet, FileSetItem } from '../lib/fileSet';
import type { FileSetMapping } from '../types';
import { FuncSmithContextEnv } from '../types';

export const env =
  <T extends FileSetItem, R>(env: Record<string, unknown>) =>
  (next: FileSetMapping<T, T, R>): FileSetMapping<T, T, Exclude<R, FuncSmithContextEnv>> =>
  (ifs: FileSet<T>) =>
    P.pipe(next(ifs), P.Effect.provideService(FuncSmithContextEnv, FuncSmithContextEnv.of({ env })));
