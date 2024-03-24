import * as P from '@konker.dev/effect-ts-prelude';
import { toTinyError } from '@konker.dev/tiny-error-fp';
import * as M from 'commonmark';

import type { MarkdownOptions } from '../plugins/Markdown/types';

// --------------------------------------------------------------------------
export const ERROR_TAG = 'CommonMarkError';
export type ERROR_TAG = typeof ERROR_TAG;

export const toCommonMarkError = toTinyError<ERROR_TAG>(ERROR_TAG);
export type CommonMarkError = ReturnType<typeof toCommonMarkError>;

// --------------------------------------------------------------------------
export function adaptOptions(_options: MarkdownOptions | undefined): M.HtmlRenderingOptions {
  return {};
}

// --------------------------------------------------------------------------
export const commonMarkRender =
  (options?: MarkdownOptions) =>
  (markdown: string): P.Effect.Effect<string, CommonMarkError> =>
    P.pipe(
      P.Effect.try({ try: () => new M.Parser(adaptOptions(options)).parse(markdown), catch: toCommonMarkError }),
      P.Effect.flatMap((node) =>
        P.Effect.try({ try: () => new M.HtmlRenderer(adaptOptions(options)).render(node), catch: toCommonMarkError })
      )
    );
