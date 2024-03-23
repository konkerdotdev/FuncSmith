import { stringToUint8Array } from '@konker.dev/tiny-filesystem-fp/dist/lib/array';

import { FileSetItemType } from '../../lib/fileSet';

export const TEST_FILE_SET_COLLECTIONS_1 = [
  {
    _id: '0000000000001111111111112222222222220001',
    _tag: FileSetItemType.File,
    baseDir: '/tmp/foo',
    contents: stringToUint8Array('A'),
    fileBase: 'a',
    fileExt: '.txt',
    fileName: 'a.txt',
    path: '/tmp/foo/a.txt',
    relDir: '.',
    relPath: 'a.txt',
    link: '/a.txt',
  },
  {
    _id: '0000000000001111111111112222222222220021',
    _tag: FileSetItemType.File,
    baseDir: '/tmp/foo',
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
  {
    _id: '0000000000001111111111112222222222220030',
    _tag: FileSetItemType.File,
    path: '/tmp/foo/docs/index.doc',
    baseDir: '/tmp/foo',
    relPath: 'docs/index.doc',
    link: '/docs/index.doc',
    relDir: 'docs',
    fileName: 'index.doc',
    fileBase: 'index',
    fileExt: '.doc',
    title: 'DOCS-INDEX',
    date: '2024-11-01',
    layout: 'foo.hbs',
    frontMatter: {
      title: 'DOCS-INDEX',
      date: '2024-11-01',
      layout: 'foo.hbs',
      collectionIndex: true,
    },
    contents: 'docs-index content',
  },
  {
    _id: '0000000000001111111111112222222222220031',
    _tag: FileSetItemType.File,
    baseDir: '/tmp/foo',
    contents: 'd1 content',
    date: '2024-11-01',
    fileBase: 'd1',
    fileExt: '.doc',
    fileName: 'd1.doc',
    frontMatter: {
      date: '2024-11-01',
      layout: 'foo.hbs',
      title: 'D1',
    },
    layout: 'foo.hbs',
    path: '/tmp/foo/docs/d1.doc',
    relDir: 'docs',
    relPath: 'docs/d1.doc',
    link: '/docs/d1.doc',
    title: 'D1',
  },
  {
    _id: '0000000000001111111111112222222222220032',
    _tag: FileSetItemType.File,
    baseDir: '/tmp/foo',
    contents: 'd2 content',
    date: '2024-11-02',
    fileBase: 'd2',
    fileExt: '.doc',
    fileName: 'd2.doc',
    frontMatter: {
      date: '2024-11-02',
      layout: 'bar.hbs',
      title: 'D2',
    },
    layout: 'bar.hbs',
    path: '/tmp/foo/docs/d2.doc',
    relDir: 'docs',
    relPath: 'docs/d2.doc',
    link: '/docs/d2.doc',
    title: 'D2',
  },
  {
    _id: '0000000000001111111111112222222222220033',
    _tag: FileSetItemType.File,
    baseDir: '/tmp/foo',
    contents: 'd3 content',
    date: '2024-11-03',
    fileBase: 'd3',
    fileExt: '.doc',
    fileName: 'd3.doc',
    frontMatter: {
      date: '2024-11-03',
      title: 'D3',
    },
    path: '/tmp/foo/docs/d3.doc',
    relDir: 'docs',
    relPath: 'docs/d3.doc',
    link: '/docs/d3.doc',
    title: 'D3',
  },
  {
    _id: '0000000000001111111111112222222222220034',
    _tag: FileSetItemType.File,
    path: '/tmp/foo/docs/d4.doc',
    baseDir: '/tmp/foo',
    relPath: 'docs/d4.doc',
    link: '/docs/d4.doc',
    relDir: 'docs',
    fileName: 'd4.doc',
    fileBase: 'd4',
    fileExt: '.doc',
    title: 'D4',
    date: '2024-11-04',
    frontMatter: {
      title: 'D4',
      date: '2024-11-04',
      collectionExclude: true,
    },
    contents: 'd4 content',
  },
];

export const TEST_FILE_SET_COLLECTIONS_POSTS_1 = [
  {
    _id: '0000000000001111111111112222222222220001',
    _tag: FileSetItemType.File,
    baseDir: '/tmp/foo',
    contents: stringToUint8Array('A'),
    fileBase: 'a',
    fileExt: '.txt',
    fileName: 'a.txt',
    path: '/tmp/foo/a.txt',
    relDir: '.',
    relPath: 'a.txt',
    link: '/a.txt',
  },
  {
    _id: '0000000000001111111111112222222222220021',
    _tag: FileSetItemType.File,
    baseDir: '/tmp/foo',
    collection: {
      name: 'posts',
      len: 4,
      next: expect.objectContaining({
        relPath: 'posts/p2.md',
      }),
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
      previous: expect.objectContaining({
        relPath: 'posts/p1.md',
      }),
      next: expect.objectContaining({
        relPath: 'posts/p3.md',
      }),
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
      previous: expect.objectContaining({
        relPath: 'posts/p2.md',
      }),
      next: expect.objectContaining({
        relPath: 'posts/p4.md',
      }),
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
      previous: expect.objectContaining({
        relPath: 'posts/p3.md',
      }),
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
  ...TEST_FILE_SET_COLLECTIONS_1.slice(5),
];

export const TEST_FILE_SET_COLLECTIONS_DOCS_1 = [
  ...TEST_FILE_SET_COLLECTIONS_1.slice(0, 5),
  {
    _id: '0000000000001111111111112222222222220030',
    _tag: FileSetItemType.File,
    path: '/tmp/foo/docs/index.doc',
    baseDir: '/tmp/foo',
    relPath: 'docs/index.doc',
    link: '/docs/index.doc',
    relDir: 'docs',
    fileName: 'index.doc',
    fileBase: 'index',
    fileExt: '.doc',
    title: 'DOCS-INDEX',
    date: '2024-11-01',
    layout: 'foo.hbs',
    frontMatter: {
      title: 'DOCS-INDEX',
      date: '2024-11-01',
      layout: 'foo.hbs',
      collectionIndex: true,
    },
    contents: 'docs-index content',
  },
  {
    _id: '0000000000001111111111112222222222220031',
    _tag: FileSetItemType.File,
    baseDir: '/tmp/foo',
    collection: {
      name: 'docs',
      len: 3,
      index: expect.objectContaining({
        relPath: 'docs/index.doc',
      }),
      next: expect.objectContaining({
        relPath: 'docs/d2.doc',
      }),
    },
    contents: 'd1 content',
    date: '2024-11-01',
    fileBase: 'd1',
    fileExt: '.doc',
    fileName: 'd1.doc',
    frontMatter: {
      date: '2024-11-01',
      layout: 'foo.hbs',
      title: 'D1',
    },
    layout: 'foo.hbs',
    path: '/tmp/foo/docs/d1.doc',
    relDir: 'docs',
    relPath: 'docs/d1.doc',
    link: '/docs/d1.doc',
    title: 'D1',
  },
  {
    _id: '0000000000001111111111112222222222220032',
    _tag: FileSetItemType.File,
    baseDir: '/tmp/foo',
    collection: {
      name: 'docs',
      len: 3,
      index: expect.objectContaining({
        relPath: 'docs/index.doc',
      }),
      previous: expect.objectContaining({
        relPath: 'docs/d1.doc',
      }),
      next: expect.objectContaining({
        relPath: 'docs/d3.doc',
      }),
    },
    contents: 'd2 content',
    date: '2024-11-02',
    fileBase: 'd2',
    fileExt: '.doc',
    fileName: 'd2.doc',
    frontMatter: {
      date: '2024-11-02',
      layout: 'bar.hbs',
      title: 'D2',
    },
    layout: 'bar.hbs',
    path: '/tmp/foo/docs/d2.doc',
    relDir: 'docs',
    relPath: 'docs/d2.doc',
    link: '/docs/d2.doc',
    title: 'D2',
  },
  {
    _id: '0000000000001111111111112222222222220033',
    _tag: FileSetItemType.File,
    baseDir: '/tmp/foo',
    collection: {
      name: 'docs',
      len: 3,
      index: expect.objectContaining({
        relPath: 'docs/index.doc',
      }),
      previous: expect.objectContaining({
        relPath: 'docs/d2.doc',
      }),
    },
    contents: 'd3 content',
    date: '2024-11-03',
    fileBase: 'd3',
    fileExt: '.doc',
    fileName: 'd3.doc',
    frontMatter: {
      date: '2024-11-03',
      title: 'D3',
    },
    path: '/tmp/foo/docs/d3.doc',
    relDir: 'docs',
    relPath: 'docs/d3.doc',
    link: '/docs/d3.doc',
    title: 'D3',
  },
  {
    _id: '0000000000001111111111112222222222220034',
    _tag: FileSetItemType.File,
    path: '/tmp/foo/docs/d4.doc',
    baseDir: '/tmp/foo',
    relPath: 'docs/d4.doc',
    link: '/docs/d4.doc',
    relDir: 'docs',
    fileName: 'd4.doc',
    fileBase: 'd4',
    fileExt: '.doc',
    title: 'D4',
    date: '2024-11-04',
    frontMatter: {
      title: 'D4',
      date: '2024-11-04',
      collectionExclude: true,
    },
    contents: 'd4 content',
  },
];

export const TEST_FILE_SET_COLLECTIONS_POSTS_DOCS_1 = [
  ...TEST_FILE_SET_COLLECTIONS_POSTS_1.slice(0, 5),
  ...TEST_FILE_SET_COLLECTIONS_DOCS_1.slice(5),
];
