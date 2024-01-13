import { collapseFuncSmith, FuncSmith } from './index';
import { identityMapping } from './mappings/IdentityMapping';

(async () => {
  console.log('KONK');
  const funcSmith = FuncSmith(
    {
      type: 'fs',
      path: '/tmp/srcfiles',
    },
    { type: 'fs', path: '/tmp/dstfiles' },
    identityMapping
  );

  await collapseFuncSmith(funcSmith({}));
})()
  .then(console.log)
  .catch(console.error);
