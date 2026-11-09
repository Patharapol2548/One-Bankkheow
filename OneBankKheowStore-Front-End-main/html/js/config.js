(function (global) {
  // Base URL for the Express API server.
  // Defaults to localhost:3100, but can be overridden dynamically by window.ENV_API_BASE or localStorage.
  const API_BASE =
    (typeof window !== "undefined" && window.ENV_API_BASE) ||
    (typeof localStorage !== "undefined" && localStorage.getItem("customApiBase")) ||
    "http://localhost:3100";

  function getAdminToken() {
    return localStorage.getItem("adminToken");
  }

  function getCustomerSession() {
    const token = localStorage.getItem("customerToken");
    if (!token) return null;
    return {
      token,
      cID: localStorage.getItem("customerID"),
      cEmail: localStorage.getItem("customerEmail"),
    };
  }

  function isLoggedInAsCustomer() {
    return !!getCustomerSession();
  }

  async function apiFetch(path, options = {}) {
    const { method = "GET", body, auth } = options;
    const headers = { "Content-Type": "application/json" };
    if (auth === "admin") {
      const t = getAdminToken();
      if (!t) throw new Error("Not logged in as admin.");
      headers["Authorization"] = t;
    } else if (auth === "customer") {
      const s = getCustomerSession();
      if (!s) throw new Error("Not logged in.");
      headers["Authorization"] = s.token;
    }

    const res = await fetch(API_BASE + path, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    let data;
    try {
      data = await res.json();
    } catch {
      throw new Error(`Server returned non-JSON (HTTP ${res.status}).`);
    }
    if (!res.ok || data.error === 1 || data.error === true) {
      throw new Error(data.message || `Request failed (HTTP ${res.status}).`);
    }
    return data;
  }

  function requireAdmin() {
    if (!getAdminToken()) {
      window.location.href = "admin-login.html";
    }
  }

  function requireCustomer() {
    if (!isLoggedInAsCustomer()) {
      window.location.href = "login-page.html";
    }
  }

  function logout(kind) {
    if (kind === "admin") {
      localStorage.removeItem("adminToken");
      window.location.href = "admin-login.html";
    } else {
      localStorage.removeItem("customerToken");
      localStorage.removeItem("customerID");
      localStorage.removeItem("customerEmail");
      customerProfileCache = null;
      window.location.href = "index.html";
    }
  }

  let customerProfileCache = null;

  async function getCustomerProfile() {
    if (customerProfileCache) return customerProfileCache;
    const session = getCustomerSession();
    if (!session || !session.cID) return null;
    try {
      const res = await apiFetch(
        `/user/profile/${encodeURIComponent(session.cID)}`,
        { auth: "customer" }
      );
      customerProfileCache = res.data || null;
      return customerProfileCache;
    } catch (err) {
      console.warn("Customer profile fetch failed:", err.message);
      return null;
    }
  }

  function clearCustomerProfileCache() {
    customerProfileCache = null;
  }

  let exchangeRateCache = null;

  async function getExchangeRate() {
    if (exchangeRateCache) return exchangeRateCache;
    try {
      const data = await apiFetch("/products/exchange-rate");
      exchangeRateCache = data;
      return data;
    } catch (err) {
      console.warn("Exchange rate fetch failed:", err.message);
      return null;
    }
  }

  global.OBK = {
    API_BASE,
    apiFetch,
    getAdminToken,
    getCustomerSession,
    isLoggedInAsCustomer,
    requireAdmin,
    requireCustomer,
    logout,
    getExchangeRate,
    getCustomerProfile,
    clearCustomerProfileCache,
  };
})(window);
