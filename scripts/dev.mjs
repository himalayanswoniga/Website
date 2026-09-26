// Runs the API and the Vite dev server together, so `npm run dev` at the repo root is
// the whole local setup. Vite proxies /api to the API, matching how the deployed site
// reaches its Netlify Function on the same origin.
import { spawn } from 'node:child_process';

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

const TASKS = [
  { name: 'api', args: ['--prefix', 'backend', 'run', 'dev'] },
  { name: 'web', args: ['--prefix', 'frontend', 'run', 'dev'] },
];

const children = [];
let shuttingDown = false;

function stopAll(code) {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const child of children) child.kill();
  process.exit(code);
}

for (const { name, args } of TASKS) {
  const child = spawn(npm, args, { stdio: ['ignore', 'pipe', 'pipe'], shell: process.platform === 'win32' });
  children.push(child);

  const prefix = `[${name}] `;
  for (const stream of [child.stdout, child.stderr]) {
    stream.setEncoding('utf8');
    let buffer = '';
    stream.on('data', (chunk) => {
      buffer += chunk;
      const lines = buffer.split('\n');
      buffer = lines.pop();
      for (const line of lines) process.stdout.write(prefix + line + '\n');
    });
  }

  // One process dying leaves the other half-useless, so take both down together.
  child.on('exit', (code) => {
    if (!shuttingDown) console.log(`${prefix}exited with code ${code}`);
    stopAll(code ?? 0);
  });
}

for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => stopAll(0));
