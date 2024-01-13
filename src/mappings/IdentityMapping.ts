import * as P from '@konker.dev/effect-ts-prelude';

import type { Environment } from '../index';
import type { FileSet } from './index';

export function identityMapping<D extends Environment>(a: FileSet): P.Effect.Effect<D, Error, FileSet> {
  return P.Effect.succeed([...a]);
}
