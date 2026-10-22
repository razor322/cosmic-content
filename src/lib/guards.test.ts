import assert from 'node:assert/strict';
import {readFileSync, readdirSync, statSync} from 'node:fs';
import {join} from 'node:path';
import {test} from 'node:test';

const SELF = 'src/lib/guards.test.ts';
const PALETTE_FILE = 'src/theme/palette.ts';

const normalize = (file: string): string => file.split(/[\\/]/).join('/');

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });

const sources = (): {file: string; text: string}[] =>
  walk('src')
    .filter((file) => file.endsWith('.ts') || file.endsWith('.tsx'))
    .map((file) => ({file: normalize(file), text: readFileSync(file, 'utf8')}));

test('no source file uses an unseeded random or the wall clock', () => {
  const offenders = sources()
    .filter(({file}) => file !== SELF)
    .filter(({text}) => /Math\.random|Date\.now/.test(text))
    .map(({file}) => file);
  assert.deepEqual(offenders, []);
});

test('hex colour literals exist only in src/theme/palette.ts', () => {
  const offenders = sources()
    .filter(({file}) => file !== SELF)
    .filter(({file}) => file !== PALETTE_FILE)
    .filter(({file}) => !file.endsWith('.test.ts'))
    .filter(({text}) => /#[0-9a-fA-F]{3,8}\b/.test(text))
    .map(({file}) => file);
  assert.deepEqual(offenders, []);
});

test('no source file uses a css colour keyword outside the palette', () => {
  const banned =
    /(background|backgroundColor|color|fill|stroke|borderColor|outlineColor|boxShadow|textShadow)\s*:\s*['"]?(black|white|red|blue|green|yellow|cyan|magenta|orange|purple)\b/i;
  const offenders = sources()
    .filter(({file}) => file !== SELF)
    .filter(({file}) => file !== PALETTE_FILE)
    .filter(({file}) => !file.endsWith('.test.ts'))
    .filter(({text}) => banned.test(text))
    .map(({file}) => file);
  assert.deepEqual(offenders, []);
});
