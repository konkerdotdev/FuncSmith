import { stringToUint8Array } from '@konker.dev/tiny-filesystem-fp/dist/lib/array';
import { type DirectoryData, type FileData, TreeCrawlerDataType } from '@konker.dev/tiny-treecrawler-fp';

export const TEST_TREE_CRAWLER_DATA_1: Array<DirectoryData | FileData> = [
  { _tag: TreeCrawlerDataType.Directory, level: 0, path: '/tmp/foo' },
  { _tag: TreeCrawlerDataType.File, level: 1, path: '/tmp/foo/a.txt', data: stringToUint8Array('A') },
  { _tag: TreeCrawlerDataType.File, level: 1, path: '/tmp/foo/b.txt', data: stringToUint8Array('B') },
  {
    _tag: TreeCrawlerDataType.File,
    level: 1,
    path: '/tmp/foo/c.csv',
    data: stringToUint8Array('bam,baz\ntrue,false\n'),
  },
  {
    _tag: TreeCrawlerDataType.File,
    level: 1,
    path: '/tmp/foo/d.json',
    data: stringToUint8Array('{"bam": true, "baz":  false }'),
  },
  { _tag: TreeCrawlerDataType.Directory, level: 1, path: '/tmp/foo/bar' },
  { _tag: TreeCrawlerDataType.File, level: 2, path: '/tmp/foo/bar/e.txt', data: stringToUint8Array('E') },
  { _tag: TreeCrawlerDataType.File, level: 2, path: '/tmp/foo/bar/f.log', data: stringToUint8Array('F') },
] as const;
