import { build } from 'vite';

async function runBuild() {
  console.log('[Build] Starting Vite production build...');
  await build();
  console.log('[Build] Vite production build successfully completed.');
}

runBuild().catch((err) => {
  console.error('[Build Error]', err);
  process.exit(1);
});
