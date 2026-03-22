# Добавление правила для нового компонента

Применяй когда пользователь хочет добавить компонент в pipeline.

## Шаги

**1. Прочитай формат:** `rules/README.md` + любой файл из `rules/`

**2. Создай `rules/<name>.rules.json`**

React-компонент:
```json
{
  "version": "1",
  "components": [{
    "figmaName": "Group/Name",
    "component": "ReactName",
    "importPath": "primereact/package",
    "props": { "figmaProp": { "mapTo": "reactProp" } },
    "variants": { "Prop=Value": { "className": "p-class" } }
  }]
}
```

HTML-элемент (без импорта):
```json
{ "figmaName": "Layout/Card", "element": "div", "className": "card" }
```

**3. Валидируй**
```bash
node renderer/src/validate-rules.js rules/<name>.rules.json
```

**4. Пересобери bundle**
```bash
node scripts/build-rules-bundle.js
```

**5. Обнови `rules/README.md`** — добавь строку в таблицу.
