import * as P from '@konker.dev/effect-ts-prelude';

import type { FileSet, FileSetItem } from '../../lib/fileSet';
import type { FileSetInjectionMappingCtor, FileSetMapping, FileSetMappingCtor } from '../../types';

/**
 * A type when the plugin wants to accept either a full options record, or a string convenience version.
 * E.g.
 * ```
 *     F.collections({
 *       posts: {
 *         globPattern: 'posts/*.html',
 *         sortBy: 'date',
 *       },
 *     }),
 * ```
 * vs
 * ```
 *     F.collections({
 *       posts: 'posts/*.html',
 *     }),
 * ```
 */
export type Convenience<T> = string | Partial<T>;

/**
 * IF - input fileSetItem
 * OF - output fileSetItem
 * MF - mapping output fileSetItem
 * RM - mapping deps
 * RN - next mapping deps
 * OP - options
 */
export const wrapMapping =
  <IF extends FileSetItem, MF extends FileSetItem, RM, OP = undefined>(
    mappingCtor: FileSetMappingCtor<IF, MF, RM, OP>
  ) =>
  (options?: OP) =>
  <OF extends FileSetItem, RN>(next: FileSetMapping<MF, OF, RN>) =>
  (fileSet: FileSet<IF>) =>
    P.pipe(P.Effect.succeed(fileSet), P.Effect.flatMap(mappingCtor(options)), P.Effect.flatMap(next));

/**
 * IF - input fileSetItem
 * OF - output fileSetItem
 * MF - mapping output fileSetItem
 * RM - mapping deps
 * RN - next mapping deps
 * OP - options
 */
export const wrapInjection =
  <IF extends FileSetItem, OF extends FileSetItem, RN, RM, OP = undefined>(
    postMappingCtor: FileSetInjectionMappingCtor<OF, RN, RM, OP>
  ) =>
  (options: OP) =>
  (next: FileSetMapping<IF, OF, RN>): FileSetMapping<IF, OF, RM> =>
  (fileSet: FileSet<IF>) =>
    P.pipe(next(fileSet), postMappingCtor(options));
