import { stringToUint8Array } from '@konker.dev/tiny-filesystem-fp/dist/lib/array';
import H from 'handlebars';

import { FileSetItemType } from '../../lib/fileSet';

export const TEST_HBS_TEMPLATE_S_1 = 'Handlebars <b>{{title}}</b>';
export const TEST_HBS_TEMPLATE_1 = H.compile(TEST_HBS_TEMPLATE_S_1);

export const TEST_HBS_TEMPLATE_S_2 = 'Handlebars <b>{{ testHelper title}}</b>';
export const TEST_HBS_TEMPLATE_2 = H.compile(TEST_HBS_TEMPLATE_S_2);

export const TEST_HBS_TEMPLATE_S_3 = 'Handlebars <b>{{ title}}</b> {{> footer.hbs }}';
export const TEST_HBS_TEMPLATE_3 = H.compile(TEST_HBS_TEMPLATE_S_3);

export const TEST_PARTIAL_S_1 = '<footer>{{ testHelper footStuff }}</footer>';
export const TEST_PARTIAL_1 = H.compile(TEST_PARTIAL_S_1);
export const TEST_PARTIAL_SPEC_1 = { 'footer.hbs': TEST_PARTIAL_1 };

export const TEST_HELPER = function (s: string) {
  return String(s).toUpperCase();
};

export const TEST_HBS_LAYOUTS_FILE_DATA = [
  {
    _tag: FileSetItemType.File,
    _id: '0000000000001111111111112222222222220001',
    path: '/tmp/foo/layouts/foo.hbs',
    baseDir: '/tmp/foo',
    relPath: 'layouts/foo.hbs',
    relDir: 'layouts',
    fileName: 'foo.hbs',
    fileBase: 'foo',
    fileExt: '.hbs',
    contents: stringToUint8Array(TEST_HBS_TEMPLATE_S_1),
  },
  {
    _tag: FileSetItemType.File,
    _id: '0000000000001111111111112222222222220002',
    path: '/tmp/foo/layouts/layout.hbs',
    baseDir: '/tmp/foo',
    relPath: 'layouts/layout.hbs',
    relDir: 'layouts',
    fileName: 'layout.hbs',
    fileBase: 'layout',
    fileExt: '.hbs',
    contents: stringToUint8Array(TEST_HBS_TEMPLATE_S_3),
  },
];

export const TEST_HBS_PARTIALS_FILE_DATA = [
  {
    _tag: FileSetItemType.File,
    _id: '0000000000001111111111112222222222220001',
    path: '/tmp/foo/layouts/footer.hbs',
    baseDir: '/tmp/footer',
    relPath: 'layouts/footer.hbs',
    relDir: 'layouts',
    fileName: 'footer.hbs',
    fileBase: 'footer',
    fileExt: '.hbs',
    contents: stringToUint8Array(TEST_PARTIAL_S_1),
  },
];
