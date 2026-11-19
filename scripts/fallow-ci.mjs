import { execFileSync, spawnSync } from 'node:child_process';

const candidates = [
  process.env.FALLOW_AUDIT_BASE,
  'origin/master',
  'origin/HEAD',
  'HEAD^',
].filter(Boolean);

let base;
for (const candidate of candidates) {
  try {
    base = execFileSync('git', ['rev-parse', '--verify', candidate], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    break;
  } catch {
    // The TensorBuzz lane may omit the remote default branch from its clone.
  }
}

if (!base) {
  console.error('fallow:ci could not resolve a git base ref');
  process.exit(1);
}

const result = spawnSync(
  'fallow',
  ['audit', '--base', base, '--gate', 'new-only', '--quiet'],
  { stdio: 'inherit' },
);

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}
process.exit(result.status ?? 1);
