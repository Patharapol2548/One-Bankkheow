# OneBankKheowStore — Back-End

REST API server for **OneBankKheow Store** (ITCS-223 needle shop project), built with Node.js + Express 5 and a MySQL database.

This service exposes endpoints for authentication (admin / customer), product browsing & admin CRUD, customer profiles, and a THB→CNY exchange-rate proxy.

---

## Tech Stack

- **Runtime:** Node.js (LTS) + npm
- **Framework:** Express `^5.2.1`
- **Database:** MySQL (driver: `mysql2 ^3.20.0`)
- **Other deps:** `dotenv`, `cors`, `axios`, `nodemon` (dev)

---

## Prerequisites

1. [Node.js](https://nodejs.org/) (LTS) and `npm` installed.
2. A running **MySQL** server you can connect to locally.
3. (Optional) An [ExchangeRate-API](https://www.exchangerate-api.com/) key for the `/products/exchange-rate` endpoint.

---

## Setup

### 1. Install dependencies

```bash
cd OneBankKheowStore-Back-End
npm install
```

### 2. Create the database & import the schema

In your MySQL client:

```sql
CREATE DATABASE itcs223_needleshop;
```

Then import the provided SQL dump (schema + seed data):

```bash
mysql -u root -p itcs223_needleshop < data/onebankkheow.sql
```

### 3. Create a `.env` file

The repo does **not** ship a `.env`. Create one in the project root with:

```
PORT=3100
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=<your-mysql-password>
DB_NAME=itcs223_needleshop
EXCHANGE_RATE_KEY=<your-exchangerate-api-key>
```

---

## Run

```bash
npm start
```

This runs `nodemon app.js` (auto-restart on file changes). On a successful boot you should see:

```
Server is running on port 3100
Connected DB: itcs223_needleshop
```

The server is now reachable at `http://localhost:3100`.

---

## API Endpoints

### Auth — `/auth`
- `POST /auth/admin/login` — admin login, returns JWT
- `POST /auth/customer/login` — customer login, returns JWT

### Products — `/products`
- `GET /products/search` — search / filter products
- `GET /products/exchange-rate` — current THB→CNY rate (uses `EXCHANGE_RATE_KEY`)
- `GET /products/recommend` — random recommended products
- `GET /products/:productID` — product detail
- **Admin (JWT required, `Authorization` header):**
  - `GET /products/admin`
  - `POST /products/admin`
  - `PUT /products/admin/:productID`
  - `DELETE /products/admin/:productID`

### User — `/user`
- `GET /user/profile/:cID` — customer profile (customer JWT required)
- `PUT /user/profile/:cID` — update customer profile (customer JWT required)

Any unmatched route returns `404 Service not found`.

---

## Extra Remarks, Bugs & Exceptions

- **`.env` is mandatory.** `src/config/db.js` calls `throw err` inside the MySQL connect callback — if the credentials are wrong or MySQL isn't running, the process **crashes immediately on startup**.
- **Missing `PORT`** ⇒ `app.listen(undefined, ...)` will log `Server is running on port undefined` and Node will pick a random free port. Always set `PORT` in `.env`.
- **Exchange rate** ⇒ `/products/exchange-rate` calls the external ExchangeRate-API; without a valid `EXCHANGE_RATE_KEY` it will return an error.
- **CORS is wide open** (`app.use(cors())`) — every origin is allowed. Acceptable for local dev with the front-end, **not** production-safe.
- **JWT format quirk** — The server expects the token in the `Authorization` header **without** the `Bearer` prefix (this matches what the front-end's `apiFetch` sends). Don't add `Bearer ` manually.
- **No tests.** `npm test` is a placeholder and exits with error.
- **Front-end pairing.** This API is intended to be consumed by the [OneBankKheowStore-Front-End](../OneBankKheowStore-Front-End/) repo, which hardcodes `API_BASE = "http://localhost:3100"`. Keep `PORT=3100` unless you also update the front-end.
- **Secrets in `.env`** — Never commit your `.env`. The DB password and ExchangeRate-API key live there.
