#!/usr/bin/env node
/**
 * Валидатор rules-файлов по schema/rules.schema.json
 *
 * Usage:
 *   node renderer/src/validate-rules.js rules/button.rules.json
 *   node renderer/src/validate-rules.js rules/          ← все файлы в папке
 */

const fs   = require('fs');
const path = require('path');
const Ajv  = require('ajv');

const schemaPath = path.resolve(__dirname, '../../schema/rules.schema.json');
const schema     = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
const ajv        = new Ajv({ allErrors: true });
const validate   = ajv.compile(schema);

const [,, target] = process.argv;
if (!target) {
  console.error('Usage: node validate-rules.js <rules-file.json|rules-dir/>');
  process.exit(1);
}

const targetPath = path.resolve(target);
const stat = fs.statSync(targetPath);

const files = stat.isDirectory()
  ? fs.readdirSync(targetPath)
      .filter(f => f.endsWith('.rules.json'))
      .map(f => path.join(targetPath, f))
  : [targetPath];

let hasErrors = false;

for (const file of files) {
  let data;
  try {
    data = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    console.error(`❌ ${path.basename(file)}: JSON parse error — ${e.message}`);
    hasErrors = true;
    continue;
  }

  const valid = validate(data);
  if (!valid) {
    console.error(`❌ ${path.basename(file)}:`);
    validate.errors.forEach(e => console.error(`   ${e.instancePath || '/'} ${e.message}`));
    hasErrors = true;
  } else {
    const count = data.components.length;
    console.log(`✅ ${path.basename(file)} — ${count} component${count !== 1 ? 's' : ''}`);
  }
}

process.exit(hasErrors ? 1 : 0);
