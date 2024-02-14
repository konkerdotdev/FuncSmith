import * as P from '@konker.dev/effect-ts-prelude';

import type { FileSet, FileSetItem, Html } from '../../lib/fileSet';
import { type FileSetMapping, FuncSmithContextEnv, FuncSmithContextMetadata } from '../../types';
import type { FrontMatter } from '../FrontMatter/types';
import { wrapMapping } from '../lib';
import { processFileSetItem } from './lib';
import type { MarkdownOptions } from './types';

// --------------------------------------------------------------------------
export const DEFAULT_MARKDOWN_OPTIONS: MarkdownOptions = {
  globPattern: '**/*.md',
};

// --------------------------------------------------------------------------
/**
 * Basic Markdown mapping
 * Any kind of error in parsing, file access, etc. is fatal
 */
export const markdownMappingCtor =
  <IF extends FileSetItem>(
    options: Partial<MarkdownOptions> = DEFAULT_MARKDOWN_OPTIONS
  ): FileSetMapping<IF | FrontMatter<IF>, IF | Html<IF>, FuncSmithContextEnv | FuncSmithContextMetadata> =>
  (fileSet: FileSet<IF | FrontMatter<IF>>) =>
    P.pipe(
      P.Effect.all([FuncSmithContextEnv, FuncSmithContextMetadata]),
      P.Effect.flatMap(([_funcSmithContextEnv, _funcSmithContextMetadata]) =>
        P.pipe(fileSet, P.Array.map(processFileSetItem({ ...DEFAULT_MARKDOWN_OPTIONS, ...options })), P.Effect.all)
      )
    );

export const markdown = wrapMapping(markdownMappingCtor);
