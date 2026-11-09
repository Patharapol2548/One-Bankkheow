document.addEventListener("DOMContentLoaded", () => {
  // If admin is already logged in, redirect to dashboard
  if (localStorage.getItem("adminToken")) {
    window.location.href = "admin.html";
    return;
  }

  const form = document.querySelector(".login-form");
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

    const userName = document.getElementById("Username").value.trim();
    const password = document.getElementById("password").value;

    try {
      const data = await OBK.apiFetch("/auth/admin/login", {
        method: "POST",
        body: { userName, password },
      });
      localStorage.setItem("adminToken", data.token);
      window.location.href = "admin.html";
    } catch (err) {
      errorEl.textContent = err.message || "Login failed.";
    }
  });
});
