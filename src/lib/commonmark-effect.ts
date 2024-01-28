import * as P from '@konker.dev/effect-ts-prelude';
import * as M from 'commonmark';

import type { FuncSmithError } from '../error';
import { toFuncSmithError } from '../error';

export const commonmarkParse =
  (options: M.ParserOptions = {}) =>
  (markdown: string): P.Effect.Effect<never, FuncSmithError, M.Node> =>
    P.Effect.try({ try: () => new M.Parser(options).parse(markdown), catch: toFuncSmithError });

export const commonmarkRender =
  (options: M.HtmlRenderingOptions = {}) =>
  (node: M.Node): P.Effect.Effect<never, FuncSmithError, string> =>
    P.Effect.try({ try: () => new M.HtmlRenderer(options).render(node), catch: toFuncSmithError });
