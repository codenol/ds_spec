#!/usr/bin/env node
/**
 * ds_spec Renderer v2
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
  // Determine which React hooks are actually used
  const usedHooks = {
    useState:    (spec.state     || []).length > 0,
    useRef:      (spec.refs      || []).length > 0,
    useMemo:     (spec.derived   || []).length > 0,
    useCallback: (spec.callbacks || []).length > 0,
    useEffect:   (spec.effects   || []).length > 0,
  };

  const imports = patchReactImport(spec.imports, usedHooks);

  const stateLines = (spec.state || []).map(s => {
    const setter = s.setter || `set${capitalize(s.name)}`;
    return `  const [${s.name}, ${setter}] = useState<${s.type}>(${s.initial});`;
  });

  const refLines = (spec.refs || []).map(r =>
    `  const ${r.name} = useRef<${r.type}>(null);`
  );

  const callbackLines = (spec.callbacks || []).map(cb => {
    const params = cb.params || '';
    return (
      `  const ${cb.name} = useCallback((${params}) => {\n` +
      `    ${cb.body}\n` +
      `  }, [${cb.deps.join(', ')}]);`
    );
  });

  const derivedLines = (spec.derived || []).map(d =>
    `  const ${d.name} = useMemo(\n    () => ${d.logic},\n    [${d.deps.join(', ')}],\n  );`
  );

  const effectLines = (spec.effects || []).map(e => {
    const cleanup = e.cleanup ? `\n    return () => { ${e.cleanup} };` : '';
    return (
      `  useEffect(() => {\n` +
      `    ${e.body}${cleanup}\n` +
      `  }, [${e.deps.join(', ')}]);`
    );
  });

  const dataLines = Object.entries(spec.data || {}).map(([key, val]) =>
    `const ${key} = ${JSON.stringify(val, null, 2)};`
  ).join('\n\n');

  const componentName = capitalize(spec.page.id);
  const jsx = renderNode(spec.tree, 2);

  // Assemble component body — skip empty sections
  const bodyBlocks = [
    stateLines.join('\n'),
    refLines.join('\n'),
    callbackLines.join('\n\n'),
    derivedLines.join('\n'),
    effectLines.join('\n\n'),
  ].filter(Boolean);

  const body = bodyBlocks.length ? bodyBlocks.join('\n\n') + '\n' : '';

  const code = [
    imports,
    '',
    dataLines,
    '',
    `const ${componentName}: React.FC = () => {`,
    body,
    `  return (`,
    jsx,
    `  );`,
    `};`,
    '',
    `export default ${componentName};`,
    '',
  ].join('\n');

  // Collapse 3+ consecutive blank lines → 2
  return code.replace(/\n{3,}/g, '\n\n');
}

// ─── Import patching ──────────────────────────────────────────────────────────

/**
 * Rewrites the `import React, { ... } from 'react'` line to include
 * exactly the hooks that are needed — no more, no less.
 */
function patchReactImport(importLines, usedHooks) {
  const needed = Object.entries(usedHooks)
    .filter(([, v]) => v)
    .map(([k]) => k)
    .sort();

  return importLines.map(line => {
    if (!/from ['"]react['"]/.test(line)) return line;

    if (needed.length === 0) return `import React from 'react';`;
    return `import React, { ${needed.join(', ')} } from 'react';`;
  }).join('\n');
}

// ─── Node rendering ───────────────────────────────────────────────────────────

function renderNode(node, indent) {
  const pad = ' '.repeat(indent);

  // Plain text expression node: {value}
  if (node.type === 'text') {
    return `${pad}{${node.text}}`;
  }

  // Fragment <>...</>
  if (node.type === 'fragment') {
    const children = visibleChildren(node).map(c => renderNode(c, indent + 2)).join('\n');
    return `${pad}<>\n${children}\n${pad}</>`;
  }

  // Conditional: {cond && (<elem>)}
  if (node.type === 'conditional') {
    const inner = renderNode(
      { ...node, type: node.component ? 'component' : 'element', condition: undefined },
      indent + 2,
    );
    return `${pad}{${node.condition} && (\n${inner}\n${pad})}`;
  }

  // List: arr.map(item => (<elem key={item.id} .../>))
  if (node.type === 'list') {
    const itemVar  = node.itemVar  || 'item';
    const keyField = node.keyField || 'id';
    const innerNode = { ...node, type: node.component ? 'component' : 'element', iterateOver: undefined, itemVar: undefined, keyField: undefined };
    const inner = renderNode(innerNode, indent + 4);
    const keyed = injectKeyProp(inner, `${itemVar}.${keyField}`);
    return `${pad}{${node.iterateOver}.map((${itemVar}) => (\n${keyed}\n${pad}))}`;
  }

  // Regular element or component
  const tag   = node.component || node.element || 'div';
  const props = buildProps(node);

  // Inline body text: <Tag props>body text</Tag>
  if (node.body) {
    return `${pad}<${tag}${props}>${node.body}</${tag}>`;
  }

  const kids = visibleChildren(node);

  if (kids.length === 0) {
    return `${pad}<${tag}${props} />`;
  }

  const childrenStr = kids.map(c => renderNode(c, indent + 2)).join('\n');
  return `${pad}<${tag}${props}>\n${childrenStr}\n${pad}</${tag}>`;
}

/** Filter out comment-only nodes (nodes whose only key is _comment) */
function visibleChildren(node) {
  return (node.children || []).filter(c => {
    const keys = Object.keys(c).filter(k => k !== '_comment');
    return keys.length > 0;
  });
}

/** Inject key={expr} into the first JSX tag of a rendered string */
function injectKeyProp(rendered, keyExpr) {
  // Match `  <TagName` followed by a space or `>`
  return rendered.replace(/^(\s*<[A-Za-z][\w.]*)([ >\/])/, (_, open, after) => {
    if (after === '>') return `${open} key={${keyExpr}}>`;
    if (after === '/') return `${open} key={${keyExpr}} /`; // self-closing edge case
    return `${open} key={${keyExpr}}${after}`;
  });
}

// ─── Props builder ────────────────────────────────────────────────────────────

function buildProps(node) {
  const parts = [];

  if (node.className) parts.push(`className="${node.className}"`);

  if (node.style && Object.keys(node.style).length) {
    parts.push(`style={${JSON.stringify(node.style)}}`);
  }

  for (const [k, v] of Object.entries(node.props || {})) {
    if (k === '_comment') continue;
    if (typeof v === 'string' && v.startsWith('{')) {
      // Already a JSX expression, e.g. "{value}" or "{() => foo()}"
      parts.push(`${k}=${v}`);
    } else if (typeof v === 'boolean') {
      if (v) parts.push(k); // boolean true → shorthand prop
    } else if (typeof v === 'number') {
      parts.push(`${k}={${v}}`);
    } else if (typeof v === 'object' && v !== null) {
      // Inline object → JSX expression, e.g. style={{ width: '12rem' }}
      parts.push(`${k}={${JSON.stringify(v)}}`);
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
