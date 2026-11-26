// Chen Family Ledger — hand-in program (Node 22, standard library only).
//
// The site is app/: plain static files a browser opens at app/index.html
// (ES modules, one stylesheet, no build step, nothing fetched from the
// network). This program copies app/ and screenshots/ from beside this file
// into /output (or MAKEFUN_OUTPUT_DIR outside the grader) and writes
// /output/dossier.json with the vendored make.fun library, exactly as the
// scorer rebuilds it. vendor/makefun-frontend.ts stays untouched: the gate
// requires the dossier to be byte for byte what its own copy writes.
//
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const appDir = join(here, 'app');
const shotsDir = join(here, 'screenshots');

// Refuse to hand in a half-built entry: the site and its screenshots must
// both be present, and the entry point must exist.
if (!statSync(appDir).isDirectory()) throw new Error(`missing app/ directory: ${appDir}`);
if (!existsSync(join(appDir, 'index.html'))) throw new Error('missing app/index.html');
if (!statSync(shotsDir).isDirectory()) throw new Error(`missing screenshots/ directory: ${shotsDir}`);
const shots = readdirSync(shotsDir).filter((name) => !name.startsWith('.')).sort();
if (shots.length < 3 || shots.length > 4) {
  throw new Error(`expected 3 or 4 screenshots, found ${shots.length}`);
}
// Fail early, with the offending file named, if a screenshot breaks the
// gate's 256 KiB cap instead of handing in an entry the scorer refuses.
for (const name of shots) {
  const size = statSync(join(shotsDir, name)).size;
  if (size > 262144) throw new Error(`screenshot ${name} is ${size} bytes, over the 256 KiB cap`);
  if (!/\.(png|jpe?g)$/i.test(name)) throw new Error(`screenshot ${name} is not a PNG or JPEG`);
}

mkdirSync(out, { recursive: true });
cpSync(appDir, join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
cpSync(shotsDir, join(out, 'screenshots'), { recursive: true });

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes the
// bytes; the others refuse an entry the scorer would refuse (more than 4
// screenshots or one over 256 KiB; more than 993 files and directories in
// app/ or 16 MiB of app files: app/ counts beside /output's own 1000-entry
// cap, its screenshots/ and dossier.json).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 16777216 }),
);

// Verify the hand-in before reporting success: the dossier must exist and
// the output must hold exactly app/, screenshots/ and dossier.json.
const dossierBytes = statSync(join(out, 'dossier.json')).size;
const outEntries = readdirSync(out).sort();
if (dossierBytes === 0) throw new Error('dossier.json was written empty');
if (outEntries.join(',') !== 'app,dossier.json,screenshots') {
  throw new Error(`unexpected /output entries: ${outEntries.join(', ')}`);
}

console.log(`handed in ${shots.length} screenshots (${shots.join(', ')}) to ${out}`);
console.log(`dossier.json: ${dossierBytes} bytes; app/ files: ${readdirSync(join(out, 'app')).sort().join(', ')}`);
