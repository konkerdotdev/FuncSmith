import type * as H from 'handlebars';

export type LayoutsOptions = {
  readonly templateEngine: string;
  readonly directory: string;
  readonly defaultLayout: string;
  readonly globPattern: string;
  readonly helpers: Record<string, H.HelperDelegate>;
};
