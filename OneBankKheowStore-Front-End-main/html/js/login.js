document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".left form");
  if (!form) return;

  let errorEl = document.querySelector(".login-error");
  if (!errorEl) {
    errorEl = document.createElement("div");
    errorEl.className = "login-error";
    errorEl.style.color = "#c0392b";
    errorEl.style.marginTop = "8px";
    errorEl.style.fontSize = "14px";
    form.appendChild(errorEl);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorEl.textContent = "";

    const cEmail = document.getElementById("email").value.trim();
    const cPassword = document.getElementById("password").value;

    try {
      const data = await OBK.apiFetch("/auth/customer/login", {
        method: "POST",
        body: { cEmail, cPassword },
      });
      localStorage.setItem("customerToken", data.token);
      localStorage.setItem("customerID", data.cID);
      localStorage.setItem("customerEmail", data.cEmail);
      window.location.href = "webpage-login.html";
    } catch (err) {
      errorEl.textContent = err.message || "Login failed.";
    }
  });
});
