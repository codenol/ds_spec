Добавь правило для нового компонента дизайн-системы.

Аргументы: $ARGUMENTS
(ожидается: название компонента и/или описание его пропов и вариантов)

## Твои шаги

1. **Прочитай формат** — `rules/README.md` и любой существующий файл из `rules/` для примера.

2. **Создай файл** `rules/<component-name>.rules.json`:
   - `figmaName` — точное имя в Figma (спроси у пользователя если неизвестно)
   - `component` — имя React-компонента
   - `importPath` — путь импорта (primereact/... или uikit/...)
   - `props` — маппинг Figma props → React props
   - `variants` — маппинг Figma variants → React className/props

3. **Валидируй:**
   ```bash
   node renderer/src/validate-rules.js rules/<component-name>.rules.json
   ```
   Исправь ошибки если есть.

4. **Пересобери bundle:**
   ```bash
   node scripts/build-rules-bundle.js
   ```

5. Сообщи пользователю сколько компонентов теперь в rules/ и что нужно сделать дальше
   (обновить примеры, если компонент используется в существующих страницах).
