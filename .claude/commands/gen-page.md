Сгенерируй страницу по дизайн-спеке для этого репозитория.

Аргументы: $ARGUMENTS
(ожидается: <figma-node-id или описание> --route /путь --out src/pages/ИмяСтраницы.tsx)

## Твои шаги

1. **Прочитай контекст** — прочитай эти файлы:
   - `prompts/rules-bundle.md` — все доступные компоненты
   - `schema/page-spec.schema.json` — схема валидации
   - `prompts/system.md` — правила генерации

2. **Получи дизайн** — если передан Figma node ID, вызови Figma MCP `get_design_context`.
   Если нет — попроси пользователя описать страницу или вставить данные из Figma.

3. **Сгенерируй page-spec.json** строго по схеме и правилам из rules-bundle.
   - Только компоненты из rules/
   - Только разрешённые className
   - Не придумывай importPath

4. **Сохрани spec** во временный файл `/tmp/spec-<name>.json`

5. **Валидируй:**
   ```bash
   node renderer/src/index.js --validate /tmp/spec-<name>.json
   ```
   Если ошибки — исправь spec и повтори валидацию.

6. **Генерируй TSX:**
   ```bash
   node renderer/src/index.js --input /tmp/spec-<name>.json --out <out-dir>
   ```

7. **Сохрани spec** в `examples/<name>.json` для истории.

8. Покажи пользователю путь к сгенерированному файлу и краткое резюме:
   сколько компонентов, какие хуки использованы, есть ли `_comment` с непокрытыми элементами.
