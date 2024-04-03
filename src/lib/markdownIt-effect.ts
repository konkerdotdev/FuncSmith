import * as P from '@konker.dev/effect-ts-prelude';
import { toTinyError } from '@konker.dev/tiny-error-fp';
import H from 'highlight.js';
import markdownIt from 'markdown-it';

import type { MarkdownOptions } from '../plugins/Markdown/types';

// --------------------------------------------------------------------------
export const ERROR_TAG = 'MarkdownItError';
export type ERROR_TAG = typeof ERROR_TAG;

export const toMarkdownItError = toTinyError<ERROR_TAG>(ERROR_TAG);
export type MarkdownItError = ReturnType<typeof toMarkdownItError>;

// --------------------------------------------------------------------------
export function adaptOptions(_options: MarkdownOptions | undefined): markdownIt.Options {
  return {
    highlight: function (str, lang) {
      if (lang && H.getLanguage(lang)) {
        try {
          return H.highlight(lang, str, true).value;
        } catch (__) {}
      }

      return ''; // use external default escaping
    },
  };
}

// --------------------------------------------------------------------------
export const markdownItRender =
  (options?: MarkdownOptions) =>
  (markdown: string): P.Effect.Effect<string, MarkdownItError> =>
    P.Effect.tryPromise({
      try: async () => markdownIt(adaptOptions(options)).render(markdown),
      catch: toMarkdownItError,
    });
