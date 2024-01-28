import * as P from '@konker.dev/effect-ts-prelude';

import type { FileSet, FileSetItem } from '../lib/fileSet';
import type { FileSetMapping } from '../types';
import { FuncSmithContextMetadata } from '../types';

export const metadata =
  <IF extends FileSetItem, OF extends FileSetItem, R>(metadata: Record<string, unknown>) =>
  (next: FileSetMapping<IF, OF, R>): FileSetMapping<IF, OF, Exclude<R, FuncSmithContextMetadata>> =>
  (ifs: FileSet<IF>) =>
    P.pipe(next(ifs), P.Effect.provideService(FuncSmithContextMetadata, FuncSmithContextMetadata.of({ metadata })));
