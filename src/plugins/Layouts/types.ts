import type * as H from 'handlebars';

export type LayoutsOptions = {
  readonly templateEngine: string;
  readonly layoutsPath: string;
  readonly partialsPath?: string | undefined;
  readonly defaultLayout: string;
  readonly globPattern: string;
  readonly helpers: Record<string, H.HelperDelegate>;
};
