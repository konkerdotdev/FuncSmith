import * as P from '@konker.dev/effect-ts-prelude';
import H from 'handlebars';

import type { FuncSmithError } from '../error';
import { toFuncSmithError } from '../error';

export function handlebarsCompile(
  templateStr: string,
  helpers: Record<string, H.HelperDelegate> = {}
): P.Effect.Effect<never, FuncSmithError, H.TemplateDelegate> {
  return P.Effect.try({
    try: () => {
      // eslint-disable-next-line fp/no-unused-expression
      Object.keys(helpers).forEach((name) => H.registerHelper(name, helpers[name]!));
      return H.compile(templateStr);
    },
    catch: toFuncSmithError,
  });
}

export function handlebarsRender(
  template: H.TemplateDelegate,
  context: unknown
): P.Effect.Effect<never, FuncSmithError, string> {
  return P.Effect.try({
    try: () => template(context),
    catch: toFuncSmithError,
  });
}

export const handlebarsRenderK =
  (context: unknown) =>
  (template: H.TemplateDelegate): P.Effect.Effect<never, FuncSmithError, string> =>
    P.Effect.try({
      try: () => template(context),
      catch: toFuncSmithError,
    });

export const handlebars =
  (templateStr: string, helpers: Record<string, H.HelperDelegate> = {}) =>
  (context: unknown): P.Effect.Effect<never, FuncSmithError, string> =>
    P.pipe(handlebarsCompile(templateStr, helpers), P.Effect.flatMap(handlebarsRenderK(context)));
