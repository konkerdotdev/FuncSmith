import type { FileSet, FileSetItem } from '../../lib/fileSet';
import { FileSetItemType } from '../../lib/fileSet';
import type { CollectionItem } from '../../plugins/Collections/types';
import type { FrontMatter } from '../../plugins/FrontMatter/types';

export const TEST_COLLECTIONS_FIXTURES_DOCS_1: FileSet<
  CollectionItem<FrontMatter<FileSetItem & Record<string, unknown>>>
> = [
  {
    _id: '0000000000001111111111112222222222220031',
    _tag: FileSetItemType.File,
    baseDir: '/tmp/foo',
    collection: {
      name: 'docs',
      len: 3,
      index: expect.objectContaining({
        link: '/docs/index.doc',
        title: 'DOCS-INDEX',
      }),
      next: expect.objectContaining({
        link: '/docs/d2.doc',
        title: 'D2',
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
        link: '/docs/index.doc',
        title: 'DOCS-INDEX',
      }),
      previous: expect.objectContaining({
        link: '/docs/d1.doc',
        title: 'D1',
      }),
      next: expect.objectContaining({
        link: '/docs/d3.doc',
        title: 'D3',
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
        link: '/docs/index.doc',
        title: 'DOCS-INDEX',
      }),
      previous: expect.objectContaining({
        link: '/docs/d2.doc',
        title: 'D2',
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
];

export const TEST_COLLECTIONS_FIXTURES_POSTS_1: FileSet<
  CollectionItem<FrontMatter<FileSetItem & Record<string, unknown>>>
> = [
  {
    _id: '0000000000001111111111112222222222220021',
    _tag: FileSetItemType.File,
    baseDir: '/tmp/foo',
    collection: {
      name: 'posts',
      len: 4,
      next: expect.objectContaining({
        link: '/posts/p2.md',
        title: 'P2',
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
      nav: true,
      navOrder: 1,
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
      next: expect.objectContaining({
        link: '/posts/p3.md',
        title: 'P3',
      }),
      previous: expect.objectContaining({
        link: '/posts/p1.md',
        title: 'P1',
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
      next: expect.objectContaining({
        link: '/posts/p4.md',
        title: 'P4',
      }),
      previous: expect.objectContaining({
        link: '/posts/p2.md',
        title: 'P2',
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
        link: '/posts/p3.md',
        title: 'P3',
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
];
