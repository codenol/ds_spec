# PRD — ds_spec: следующая фаза развития пайплайна

**Дата:** 2026-03-22
**Статус:** Draft
**Ветка:** `claude/create-prd-document-VW9kS`

---

## 1. Контекст и текущее состояние

Пайплайн `ds_spec` автоматизирует преобразование Figma-макетов в production-ready React-компоненты:

```
Figma (MCP / Figma API)
        ↓
   [LLM + prompts/ + rules/]
        ↓
   page-spec.json  ← валидируется по schema/
        ↓
   [renderer CLI]
        ↓
   src/pages/PageName.tsx
```

**Что работает сейчас:**
- Renderer: `page-spec.json → .tsx` (6 типов узлов: component, element, text, fragment, conditional, list)
- Rules: Button, InputText/Dropdown/InputSwitch, StatusBadge, DataTable, AppLayout
- Schema: JSON Schema v7 с AJV-валидацией
- CI: автовалидация examples/ при push
- Пример страницы: `/agents` с DataTable, фильтрами, StatusBadge

**Что отсутствует / сломано:**
- Rules для Dialog, Drawer, InlineMessage — упомянуты в README, файлов нет
- Нет автоматического теста renderer (только валидация schema)
- Нет diff-режима: нельзя понять, что изменилось между двумя версиями page-spec
- LLM получает весь rules-bundle целиком, даже если страница использует 3 компонента
- Нет поддержки `useCallback`, `useEffect` в schema — только `useMemo` (`derived`)

---

## 2. Цели новой фазы

| # | Цель | Приоритет |
|---|------|-----------|
| G1 | 100% покрытие правилами всех компонентов из дизайн-системы | P0 |
| G2 | Renderer без ручных правок: любой валидный page-spec → корректный .tsx | P0 |
| G3 | Сокращение размера промпта для LLM (точечный rules-bundle) | P1 |
| G4 | Поддержка эффектов и колбэков в schema | P1 |
| G5 | Diff-режим для инкрементальных обновлений страниц | P2 |

---

## 3. Требования

### 3.1 Завершить покрытие rules/ (G1 · P0)

**Проблема:** В `rules/README.md` перечислены `message.rules.json` и `dialog.rules.json`, но файлов нет. LLM при встрече этих компонентов пишет `_comment` и использует fallback.

**Требования:**

| Файл | Компоненты | Варианты |
|------|-----------|---------|
| `message.rules.json` | `InlineMessage` | 4 sentiment (info/success/warning/error) × 2 размера |
| `dialog.rules.json` | `Dialog`, `Drawer`, `DialogTabs` | стандартные пропы: header, visible, onHide, footer |
| `menu.rules.json` | `Menu`, `ContextMenu`, `TieredMenu` | popup-режим, model-пропы |
| `tabs.rules.json` | `TabView`, `TabPanel` | — |
| `form.rules.json` | `InputNumber`, `Calendar`, `MultiSelect`, `Chips` | — |

**Критерии приёмки:**
- `node renderer/src/validate-rules.js rules/<name>.rules.json` — ✅ для каждого файла
- Минимум один пример использования в `examples/` или в существующем page-spec
- `node scripts/build-rules-bundle.js` обновляет `prompts/rules-bundle.md` без ошибок

---

### 3.2 Расширение schema: effects и callbacks (G4 · P1)

**Проблема:** Schema поддерживает только `derived` (useMemo). Интерактивные страницы требуют `useEffect` и `useCallback`.

**Новые поля в `page-spec.schema.json`:**

```jsonc
"effects": {
  "type": "array",
  "description": "useEffect-хуки",
  "items": {
    "type": "object",
    "required": ["deps", "body"],
    "properties": {
      "deps":  { "type": "array", "items": { "type": "string" } },
      "body":  { "type": "string", "description": "Тело эффекта (JS-код)" },
      "cleanup": { "type": "string", "description": "Код очистки (return () => {...})" }
    }
  }
},
"callbacks": {
  "type": "array",
  "description": "useCallback-функции",
  "items": {
    "type": "object",
    "required": ["name", "deps", "body"],
    "properties": {
      "name": { "type": "string" },
      "deps": { "type": "array", "items": { "type": "string" } },
      "body": { "type": "string" }
    }
  }
}
```

**Renderer должен генерировать:**

```tsx
// effects
useEffect(() => {
  <body>
  <cleanup>
}, [<deps>]);

// callbacks
const <name> = useCallback((<params>) => {
  <body>
}, [<deps>]);
```

**Критерии приёмки:**
- Schema обновлена, обратная совместимость сохранена (поля опциональные)
- Renderer генерирует корректный код для обоих хуков
- Добавлен пример в `examples/` с использованием `effects` или `callbacks`
- CI валидирует обновлённый пример без ошибок

---

### 3.3 Точечный rules-bundle (G3 · P1)

**Проблема:** `prompts/rules-bundle.md` содержит все правила (~5000 токенов). LLM платит за токены, которые не нужны для конкретной страницы.

**Решение: скрипт `scripts/build-rules-bundle.js` принимает флаг `--components`**

```bash
node scripts/build-rules-bundle.js --components button,datatable,status-badge
# → генерирует prompts/rules-bundle-slim.md только с нужными правилами
```

**Требования к реализации:**
- Флаг `--components` принимает comma-separated список имён rules-файлов (без расширения)
- Без флага — текущее поведение (весь bundle)
- Вывод: размер до/после в stdout (`Reduced: 5120 → 1340 tokens (est.)`)
- Добавить в `prompts/user-template.md` раздел с инструкцией по использованию slim-bundle

**Критерии приёмки:**
- `node scripts/build-rules-bundle.js --components button,status-badge` → файл меньше полного bundle
- Генерируемый slim-bundle валидируется тем же парсером что и полный

---

### 3.4 E2E тест renderer (G2 · P0)

**Проблема:** CI проверяет только валидность schema, но не то, что renderer генерирует корректный .tsx.

**Что нужно:**
- Скрипт `scripts/test-renderer.js` запускает renderer на каждом `examples/*.json`
- Сравнивает вывод с golden-файлом в `tests/golden/`
- При расхождении — выводит diff и завершается с кодом 1
- В CI добавляется шаг `node scripts/test-renderer.js`

**Подход к golden-файлам:**
- Первый запуск с `--update-golden` создаёт/обновляет эталоны
- В PR golden-файлы reviewable как обычный diff .tsx

**Структура:**
```
tests/
  golden/
    Agents.tsx        ← эталонный вывод renderer для examples/agents.json
  test-renderer.js    ← скрипт сравнения (можно в scripts/)
```

**Критерии приёмки:**
- `node scripts/test-renderer.js` — ✅ на текущем examples/agents.json
- CI завершается с ошибкой если renderer изменил вывод без обновления golden
- `--update-golden` обновляет эталоны и выводит список изменённых файлов

---

### 3.5 Diff-режим для инкрементальных обновлений (G5 · P2)

**Проблема:** При обновлении макета дизайнером нет способа понять, что именно изменилось в page-spec, не читая весь JSON.

**Новый флаг renderer:**

```bash
node renderer/src/index.js --diff old-spec.json new-spec.json
```

**Вывод:**
```
~ state.searchQuery.initial: '' → 'all'
+ tree.children[2].props.disabled: true
- tree.children[4]  (removed: Button "Удалить")
~ imports[3]: 'primereact/menu' → 'primereact/tieredmenu'
```

**Критерии приёмки:**
- Diff показывает добавленные (+), удалённые (-) и изменённые (~) узлы
- Работает рекурсивно по всему дереву `tree`
- Не требует внешних зависимостей (только Node.js std)

---

## 4. Что остаётся за рамками

| Тема | Причина исключения |
|------|--------------------|
| Figma MCP интеграция | Решается на стороне пользователя, вне пайплайна |
| React-компиляция и type-check | Ответственность целевого проекта |
| UI для управления rules | Избыточно — достаточно JSON + Claude |
| Поддержка нескольких дизайн-систем | Не нужна сейчас |

---

## 5. Зависимости и риски

| Риск | Вероятность | Митигация |
|------|-------------|-----------|
| Dialog/Drawer пропы расходятся в разных версиях PrimeReact | Средняя | Зафиксировать версию в rules, добавить поле `minVersion` |
| Golden-файлы устаревают при рефакторинге renderer | Высокая | `--update-golden` в CI при merge в main |
| slim-bundle пропускает нужный компонент | Средняя | LLM пишет `_comment` — это acceptable behavior |

---

## 6. Порядок реализации

```
Sprint 1 (неделя 1-2):
  [ ] 3.1 — message.rules.json + dialog.rules.json (минимальное покрытие)
  [ ] 3.4 — E2E тест renderer + golden для agents.json

Sprint 2 (неделя 3-4):
  [ ] 3.1 — menu.rules.json, tabs.rules.json, form.rules.json
  [ ] 3.2 — effects + callbacks в schema + renderer

Sprint 3 (неделя 5):
  [ ] 3.3 — slim rules-bundle script
  [ ] 3.5 — diff-режим
```

---

## 7. Критерии готовности фазы

- [ ] `rules/` покрывает все компоненты из дизайн-системы (0 `_comment` для стандартных компонентов)
- [ ] `node scripts/test-renderer.js` — ✅ в CI
- [ ] Schema версии `"1"` с обратной совместимостью (effects/callbacks опциональные)
- [ ] `rules-bundle.md` пересобирается автоматически в CI
- [ ] PRD закрыт, все issues в `done`
