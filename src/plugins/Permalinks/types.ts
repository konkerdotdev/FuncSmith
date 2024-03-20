export type PermalinksOptions = {
  // An array of glob patterns, of files to permalink if matched
  readonly match: Array<string>;

  // An array of glob patterns, of files to ignore if matched
  readonly ignore: Array<string>;

  // Filename for the directory index
  readonly directoryIndex: string;

  // Whether updated links should have a trailing slash or not
  readonly trailingSlash: boolean;

  // Whether a duplicate file path is considered an error or not
  readonly duplicatesError: boolean;
};
