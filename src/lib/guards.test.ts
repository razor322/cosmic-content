import assert from 'node:assert/strict';
import {readFileSync, readdirSync, statSync} from 'node:fs';
import {join} from 'node:path';
import {test} from 'node:test';

const SELF = 'src/lib/guards.test.ts';

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

test('hex colour literals exist only in src/data/theme.ts', () => {
  const offenders = sources()
    .filter(({file}) => file !== SELF)
    .filter(({file}) => file !== 'src/data/theme.ts')
    .filter(({file}) => !file.endsWith('.test.ts'))
    .filter(({text}) => /#[0-9a-fA-F]{3,8}\b/.test(text))
    .map(({file}) => file);
  assert.deepEqual(offenders, []);
});
