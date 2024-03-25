import * as P from '@konker.dev/effect-ts-prelude';

import type { FileSet, FileSetItem, Html } from '../../lib/fileSet';
import type { DefaultContext, FileSetMapping } from '../../types';
import { FsDepContext, FsDepEnv } from '../../types';
import type { FrontMatter } from '../FrontMatter/types';
import { wrapMapping } from '../lib';
import { processFileSetItem } from './lib';
import type { MarkdownOptions } from './types';

// --------------------------------------------------------------------------
export const DEFAULT_MARKDOWN_OPTIONS: MarkdownOptions = {
  globPattern: '**/*.md',
} as const;

// --------------------------------------------------------------------------
/**
 * Basic Markdown mapping
 * Any kind of error in parsing, file access, etc. is fatal
 */
// TODO: do we need env and context deps here?
export const markdownMappingCtor =
  <IF extends FileSetItem, C extends DefaultContext>(
    options: Partial<MarkdownOptions> = DEFAULT_MARKDOWN_OPTIONS
  ): FileSetMapping<IF | FrontMatter<IF>, IF | Html<IF>, FsDepEnv | FsDepContext<C>> =>
  (fileSet: FileSet<IF | FrontMatter<IF>>) =>
    P.pipe(
      P.Effect.all([FsDepEnv, FsDepContext<C>()]),
      P.Effect.flatMap(([_fsDepEnv, _fsDepContext]) =>
        P.pipe(fileSet, P.Array.map(processFileSetItem({ ...DEFAULT_MARKDOWN_OPTIONS, ...options })), P.Effect.all)
      )
    );

export const markdown = wrapMapping(markdownMappingCtor);
