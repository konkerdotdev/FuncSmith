import * as P from '@konker.dev/effect-ts-prelude';

import type { FuncSmithError } from '../../error';
import type { FileSet, FileSetItem } from '../../lib/fileSet';
import { resolveRefsFileSet, resolveRefsObject } from '../../lib/fileSet/idRefs/resolve';
import type { DefaultContext } from '../../types';
import type { FrontMatter } from '../FrontMatter/types';

// --------------------------------------------------------------------------
export function inlineContextProps<IF extends FileSetItem, C extends DefaultContext>(
  fileSet: FileSet<IF | FrontMatter<IF>>,
  context: C
): P.Effect.Effect<C, FuncSmithError> {
  return P.pipe(context, resolveRefsObject(fileSet), P.Effect.succeed);
}

// --------------------------------------------------------------------------
export function inlineFileSetProps<IF extends FileSetItem>(
  fileSet: FileSet<IF | FrontMatter<IF>>
): P.Effect.Effect<FileSet<IF | FrontMatter<IF>>, FuncSmithError> {
  return P.pipe(fileSet, resolveRefsFileSet, P.Effect.succeed);
}
