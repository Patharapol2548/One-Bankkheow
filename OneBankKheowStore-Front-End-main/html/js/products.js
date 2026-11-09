(function () {
  const PLACEHOLDER_IMG = "https://placehold.co/300x300?text=No+Image";

  function detailUrl(productID) {
    const page = OBK.isLoggedInAsCustomer()
      ? "product-information-login.html"
      : "product-information.html";
    return `${page}?id=${encodeURIComponent(productID)}`;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function escapeAttr(s) {
    return escapeHtml(s);
  }

  function renderCard(p, rateData) {
    const img = p.productImage || PLACEHOLDER_IMG;
    const name = p.productName || "Unnamed";
    const qty = p.productAmount != null ? `Qty: ${p.productAmount}` : "";
    let cnyHtml = "";
    if (rateData && rateData.rate) {
      const cny = (20 * rateData.rate).toFixed(2);
      cnyHtml = ` <span style="font-size:12px;color:#888;font-weight:normal;">(~ ${cny} ¥)</span>`;
    }
    return `
      <a class="product-card" href="${detailUrl(p.productID)}" data-product-id="${p.productID}" style="text-decoration:none;color:inherit;display:block;">
        <div class="product-img">
          <img src="${img}" alt="${escapeAttr(name)}" />
        </div>
        <div class="product-info">
          <h3>${escapeHtml(name)}</h3>
          <div class="product-price" style="font-weight:600;">20 ฿${cnyHtml}</div>
          <div class="product-qty" style="font-size:13px;color:#666;">${escapeHtml(qty)}</div>
        </div>
      </a>
    `;
  }

  function buildQuery(filters) {
    const params = new URLSearchParams();
    for (const k of Object.keys(filters)) {
      const v = filters[k];
      if (v !== undefined && v !== null && v !== "") params.set(k, v);
    }
    const qs = params.toString();
    return qs ? `?${qs}` : "";
  }

  function chunk(arr, size) {
    const out = [];
    for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
    return out;
  }

  async function searchByNameOrId(filters) {
    const term = (filters.name || "").trim();
    const rest = { ...filters };
    delete rest.name;

    const calls = [OBK.apiFetch(`/products/search${buildQuery(filters)}`)];
    if (term) {
      calls.push(
        OBK.apiFetch(`/products/${encodeURIComponent(term)}`).catch(() => null)
      );
    }
    const [byName, byId] = await Promise.all(calls);

    const items = byName.data || [];
    if (byId && byId.data) {
      const idHit = byId.data;
      const matchesRest =
        (!rest.brand || (idHit.productBrand || "").toLowerCase().includes(rest.brand.toLowerCase())) &&
        (!rest.category || (idHit.productCategory || "").toLowerCase().includes(rest.category.toLowerCase()));
      const already = items.some((p) => p.productID === idHit.productID);
      if (!already && matchesRest) items.unshift(idHit);
    }
    return items;
  }

  async function loadProducts(filters = {}) {
    const grid = document.querySelector(".product-grid");
    if (!grid) return;
    const useRows = !!grid.querySelector(".product-row");
    grid.innerHTML = `<div style="padding:16px;">Loading products…</div>`;
    try {
      const [items, rateData] = await Promise.all([
        searchByNameOrId(filters),
        OBK.getExchangeRate(),
      ]);
      if (items.length === 0) {
        grid.innerHTML = `<div style="padding:16px;">No products found.</div>`;
        return;
      }
      if (useRows) {
        grid.innerHTML = chunk(items, 5)
          .map((row) => `<div class="product-row">${row.map((p) => renderCard(p, rateData)).join("")}</div>`)
          .join("");
      } else {
        grid.innerHTML = items.map((p) => renderCard(p, rateData)).join("");
      }
    } catch (err) {
      grid.innerHTML = `<div style="padding:16px;color:#c0392b;">Failed to load products: ${escapeHtml(err.message)}</div>`;
    }
  }

  window.loadProducts = loadProducts;

  function initialFiltersFromUrl() {
    const params = new URLSearchParams(location.search);
    const filters = {};
    const name = params.get("name");
    const category = params.get("category");
    const brand = params.get("brand");
    if (name) filters.name = name;
    if (category) filters.category = category;
    if (brand) filters.brand = brand;
    return filters;
  }

  function wireSidebarCategories() {
    document.querySelectorAll(".category-list li").forEach((li) => {
      li.style.cursor = "pointer";
      li.addEventListener("click", () => {
        loadProducts({ category: li.textContent.trim() });
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    loadProducts(initialFiltersFromUrl());
    wireSidebarCategories();
  });
})();
