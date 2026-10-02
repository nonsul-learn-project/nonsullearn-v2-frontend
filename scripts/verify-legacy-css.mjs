import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

const expected = 'e0dce7a53e7c3643c0eaa180a85bde3d2ff01016b209e4302acfc9d100367f1a';
const file = new URL('../src/design-system/legacy/main.css', import.meta.url);
const actual = createHash('sha256')
  .update(await readFile(file))
  .digest('hex');

if (actual !== expected) {
  throw new Error(`Legacy main.css SHA256 mismatch: expected ${expected}, got ${actual}`);
}

console.log(`legacy main.css SHA256 verified: ${actual}`);
