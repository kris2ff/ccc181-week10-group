# CCC181 Weeks 10-13: CampusConnect Login (Mobile-First Front End + Backend)

React + TypeScript starter for the Week 10 group activity. The page is already
built. Your group's job is the **mobile-first CSS** and the **GitHub teamwork**.

## How to run (both apps must run at the same time)

**Demo account:** `student@campusconnect.test` / `Campus26` (name: Demo Student)

**Terminal 1: the backend (http://localhost:3000)**

```bash
cd server
npm install
cp .env.example .env      # Windows: copy .env.example .env  (then edit the values)
npm start                 # prints "API running on http://localhost:3000"
```

**Terminal 2: the front end (http://localhost:5173), in the project root**

```bash
npm install
cp .env.example .env      # Windows: copy .env.example .env
npm run dev               # open the Local URL it prints
npm run dev:phone         # same, but your phone (same Wi-Fi) can open the Network URL
npm run build             # must finish with no errors before you submit
```

Settings files (the real `.env` files are never committed):

| File | Contents (fake values) |
| --- | --- |
| `.env.example` (root) | `VITE_API_URL=http://localhost:3000/api/v1` |
| `server/.env.example` | `PORT=3000`, `JWT_SECRET=change-this-to-a-long-random-text`, `CLIENT_ORIGIN=http://localhost:5173` |

## API summary

Full specification (including the events design): [docs/API-SPEC.md](docs/API-SPEC.md). Postman collection: `docs/postman/CampusConnect.postman_collection.json`.

| Method | Endpoint | Purpose | Success | Errors |
| --- | --- | --- | --- | --- |
| GET | `/api/v1/health` | Is the API running? | 200 | none |
| POST | `/api/v1/sessions` | Log in | 200 (token + user) | 400, 401 |
| GET | `/api/v1/users/me` | Current user (Bearer token) | 200 | 401 |

Screenshots for Part 2 in `screenshots/`: `postman-health.png`, `postman-login-200.png`, `postman-login-401.png`, `postman-me-401.png`, `login-fail-360.png`, `login-success-360.png`.

## Rules

- Edit only the CSS files in `src/styles/` (one member = one file). Do not edit `reset.css`.
- Plain CSS only. No Tailwind, Bootstrap, Material UI, styled-components, or any UI library.
- Phone styles first (no media query), then `min-width` queries only. Never `max-width`.
- Part 1: do not edit the `.tsx` files or rename classes. Part 2 allows `.tsx` edits, but keep class names.

## Group information (fill in)

| Item | Your answer |
| --- | --- |
| Group number | |
| Section | |
| Repository URL | |

## Members (each member fills in their own row in their own commit)

| Member | Name | GitHub username | CSS file | What I did in Part 1 | What I did in Part 2 |
| --- | --- | --- | --- | --- | --- |
| 1 (leader) | | | `base.css` | | backend: `POST /sessions` |
| 2 | | | `nav.css` | | backend: `GET /users/me`, 404/500, API-SPEC, Postman |
| 3 | | | `form.css` | | front end: `auth.ts`, states, Welcome screen, `auth.css` |

## Experiment 0: the page without the viewport tag

What did the page look like in DevTools phone mode **before** adding the viewport meta tag?
What changed **after** adding it?

> (write your answer here)

## DevTools test results

| Width | What must be true | Pass? |
| --- | --- | --- |
| 360 px | 1 column. Nav links stacked and 48px tall. Options and buttons stacked. Footer in 1 column. No sideways scrollbar. | |
| 768 px | Nav in one row (brand left, links right). Checkbox and link in one row. Two buttons side by side. | |
| 1024 px | Brand panel and login card side by side. Footer in 3 columns. Heading is larger. | |
| 1280 px | Content centered and stops at 1200px. | |

### Breakpoints I observed

Using **Show media queries** and dragging slowly from 360 px to 1280 px, the layout changed at these exact widths:

> (write the widths here, and say whether any width looked broken)

Screenshots are in `screenshots/` as `360.png`, `768.png`, `1024.png`, `1280.png`.

## What our group learned (leader writes this last)

> (write your answer here)
