(function () {
  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderCard(p) {
    return `
      <div class="item-card" data-product-id="${escapeHtml(p.productID)}">
        <div class="item-image">
          <img src="${escapeHtml(p.productImage || "https://placehold.co/200x200?text=No+Image")}" alt="${escapeHtml(p.productName)}">
        </div>
        <div class="item-details">
          <h2 class="item-name">${escapeHtml(p.productName)}</h2>
          <p class="item-description">${escapeHtml(p.productDetail || "")}</p>
          <div style="margin-top:8px;color:#666;font-size:13px;">
            ID: ${escapeHtml(p.productID)} &nbsp;|&nbsp;
            Brand: ${escapeHtml(p.productBrand || "-")} &nbsp;|&nbsp;
            Qty: ${escapeHtml(p.productAmount)}
          </div>
        </div>
        <div class="item-actions">
          <a href="#" class="btn-action btn-delete" data-product-id="${escapeHtml(p.productID)}">
            <img src="https://i.ibb.co/s9Kyrx2d/icons8-trash-480.png" alt="Delete Icon">
            Delete
          </a>
          <a href="admin-edit.html?id=${encodeURIComponent(p.productID)}" class="btn-action btn-edit">
            <img src="https://img.icons8.com/ios-filled/100/create-new.png" alt="Edit Icon">
            Edit
          </a>
        </div>
      </div>
    `;
  }

  async function load() {
    const list = document.querySelector(".item-list");
    if (!list) return;
    list.innerHTML = `<div style="padding:16px;">Loading…</div>`;
    try {
      const res = await OBK.apiFetch("/products/admin", { auth: "admin" });
      const items = res.data || [];
      if (items.length === 0) {
        list.innerHTML = `<div style="padding:16px;">No products yet. Click "Add Item" to create one.</div>`;
        return;
      }
      list.innerHTML = items.map(renderCard).join("");
    } catch (err) {
      list.innerHTML = `<div style="padding:16px;color:#c0392b;">Failed to load products: ${escapeHtml(err.message)}</div>`;
    }
  }

  function wireAddItem() {
    const addBtn = document.querySelector(".btn-add-item");
    if (addBtn) addBtn.setAttribute("href", "admin-edit.html");
  }

  function wireDeleteDelegation() {
    document.addEventListener("click", async (e) => {
      const btn = e.target.closest(".btn-delete");
      if (!btn) return;
      e.preventDefault();
      const id = btn.getAttribute("data-product-id");
      if (!id) return;
      if (!confirm(`Delete product ${id}?`)) return;
      try {
        await OBK.apiFetch(`/products/admin/${encodeURIComponent(id)}`, {
          method: "DELETE",
          auth: "admin",
        });
        await load();
      } catch (err) {
        alert(`Delete failed: ${err.message}`);
      }
    });
  }

  function injectLogout() {
    const header = document.querySelector(".admin-header-text");
    if (!header || header.querySelector(".admin-logout")) return;
    const btn = document.createElement("a");
    btn.href = "#";
    btn.className = "admin-logout";
    btn.textContent = "Logout";
    btn.style.marginLeft = "16px";
    btn.style.cursor = "pointer";
    btn.style.textDecoration = "underline";
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      OBK.logout("admin");
    });
    header.appendChild(btn);
  }

  document.addEventListener("DOMContentLoaded", () => {
    OBK.requireAdmin();
    injectLogout();
    wireAddItem();
    wireDeleteDelegation();
    load();
  });
})();
