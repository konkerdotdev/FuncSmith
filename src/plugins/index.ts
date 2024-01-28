import type { FileSetItem } from '../lib/fileSet';
import type { FileSetMapping, FuncSmithContext, FuncSmithPlugin } from '../types';

// --------------------------------------------------------------------------
export function use<IF extends FileSetItem, OF extends FileSetItem, NIF extends FileSetItem = IF, R1 = never, R2 = R1>(
  plugin: FuncSmithPlugin<IF, OF, NIF, R1, R2>
): FuncSmithPlugin<IF, OF, NIF, R1, R2> {
  return (next: FileSetMapping<NIF, OF, R2 | FuncSmithContext>): FileSetMapping<IF, OF, R1 | FuncSmithContext> =>
    plugin(next);
}

// --------------------------------------------------------------------------
export * from './Cleaner';
export * from './Collections';
export * from './Debug';
export * from './Drafts';
export * from './Env';
export * from './FrontMatter';
export * from './Identity';
export * from './Layouts';
export * from './Markdown';
export * from './Metadata';
export * from './Reader';
export * from './Rename';
export * from './Root';
export * from './Sink';
export * from './Source';
export * from './Writer';
