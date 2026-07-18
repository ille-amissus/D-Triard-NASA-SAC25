# API Reference

Base URL for local development:

```text
http://127.0.0.1:8000
```

## Signup

```http
POST /api/signup/
Content-Type: application/json
```

Request:

```json
{
  "username": "planner",
  "password": "secret123"
}
```

Success:

```json
{
  "message": "Signup successful!",
  "user_id": 1
}
```

## Login

```http
POST /api/login/
Content-Type: application/json
```

Request:

```json
{
  "username": "planner",
  "password": "secret123"
}
```

Success:

```json
{
  "message": "Login successful",
  "user_id": 1,
  "username": "planner"
}
```

## Logout

```http
GET /api/logout/
```

Success:

```json
{
  "message": "Logged out"
}
```

## Climatology

```http
GET /api/climatology/?city=Sakarya&month=7&day=15
```

Success:

```json
{
  "city": "Sakarya",
  "month": 7,
  "day": 15,
  "rain": 0.76,
  "temp": 24.5,
  "humidity": 68.1,
  "wind": 2.4,
  "rain_prob": 0.31
}
```

Validation errors return `400`. External geocoding or NASA POWER errors return `502`.

## Save Event

Requires a logged-in session.

```http
POST /api/events/
Content-Type: application/json
```

Request:

```json
{
  "name": "Campus Picnic",
  "details": "Outdoor student event",
  "city": "Sakarya",
  "date": "2026-08-12",
  "probability": 0.2
}
```

Success:

```json
{
  "status": "success",
  "message": "Event 'Campus Picnic' saved successfully!",
  "event_id": 1
}
```

## List Events

Requires a logged-in session.

```http
GET /api/events/
```

Success:

```json
{
  "events": [
    {
      "id": 1,
      "name": "Campus Picnic",
      "details": "Outdoor student event",
      "city": "Sakarya",
      "date": "2026-08-12",
      "probability": 0.2,
      "created_at": "2026-07-18T12:00:00Z"
    }
  ]
}
```
