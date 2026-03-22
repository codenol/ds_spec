# Rules Bundle

Автогенерируется скриптом `scripts/build-rules-bundle.js`.
Вставляй этот файл целиком в LLM-промпт.

Компонентов покрыто: 36

---

## accordion.rules.json

```json
{
  "version": "1",
  "components": [
    {
      "figmaName": "Accordion/Accordion",
      "component": "Accordion",
      "importPath": "primereact/accordion",
      "props": {
        "activeIndex": { "mapTo": "activeIndex", "bindState": true, "optional": true },
        "onTabChange": { "mapTo": "onTabChange", "optional": true },
        "multiple":    { "mapTo": "multiple",    "optional": true }
      },
      "variants": {
        "Multiple=true": { "multiple": true }
      },
      "childSlots": { "default": "children" }
    },
    {
      "figmaName": "Accordion/AccordionTab",
      "component": "AccordionTab",
      "importPath": "primereact/accordion",
      "props": {
        "header":   { "mapTo": "header" },
        "disabled": { "mapTo": "disabled", "optional": true }
      },
      "variants": {
        "Disabled=true": { "disabled": true }
      },
      "childSlots": { "default": "children" }
    }
  ]
}

```

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

## checkbox.rules.json

```json
{
  "version": "1",
  "components": [
    {
      "figmaName": "Checkbox/Checkbox",
      "component": "Checkbox",
      "importPath": "primereact/checkbox",
      "props": {
        "checked":   { "mapTo": "checked",   "bindState": true },
        "onChange":  { "mapTo": "onChange",  "optional": true },
        "disabled":  { "mapTo": "disabled",  "optional": true },
        "inputId":   { "mapTo": "inputId",   "optional": true }
      },
      "variants": {
        "State=checked":        { "checked": true },
        "State=unchecked":      { "checked": false },
        "State=indeterminate":  { "checked": false },
        "Disabled=true":        { "disabled": true }
      }
    },
    {
      "figmaName": "Checkbox/CheckboxLabel",
      "_comment": "Обёртка Checkbox + label в одной строке",
      "element": "div",
      "className": "flex align-items-center gap-2",
      "childSlots": { "default": "children" }
    },
    {
      "figmaName": "Checkbox/CheckboxGroup",
      "_comment": "Вертикальный список Checkbox с общим заголовком",
      "element": "div",
      "className": "flex flex-column gap-2",
      "childSlots": { "default": "children" }
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

## dialog.rules.json

```json
{
  "version": "1",
  "components": [
    {
      "figmaName": "Dialog/Default",
      "component": "Dialog",
      "importPath": "primereact/dialog",
      "props": {
        "header":   { "mapTo": "header" },
        "visible":  { "mapTo": "visible", "bindState": true },
        "onHide":   { "mapTo": "onHide", "bindCallback": true },
        "footer":   { "mapTo": "footer", "optional": true }
      },
      "variants": {
        "Width=small":  { "style": { "width": "400px" } },
        "Width=medium": { "style": { "width": "600px" } },
        "Width=large":  { "style": { "width": "900px" } },
        "Closable=false": { "closable": false }
      },
      "staticProps": {
        "modal": true,
        "draggable": false,
        "resizable": false
      },
      "childSlots": {
        "default": "children"
      }
    },
    {
      "figmaName": "Dialog/Drawer",
      "component": "Sidebar",
      "importPath": "primereact/sidebar",
      "props": {
        "header":   { "mapTo": "header", "optional": true },
        "visible":  { "mapTo": "visible", "bindState": true },
        "onHide":   { "mapTo": "onHide", "bindCallback": true }
      },
      "variants": {
        "Position=right":  { "position": "right" },
        "Position=left":   { "position": "left" },
        "Position=bottom": { "position": "bottom" },
        "Width=narrow":  { "style": { "width": "400px" } },
        "Width=wide":    { "style": { "width": "700px" } }
      },
      "staticProps": {
        "modal": true
      },
      "childSlots": {
        "default": "children"
      }
    },
    {
      "figmaName": "Dialog/Tabs",
      "component": "Dialog",
      "importPath": "primereact/dialog",
      "props": {
        "header":  { "mapTo": "header" },
        "visible": { "mapTo": "visible", "bindState": true },
        "onHide":  { "mapTo": "onHide", "bindCallback": true }
      },
      "variants": {
        "Width=medium": { "style": { "width": "600px" } },
        "Width=large":  { "style": { "width": "900px" } }
      },
      "staticProps": {
        "modal": true,
        "draggable": false,
        "resizable": false
      },
      "childSlots": {
        "default": "children"
      },
      "_comment": "Внутри children используй TabView/TabPanel из tabs.rules.json"
    }
  ]
}

```

## form.rules.json

```json
{
  "version": "1",
  "components": [
    {
      "figmaName": "Input/Number",
      "component": "InputNumber",
      "importPath": "primereact/inputnumber",
      "props": {
        "value":       { "mapTo": "value", "bindState": true },
        "placeholder": { "mapTo": "placeholder", "optional": true },
        "min":         { "mapTo": "min", "optional": true },
        "max":         { "mapTo": "max", "optional": true },
        "step":        { "mapTo": "step", "optional": true },
        "disabled":    { "mapTo": "disabled", "optional": true }
      },
      "variants": {
        "Mode=decimal":  { "mode": "decimal" },
        "Mode=currency": { "mode": "currency", "currency": "RUB" },
        "Size=small":    { "className": "p-inputtext-sm" },
        "State=disabled": { "disabled": true }
      },
      "staticProps": {}
    },
    {
      "figmaName": "Input/Calendar",
      "component": "Calendar",
      "importPath": "primereact/calendar",
      "props": {
        "value":       { "mapTo": "value", "bindState": true },
        "placeholder": { "mapTo": "placeholder", "optional": true },
        "disabled":    { "mapTo": "disabled", "optional": true }
      },
      "variants": {
        "Selection=single":   { "selectionMode": "single" },
        "Selection=range":    { "selectionMode": "range" },
        "Selection=multiple": { "selectionMode": "multiple" },
        "View=month":  { "view": "month", "dateFormat": "mm/yy" },
        "State=disabled": { "disabled": true }
      },
      "staticProps": {
        "showIcon": true,
        "dateFormat": "dd.mm.yy"
      }
    },
    {
      "figmaName": "Input/MultiSelect",
      "component": "MultiSelect",
      "importPath": "primereact/multiselect",
      "props": {
        "value":        { "mapTo": "value", "bindState": true },
        "options":      { "mapTo": "options", "bindState": true },
        "optionLabel":  { "mapTo": "optionLabel", "default": "label" },
        "placeholder":  { "mapTo": "placeholder", "optional": true },
        "disabled":     { "mapTo": "disabled", "optional": true }
      },
      "variants": {
        "Display=chip":  { "display": "chip" },
        "Display=comma": { "display": "comma" },
        "State=disabled": { "disabled": true }
      },
      "staticProps": {}
    },
    {
      "figmaName": "Input/Chips",
      "component": "Chips",
      "importPath": "primereact/chips",
      "props": {
        "value":       { "mapTo": "value", "bindState": true },
        "placeholder": { "mapTo": "placeholder", "optional": true },
        "disabled":    { "mapTo": "disabled", "optional": true }
      },
      "variants": {
        "State=disabled": { "disabled": true }
      },
      "staticProps": {}
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

## menu.rules.json

```json
{
  "version": "1",
  "components": [
    {
      "figmaName": "Menu/Menu",
      "component": "Menu",
      "importPath": "primereact/menu",
      "props": {
        "model": { "mapTo": "model", "bindState": true }
      },
      "variants": {
        "Popup=true": { "popup": true },
        "Popup=false": {}
      },
      "staticProps": {}
    },
    {
      "figmaName": "Menu/ContextMenu",
      "component": "ContextMenu",
      "importPath": "primereact/contextmenu",
      "props": {
        "model": { "mapTo": "model", "bindState": true }
      },
      "variants": {},
      "staticProps": {},
      "_comment": "Управляется через ref: menuRef.current.show(event)"
    },
    {
      "figmaName": "Menu/TieredMenu",
      "component": "TieredMenu",
      "importPath": "primereact/tieredmenu",
      "props": {
        "model": { "mapTo": "model", "bindState": true }
      },
      "variants": {
        "Popup=true": { "popup": true },
        "Popup=false": {}
      },
      "staticProps": {}
    }
  ]
}

```

## message.rules.json

```json
{
  "version": "1",
  "components": [
    {
      "figmaName": "Message/Inline",
      "component": "InlineMessage",
      "importPath": "primereact/inlinemessage",
      "props": {
        "text": { "mapTo": "text" }
      },
      "variants": {
        "Severity=info":    { "severity": "info" },
        "Severity=success": { "severity": "success" },
        "Severity=warning": { "severity": "warn" },
        "Severity=error":   { "severity": "error" },
        "Size=small": { "className": "p-inline-message-sm" },
        "Size=large": {}
      },
      "staticProps": {}
    },
    {
      "figmaName": "Message/Toast",
      "component": "Toast",
      "importPath": "primereact/toast",
      "props": {},
      "variants": {},
      "staticProps": {},
      "_comment": "Toast управляется через ref: toastRef.current.show({severity, summary, detail})"
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

## stepper.rules.json

```json
{
  "version": "1",
  "components": [
    {
      "figmaName": "Stepper/StepWizard",
      "_comment": "Пошаговый wizard. В uikit реализован как кастомный компонент поверх Steps + контент",
      "component": "Steps",
      "importPath": "primereact/steps",
      "props": {
        "model":        { "mapTo": "model" },
        "activeIndex":  { "mapTo": "activeIndex",  "bindState": true },
        "onSelect":     { "mapTo": "onSelect",     "optional": true },
        "readOnly":     { "mapTo": "readOnly",     "optional": true }
      },
      "variants": {
        "ReadOnly=true":  { "readOnly": true },
        "ReadOnly=false": { "readOnly": false }
      },
      "staticProps": {
        "readOnly": false
      }
    },
    {
      "figmaName": "Stepper/StepContent",
      "_comment": "Контентная область одного шага wizard — обёрточный div",
      "element": "div",
      "className": "flex flex-column gap-3 p-3",
      "childSlots": { "default": "children" }
    },
    {
      "figmaName": "Stepper/StepActions",
      "_comment": "Кнопки Назад / Далее внизу шага",
      "element": "div",
      "className": "flex justify-content-between mt-3",
      "childSlots": { "default": "children" }
    }
  ]
}

```

## tabs.rules.json

```json
{
  "version": "1",
  "components": [
    {
      "figmaName": "Tabs/TabView",
      "component": "TabView",
      "importPath": "primereact/tabview",
      "props": {
        "activeIndex": { "mapTo": "activeIndex", "bindState": true, "optional": true }
      },
      "variants": {
        "Scrollable=true": { "scrollable": true }
      },
      "staticProps": {},
      "childSlots": {
        "default": "children"
      }
    },
    {
      "figmaName": "Tabs/TabPanel",
      "component": "TabPanel",
      "importPath": "primereact/tabview",
      "props": {
        "header": { "mapTo": "header" },
        "disabled": { "mapTo": "disabled", "optional": true }
      },
      "variants": {
        "State=disabled": { "disabled": true }
      },
      "staticProps": {},
      "childSlots": {
        "default": "children"
      }
    }
  ]
}

```

## tooltip.rules.json

```json
{
  "version": "1",
  "components": [
    {
      "figmaName": "Tooltip/Tooltip",
      "_comment": "PrimeReact Tooltip — навешивается через data-pr-tooltip + <Tooltip target> или через className target",
      "component": "Tooltip",
      "importPath": "primereact/tooltip",
      "props": {
        "target":    { "mapTo": "target" },
        "content":   { "mapTo": "content", "optional": true }
      },
      "variants": {
        "Position=top":    { "position": "top" },
        "Position=bottom": { "position": "bottom" },
        "Position=left":   { "position": "left" },
        "Position=right":  { "position": "right" }
      },
      "staticProps": {
        "position": "top"
      }
    },
    {
      "figmaName": "Tooltip/Toggletip",
      "_comment": "Toggletip = OverlayPanel с кнопкой-триггером",
      "component": "OverlayPanel",
      "importPath": "primereact/overlaypanel",
      "props": {
        "content": { "mapTo": "children", "optional": true }
      },
      "variants": {}
    }
  ]
}

```

## tree.rules.json

```json
{
  "version": "1",
  "components": [
    {
      "figmaName": "Tree/Tree",
      "component": "Tree",
      "importPath": "primereact/tree",
      "props": {
        "value":              { "mapTo": "value" },
        "selectionMode":      { "mapTo": "selectionMode",      "optional": true },
        "selectionKeys":      { "mapTo": "selectionKeys",      "bindState": true, "optional": true },
        "onSelectionChange":  { "mapTo": "onSelectionChange",  "optional": true },
        "expandedKeys":       { "mapTo": "expandedKeys",       "bindState": true, "optional": true },
        "onToggle":           { "mapTo": "onToggle",           "optional": true },
        "filter":             { "mapTo": "filter",             "optional": true },
        "filterPlaceholder":  { "mapTo": "filterPlaceholder",  "optional": true },
        "nodeTemplate":       { "mapTo": "nodeTemplate",       "optional": true }
      },
      "variants": {
        "Selectable=single":   { "selectionMode": "single" },
        "Selectable=multiple": { "selectionMode": "multiple" },
        "Filter=true":         { "filter": true }
      }
    }
  ]
}

```

