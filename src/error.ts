import { toTinyError } from '@konker.dev/tiny-error-fp';

export const ERROR_TAG = 'FuncsmithError';
export type ERROR_TAG = typeof ERROR_TAG;

export const toFuncSmithError = toTinyError<ERROR_TAG>(ERROR_TAG);
export type FuncSmithError = ReturnType<typeof toFuncSmithError>;
