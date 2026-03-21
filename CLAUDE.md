# CLAUDE.md — ds_spec

Инструкция для Claude Code при работе с этим репозиторием с мобильного.

## Что это

Pipeline: Figma → LLM → `page-spec.json` → Renderer → `.tsx` файлы.
Дизайнер работает строго через компоненты дизайн-системы.
Каждый компонент описан в `rules/`. Renderer детерминирован.

## Команды

```bash
cd renderer && npm install          # Установить зависимости renderer

# Валидировать page-spec
node renderer/src/index.js --validate examples/agents.json

# Генерировать страницу
node renderer/src/index.js --input examples/agents.json --out /tmp/out/

# Обновить rules-bundle для LLM (после изменений в rules/)
node scripts/build-rules-bundle.js
```

## Как добавить правило для нового компонента

1. Создай `rules/component-name.rules.json` по формату из `rules/README.md`
2. Проверь: `node renderer/src/validate-rules.js rules/component-name.rules.json`
3. Добавь пример использования в `examples/` или обнови существующий
4. Обнови `prompts/rules-bundle.md`: `node scripts/build-rules-bundle.js`

## Как создать page-spec для новой страницы

1. Скопируй `prompts/user-template.md`
2. Вставь данные из Figma MCP (get_design_context / get_metadata)
3. Вставь содержимое `prompts/rules-bundle.md`
4. Отправь в LLM с `prompts/system.md` как system prompt
5. Валидируй вывод: `node renderer/src/index.js --validate output.json`
6. Положи в `examples/page-name.json`

## Управление Issues с мобильного (через Claude)

- *"Покажи открытые задачи"* → Claude читает Issues через GitHub API
- *"Закрой issue #3"* → Claude закрывает через API
- *"Создай задачу: добавить правило для Accordion"* → Claude создаёт Issue с label `rules`
- *"Что сделано по рендереру?"* → Claude читает issue #4 и комментарии

## Структура репозитория

```
rules/          Маппинг Figma → React (по одному файлу на группу компонентов)
schema/         JSON Schema для page-spec и rules (валидация через AJV)
renderer/       Node.js CLI: page-spec.json → .tsx
  src/index.js          Основной генератор
  src/validate-rules.js Валидатор rules-файлов
prompts/        LLM инструкции
  system.md             Системный промпт
  user-template.md      Шаблон запроса
  rules-bundle.md       Автогенерируемый: все rules/ в одном файле
scripts/        Утилиты разработки
  build-rules-bundle.js Собирает rules-bundle.md
examples/       Готовые page-spec.json для реальных страниц
```

## Принципы

- **Правила — источник истины.** Renderer не знает ничего кроме rules/ и schema/.
- **LLM не придумывает классы.** Только то, что есть в rules/ и в schema.
- **100% покрытие достижимо.** Новый компонент → новое правило → 100% снова.
