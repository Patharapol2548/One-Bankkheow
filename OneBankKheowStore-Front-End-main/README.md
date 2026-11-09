# OneBankKheowStore — Front-End

Static HTML / CSS / vanilla-JavaScript storefront for **OneBankKheow Store** (ITCS-223 needle shop project). It consumes the REST API served by the companion repo [OneBankKheowStore-Back-End](../OneBankKheowStore-Back-End/).

There is **no build step** and **no `package.json`** — just open / serve the `html/` folder.

---

## Tech Stack

- HTML5, CSS3
- Vanilla JavaScript (no framework, no bundler)
- Browser `fetch()` for API calls

---

## Prerequisites

1. A modern browser (Chrome, Edge, Firefox).
2. The **back-end API must be running** at `http://localhost:3100`. See [OneBankKheowStore-Back-End/README.md](../OneBankKheowStore-Back-End/README.md).

---

## How to Run / Serve

The site is fully static — pick any of the options below.

### Option A — VS Code Live Server (recommended)
1. Open the repo in VS Code.
2. Install the *Live Server* extension if you don't have it.
3. Right-click `html/index.html` → **Open with Live Server**.

### Option B — Any static server

```bash
npx live-server html
```

or with Python:

```bash
python -m http.server 5500 --directory html
```

Then open `http://localhost:5500/index.html` in your browser.

> Opening `index.html` directly via `file://` may load the page, but some browsers block `fetch()` calls from the `file://` origin — **prefer a local web server**.

---

## Entry Points

| Page | File |
|------|------|
| Public homepage | `html/index.html` |
| Customer login | `html/login-page.html` |
| Customer register | `html/register-page.html` |
| Admin login | `html/admin-login.html` |
| Admin dashboard | `html/admin.html` |
| Product detail | `html/product-information.html` |
| Cart / Checkout | `html/shopping-cart.html`, `html/checkout.html` |
| Team page | `html/our-team.html` |

---

## Configuration

The back-end URL is **hardcoded** in `html/js/config.js`:

```js
const API_BASE = "http://localhost:3100";
```

Edit this single line to point at a different host/port.

Auth tokens are stored in `localStorage`:
- `adminToken` (admin)
- `customerToken`, `customerID`, `customerEmail` (customer)

Use `OBK.logout("admin")` or `OBK.logout()` from the console to clear them, or delete them in DevTools → *Application* → *Local Storage*.

---

## Extra Remarks, Bugs & Exceptions

- **Hardcoded price (20 ฿).** The home grid (`html/js/products.js`) and the recommendations strip on the product detail page (`html/js/product-detail.js`) display a fixed `20 ฿` price instead of reading the per-product price from the API.
- **Typo:** `html/index.html` contains the string **"IFhone"** instead of **"iPhone"**.
- **Fragile image URLs.** Several product images are loaded from temporary Figma asset URLs (`figma.com/api/mcp/asset/…`) and from public hosts like `ibb.co` / `unsplash.com`. They will break if the links expire or you have no internet access.
- **Register flow is incomplete.** `register-page.html` exists but there is no JS file wiring its form to a backend endpoint — registration submission does not work out of the box.
- **Checkout flow is incomplete.** `shopping-cart.html`, `checkout.html`, `checkout-add-address.html`, `checkout-change-address.html`, and `checkout-success.html` are present, but order submission / payment is not fully implemented.
- **`localStorage` auth.** Tokens are persisted in `localStorage` (no `httpOnly` cookies), so they survive reloads but are accessible to any script running on the page.
- **CORS / origin.** The site assumes `http://localhost:3100` for the API. The back-end enables CORS for all origins, so any local port works during development. For a deployed setup you must update `API_BASE` and tighten the back-end CORS.
- **No `npm install`.** There is no `package.json` here — don't try to `npm install` in this repo. It's purely static assets.
- **Pages with the `-login` suffix** (e.g. `webpage-login.html`, `product-information-login.html`) are the logged-in variants of their public counterparts. The JS will redirect to `login-page.html` if a customer session is missing — this is expected.
