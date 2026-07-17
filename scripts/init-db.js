const { spawnSync } = require('node:child_process');

function run(script) {
  const result = spawnSync(process.execPath, [script], { stdio: 'inherit' });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

run('scripts/migrate.js');
run('scripts/seed.js');
