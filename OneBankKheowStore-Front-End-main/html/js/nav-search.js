(function () {
  const SHOP_PAGES = ["webpage.html", "webpage-login.html"];

  function isShopPage() {
    const path = location.pathname.split("/").pop() || "";
    return SHOP_PAGES.includes(path);
  }

  function shopUrl(params) {
    const page = window.OBK && window.OBK.isLoggedInAsCustomer()
      ? "webpage-login.html"
      : "webpage.html";
    const qs = new URLSearchParams(params).toString();
    return qs ? `${page}?${qs}` : page;
  }

  function buildAdvancePanel() {
    const panel = document.createElement("div");
    panel.className = "obk-advance";
    panel.innerHTML = `
      <h4>Advance Search</h4>
      <input class="obk-input" data-field="category" placeholder="Search Categories..." />
      <input class="obk-input" data-field="brand" placeholder="Search Brand..." />
      <div class="obk-filter-label">Filter</div>
      <div class="obk-filter-help">Cycle: include &rarr; exclude &rarr; clear.</div>
      <div class="obk-chip-row">
        <span class="obk-chip" data-filter="freeShipping">Free shipping</span>
        <span class="obk-chip" data-filter="flashSale">Flash sale</span>
        <span class="obk-chip" data-filter="stockReady">Stock Ready</span>
        <span class="obk-chip" data-filter="promo50">Promotion &gt; 50%</span>
        <span class="obk-chip" data-filter="promoUnder50">Promotion &lt; 50%</span>
      </div>
      <div class="obk-actions">
        <button type="button" class="obk-btn obk-btn-ghost" data-action="clear">Clear</button>
        <button type="button" class="obk-btn obk-btn-primary" data-action="apply">Apply</button>
      </div>
    `;
    return panel;
  }

  function collectFilters(searchInput, panel) {
    const filters = {};
    const name = searchInput.value.trim();
    const category = panel.querySelector("[data-field='category']").value.trim();
    const brand = panel.querySelector("[data-field='brand']").value.trim();
    if (name) filters.name = name;
    if (category) filters.category = category;
    if (brand) filters.brand = brand;
    return filters;
  }

  function applySearch(searchInput, panel) {
    const filters = collectFilters(searchInput, panel);
    if (isShopPage() && typeof window.loadProducts === "function") {
      window.loadProducts(filters);
    } else {
      window.location.href = shopUrl(filters);
    }
  }

  function clearSearch(searchInput, panel) {
    searchInput.value = "";
    panel.querySelectorAll(".obk-input").forEach((i) => (i.value = ""));
    panel.querySelectorAll(".obk-chip").forEach((c) =>
      c.classList.remove("include", "exclude")
    );
    if (isShopPage() && typeof window.loadProducts === "function") {
      window.loadProducts({});
    }
  }

  function wireForm(form) {
    if (form.dataset.obkWired === "1") return;
    form.dataset.obkWired = "1";

    const searchInput = form.querySelector("input[type='text']");
    if (!searchInput) return;

    const panel = buildAdvancePanel();
    const wrap = document.createElement("div");
    wrap.className = "obk-search-wrap";
    form.parentNode.insertBefore(wrap, form);
    wrap.appendChild(form);
    wrap.appendChild(panel);

    const open = () => panel.classList.add("open");
    const close = () => panel.classList.remove("open");

    searchInput.addEventListener("focus", open);
    searchInput.addEventListener("click", open);
    document.addEventListener("click", (e) => {
      if (!wrap.contains(e.target)) close();
    });

    panel.querySelectorAll(".obk-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        if (chip.classList.contains("include")) {
          chip.classList.remove("include");
          chip.classList.add("exclude");
        } else if (chip.classList.contains("exclude")) {
          chip.classList.remove("exclude");
        } else {
          chip.classList.add("include");
        }
      });
    });

    panel.querySelector("[data-action='apply']").addEventListener("click", () => {
      applySearch(searchInput, panel);
      close();
    });
    panel.querySelector("[data-action='clear']").addEventListener("click", () => {
      clearSearch(searchInput, panel);
      close();
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      applySearch(searchInput, panel);
      close();
    });

    if (isShopPage()) {
      const params = new URLSearchParams(location.search);
      const name = params.get("name") || "";
      const category = params.get("category") || "";
      const brand = params.get("brand") || "";
      if (name) searchInput.value = name;
      if (category) panel.querySelector("[data-field='category']").value = category;
      if (brand) panel.querySelector("[data-field='brand']").value = brand;
    }

    document.querySelectorAll(".category-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        const cat = chip.textContent.trim();
        if (isShopPage() && typeof window.loadProducts === "function") {
          window.loadProducts({ category: cat });
        } else {
          window.location.href = shopUrl({ category: cat });
        }
      });
    });
  }

  function init() {
    const form = document.querySelector("form.search-bar");
    if (form) wireForm(form);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
