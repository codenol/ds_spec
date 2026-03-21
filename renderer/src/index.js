#!/usr/bin/env node
/**
 * ds_spec Renderer
 * Читает page-spec.json → генерирует .tsx файлы
 *
 * Usage:
 *   node src/index.js --input page-spec.json --out src/pages/
 *   node src/index.js --validate page-spec.json
 */

const fs   = require('fs');
const path = require('path');
const Ajv  = require('ajv');

const [,, ...argv] = process.argv;
const args = parseArgs(argv);

const schemaPath = path.resolve(__dirname, '../../schema/page-spec.schema.json');
const schema     = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
const ajv        = new Ajv({ allErrors: true });
const validate   = ajv.compile(schema);

// ─── Main ──────────────────────────────────────────────────────────────────────

const specPath = args['--input'] || args['--validate'];
if (!specPath) {
  console.error('Usage: node src/index.js --input <spec.json> --out <dir>');
  console.error('       node src/index.js --validate <spec.json>');
  process.exit(1);
}

const spec = JSON.parse(fs.readFileSync(path.resolve(specPath), 'utf8'));

// Validate
const valid = validate(spec);
if (!valid) {
  console.error('❌ Validation failed:');
  validate.errors.forEach(e => console.error(`  ${e.instancePath} ${e.message}`));
  process.exit(1);
}

if (args['--validate']) {
  console.log('✅ Valid page-spec.json');
  process.exit(0);
}

// Render
const outDir  = args['--out'] || '.';
const outFile = path.resolve(outDir, path.basename(spec.page.file));
const code    = renderPage(spec);

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, code, 'utf8');
console.log(`✅ Written: ${outFile}`);

// ─── Renderer ─────────────────────────────────────────────────────────────────

function renderPage(spec) {
  const imports = spec.imports.join('\n');

  const stateLines = (spec.state || []).map(s =>
    `  const [${s.name}, ${s.setter || `set${capitalize(s.name)}`}] = useState<${s.type}>(${s.initial});`
  ).join('\n');

  const refLines = (spec.refs || []).map(r =>
    `  const ${r.name} = useRef<${r.type}>(null);`
  ).join('\n');

  const derivedLines = (spec.derived || []).map(d =>
    `  const ${d.name} = useMemo(() => ${d.logic}, [${d.deps.join(', ')}]);`
  ).join('\n');

  const dataLines = Object.entries(spec.data || {}).map(([key, val]) =>
    `const ${key} = ${JSON.stringify(val, null, 2)};`
  ).join('\n\n');

  const componentName = capitalize(spec.page.id);
  const jsx = renderNode(spec.tree, 2);

  return `${imports}

${dataLines}

const ${componentName}: React.FC = () => {
${stateLines}
${refLines}
${derivedLines}

  return (
${jsx}
  );
};

export default ${componentName};
`;
}

function renderNode(node, indent) {
  const pad = ' '.repeat(indent);

  if (node.type === 'text') {
    return `${pad}{${node.text}}`;
  }

  if (node.type === 'fragment') {
    const children = (node.children || []).map(c => renderNode(c, indent + 2)).join('\n');
    return `${pad}<>\n${children}\n${pad}</>`;
  }

  if (node.type === 'conditional') {
    const inner = renderNode({ ...node, type: node.children ? 'element' : 'component', condition: undefined }, indent + 2);
    return `${pad}{${node.condition} && (\n${inner}\n${pad})}`;
  }

  if (node.type === 'list') {
    const inner = renderNode({ ...node, type: 'component', iterateOver: undefined, itemVar: undefined, keyField: undefined }, indent + 4);
    return `${pad}{${node.iterateOver}.map((${node.itemVar || 'item'}) => (\n${inner.replace('>', ` key={${node.itemVar || 'item'}.${node.keyField || 'id'}}>`)} \n${pad}))}`;
  }

  const tag    = node.component || node.element || 'div';
  const props  = buildProps(node);
  const hasChildren = node.children && node.children.length > 0;

  if (!hasChildren) {
    return `${pad}<${tag}${props} />`;
  }

  const children = node.children.map(c => renderNode(c, indent + 2)).join('\n');
  return `${pad}<${tag}${props}>\n${children}\n${pad}</${tag}>`;
}

function buildProps(node) {
  const parts = [];

  if (node.className) parts.push(`className="${node.className}"`);

  if (node.style && Object.keys(node.style).length) {
    const styleStr = JSON.stringify(node.style);
    parts.push(`style={${styleStr}}`);
  }

  for (const [k, v] of Object.entries(node.props || {})) {
    if (typeof v === 'string' && v.startsWith('{')) {
      parts.push(`${k}=${v}`);
    } else if (typeof v === 'boolean') {
      if (v) parts.push(k);
    } else if (typeof v === 'number') {
      parts.push(`${k}={${v}}`);
    } else {
      parts.push(`${k}="${v}"`);
    }
  }

  return parts.length ? ' ' + parts.join(' ') : '';
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function parseArgs(argv) {
  const result = {};
  for (let i = 0; i < argv.length; i += 2) {
    result[argv[i]] = argv[i + 1];
  }
  return result;
}
