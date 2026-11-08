# CampusConnect API Specification

Base URL (development): `http://localhost:3000/api/v1`
Format: JSON requests and responses. The API is **stateless**: a logged-in client sends its token on every request.

## 1. Required endpoints (fixed contract)

| Method | Endpoint | Purpose | Success | Errors |
| --- | --- | --- | --- | --- |
| GET | `/api/v1/health` | Checks that the API is running. | 200 OK | none |
| POST | `/api/v1/sessions` | Logs in (creates a session). | 200 OK | 400, 401 |
| GET | `/api/v1/users/me` | Returns the logged-in user. Needs a token. | 200 OK | 401 |

Any unknown address returns **404** `{ "error": "Not found." }`. An unexpected failure returns **500** `{ "error": "Something went wrong." }`. No response ever contains a password, a password hash or a stack trace.

### GET /api/v1/health

200 OK

```json
{ "status": "ok" }
```

### POST /api/v1/sessions

Request body:

```json
{ "email": "student@campusconnect.test", "password": "Campus26" }
```

200 OK: login succeeded

```json
{
  "token": "<a long token text>",
  "user": { "id": 1, "name": "Demo Student", "email": "student@campusconnect.test" }
}
```

400 Bad Request: email or password missing or badly formed

```json
{ "error": "Email and password are required." }
```

401 Not logged in: wrong password **or** unknown email (the same message for both, so attackers cannot learn which emails exist)

```json
{ "error": "Invalid email or password." }
```

The token is a JWT signed with `JWT_SECRET` and expires in 1 hour.

### GET /api/v1/users/me

Request header:

```
Authorization: Bearer <token>
```

200 OK

```json
{ "id": 1, "name": "Demo Student", "email": "student@campusconnect.test" }
```

401 Not logged in: token missing, wrong, or expired

```json
{ "error": "Not logged in." }
```

### Demo account

| Email | Password | Name |
| --- | --- | --- |
| student@campusconnect.test | Campus26 | Demo Student |

## 2. Events (design only)

Not built. Follows the Week 12 conventions: plural nouns, the method is the verb, filters in the query string, versioned address.

| Method | Endpoint | What it does | Success | Errors |
| --- | --- | --- | --- | --- |
| GET | `/api/v1/events` | List all events | 200 OK | none |
| GET | `/api/v1/events?month=11` | List only the events in November | 200 OK | 400 (month is not 1 to 12) |
| GET | `/api/v1/events/5` | Get one event | 200 OK | 404 (no such event) |
| POST | `/api/v1/events` | Add a new event | 201 Created | 400 (missing field), 401 |
| PATCH | `/api/v1/events/5` | Change only some fields of event 5 | 200 OK | 400, 401, 404 |
| DELETE | `/api/v1/events/5` | Remove event 5 | 204 No Content | 401, 404 |

Example event:

```json
{ "id": 5, "title": "CBIT Tech Talk", "date": "2026-11-20", "venue": "MSU-Naawan Gym", "organizer": "CBIT Student Council" }
```

Example `POST /api/v1/events` body (response is 201 with the saved event, including its new `id`):

```json
{ "title": "CBIT Tech Talk", "date": "2026-11-20", "venue": "MSU-Naawan Gym", "organizer": "CBIT Student Council" }
```

Example `PATCH /api/v1/events/5` body (only the fields that change):

```json
{ "venue": "Audio-Visual Room" }
```

Error example for a missing event (404): `{ "error": "Event not found." }`.
