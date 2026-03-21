# Rules Bundle

Автогенерируется скриптом `scripts/build-rules-bundle.js`.
Вставляй этот файл целиком в LLM-промпт.

Компонентов покрыто: 11

---

## button.rules.json

```json
{
  "version": "1",
  "components": [
    {
      "figmaName": "Button/Button",
      "component": "Button",
      "importPath": "primereact/button",
      "props": {
        "label": { "mapTo": "label" },
        "icon":  { "mapTo": "icon", "optional": true }
      },
      "variants": {
        "Type=filled,Sentiment=primary":   { "className": "p-button-pr" },
        "Type=filled,Sentiment=secondary": { "className": "p-button-secondary" },
        "Type=filled,Sentiment=success":   { "className": "p-button-success" },
        "Type=filled,Sentiment=warning":   { "className": "p-button-warning" },
        "Type=filled,Sentiment=danger":    { "className": "p-button-danger" },
        "Type=outlined,Sentiment=primary": { "className": "p-button-outlined" },
        "Type=outlined,Sentiment=danger":  { "className": "p-button-danger p-button-outlined" },
        "Type=text":                       { "className": "p-button-text" },
        "Size=large": { "size": null },
        "Size=small": { "size": "small" }
      }
    }
  ]
}

```

## datatable.rules.json

```json
{
  "version": "1",
  "components": [
    {
      "figmaName": "DataTable/Table",
      "component": "DataTable",
      "importPath": "primereact/datatable",
      "props": {
        "value":     { "mapTo": "value", "bindState": true },
        "dataKey":   { "mapTo": "dataKey", "default": "id" },
        "selection": { "mapTo": "selection", "bindState": true, "optional": true }
      },
      "variants": {
        "Size=small":      { "size": "small" },
        "Striped=true":    { "stripedRows": true },
        "Selectable=true": { "selectionMode": "multiple", "onSelectionChange": "bindHandler" },
        "Clickable=true":  { "onRowClick": "bindHandler", "rowClassName": "() => 'cursor-pointer'" },
        "Sortable=true":   { "sortMode": "single", "removableSort": true }
      },
      "columns": {
        "selection": {
          "component": "Column",
          "props": { "selectionMode": "multiple", "headerStyle": { "width": "3rem" } }
        },
        "text": {
          "component": "Column",
          "props": { "field": "bindField", "header": "bindHeader", "sortable": "optional" }
        },
        "status": {
          "component": "Column",
          "props": { "header": "bindHeader" },
          "bodyTemplate": "<StatusBadge code={row.{statusCodeField}} name={row.{statusNameField}} />"
        },
        "actions": {
          "component": "Column",
          "props": { "headerStyle": { "width": "3rem" } },
          "bodyTemplate": "<Button icon='pi pi-ellipsis-v' className='p-button-text p-button-rounded' onClick={(e) => { setMenuRow(row); rowMenuRef.current?.toggle(e); }} />"
        }
      }
    }
  ]
}

```

## input.rules.json

```json
{
  "version": "1",
  "components": [
    {
      "figmaName": "Input/Text",
      "component": "InputText",
      "importPath": "primereact/inputtext",
      "props": {
        "placeholder": { "mapTo": "placeholder", "optional": true },
        "value":       { "mapTo": "value", "bindState": true },
        "disabled":    { "mapTo": "disabled", "optional": true }
      },
      "variants": {
        "Size=large": {},
        "Size=small": { "className": "p-inputtext-sm" },
        "State=error":   { "className": "p-invalid" },
        "State=warning": { "className": "p-warning" },
        "State=disabled":{ "disabled": true },
        "Icon=left":  { "wrapWith": "p-input-icon-left" },
        "Icon=right": { "wrapWith": "p-input-icon-right" }
      }
    },
    {
      "figmaName": "Input/Dropdown",
      "component": "Dropdown",
      "importPath": "primereact/dropdown",
      "props": {
        "placeholder":  { "mapTo": "placeholder", "optional": true },
        "value":        { "mapTo": "value", "bindState": true },
        "options":      { "mapTo": "options", "bindState": true },
        "optionLabel":  { "mapTo": "optionLabel", "default": "label" }
      },
      "variants": {
        "Size=small": { "className": "p-inputtext-sm" },
        "State=disabled": { "disabled": true }
      }
    },
    {
      "figmaName": "Input/Switch",
      "component": "InputSwitch",
      "importPath": "primereact/inputswitch",
      "props": {
        "checked":  { "mapTo": "checked", "bindState": true },
        "disabled": { "mapTo": "disabled", "optional": true }
      },
      "variants": {
        "State=disabled": { "disabled": true }
      }
    }
  ]
}

```

## layout.rules.json

```json
{
  "version": "1",
  "components": [
    {
      "figmaName": "Layout/PageShell",
      "component": "AppLayout",
      "importPath": "../layout/AppLayout",
      "props": {
        "breadcrumbTrail": { "mapTo": "breadcrumbTrail", "type": "breadcrumb[]" }
      },
      "variants": {},
      "childSlots": {
        "default": "children"
      }
    },
    {
      "figmaName": "Layout/Card",
      "element": "div",
      "className": "card",
      "variants": {
        "Padding=none": { "style": { "padding": 0 } },
        "Overflow=auto": { "style": { "overflow": "auto", "minWidth": 0 } }
      }
    },
    {
      "figmaName": "Layout/Toolbar",
      "element": "div",
      "className": "flex flex-wrap align-items-center gap-2 mb-3",
      "childSlots": { "default": "children" }
    },
    {
      "figmaName": "Layout/Stack/Horizontal",
      "element": "div",
      "className": "flex align-items-center",
      "variants": {
        "Gap=2": { "className": "flex align-items-center gap-2" },
        "Gap=3": { "className": "flex align-items-center gap-3" },
        "Gap=4": { "className": "flex align-items-center gap-4" },
        "Wrap=true": { "className": "flex flex-wrap align-items-center gap-2" }
      }
    },
    {
      "figmaName": "Layout/Stack/Vertical",
      "element": "div",
      "className": "flex flex-column",
      "variants": {
        "Gap=2": { "className": "flex flex-column gap-2" },
        "Gap=3": { "className": "flex flex-column gap-3" }
      }
    }
  ]
}

```

## status-badge.rules.json

```json
{
  "version": "1",
  "components": [
    {
      "figmaName": "StatusBadge/Badge",
      "component": "StatusBadge",
      "importPath": "uikit/StatusBadge/StatusBadge",
      "props": {
        "severity": { "mapTo": "code" },
        "label":    { "mapTo": "name" }
      },
      "variants": {
        "Size=32":    { "size": 32 },
        "Size=24":    { "size": 24 },
        "Small=true": { "isSmall": true }
      },
      "severityMapping": {
        "success":     "success",
        "warning":     "warning",
        "degradation": "degradation",
        "critical":    "critical",
        "info":        "info",
        "maintenance": "maintenance",
        "additional":  "additional",
        "stop":        "stop",
        "new":         "new",
        "load":        "load"
      }
    }
  ]
}

```

