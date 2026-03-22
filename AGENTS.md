# AGENTS.md — ds_spec

Инструкция для любого AI-агента работающего с этим репозиторием.

## Что это за репо

Pipeline: **Figma → page-spec.json → renderer → .tsx**

Дизайнер работает через компоненты дизайн-системы (PrimeReact + uikit).
LLM генерирует `page-spec.json` строго по правилам из `rules/`.
Renderer детерминированно превращает spec в TypeScript.

## Ключевые файлы

| Файл/папка | Роль |
|---|---|
| `rules/*.rules.json` | Маппинг Figma-компонентов → React (источник истины) |
| `prompts/rules-bundle.md` | Все rules в одном файле — подкладывать в контекст LLM |
| `prompts/system.md` | System prompt для генерации page-spec |
| `schema/page-spec.schema.json` | JSON Schema — валидация spec |
| `renderer/src/index.js` | CLI: spec → .tsx |
| `examples/*.json` | Готовые примеры page-spec |

## Workflow 1: Сгенерировать страницу

**Вход:** Figma node или текстовое описание + маршрут + путь выходного файла.

```
1. Прочитать prompts/rules-bundle.md          ← доступные компоненты
2. Прочитать schema/page-spec.schema.json     ← структура spec
3. Прочитать prompts/system.md                ← правила генерации
4. Если есть Figma MCP → get_design_context(nodeId)
5. Сгенерировать page-spec.json по схеме
6. Валидировать: node renderer/src/index.js --validate <spec>
7. Если ошибки → исправить spec и повторить шаг 6
8. Генерировать: node renderer/src/index.js --input <spec> --out <dir>
9. Сохранить spec в examples/<name>.json
```

**Нельзя:** придумывать компоненты, importPath или className не из rules/.
**Если компонент не покрыт правилом:** добавить `_comment` и использовать ближайший аналог.

## Workflow 2: Добавить правило для нового компонента

```
1. Создать rules/<name>.rules.json по формату из rules/README.md
2. Валидировать: node renderer/src/validate-rules.js rules/<name>.rules.json
3. Пересобрать bundle: node scripts/build-rules-bundle.js
4. Добавить пример использования в examples/ или обновить существующий
```

## Workflow 3: Проверить покрытие

```bash
node renderer/src/validate-rules.js rules/   # все файлы + счётчик компонентов
node scripts/test-renderer.js                # E2E: examples/ → golden/
```

## Формат page-spec.json (кратко)

```jsonc
{
  "version": "1",
  "page": { "id": "myPage", "route": "/my-page", "file": "src/pages/MyPage.tsx" },
  "imports": ["import React, { useState } from 'react';", "..."],
  "state": [{ "name": "query", "type": "string", "initial": "''" }],
  "refs": [{ "name": "menuRef", "type": "Menu" }],
  "derived": [{ "name": "filtered", "deps": ["items","query"], "logic": "..." }],
  "callbacks": [{ "name": "handleSave", "params": "", "deps": [], "body": "..." }],
  "effects": [{ "deps": [], "body": "loadData();" }],
  "data": { "ITEMS": [...] },
  "tree": { "type": "component", "component": "AppLayout", "children": [...] }
}
```

## Установка зависимостей (если нужно)

```bash
cd renderer && npm install
```
