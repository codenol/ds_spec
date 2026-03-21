# ds_spec — Figma → Code Pipeline

Система перевода Figma-макетов в производственный React-код **1:1** через LLM.

```
Figma (MCP / Figma API)
        ↓
   [LLM + prompts/]          ← передаёшь промпт + rules/ + schema/
        ↓
   page-spec.json            ← валидируется по schema/page-spec.schema.json
        ↓
   [renderer]                ← CLI, запускается локально
        ↓
   src/pages/PageName.tsx    ← готовый файл, 1:1 макет
```

## Принцип работы

1. **Дизайнер** строит макет **только** из компонентов библиотеки.
2. **LLM** получает данные из Figma + файлы из `prompts/` + `rules/` + `schema/` → генерирует `page-spec.json`.
3. **Renderer** (`renderer/`) читает `page-spec.json` и пишет `.tsx` файлы на диск.
4. Если компонент новый или правило отсутствует — добавляем в `rules/`, обновляем renderer → снова 100%.

## Структура репозитория

```
rules/          — маппинг Figma-компонентов → React-компоненты (JSON)
schema/         — JSON Schema для page-spec (валидация через AJV)
renderer/       — CLI-инструмент: page-spec.json → .tsx файлы
prompts/        — системный промпт и шаблоны для LLM
examples/       — примеры page-spec.json для реальных страниц
```

## Быстрый старт

```bash
# Установить renderer
cd renderer && npm install

# Сгенерировать страницу из page-spec
node renderer/src/index.js --input examples/agents.json --out src/pages/

# Валидировать page-spec без рендеринга
node renderer/src/index.js --validate examples/agents.json
```

## Управление через Claude (mobile)

Репозиторий спроектирован для управления через Claude Code.
Каждая задача — GitHub Issue. Статус — через labels: `todo` / `in-progress` / `done`.

Примеры команд Claude:
- *"Добавь правило для компонента DataGrid"*
- *"Обнови промпт: добавь поддержку Drawer"*
- *"Создай page-spec для страницы /settings по этому Figma-узлу"*
