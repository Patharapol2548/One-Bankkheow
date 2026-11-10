# 🪡 OneBankKheow Store — Full-Stack E-Commerce Web Application

[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-lightgrey.svg)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue.svg)](https://www.mysql.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg)](https://www.docker.com/)

**OneBankKheow Store (วันแบงก์เขียว)** is an end-to-end e-commerce web application developed for the **ITCS223 Introduction to Web Development** course across **Project Phase I & Phase II**.

The platform is inspired by Thailand's popular **"20 Baht Shop" (ร้านทุกอย่าง 20 บาท)** model, symbolized by the iconic green 20-Baht banknote (*"แบงก์เขียว"*). Traditionally operating as local neighborhood brick-and-mortar stores offering affordable daily items, household goods, and craft accessories, this project transforms that cultural retail concept into a modern, centralized digital shopping platform.

---

## 📑 Official Project Reports & Documentation

The complete course documentation submitted for the project is available in the repository:

* 📄 [**Phase I Summary Report (`docs/Sec1-Gr04-PJ1-summary.pdf`)**](docs/Sec1-Gr04-PJ1-summary.pdf)
  * *Business Domain, Initial Wireframes, and Relational ER Data Model & Data Dictionary.*
* 📄 [**Phase II Comprehensive Report (`docs/Sec1-Gr04-PJ2-report.pdf`)**](docs/Sec1-Gr04-PJ2-report.pdf)
  * *4-Tier Navigation Architecture, JavaScript Component Implementations (17 views), REST Web Services (Dynamic SQL & Exchange Rate Proxy), and 9 Postman API Test Cases.*

---

## 👥 Academic Course & Project Team

* **Course:** ITCS223 Introduction to Web Development (Faculty of ICT, Mahidol University)
* **Project Phases:** Phase I (Summary & Architecture) & Phase II (Implementation & Testing)
* **Group:** Section 1, Group 04

### Team Members (Submitted by):
| Student ID | Full Name |
| :--- | :--- |
| `6788011` | Patharapol Chaisrithong |
| `6788016` | Siraphat Chen |
| `6788091` | Peerawat Pojlertarun |
| `6788117` | Pasit Sugrivaka |
| `6788185` | Daranpob Sianghen |

### Instructors (Presented to):
* **Lect. Dr. Wudhichart Sawangphol**
* **Asst. Prof. Dr. Jidapa Kraisangka**

---

## 🎯 Project Overview & Business Domain

Our platform is centered on transforming the **"20 Baht Shop"** into a digital storefront that maintains the fixed-price affordability and community accessibility of traditional stores while scaling for modern e-commerce.

### Key Functional Pillars:
1. **Product Discovery & Catalog**
   - Category filtering across sewing, embroidery, beading, leatherwork, and tapestry accessories.
   - Live keyword search across product names, brands, and descriptions.
   - Interactive product display cards with specifications and recommendations.
2. **Real-time Currency Conversion**
   - Built-in backend proxy endpoint (`/products/exchange-rate`) querying live foreign exchange rates via ExchangeRate-API.
   - Seamless dynamic price conversion between **Thai Baht (THB ฿)** and **Chinese Yuan (CNY ¥)** directly on product detail and cart views.
3. **Customer Shopping Flow & Session State**
   - Dynamic shopping cart with quantity adjustments and real-time total calculations.
   - Multi-address checkout flow and customer order history tracking.
   - Token-based customer sessions saved in browser `localStorage`.
4. **Administrative Inventory Management (CRUD)**
   - Dedicated admin portal (`admin-login.html` & `admin.html`) secured via token authentication.
   - Full product lifecycle control: add new products, update stock levels, modify descriptions, and delete obsolete inventory.

---

## 🗺️ 4-Tier Navigation Architecture

*(Detailed in Phase II Report, Page 2)*

The application is structured into four distinct functional tiers, with a static credits page accessible globally from the footer:

```text
┌────────────────────────────────────────────────────────────────────────┐
│ 1. Public-Guest Area                                                   │
│    • index.html (Landing page with category icons & recommended items) │
│    • webpage.html (Full product catalog & filter search)               │
│    • product-information.html (Guest product detail view)              │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                         Login / Register Trigger
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 2. Authentication Area                                                 │
│    • login-page.html (Customer login form)                             │
│    • register-page.html (Customer registration form)                   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                         Authentication Success
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 3. Logged-in Customer Area                                             │
│    • webpage-login.html (Catalog with active session navbar)           │
│    • product-information-login.html (Product detail + Add to Cart)     │
│    • shopping-cart.html (Cart items review & promo code)               │
│    • checkout.html (Billing, payment method, shipping review)          │
│    • checkout-change-address.html (Select delivery destination)        │
│    • checkout-add-address.html (Add new shipping address)              │
│    • checkout-success.html (Confirmation & order receipt)              │
│    • user-info.html (Profile management & order history)               │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│ 4. Admin Console (Protected Tier)                                      │
│    • admin-login.html (Administrative credentials verification)        │
│    • admin.html (Main inventory management dashboard)                  │
│    • admin-edit.html (Create new product / Edit existing product)      │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│ Global Static Page: our-team.html (Reachable via footer across all)    │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 📊 Relational Data Model & Data Dictionary

*(From Project Report Phase I Pages 4–8 & Phase II Schema)*

```text
  ┌───────────────┐           ┌───────────────┐           ┌───────────────┐
  │   Customer    │1        M │    Orders     │1        M │    Payment    │
  │───────────────┼───────────┼───────────────┼───────────┼───────────────┤
  │ cID (PK)      │           │ orderID (PK)  │           │ pmID (PK)     │
  │ phoneNo       │           │ cID (FK)      │           │ orderID (FK)  │
  │ cEmail        │           │ orderName     │           │ pmDate        │
  │ cPassword     │           │ orderDate     │           │ pmName        │
  │ cAddress      │           │ orderStatus   │           │ pmStatus      │
  │ cFirstName    │           └───────┬───────┘           │ pmAmount      │
  │ cLastName     │                   │ 1                 │ Method        │
  │ cGender       │                   │                   │ (PromptPay/   │
  │ cBirthDate    │                   │ M                 │  Card/True)   │
  │ cPicture      │           ┌───────┴───────┐           └───────────────┘
  └───────────────┘           │   Delivery    │
                              │───────────────┤
                              │ trackNum (PK) │
                              │ orderID (FK)  │
                              │ deliStatus    │
                              │ deliAddr      │
                              └───────────────┘

  ┌───────────────┐           ┌───────────────┐           ┌────────────────┐
  │     Admin     │1        M │    Product    │           │ AdminLoginInfo │
  │───────────────┼───────────┼───────────────┤           │────────────────┤
  │ adminID (PK)  │           │ productID(PK) │           │ userName (PK)  │
  │ Fname, Lname  │           │ adminID (FK)  │           │ password       │
  │ birthdate     │           │ productName   │           │ loginLog       │
  │ phoneNo       │           │ productAmount │           └────────────────┘
  │ Address       │           │ productImage  │
  └───────────────┘           │ productBrand  │
                              │ productDetail │
                              └───────────────┘
```

---

## 🧪 Web Services & Postman Test Verification (Phase II)

The backend Express 5 REST API was verified across 9 test suites documented in Phase II:

| Test Case | Method | Endpoint / Test Description | Expected Result |
| :--- | :--- | :--- | :--- |
| **TC 1** | `GET` | `/products/search` (no criteria) | Returns all available products |
| **TC 2** | `GET` | `/products/search?name=Pen&brand=Double&category=Stationery` | Dynamic multi-criteria SQL filtering |
| **TC 3** | `GET` | `/products/P00002` | Returns full product details for specific ID |
| **TC 4** | `GET` | `/products/P99999` | Correct `404 Product not found` error response |
| **TC 5** | `GET` | `/products/admin/` (Header: `Authorization: supersecret`) | Returns full inventory with admin attributes |
| **TC 6** | `GET` | `/products/admin/:productID` | Fetch product for admin edit preloading |
| **TC 7** | `POST`| `/products/admin/` | Inserts new product record into database |
| **TC 8** | `PUT` | `/products/admin/:productID` | Updates existing product name, stock, details |
| **TC 9** | `DELETE`| `/products/admin/:productID` | Removes product from database |

---

## 🏗️ System Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                       Client Browser                        │
│                 http://localhost:5500/                      │
│            (HTML5 / Tailwind CSS / Vanilla JS)              │
└──────────────┬──────────────────────────────▲───────────────┘
               │                              │
               │ REST API Calls               │ JSON Responses
               ▼                              │
┌─────────────────────────────────────────────┴───────────────┐
│                    Backend API Server                       │
│                 http://localhost:3100/                      │
│              (Node.js + Express 5 Router)                   │
├──────────────────────────────┬──────────────────────────────┤
│  • Auth & Session Controller │  • Product Catalog Controller│
│  • Order & Profile Handling  │  • THB/CNY Exchange Proxy    │
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

## 🚀 How to Run the Project

You can run the project using either the **Automated 1-Click Launch** (recommended for evaluators) or the **Manual Step-by-Step Setup**.

### ⚡ Option 1: 1-Click Automated Launch (Docker — Recommended)

No manual database setup or dependency installation required!

1. Open **Docker Desktop** on your computer.
2. Double-click **`START.bat`** in this folder (or **`run\START.bat`**).
3. The script will:
   - Verify Docker engine is running.
   - Build and start MySQL 8.0, the Express backend, and the frontend server.
   - Automatically initialize and seed the `itcs223_store` database.
   - **Open your browser** to [http://localhost:5500/index.html](http://localhost:5500/index.html).
4. When finished, double-click **`STOP.bat`** (or **`run\STOP.bat`**) to cleanly shut down all containers.

> 📖 For a quick checklist and testing guide, see [HOW_TO_RUN.md](HOW_TO_RUN.md).

---

### 🛠️ Option 2: Step-by-Step Manual Setup (Node.js & MySQL)

#### Prerequisites
- **Node.js** (v18+) and `npm`
- **MySQL Server** (listening on default port `3306`)
- Modern web browser

#### 1. Setup Database
Import the schema and initial seed data into your MySQL server:
```bash
mysql -u root -p < OneBankKheowStore-Back-End-main/data/onebankkheow.sql
```
*(This automatically creates the `itcs223_store` database with demo products and accounts).*

#### 2. Start Backend API
```bash
cd OneBankKheowStore-Back-End-main
npm install
npm start
```
* The backend API server starts at: **`http://localhost:3100`**.
* Database settings are configured in `OneBankKheowStore-Back-End-main/.env`.
* *(Shortcut: you can also run **`run\start-backend.bat`**).*

#### 3. Start Frontend Web Server
The frontend is pure static HTML/CSS/JS (no build step or `npm install` needed). Serve the `html` folder using any static server:
```bash
# Using npx serve:
npx serve OneBankKheowStore-Front-End-main/html -l 5500

# OR using Python:
python -m http.server 5500 --directory OneBankKheowStore-Front-End-main/html
```
* *(Shortcut: you can also run **`run\start-frontend.bat`** or use VS Code **Live Server** on `html/index.html`).*
* Open your browser to: **`http://localhost:5500/index.html`**.

---

## 🔑 Pre-Configured Demo Accounts

You can test all user roles using these pre-seeded accounts:

| Role | Login Page | Username / Email | Password | Access Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| **Customer** | [`login-page.html`](http://localhost:5500/login-page.html) | `somchai@email.com` | `pwd001` | Shopping cart, address management, checkout, order history |
| **Customer (Alt)** | [`login-page.html`](http://localhost:5500/login-page.html) | `mali@email.com` | `pwd002` | Secondary customer account |
| **Admin** | [`admin-login.html`](http://localhost:5500/admin-login.html) | `admin01` | `admin123` | Full inventory CRUD: create, edit, delete, stock update |
| **Admin (Alt)** | [`admin-login.html`](http://localhost:5500/admin-login.html) | `admin02` | `admin123` | Secondary administrative account |

---

## 📁 Repository Structure

```text
One-Bankkheow/
├── run/                             # Centralized launch and management scripts
│   ├── START.bat                    # 1-Click launcher (Docker)
│   ├── STOP.bat                     # 1-Click shutdown (Docker)
│   ├── start-backend.bat            # Local backend launcher
│   ├── start-frontend.bat           # Local frontend launcher
│   ├── docker-run.bat               # Direct docker-compose run
│   └── docker-stop.bat              # Direct docker-compose stop
├── START.bat                        # Root shortcut to run/START.bat
├── STOP.bat                         # Root shortcut to run/STOP.bat
├── HOW_TO_RUN.md                    # Detailed guide for evaluators & developers
├── README.md                        # Master project documentation
├── docker-compose.yml               # Multi-container orchestration (MySQL, Node, Nginx)
├── docs/                            # Project documentation & summary reports
│   ├── index.html                   # Showcase presentation & guide webpage
│   ├── Sec1-Gr04-PJ1-summary.pdf    # Course Project Phase I Summary Report
│   └── Sec1-Gr04-PJ2-report.pdf     # Course Project Phase II Comprehensive Report
├── OneBankKheowStore-Back-End-main/ # Express 5 REST API + MySQL schema
│   ├── src/                         # Controllers, routes, DB configuration
│   ├── data/onebankkheow.sql        # Database schema and seed data
│   ├── .env                         # Server environment configuration
│   └── app.js                       # Express application entry point
└── OneBankKheowStore-Front-End-main/# Pure HTML/CSS/Vanilla JS storefront
    └── html/                        # Static web pages, styles, and scripts
```

---

## 👥 Course Credits & Project Attribution
* **Course:** ITCS223 Introduction to Web Development
* **Institution:** Faculty of Information and Communication Technology, Mahidol University
* **Section 1, Group 04 Team:**
  * Patharapol Chaisrithong (6788011)
  * Siraphat Chen (6788016)
  * Peerawat Pojlertarun (6788091)
  * Pasit Sugrivaka (6788117)
  * Daranpob Sianghen (6788185)
* **Instructors:** Lect. Dr. Wudhichart Sawangphol, Asst. Prof. Dr. Jidapa Kraisangka
