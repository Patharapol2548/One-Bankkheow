# 🪡 OneBankKheow Store — Full-Stack E-Commerce Web Application

[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-lightgrey.svg)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue.svg)](https://www.mysql.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg)](https://www.docker.com/)

**OneBankKheow Store** is a full-featured online retail store application developed for specialized sewing and craft needles (ITCS-223 Web Programming project). It features a responsive customer shopping storefront, user profile and order tracking, real-time THB→CNY currency exchange proxy, and a protected administrative inventory management dashboard.

---

## ⚡ Quick Start for HR & Reviewers (1-Click Run)

If you are an evaluator, hiring manager, or HR reviewing this project, you can launch the entire stack in **one step**:

1. Ensure **Docker Desktop** is running on your machine.
2. Double-click **`START.bat`** in this folder.
3. Your default browser will automatically open:
   - 🛍️ **Customer Storefront:** [http://localhost:5500/index.html](http://localhost:5500/index.html)
   - 🛡️ **Admin Portal:** [http://localhost:5500/admin-login.html](http://localhost:5500/admin-login.html)
4. When you are done evaluating, double-click **`STOP.bat`** to cleanly turn off all containers.

> 📖 **Need a quick 1-page guide?** Check out [HOW_TO_RUN.md](HOW_TO_RUN.md).

---

## 🔑 Pre-Configured Demo Credentials

The database automatically initializes with sample accounts ready for immediate testing:

| Role | Login URL | Email / Username | Password | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Customer** | [`login-page.html`](http://localhost:5500/login-page.html) | `somchai@email.com` | `pwd001` | Sample customer with addresses & orders |
| **Customer (Alt)** | [`login-page.html`](http://localhost:5500/login-page.html) | `mali@email.com` | `pwd002` | Secondary sample customer |
| **Admin** | [`admin-login.html`](http://localhost:5500/admin-login.html) | `admin01` | `admin123` | Full inventory & product CRUD access |
| **Admin (Alt)** | [`admin-login.html`](http://localhost:5500/admin-login.html) | `admin02` | `admin123` | Secondary administrative account |

---

## 🏗️ System Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                       Client Browser                        │
│                 http://localhost:5500/                      │
│            (HTML5 / Tailwind CSS / Vanilla JS)              │
└──────────────┬──────────────────────────────▲───────────────┘
               │                              │
               │ REST API Calls               │ Responses
               ▼                              │
┌─────────────────────────────────────────────┴───────────────┐
│                    Backend API Server                       │
│                 http://localhost:3100/                      │
│              (Node.js + Express 5 Router)                   │
├──────────────────────────────┬──────────────────────────────┤
│  • Auth & Session Controller │  • Product Catalog Controller│
│  • Order & Cart Processing   │  • THB/CNY Exchange Proxy    │
└──────────────┬───────────────┴──────────────────────────────┘
               │
               │ SQL Queries (Port 3306 / 3307)
               ▼
┌─────────────────────────────────────────────────────────────┐
│                      MySQL Database                         │
│               Database: itcs223_store                       │
│        (Auto-seeded via onebankkheow.sql dump)              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 What's Inside the Stack

* **Frontend (`/OneBankKheowStore-Front-End-main`)**:
  * Static web client served via Nginx (Docker) or static Node server (`serve`).
  * Features: Product catalog, keyword search, category filtering, shopping cart, multi-address checkout, order tracking, admin CRUD.
  * Centralized configuration in `html/js/config.js`.

* **Backend (`/OneBankKheowStore-Back-End-main`)**:
  * REST API server powered by Express 5 and `mysql2`.
  * Modular routing:
    * `/user` — Customer authentication and profile management.
    * `/products` — Product queries, catalog filters, and currency exchange endpoint.
    * `/admin` — Admin credentials verification and inventory CRUD operations.

* **Database (`/OneBankKheowStore-Back-End-main/data/onebankkheow.sql`)**:
  * MySQL 8.0 schema and seed dataset containing pre-populated products, customer records, and admin users.

* **Launch & Control Scripts (in `/run`)**:
  * `START.bat` (and `run/START.bat`): Master 1-click launcher with auto-detection for Docker Desktop.
  * `STOP.bat` (and `run/STOP.bat`): 1-click clean container shutdown.
  * `run/start-backend.bat`: Standalone local backend launcher.
  * `run/start-frontend.bat`: Standalone local frontend launcher.
  * `run/docker-run.bat` & `run/docker-stop.bat`: Direct docker-compose scripts.

---

## 🌐 Deploying to GitHub Pages (`github.io`) vs Cloud

### Can the app run 100% on GitHub Pages?
**No, not directly by itself.** Here is why:
- **GitHub Pages** only hosts **static files** (HTML, CSS, JavaScript).
- This application requires a **Node.js Express backend** and a **MySQL database** to process user login, save cart items, manage checkout, and handle admin operations.
- If you deploy just the frontend files to GitHub Pages without a cloud database and backend, all API calls to `http://localhost:3100` will fail for remote visitors.

### Recommended Approaches:

#### Option 1: Use GitHub Pages as an Interactive Portfolio Showcase (Included!)
Use GitHub Pages to showcase project screenshots, architecture diagrams, video demonstrations, and step-by-step instructions for recruiters to run locally.
- A ready-to-publish showcase webpage is provided in the **`docs/`** directory.
- Simply go to your repository **Settings > Pages > Source**, select branch `main` and folder `/docs`, and click **Save**.
- Your site will be live at `https://<your-username>.github.io/One-Bankkheow/`!

#### Option 2: Full Live Cloud Deployment (If you want remote live testing)
If you want anyone to test the actual functional store online without downloading anything:
1. **Database:** Deploy the MySQL dump to a free managed MySQL service (e.g., [Railway](https://railway.app), [TiDB Cloud](https://tidbcloud.com), or [Aiven](https://aiven.io)).
2. **Backend:** Deploy `OneBankKheowStore-Back-End-main` to [Render](https://render.com) or [Railway](https://railway.app) and set the DB environment variables.
3. **Frontend:** Update `API_BASE` in `html/js/config.js` to your live backend URL (e.g. `https://my-backend.onrender.com`), and deploy the frontend to **GitHub Pages** or **Vercel**.

---

## 🛠️ Manual Development Setup (Without Docker)

If you prefer running services directly on your host machine:

### 1. Database
```bash
mysql -u root -p < OneBankKheowStore-Back-End-main/data/onebankkheow.sql
```

### 2. Backend
```bash
cd OneBankKheowStore-Back-End-main
npm install
npm start
```
*Backend runs on `http://localhost:3100`.*

### 3. Frontend
```bash
cd OneBankKheowStore-Front-End-main/html
npx serve . -l 5500
```
*Frontend runs on `http://localhost:5500/index.html`.*

---

## 📄 License & Attribution
Developed for ITCS-223 Web Programming Course. Created by the OneBankKheow development team.

