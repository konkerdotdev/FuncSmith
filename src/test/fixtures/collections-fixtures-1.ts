/* eslint-disable fp/no-mutation,@typescript-eslint/ban-ts-comment */
import type { FileSet, FileSetItem } from '../../lib/fileSet';
import { FileSetItemType } from '../../lib/fileSet';
import type { IdRef } from '../../lib/fileSet/idRefs';
import { ID_REF } from '../../lib/fileSet/idRefs';
import type { CollectionItem } from '../../plugins/Collections/types';
import type { FrontMatter } from '../../plugins/FrontMatter/types';

export const TEST_COLLECTIONS_FIXTURES_INDEX_DOCS_1: IdRef = {
  _tag: ID_REF,
  ref: '0000000000001111111111112222222222220030',
};

export const TEST_COLLECTIONS_FIXTURES_COLLECTION_DOCS_1: ReadonlyArray<IdRef> = [
  { _tag: ID_REF, ref: '0000000000001111111111112222222222220031' },
  { _tag: ID_REF, ref: '0000000000001111111111112222222222220032' },
  { _tag: ID_REF, ref: '0000000000001111111111112222222222220033' },
];

export const TEST_COLLECTIONS_FIXTURES_COLLECTION_POSTS_1: ReadonlyArray<IdRef> = [
  { _tag: ID_REF, ref: '0000000000001111111111112222222222220021' },
  { _tag: ID_REF, ref: '0000000000001111111111112222222222220022' },
  { _tag: ID_REF, ref: '0000000000001111111111112222222222220023' },
  { _tag: ID_REF, ref: '0000000000001111111111112222222222220024' },
];

export const TEST_COLLECTIONS_FIXTURES_FILE_SET_RESOLVED_POSTS_1: FileSet<
  CollectionItem<FrontMatter<FileSetItem & Record<string, unknown>>>
> = [
  {
    _id: '0000000000001111111111112222222222220021',
    _tag: FileSetItemType.File,
    baseDir: '/tmp/foo',
    collection: {
      name: 'posts',
      len: 4,
      next: {
        _tag: ID_REF,
        ref: '0000000000001111111111112222222222220022',
      },
    },
    contents: 'p1 content',
    date: '2024-01-01',
    fileBase: 'p1',
    fileExt: '.md',
    fileName: 'p1.md',
    frontMatter: {
      date: '2024-01-01',
      layout: 'foo.hbs',
      title: 'P1',
      draft: false,
      nav: true,
      navOrder: 1,
      tags: ['tag1', 'tag2'],
    },
    layout: 'foo.hbs',
    path: '/tmp/foo/posts/p1.md',
    relDir: 'posts',
    relPath: 'posts/p1.md',
    link: '/posts/p1.md',
    title: 'P1',
    draft: false,
  },
  {
    _id: '0000000000001111111111112222222222220022',
    _tag: FileSetItemType.File,
    baseDir: '/tmp/foo',
    collection: {
      name: 'posts',
      len: 4,
      next: {
        _tag: ID_REF,
        ref: '0000000000001111111111112222222222220023',
      },
      previous: {
        _tag: ID_REF,
        ref: '0000000000001111111111112222222222220021',
      },
    },
    contents: 'p2 content',
    date: '2024-02-02',
    fileBase: 'p2',
    fileExt: '.md',
    fileName: 'p2.md',
    frontMatter: {
      date: '2024-02-02',
      layout: 'bar.hbs',
      title: 'P2',
      draft: true,
    },
    layout: 'bar.hbs',
    path: '/tmp/foo/posts/p2.md',
    relDir: 'posts',
    relPath: 'posts/p2.md',
    link: '/posts/p2.md',
    title: 'P2',
    draft: true,
  },
  {
    _id: '0000000000001111111111112222222222220023',
    _tag: FileSetItemType.File,
    baseDir: '/tmp/foo',
    collection: {
      name: 'posts',
      len: 4,
      next: {
        _tag: ID_REF,
        ref: '0000000000001111111111112222222222220024',
      },
      previous: {
        _tag: ID_REF,
        ref: '0000000000001111111111112222222222220022',
      },
    },
    contents: 'p3 content',
    date: '2024-03-03',
    fileBase: 'p3',
    fileExt: '.md',
    fileName: 'p3.md',
    frontMatter: {
      date: '2024-03-03',
      title: 'P3',
    },
    path: '/tmp/foo/posts/p3.md',
    relDir: 'posts',
    relPath: 'posts/p3.md',
    link: '/posts/p3.md',
    title: 'P3',
  },
  {
    _id: '0000000000001111111111112222222222220024',
    _tag: FileSetItemType.File,
    baseDir: '/tmp/foo',
    collection: {
      name: 'posts',
      len: 4,
      previous: {
        _tag: ID_REF,
        ref: '0000000000001111111111112222222222220023s',
      },
    },
    contents: 'p4 content',
    date: '2024-04-04',
    fileBase: 'p4',
    fileExt: '.md',
    fileName: 'p4.md',
    frontMatter: {
      date: '2024-04-04',
      title: 'P4',
    },
    path: '/tmp/foo/posts/p4.md',
    relDir: 'posts',
    relPath: 'posts/p4.md',
    link: '/posts/p4.md',
    title: 'P4',
  },
];
// @ts-expect-error
TEST_COLLECTIONS_FIXTURES_FILE_SET_RESOLVED_POSTS_1[0]!.collection.next =
  TEST_COLLECTIONS_FIXTURES_FILE_SET_RESOLVED_POSTS_1[1];
// @ts-expect-error
TEST_COLLECTIONS_FIXTURES_FILE_SET_RESOLVED_POSTS_1[1]!.collection.next =
  TEST_COLLECTIONS_FIXTURES_FILE_SET_RESOLVED_POSTS_1[2];
// @ts-expect-error
TEST_COLLECTIONS_FIXTURES_FILE_SET_RESOLVED_POSTS_1[1]!.collection.previous =
  TEST_COLLECTIONS_FIXTURES_FILE_SET_RESOLVED_POSTS_1[0];
// @ts-expect-error
TEST_COLLECTIONS_FIXTURES_FILE_SET_RESOLVED_POSTS_1[2]!.collection.next =
  TEST_COLLECTIONS_FIXTURES_FILE_SET_RESOLVED_POSTS_1[3];
// @ts-expect-error
TEST_COLLECTIONS_FIXTURES_FILE_SET_RESOLVED_POSTS_1[2]!.collection.previous =
  TEST_COLLECTIONS_FIXTURES_FILE_SET_RESOLVED_POSTS_1[1];
// @ts-expect-error
TEST_COLLECTIONS_FIXTURES_FILE_SET_RESOLVED_POSTS_1[3]!.collection.previous =
  TEST_COLLECTIONS_FIXTURES_FILE_SET_RESOLVED_POSTS_1[2];
