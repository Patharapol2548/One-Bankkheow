# 🚀 How to Run OneBankKheow Store (Quick HR & Evaluator Guide)

Welcome! This guide is designed for **HR, interviewers, and evaluators** to get the **OneBankKheow Store** e-commerce project running in under **60 seconds** on any Windows machine.

---

## ⚡ Method 1: The 1-Click Launcher (Recommended)

No command line or technical setup required!

1. Make sure **Docker Desktop** is installed and open on your PC. *(If it's closed, the script will attempt to start it automatically).*
2. Double-click **`START.bat`** (or open the **`run/`** folder and double-click **`START.bat`**).
3. The script will:
   - ✅ Check Docker status
   - ✅ Spin up MySQL 8.0 database (auto-importing sample products, users, and orders)
   - ✅ Spin up the Node.js Express Backend API
   - ✅ Spin up the Web Frontend server
   - 🌐 **Automatically open your browser** to `http://localhost:5500/index.html`

When you are finished testing, simply double-click **`STOP.bat`** (or **`run/STOP.bat`**) to shut down all services cleanly.

---

## 🔑 Ready-to-Use Demo Accounts

You do not need to register a new account to test the system. The database is pre-loaded with sample accounts:

### 👤 Customer Login (Storefront)
* **Store URL:** [http://localhost:5500/index.html](http://localhost:5500/index.html)
* **Email:** `somchai@email.com`
* **Password:** `pwd001`
*(Alternative customer: `mali@email.com` / `pwd002`)*

### 🛡️ Admin Login (Management Portal)
* **Admin Portal URL:** [http://localhost:5500/admin-login.html](http://localhost:5500/admin-login.html)
* **Username:** `admin01`
* **Password:** `admin123`
*(Alternative admin: `admin02` / `admin123`)*

---

## 🎯 Features to Test & Explore

| Feature | Where to test | What to try |
| :--- | :--- | :--- |
| **Product Catalog & Search** | Storefront (`index.html`) | Filter needles by category, search by keyword, view live THB price. |
| **Real-time Currency Converter** | Product detail page | Switch currency between **THB (฿)** and **CNY (¥)** using live exchange rate API proxy. |
| **Shopping Cart** | `shopping-cart.html` | Add items, change quantities, view calculated total. |
| **Checkout Flow** | `checkout.html` | Select or add a shipping address and complete a purchase. |
| **User Profile & History** | `user-info.html` | View past order history and manage saved addresses. |
| **Admin Product CRUD** | `admin.html` | Add new needles, edit prices, update stock levels, and delete items. |

---

## 🛠️ Method 2: Manual Run (Without Docker)

If Docker Desktop is not installed, you can run the services using Node.js and local MySQL:

### 1. Prerequisites
- **Node.js** (v18+)
- **MySQL Server** (listening on port 3306)

### 2. Database Setup
Import the database dump into your MySQL server:
```bash
mysql -u root -p < OneBankKheowStore-Back-End-main/data/onebankkheow.sql
```
*(Ensure `.env` in `OneBankKheowStore-Back-End-main/` matches your MySQL root password).*

### 3. Start Backend & Frontend
Inside the **`run/`** folder:
- Double-click **`run/start-backend.bat`** (Starts Express API on `http://localhost:3100`)
- Double-click **`run/start-frontend.bat`** (Starts web server on `http://localhost:5500`)

---

## ❓ Frequently Asked Questions & Troubleshooting

### Q1: `START.bat` says "Docker Desktop is not currently running"
> **Solution:** Look at your Windows taskbar system tray (bottom-right). Open **Docker Desktop**, wait 15-30 seconds until the bottom-left icon shows a green indicator ("Engine running"), then run `START.bat` again.

### Q2: Port Conflict (Port 5500 or 3100 is in use)
> **Solution:** Ensure you don't have other web servers (like VS Code Live Server or previous node sessions) running on port 5500 or 3100. Close them and run `START.bat`.

### Q3: How do I completely stop everything?
> **Solution:** Double-click **`STOP.bat`**. This stops and removes all project containers safely.

---

*Project developed for ITCS-223 Web Programming Course — OneBankKheow Store.*

