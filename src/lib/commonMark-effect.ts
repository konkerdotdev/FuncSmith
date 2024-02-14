import * as P from '@konker.dev/effect-ts-prelude';
import { toTinyError } from '@konker.dev/tiny-error-fp';
import * as M from 'commonmark';

// --------------------------------------------------------------------------
export const ERROR_TAG = 'CommonMarkError';
export type ERROR_TAG = typeof ERROR_TAG;

export const toCommonMarkError = toTinyError<ERROR_TAG>(ERROR_TAG);
export type CommonMarkError = ReturnType<typeof toCommonMarkError>;

// --------------------------------------------------------------------------
export const commonMarkParse =
  (options: M.ParserOptions = {}) =>
  (markdown: string): P.Effect.Effect<never, CommonMarkError, M.Node> =>
    P.Effect.try({ try: () => new M.Parser(options).parse(markdown), catch: toCommonMarkError });

export const commonMarkRender =
  (options: M.HtmlRenderingOptions = {}) =>
  (node: M.Node): P.Effect.Effect<never, CommonMarkError, string> =>
    P.Effect.try({ try: () => new M.HtmlRenderer(options).render(node), catch: toCommonMarkError });
