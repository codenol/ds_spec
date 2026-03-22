# Генерация страницы: Figma → page-spec.json → .tsx

Применяй эти инструкции когда пользователь просит сгенерировать страницу или экран по Figma-макету.

## Контекст

Pipeline этого репо: **Figma → page-spec.json → renderer → .tsx**
- Правила компонентов: `rules/*.rules.json`
- Все правила в одном файле: `prompts/rules-bundle.md`
- CLI рендерера: `node renderer/src/index.js`

## Шаги

**1. Прочитай перед генерацией:**
```
prompts/rules-bundle.md        ← все компоненты и их пропы
schema/page-spec.schema.json   ← схема
prompts/system.md              ← правила генерации
```

**2. Получи данные дизайна**

Если доступен Figma MCP — `get_design_context(nodeId)`.
Если нет — попроси пользователя описать экран или вставить данные.

**3. Сгенерируй page-spec.json**

Жёсткие ограничения:
- Только компоненты из `rules/` — не придумывать новые
- `importPath` — точно из правил
- `className` — только из разрешённого списка (`prompts/system.md`)
- Непокрытые компоненты → `_comment`, ближайший аналог

**4. Валидируй**
```bash
node renderer/src/index.js --validate /tmp/spec.json
```
Ошибки → исправь → повтори. Не двигайся дальше без ✅.

**5. Сгенерируй TSX**
```bash
node renderer/src/index.js --input /tmp/spec.json --out <dir>
```

**6. Сохрани spec**
```bash
cp /tmp/spec.json examples/<name>.json
```

**7. Покажи итог:** путь к файлу, список компонентов, `_comment` если есть.
