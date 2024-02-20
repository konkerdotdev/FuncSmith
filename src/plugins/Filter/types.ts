export type FilterOptions = {
  // An array of glob patterns, of files to drop if matched
  readonly drop: Array<string>;

  // An array of glob patterns, of files to keep if matched
  readonly keep: Array<string>;
};
