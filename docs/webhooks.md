# Webhook Integration — Founding Review Completion

## Назначение

Этот webhook используется для уведомления внешних B2B-систем
о завершении процедуры **Founding Review** и готовности результата (PDF).

Webhook предназначен для:
- SaaS-интеграций
- CRM / internal tools
- автоматических workflow

---

## Когда отправляется webhook

Webhook отправляется **один раз** при успешном завершении рендера PDF.

Событие:
render.completed

yaml
Копировать код

---

## HTTP Request

### Method
POST

shell
Копировать код

### Headers
Content-Type: application/json
X-Webhook-Signature: <hex hmac sha256>
X-Webhook-Attempt: <1..5>

yaml
Копировать код

- `X-Webhook-Signature` — HMAC-подпись тела запроса
- `X-Webhook-Attempt` — номер попытки доставки

---

## Payload (Body)

```json
{
  "event": "render.completed",
  "assessment_id": "FR-20260109-123456",
  "status": "completed",
  "timestamp": "2026-01-09T05:38:01.449Z"
}
Поля
Поле	Тип	Описание
event	string	Тип события
assessment_id	string	Уникальный ID оценки
status	string	Статус завершения
timestamp	string (ISO)	Время события

Безопасность (Webhook Verification)
Webhook подписывается с помощью HMAC-SHA256.

Секрет
Каждому клиенту выдаётся общий секрет:

nginx
Копировать код
WEBHOOK_SECRET
Секрет:

хранится только на сервере клиента

не передаётся в frontend

не логируется

Алгоритм проверки подписи
Взять raw body HTTP-запроса (байт-в-байт)

Посчитать:

ini
Копировать код
expected = HMAC_SHA256(raw_body, WEBHOOK_SECRET)
Сравнить с X-Webhook-Signature

Использовать timing-safe comparison

Если подпись не совпадает — запрос должен быть отклонён.

Retry & Delivery Semantics
Webhook доставляется с retry (до 5 попыток)

Используется exponential backoff

Если сервер клиента отвечает:

2xx → доставка считается успешной

>=400 или timeout → будет повтор

Заголовок X-Webhook-Attempt показывает номер попытки.

Рекомендации для клиентов
Идемпотентность

Использовать (assessment_id + event) как уникальный ключ

Повторные события не должны ломать логику

Быстрый ответ

Возвращать 200 OK как можно быстрее

Тяжёлую обработку делать асинхронно

Логирование

Рекомендуется логировать:

payload

signature

timestamp

attempt

Контакт
Если у вас возникли вопросы по интеграции —
обратитесь к техническому контакту, предоставив assessment_id.

