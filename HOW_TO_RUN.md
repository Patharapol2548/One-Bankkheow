# 🚀 How to Run OneBankKheow Store — Complete Guide

Welcome! This guide provides everything you need to run and test the **OneBankKheow Store** on your own computer, whether you prefer an **automated 1-click launch** or a **step-by-step manual setup**.

---

## 📌 Project Overview: What is OneBankKheow Store?

**OneBankKheow Store** is a full-stack e-commerce web application developed for the ITCS-223 Web Programming course. It simulates an online retail store specializing in handicraft, sewing, and embroidery needles.

* **Client Storefront (Frontend):** Pure HTML5, CSS3, and Vanilla JavaScript (no bundler/build step required). Features product filtering, real-time THB→CNY currency conversion, shopping cart management, multi-address checkout flow, and customer order history.
* **REST API Server (Backend):** Built with Node.js and Express 5, connecting to a MySQL 8.0 relational database via the `mysql2` driver. Provides JWT authentication, product catalog filters, an external exchange-rate proxy, and administrative CRUD operations.
* **Database:** Pre-seeded MySQL database (`itcs223_store`) containing sample needle products, customer profiles, and administrator credentials.

---

## ⚡ Method 1: The 1-Click Automated Launch (Recommended)

This method uses **Docker Compose** to automatically start MySQL, the Backend API, and the Web Frontend together in isolated containers with zero manual configuration.

### Steps:
1. Ensure **Docker Desktop** is installed and running on your computer.
2. Double-click **`START.bat`** in the project root folder (or inside the **`run/`** folder: **`run\START.bat`**).
3. The script will:
   - Check if Docker is running (or prompt to start Docker Desktop).
   - Automatically build and launch the MySQL database, Backend API, and Frontend containers.
   - Auto-seed the database with sample products and demo users.
   - **Automatically open your default browser** to [http://localhost:5500/index.html](http://localhost:5500/index.html).

### To Stop:
When you are finished testing, simply double-click **`STOP.bat`** (or **`run\STOP.bat`**) to cleanly shut down all services.

---

## 🛠️ Method 2: Step-by-Step Manual Run (Node.js & MySQL)

If you prefer running without Docker, follow this summarized guide from the Backend and Frontend setups:

### 📋 Prerequisites
1. **Node.js** (v18 or newer) and `npm` installed.
2. A running local **MySQL Server** (default port `3306`).
3. A modern web browser (Chrome, Edge, Firefox).

---

### Step 1: Database Setup
Import the provided SQL dump (schema + sample data) into your MySQL server:

1. Open your terminal or MySQL command line client.
2. Import the dump file:
   ```bash
   mysql -u root -p < OneBankKheowStore-Back-End-main/data/onebankkheow.sql
   ```
   *(This creates the database `itcs223_store` and populates all initial tables, products, and accounts).*

---

### Step 2: Backend API Setup (`OneBankKheowStore-Back-End-main`)
The backend is an Express 5 REST API running on port `3100`.

1. Open a terminal and navigate to the backend folder:
   ```bash
   cd OneBankKheowStore-Back-End-main
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Verify your `.env` configuration file in `OneBankKheowStore-Back-End-main/.env`:
   ```env
   PORT=3100
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=rootpassword
   DB_NAME=itcs223_store
   EXCHANGE_RATE_KEY=
   ```
   *(Update `DB_PASSWORD` and `DB_USER` if your local MySQL credentials differ).*
4. Start the backend server:
   ```bash
   npm start
   ```
   *(Or simply run `node app.js`). You should see: `Server is running on port 3100` and `Connected DB: itcs223_store`.*
5. The API is now listening at: **`http://localhost:3100`**.

> 💡 **Shortcut:** You can also simply double-click **`run\start-backend.bat`** to do this in one click.

---

### Step 3: Frontend Web Setup (`OneBankKheowStore-Front-End-main`)
The frontend is a static web application located in `OneBankKheowStore-Front-End-main/html`. There is **no build step** and **no `npm install` needed**.

Because modern browsers block `fetch()` API calls when opening files directly via `file://`, serve the `html` folder with any local web server:

* **Option A — 1-Click Batch (Easiest):**
  Double-click **`run\start-frontend.bat`** (serves on port 5500 and opens browser).
* **Option B — VS Code Live Server:**
  Open `OneBankKheowStore-Front-End-main/html/index.html` in VS Code, right-click, and select **"Open with Live Server"**.
* **Option C — Node `serve`:**
  ```bash
  npx serve OneBankKheowStore-Front-End-main/html -l 5500
  ```
* **Option D — Python HTTP Server:**
  ```bash
  python -m http.server 5500 --directory OneBankKheowStore-Front-End-main/html
  ```

Open your browser to: **`http://localhost:5500/index.html`**.

---

## 🔑 Pre-Configured Demo Accounts

You can test all application features immediately using these pre-seeded database accounts:

### 👤 Customer Login (Storefront)
* **Login URL:** [http://localhost:5500/login-page.html](http://localhost:5500/login-page.html)
* **Email:** `somchai@email.com`
* **Password:** `pwd001`
*(Secondary Customer: `mali@email.com` / `pwd002`)*

### 🛡️ Admin Login (Management Portal)
* **Login URL:** [http://localhost:5500/admin-login.html](http://localhost:5500/admin-login.html)
* **Username:** `admin01`
* **Password:** `admin123`
*(Secondary Admin: `admin02` / `admin123`)*

---

## 🧭 Application Pages & Features to Test

| Page Name | File / URL | What to Test |
| :--- | :--- | :--- |
| **Homepage & Catalog** | `index.html` | Browse needles by category, search by keyword, view prices. |
| **Product Detail** | `product-information.html` | Inspect specifications, test live THB→CNY currency exchange conversion. |
| **Shopping Cart** | `shopping-cart.html` | Add items to cart, modify quantities, review order total calculation. |
| **Checkout Flow** | `checkout.html` | Select an existing delivery address or enter a new shipping address. |
| **Customer Profile** | `user-info.html` | View account details, past order records, and saved addresses. |
| **Admin Dashboard** | `admin.html` | Protected inventory manager: Add needles, edit pricing/stock, delete products. |
| **Team Credits** | `our-team.html` | Project team member introduction and course credits. |

---

## ❓ Frequently Asked Questions & Troubleshooting

### 1. `START.bat` says "Docker Desktop is not currently running"
* Look at your Windows taskbar system tray (bottom-right). Open **Docker Desktop** and wait until the engine status icon turns green ("Engine running"), then run `START.bat` again.

### 2. Backend fails to start with database error
* Ensure your MySQL server is running on port 3306 (or container port 3307 if using Docker) and that the database `itcs223_store` has been created and imported from `OneBankKheowStore-Back-End-main/data/onebankkheow.sql`.
* Verify that the credentials in `OneBankKheowStore-Back-End-main/.env` match your MySQL root password.

### 3. Port Conflict (5500, 3100, or 3306/3307 is already in use)
* Close any previously running Node processes, VS Code Live Server instances, or local MySQL services occupying those ports before starting.

### 4. How do I stop all background services?
* If launched with Docker: double-click **`STOP.bat`** (or **`run\STOP.bat`**).
* If launched manually: press `Ctrl + C` in the terminal windows running the backend and frontend servers.

---
*OneBankKheow Store — ITCS-223 Web Programming Project.*
