import * as P from '@konker.dev/effect-ts-prelude';
import { stringToUint8Array } from '@konker.dev/tiny-filesystem-fp/dist/lib/array';
import { MemFsTinyFileSystem } from '@konker.dev/tiny-filesystem-fp/dist/memfs';
import type { DirectoryData, FileData } from '@konker.dev/tiny-treecrawler-fp';

import { TEST_FILE_SET_1 } from '../../test/fixtures/fileset-1';
import { TEST_TREE_CRAWLER_DATA_1 } from '../../test/fixtures/treecrawler-data-1';
import * as unit from './fileSetItem';
import type { FileSetItemFile } from './index';

const TEST_TFS = MemFsTinyFileSystem();

describe('fileSetItem', () => {
  describe('isFileSetItemFile', () => {
    it('should return true if the data is a file', () => {
      const item = TEST_FILE_SET_1[0]!;
      expect(unit.isFileSetItemFile(item)).toBe(true);
    });
  });

  describe('fileSetSetFileName', () => {
    it('should function as expected', () => {
      const item = TEST_FILE_SET_1[0]!;
      const actual = P.Effect.runSync(unit.fileSetSetFileName(TEST_TFS, 'new-name.pdf', item));
      expect(actual).toStrictEqual({
        _tag: 'File',
        _id: 'e57ec8617d467edfff00943eac189e0ec6eb1875',
        path: '/tmp/foo/new-name.pdf',
        baseDir: '/tmp/foo',
        relPath: 'new-name.pdf',
        link: '/new-name.pdf',
        relDir: '.',
        fileName: 'new-name.pdf',
        fileBase: 'new-name',
        fileExt: '.pdf',
        contents: stringToUint8Array('A'),
      });
    });
  });

  describe('fileSetSetRelDir', () => {
    it('should function as expected', () => {
      const item = TEST_FILE_SET_1[0]!;
      const actual = P.Effect.runSync(unit.fileSetSetRelDir(TEST_TFS, 'new-dir-name', item));
      expect(actual).toStrictEqual({
        _tag: 'File',
        _id: 'e57ec8617d467edfff00943eac189e0ec6eb1875',
        path: '/tmp/foo/new-dir-name/a.txt',
        baseDir: '/tmp/foo',
        relPath: 'new-dir-name/a.txt',
        link: '/new-dir-name/a.txt',
        relDir: 'new-dir-name',
        fileName: 'a.txt',
        fileBase: 'a',
        fileExt: '.txt',
        contents: stringToUint8Array('A'),
      });
    });
  });

  describe('fileSetItemRename', () => {
    it('should work as expected', () => {
      const item = TEST_FILE_SET_1[0]!;
      const actual = P.Effect.runSync(unit.fileSetItemRename(TEST_TFS, [/\.txt$/, '.pdf'], item));
      expect(actual).toStrictEqual({
        _tag: 'File',
        _id: 'e57ec8617d467edfff00943eac189e0ec6eb1875',
        path: '/tmp/foo/a.pdf',
        baseDir: '/tmp/foo',
        relPath: 'a.pdf',
        link: '/a.pdf',
        relDir: '.',
        fileName: 'a.pdf',
        fileBase: 'a',
        fileExt: '.pdf',
        contents: stringToUint8Array('A'),
      });
    });

    it('should function as expected', () => {
      const item = TEST_FILE_SET_1[0]!;
      const actual = P.Effect.runSync(unit.fileSetItemRename(TEST_TFS, [/a.txt/, 'new-name.pdf'], item));
      expect(actual).toStrictEqual({
        _tag: 'File',
        _id: 'e57ec8617d467edfff00943eac189e0ec6eb1875',
        path: '/tmp/foo/new-name.pdf',
        baseDir: '/tmp/foo',
        relPath: 'new-name.pdf',
        link: '/new-name.pdf',
        relDir: '.',
        fileName: 'new-name.pdf',
        fileBase: 'new-name',
        fileExt: '.pdf',
        contents: stringToUint8Array('A'),
      });
    });
  });

  describe('fileSetItemMatchesPattern', () => {
    it('should work as expected', () => {
      const item = TEST_FILE_SET_1[0]!;
      const actual = unit.fileSetItemMatchesPattern('**/*.txt', item);
      expect(actual).toBe(true);
    });

    it('should work as expected', () => {
      const item = TEST_FILE_SET_1[0]!;
      const actual = unit.fileSetItemMatchesPattern('**/*.pdf', item);
      expect(actual).toBe(false);
    });

    it('should work as expected', () => {
      const item = TEST_FILE_SET_1[0]!;
      const actual = unit.fileSetItemMatchesPattern(undefined, item);
      expect(actual).toBe(true);
    });
  });

  describe('toFileSetItemFile', () => {
    it('should work as expected', async () => {
      const item = TEST_TREE_CRAWLER_DATA_1[1]! as FileData;
      const actual = await P.Effect.runPromise(unit.toFileSetItemFile(TEST_TFS, '/tmp/foo')(item));
      expect(actual).toStrictEqual({
        _tag: 'File',
        _id: 'e57ec8617d467edfff00943eac189e0ec6eb1875',
        path: '/tmp/foo/a.txt',
        baseDir: '/tmp/foo',
        relPath: 'a.txt',
        link: '/a.txt',
        relDir: '.',
        fileName: 'a.txt',
        fileBase: 'a',
        fileExt: '.txt',
        contents: new Uint8Array(item.data),
      });
    });
  });

  describe('toFileSystemItemList', () => {
    it('should work as expected', async () => {
      const list = TEST_TREE_CRAWLER_DATA_1 as Array<DirectoryData | FileData>;
      const actual = await P.Effect.runPromise(unit.toFileSystemItemList(TEST_TFS, '/tmp/foo')(list));
      expect(actual).toHaveLength(6);
      expect(actual.every(unit.isFileSetItemFile)).toBe(true);
      expect(actual[0]).toStrictEqual({
        _tag: 'File',
        _id: 'e57ec8617d467edfff00943eac189e0ec6eb1875',
        path: '/tmp/foo/a.txt',
        baseDir: '/tmp/foo',
        relPath: 'a.txt',
        link: '/a.txt',
        relDir: '.',
        fileName: 'a.txt',
        fileBase: 'a',
        fileExt: '.txt',
        contents: stringToUint8Array('A'),
      });
    });
  });

  describe('fileSetItemContentsToString', () => {
    it('should work as expected', () => {
      const item = TEST_FILE_SET_1[0]! as FileSetItemFile;
      const actual = unit.fileSetItemContentsToString(item.contents);
      expect(actual).toEqual('A');
    });
  });

  describe('createFileSetItemFile', () => {
    it('should work as expected with string content', async () => {
      const contents = 'CONTENT';
      const actual = await P.Effect.runPromise(
        unit.createFileSetItemFile(TEST_TFS, '/tmp/foo', '/tmp/foo/bar/baz.md', contents)
      );
      expect(actual).toStrictEqual({
        _tag: 'File',
        _id: '1e23bbd16d9d040cc66c46b68dea8aa6026a748c',
        path: '/tmp/foo/bar/baz.md',
        baseDir: '/tmp/foo',
        relDir: 'bar',
        relPath: 'bar/baz.md',
        link: '/bar/baz.md',
        fileBase: 'baz',
        fileExt: '.md',
        fileName: 'baz.md',
        contents: stringToUint8Array(contents),
      });
    });

    it('should work as expected with ArrayBuffer content', async () => {
      const contents = stringToUint8Array('CONTENT');

      const actual = await P.Effect.runPromise(
        unit.createFileSetItemFile(TEST_TFS, '/tmp/foo', '/tmp/foo/bar/baz.md', contents)
      );
      expect(actual).toStrictEqual({
        _tag: 'File',
        _id: '1e23bbd16d9d040cc66c46b68dea8aa6026a748c',
        path: '/tmp/foo/bar/baz.md',
        baseDir: '/tmp/foo',
        relDir: 'bar',
        relPath: 'bar/baz.md',
        link: '/bar/baz.md',
        fileBase: 'baz',
        fileExt: '.md',
        fileName: 'baz.md',
        contents,
      });
    });
  });
});
