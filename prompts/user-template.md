# User Prompt Template — Figma Node → PageSpec

Используй этот шаблон как сообщение пользователя при вызове LLM.
Заполни секции в `{{ }}`.

---

Сгенерируй `page-spec.json` для следующего Figma-макета.

## Данные из Figma

```
Figma Node ID: {{ NODE_ID }}

{{ ВСТАВЬ СЮДА ВЫВОД get_design_context / get_metadata из Figma MCP }}
```

## Выходной файл

```
file: {{ src/pages/PageName.tsx }}
route: {{ /page-route }}
title: {{ Название страницы }}
```

## Доступные правила

{{ ВСТАВЬ СОДЕРЖИМОЕ ВСЕХ ФАЙЛОВ ИЗ rules/ }}

## Схема валидации

{{ ВСТАВЬ СОДЕРЖИМОЕ schema/page-spec.schema.json }}

## Требования

- Покрой все видимые компоненты на макете.
- Для колонки статуса используй `StatusBadge` с маппингом из `status-badge.rules.json`.
- Кнопки тулбара — строго по `button.rules.json`.
- Все инпуты фильтрации — по `input.rules.json`.
- Если компонент не найден в правилах — добавь `_comment` с описанием, что нужно добавить.

Верни только JSON, без markdown-обёрток.
