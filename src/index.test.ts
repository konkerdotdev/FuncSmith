import * as P from '@konker.dev/effect-ts-prelude';

import * as unit from './index';
import * as plugins from './plugins';

describe('index', () => {
  describe('FuncSmith', () => {
    it('should return the same value', async () => {
      const pluginStackObject = { pluginStack: P.pipe(P.Effect.succeed, plugins.identity()) };
      const pluginStackSpy = jest.spyOn(pluginStackObject, 'pluginStack');
      const actual = await P.Effect.runPromise(unit.FuncSmith(pluginStackObject.pluginStack));

      expect(actual).toStrictEqual([]);
      expect(pluginStackSpy).toHaveBeenCalledTimes(1);
    });
  });
});
