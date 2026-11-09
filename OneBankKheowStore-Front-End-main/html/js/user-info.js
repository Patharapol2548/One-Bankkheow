(function () {
  function setError(msg) {
    const form = document.querySelector(".form-section form");
    let errEl = form.querySelector(".user-info-error");
    if (!errEl) {
      errEl = document.createElement("div");
      errEl.className = "user-info-error";
      errEl.style.color = "#c0392b";
      errEl.style.margin = "8px 0";
      form.insertBefore(errEl, form.querySelector(".form-actions"));
    }
    errEl.textContent = msg || "";
  }

  function setStatus(msg) {
    const form = document.querySelector(".form-section form");
    let el = form.querySelector(".user-info-status");
    if (!el) {
      el = document.createElement("div");
      el.className = "user-info-status";
      el.style.color = "#27ae60";
      el.style.margin = "8px 0";
      form.insertBefore(el, form.querySelector(".form-actions"));
    }
    el.textContent = msg || "";
  }

  function ensureExtraFields(form) {
    const formActions = form.querySelector(".form-actions");

    if (!form.querySelector("[name='address']")) {
      const wrap = document.createElement("div");
      wrap.className = "input-address";
      wrap.innerHTML = `
        <label>Address</label>
        <input type="text" name="address" id="address" placeholder="Street, city..." required />
      `;
      form.insertBefore(wrap, formActions);
    }

    if (!form.querySelector("[name='gender']")) {
      const wrap = document.createElement("div");
      wrap.className = "input-gender";
      wrap.innerHTML = `
        <label>Gender</label>
        <select name="gender" id="gender" required>
          <option value="">Select…</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      `;
      form.insertBefore(wrap, formActions);
    }

    if (!form.querySelector("[name='picture']")) {
      const wrap = document.createElement("div");
      wrap.className = "input-picture";
      wrap.innerHTML = `
        <label>Picture (filename or URL)</label>
        <input type="text" name="picture" id="picture" placeholder="c1.jpg" required />
      `;
      form.insertBefore(wrap, formActions);
    }
  }

  function injectLogout() {
    const title = document.querySelector(".info-title");
    if (!title || title.querySelector(".logout-link")) return;
    const btn = document.createElement("a");
    btn.href = "#";
    btn.className = "logout-link";
    btn.textContent = "Logout";
    btn.style.marginLeft = "16px";
    btn.style.fontSize = "14px";
    btn.style.cursor = "pointer";
    btn.style.textDecoration = "underline";
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      OBK.logout("customer");
    });
    title.appendChild(btn);
  }

  function toDateInputValue(v) {
    if (!v) return "";
    const d = new Date(v);
    if (isNaN(d.getTime())) return "";
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${mm}-${dd}`;
  }

  async function init() {
    OBK.requireCustomer();
    injectLogout();

    const form = document.querySelector(".form-section form");
    if (!form) return;
    ensureExtraFields(form);

    const firstName = form.querySelector("#firstName");
    const lastName = form.querySelector("#lastName");
    const emailInput = form.querySelector("[name='userid']");
    const phoneInput = form.querySelector("[name='phone']");
    const dobInput = form.querySelector("[name='dob']");
    const addressInput = form.querySelector("[name='address']");
    const genderInput = form.querySelector("[name='gender']");
    const pictureInput = form.querySelector("[name='picture']");

    const session = OBK.getCustomerSession();
    if (emailInput) {
      emailInput.value = session.cEmail || "";
      emailInput.readOnly = true;
    }

    try {
      const u = await OBK.getCustomerProfile();
      if (!u) throw new Error("Profile not available.");
      firstName.value = u.cFirstName || "";
      lastName.value = u.cLastName || "";
      if (emailInput) emailInput.value = u.cEmail || session.cEmail || "";
      phoneInput.value = u.phoneNo || "";
      dobInput.value = toDateInputValue(u.cBirthDate);
      addressInput.value = u.cAddress || "";
      genderInput.value = u.cGender || "";
      pictureInput.value = u.cPicture || "";

      const profileImg = document.querySelector(".image-wrapper img");
      if (profileImg && u.cPicture) {
        if (/^https?:\/\//i.test(u.cPicture)) profileImg.src = u.cPicture;
      }
    } catch (err) {
      setError(`Failed to load profile: ${err.message}`);
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      setError("");
      setStatus("");
      try {
        await OBK.apiFetch(
          `/user/profile/${encodeURIComponent(session.cID)}`,
          {
            method: "PUT",
            auth: "customer",
            body: {
              phoneNo: phoneInput.value.trim(),
              cAddress: addressInput.value.trim(),
              cFirstName: firstName.value.trim(),
              cLastName: lastName.value.trim(),
              cGender: genderInput.value,
              cBirthDate: dobInput.value || null,
              cPicture: pictureInput.value.trim(),
            },
          }
        );
        OBK.clearCustomerProfileCache();
        const newPic = pictureInput.value.trim();
        const profileImg = document.querySelector(".image-wrapper img");
        if (profileImg && /^https?:\/\//i.test(newPic)) profileImg.src = newPic;
        const navImg = document.querySelector(".nav-profile-img");
        if (navImg && /^https?:\/\//i.test(newPic)) navImg.src = newPic;
        setStatus("Profile updated.");
      } catch (err) {
        setError(err.message);
      }
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
