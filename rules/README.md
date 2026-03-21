# Rules — маппинг Figma → React

Каждый файл в этой папке описывает один или группу связанных компонентов дизайн-системы.

## Формат файла правил

```json
{
  "version": "1",
  "components": [
    {
      "figmaName":   "StatusBadge/Badge",       // точное имя компонента в Figma
      "component":   "StatusBadge",             // имя React-компонента
      "importPath":  "uikit/StatusBadge/StatusBadge",
      "props": {
        // ключ = имя пропа Figma, значение = имя пропа React или трансформация
        "severity": { "mapTo": "code" },
        "label":    { "mapTo": "name" }
      },
      "variants": {
        // ключ = Figma variant property=value, значение = React prop override
        "Size=32": { "size": 32 },
        "Size=24": { "size": 24 },
        "Small=true": { "isSmall": true }
      },
      "staticProps": {
        // пропы, которые всегда добавляются (не из Figma)
      }
    }
  ]
}
```

## Файлы правил

| Файл | Покрывает |
|---|---|
| `status-badge.rules.json` | StatusBadge — 10 severity, 2 размера |
| `button.rules.json` | Button — 3 типа × 6 sentiment × 2 размера |
| `input.rules.json` | InputText, Dropdown, InputSwitch |
| `message.rules.json` | InlineMessage — 4 sentiment × 2 размера |
| `layout.rules.json` | AppLayout, breadcrumbs, card |
| `datatable.rules.json` | DataTable, Column, пагинация |
| `dialog.rules.json` | Dialog, Drawer, DialogTabs |

## Как добавить новый компонент

1. Создай файл `component-name.rules.json` по формату выше.
2. Запусти `node renderer/src/validate-rules.js rules/component-name.rules.json` — проверит схему.
3. Создай GitHub Issue с label `rules` если нужна доработка renderer.
