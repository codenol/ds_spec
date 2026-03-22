#!/usr/bin/env node
/**
 * E2E тест renderer: сравнивает вывод с golden-файлами.
 *
 * Usage:
 *   node scripts/test-renderer.js               ← сравнение с golden/
 *   node scripts/test-renderer.js --update-golden ← обновить эталоны
 */

const fs      = require('fs');
const path    = require('path');
const { execSync } = require('child_process');

const ROOT       = path.resolve(__dirname, '..');
const EXAMPLES   = path.join(ROOT, 'examples');
const GOLDEN_DIR = path.join(ROOT, 'tests', 'golden');
const RENDERER   = path.join(ROOT, 'renderer', 'src', 'index.js');
const TMP_DIR    = path.join(ROOT, 'tests', '.tmp');

const UPDATE_GOLDEN = process.argv.includes('--update-golden');

fs.mkdirSync(GOLDEN_DIR, { recursive: true });
fs.mkdirSync(TMP_DIR,    { recursive: true });

const examples = fs.readdirSync(EXAMPLES).filter(f => f.endsWith('.json'));

if (examples.length === 0) {
  console.error('❌ No examples found in examples/');
  process.exit(1);
}

let passed = 0;
let failed = 0;
const updated = [];

for (const exFile of examples) {
  const specPath   = path.join(EXAMPLES, exFile);
  const spec       = JSON.parse(fs.readFileSync(specPath, 'utf8'));
  const outputName = path.basename(spec.page.file); // e.g. Agents.tsx
  const goldenPath = path.join(GOLDEN_DIR, outputName);
  const tmpPath    = path.join(TMP_DIR, outputName);

  // Run renderer into tmp
  try {
    execSync(`node "${RENDERER}" --input "${specPath}" --out "${TMP_DIR}"`, { stdio: 'pipe' });
  } catch (e) {
    console.error(`❌ ${exFile}: renderer failed`);
    console.error(e.stderr?.toString() || e.message);
    failed++;
    continue;
  }

  const actual = fs.readFileSync(tmpPath, 'utf8');

  if (UPDATE_GOLDEN) {
    const prev = fs.existsSync(goldenPath) ? fs.readFileSync(goldenPath, 'utf8') : null;
    fs.writeFileSync(goldenPath, actual, 'utf8');
    if (prev !== actual) {
      updated.push(outputName);
      console.log(`↺  Updated golden: ${outputName}`);
    } else {
      console.log(`✅ Unchanged:      ${outputName}`);
    }
    passed++;
    continue;
  }

  if (!fs.existsSync(goldenPath)) {
    console.error(`❌ ${exFile}: no golden file at tests/golden/${outputName}`);
    console.error(`   Run with --update-golden to create it.`);
    failed++;
    continue;
  }

  const golden = fs.readFileSync(goldenPath, 'utf8');

  if (actual === golden) {
    console.log(`✅ ${exFile} → ${outputName}`);
    passed++;
  } else {
    console.error(`❌ ${exFile} → ${outputName}: output differs from golden`);
    printDiff(golden, actual);
    failed++;
  }
}

// Cleanup tmp
fs.rmSync(TMP_DIR, { recursive: true, force: true });

console.log(`\n${passed} passed, ${failed} failed`);
if (UPDATE_GOLDEN && updated.length > 0) {
  console.log(`Updated: ${updated.join(', ')}`);
}

process.exit(failed > 0 ? 1 : 0);

// ── helpers ──────────────────────────────────────────────────────────────────

function printDiff(golden, actual) {
  const goldenLines  = golden.split('\n');
  const actualLines  = actual.split('\n');
  const maxLines     = Math.max(goldenLines.length, actualLines.length);
  let diffCount      = 0;

  for (let i = 0; i < maxLines; i++) {
    const g = goldenLines[i];
    const a = actualLines[i];
    if (g !== a) {
      if (diffCount === 0) console.error('   First differences:');
      if (g !== undefined) console.error(`   - L${i + 1}: ${g}`);
      if (a !== undefined) console.error(`   + L${i + 1}: ${a}`);
      if (++diffCount >= 5) { console.error('   ... (more differences)'); break; }
    }
  }
}
