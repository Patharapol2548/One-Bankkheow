(function () {
  const ADMIN_ID_FALLBACK = "A001";

  function getIdFromUrl() {
    return new URLSearchParams(window.location.search).get("id");
  }

  function setSpinnerValue(group, value) {
    const el = group.querySelector(".spinner-val");
    if (el) el.textContent = value;
  }
  function getSpinnerValue(group) {
    const el = group.querySelector(".spinner-val");
    return el ? parseInt(el.textContent, 10) || 0 : 0;
  }

  function wireSpinners() {
    document.querySelectorAll(".control-group").forEach((group) => {
      const minus = group.querySelectorAll(".spinner-btn")[0];
      const plus = group.querySelectorAll(".spinner-btn")[1];
      if (!minus || !plus) return;
      minus.style.cursor = "pointer";
      plus.style.cursor = "pointer";
      minus.addEventListener("click", () => {
        const v = getSpinnerValue(group);
        setSpinnerValue(group, Math.max(0, v - 1));
      });
      plus.addEventListener("click", () => {
        const v = getSpinnerValue(group);
        setSpinnerValue(group, v + 1);
      });
    });
  }

  function getGroups() {
    const groups = document.querySelectorAll(".control-group");
    return { amountGroup: groups[0], promoGroup: groups[1] };
  }

  function getInputs() {
    const form = document.querySelector(".right-col");
    return form.querySelectorAll(".form-input");
  }

  function addImageField(form) {
    const group = document.createElement("div");
    group.className = "form-group";
    group.innerHTML = `
      <label class="form-label">Image URL</label>
      <input type="text" class="form-input" id="productImage" placeholder="https://..." />
    `;
    const actions = form.querySelector(".actions-row");
    form.insertBefore(group, actions);
    return group.querySelector("input");
  }

  function setError(msg) {
    const form = document.querySelector(".right-col");
    let errEl = form.querySelector(".edit-error");
    if (!errEl) {
      errEl = document.createElement("div");
      errEl.className = "edit-error";
      errEl.style.color = "#c0392b";
      errEl.style.marginTop = "8px";
      form.insertBefore(errEl, form.querySelector(".actions-row"));
    }
    errEl.textContent = msg || "";
  }

  async function init() {
    OBK.requireAdmin();
    wireSpinners();

    const form = document.querySelector(".right-col");
    if (!form) return;
    const inputs = getInputs();
    const nameInput = inputs[0];
    const brandInput = inputs[1];
    const idInput = inputs[2];
    const descTextarea = form.querySelector(".form-textarea");
    const imageInput = addImageField(form);
    const { amountGroup } = getGroups();

    const productID = getIdFromUrl();
    const isEdit = !!productID;

    const title = document.createElement("h1");
    title.textContent = isEdit ? `Edit Product ${productID}` : "New Product";
    title.style.margin = "0 0 16px 0";
    form.insertBefore(title, form.firstChild);

    if (isEdit) {
      idInput.value = productID;
      idInput.readOnly = true;
      try {
        const res = await OBK.apiFetch(
          `/products/admin/${encodeURIComponent(productID)}`,
          { auth: "admin" }
        );
        const p = res.data;
        nameInput.value = p.productName || "";
        brandInput.value = p.productBrand || "";
        descTextarea.value = p.productDetail || "";
        imageInput.value = p.productImage || "";
        setSpinnerValue(amountGroup, p.productAmount != null ? p.productAmount : 0);
      } catch (err) {
        setError(`Failed to load product: ${err.message}`);
      }
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      setError("");

      const body = {
        productName: nameInput.value.trim(),
        productAmount: getSpinnerValue(amountGroup),
        productImage: imageInput.value.trim(),
        productBrand: brandInput.value.trim(),
        productDetail: descTextarea.value.trim(),
      };

      try {
        if (isEdit) {
          await OBK.apiFetch(
            `/products/admin/${encodeURIComponent(productID)}`,
            { method: "PUT", body, auth: "admin" }
          );
        } else {
          const newID = idInput.value.trim();
          if (!newID) {
            setError("Product ID is required.");
            return;
          }
          await OBK.apiFetch("/products/admin", {
            method: "POST",
            body: { ...body, productID: newID, adminID: ADMIN_ID_FALLBACK },
            auth: "admin",
          });
        }
        window.location.href = "admin.html";
      } catch (err) {
        setError(err.message);
      }
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
