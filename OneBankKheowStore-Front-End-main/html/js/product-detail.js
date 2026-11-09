(function () {
  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function getIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
  }

  function showError(msg) {
    const details = document.querySelector(".product-details");
    if (details) {
      details.innerHTML = `<p style="color:#c0392b;">${escapeHtml(msg)}</p>`;
    }
  }

  async function loadProduct() {
    const id = getIdFromUrl();
    if (!id) {
      showError("No product ID in URL. Open a product from the catalog.");
      return;
    }
    try {
      const [res, rateData] = await Promise.all([
        OBK.apiFetch(`/products/${encodeURIComponent(id)}`),
        OBK.getExchangeRate(),
      ]);
      const p = res.data;

      const titleEl = document.querySelector(".product-title");
      if (titleEl) titleEl.textContent = p.productName || "";

      const descEl = document.querySelector(".product-desc");
      if (descEl) descEl.textContent = p.productBrand || "";

      const descLongEl = document.querySelector(".product-description-text");
      if (descLongEl) {
        descLongEl.innerHTML = (p.productDetail || "")
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/\n/g, "<br/>");
      }

      const mainImg = document.querySelector(".product-gallery .main-image img");
      if (mainImg && p.productImage) {
        mainImg.src = p.productImage;
        mainImg.alt = p.productName || "";
      }

      // Build CNY price string
      let cnyHtml = "";
      if (rateData && rateData.rate) {
        const cny = (20 * rateData.rate).toFixed(2);
        cnyHtml = ` <span style="font-size:16px;color:#888;font-weight:normal;">(~ ${cny} ¥)</span>`;
      }

      // Price (always 20฿) + Stock/quantity
      const details = document.querySelector(".product-details");
      if (details) {
        let priceEl = details.querySelector(".product-price");
        if (!priceEl) {
          priceEl = document.createElement("div");
          priceEl.className = "product-price";
          priceEl.style.fontSize = "22px";
          priceEl.style.fontWeight = "700";
          priceEl.style.margin = "12px 0 4px";
          const actions = details.querySelector(".product-actions");
          if (actions) details.insertBefore(priceEl, actions);
          else details.appendChild(priceEl);
        }
        priceEl.innerHTML = "20 ฿" + cnyHtml;

        if (p.productAmount != null) {
          let stockEl = details.querySelector(".product-stock");
          if (!stockEl) {
            stockEl = document.createElement("div");
            stockEl.className = "product-stock";
            stockEl.style.fontSize = "14px";
            stockEl.style.color = "#666";
            stockEl.style.margin = "0 0 12px";
            const actions = details.querySelector(".product-actions");
            if (actions) details.insertBefore(stockEl, actions);
            else details.appendChild(stockEl);
          }
          stockEl.textContent = `In stock: ${p.productAmount}`;
        }
      }

      // Breadcrumb category > brand
      const breadcrumb = document.querySelector(".breadcrumb");
      if (breadcrumb && (p.productCategory || p.productBrand)) {
        breadcrumb.innerHTML = `${escapeHtml(p.productCategory || "Product")} &gt; <span class="current">${escapeHtml(p.productBrand || p.productName || "")}</span>`;
      }

      document.title = `${p.productName} - OneBankKheawStore`;
    } catch (err) {
      showError(`Failed to load product: ${err.message}`);
    }
  }

  function detailUrl(productID) {
    const page = OBK.isLoggedInAsCustomer()
      ? "product-information-login.html"
      : "product-information.html";
    return `${page}?id=${encodeURIComponent(productID)}`;
  }

  function renderRecommendCard(p) {
    const img = p.productImage || "https://placehold.co/200x200?text=No+Image";
    const name = escapeHtml(p.productName || "");
    return `
      <a class="product-card" href="${detailUrl(p.productID)}" style="text-decoration:none;color:inherit;display:block;">
        <div class="product-img">
          <img src="${img}" alt="${name}" />
        </div>
        <div class="product-card-info">
          <h3>${name}</h3>
          <button class="cart-btn" type="button"><img src="https://i.ibb.co/Ps7rCWQP/icons8-cart-64.png" alt="Cart" /></button>
        </div>
      </a>
    `;
  }

  async function loadRecommended() {
    const grid = document.querySelector(".recommend-grid");
    if (!grid) return;
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "repeat(5, 1fr)";
    grid.style.gap = "20px";

    try {
      const res = await OBK.apiFetch("/products/search");
      const currentId = getIdFromUrl();
      let items = (res.data || []).filter((p) => p.productID !== currentId);
      for (let i = items.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [items[i], items[j]] = [items[j], items[i]];
      }
      items = items.slice(0, 10);
      if (items.length === 0) {
        grid.innerHTML = `<div>No recommendations.</div>`;
        return;
      }
      grid.innerHTML = items.map(renderRecommendCard).join("");
    } catch (err) {
      grid.innerHTML = `<div style="color:#c0392b;">Failed to load recommendations: ${escapeHtml(err.message)}</div>`;
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    loadProduct();
    loadRecommended();
  });
})();
