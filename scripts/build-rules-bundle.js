#!/usr/bin/env node
/**
 * Конкатенирует все rules/*.json в prompts/rules-bundle.md
 * для вставки в LLM-промпт.
 *
 * Usage: node scripts/build-rules-bundle.js
 */

const fs   = require('fs');
const path = require('path');

const rulesDir  = path.resolve(__dirname, '../rules');
const outputFile = path.resolve(__dirname, '../prompts/rules-bundle.md');

const files = fs.readdirSync(rulesDir)
  .filter(f => f.endsWith('.rules.json'))
  .sort();

let output = `# Rules Bundle\n\nАвтогенерируется скриптом \`scripts/build-rules-bundle.js\`.\nВставляй этот файл целиком в LLM-промпт.\n\n`;
output += `Компонентов покрыто: ${files.reduce((acc, f) => {
  const r = JSON.parse(fs.readFileSync(path.join(rulesDir, f), 'utf8'));
  return acc + (r.components || []).length;
}, 0)}\n\n---\n\n`;

for (const file of files) {
  const content = fs.readFileSync(path.join(rulesDir, file), 'utf8');
  output += `## ${file}\n\n\`\`\`json\n${content}\n\`\`\`\n\n`;
}

fs.mkdirSync(path.dirname(outputFile), { recursive: true });
fs.writeFileSync(outputFile, output, 'utf8');
console.log(`✅ rules-bundle.md updated (${files.length} rule files)`);
