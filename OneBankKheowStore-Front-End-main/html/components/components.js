function ensureNavStylesheet() {
  if (document.querySelector("link[data-obk-nav-css]")) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "css/nav.css";
  link.setAttribute("data-obk-nav-css", "1");
  document.head.appendChild(link);
}

class NavBar extends HTMLElement {
  connectedCallback() {
    ensureNavStylesheet();
    const isCustomer = !!localStorage.getItem("customerToken");
    const isAdmin = !!localStorage.getItem("adminToken");

    // Top bar: show admin dashboard link if admin is logged in.
    // Hide the admin login prompt when a customer is logged in.
    const adminBarHtml = isAdmin
      ? `<a href="admin.html"><b>Go to Dashboard</b></a>`
      : isCustomer
        ? ``
        : `If you are admin... <a href="admin-login.html"><b>LOGIN</b></a> here`;

    // Nav icons: swap Login/Register for cart + profile + logout when customer is logged in
    const navIconsHtml = isCustomer
      ? `<a href="shopping-cart.html"><img src="https://i.ibb.co/Ps7rCWQP/icons8-cart-64.png" alt="Shopping Cart" /></a>
         <a href="user-info.html"><img class="nav-profile-img" src="https://blocks.astratic.com/img/general-img-square.png" alt="Profile" /></a>
         <a href="#" class="login-register-btn" id="nav-logout-btn">Logout</a>`
      : `<a href="shopping-cart.html"><img src="https://i.ibb.co/Ps7rCWQP/icons8-cart-64.png" alt="Shopping Cart" /></a>
         <a href="#"><img src="https://blocks.astratic.com/img/general-img-square.png" alt="Profile" /></a>
         <a href="login-page.html" class="login-register-btn">Login / Register</a>`;

    this.innerHTML = `
      <header>
      <div class="top-bar">
        <div class="demo-site">DEMO SITE</div>
        <div class="admin-login">
          ${adminBarHtml}
        </div>
      </div>
      <nav>
        <div class="nav-main">
          <div class="logo">
            <a href="index.html">
              <img
                src="https://i.ibb.co/DgPkg1vR/onebkeow.png"
                alt="OneBankKheaw Logo"
              />
            </a>
          </div>
          <div class="search-container">
            <form class="search-bar">
              <img
                src="https://img.icons8.com/?size=100&id=p8VkXMjDOpcE&format=png&color=000000"
                alt="Search Icon"
                style="width: 30px; height: 30px"
              />
              <input type="text" placeholder="Search by Name or Product ID..." />
            </form>
          </div>
          <div class="nav-icons">
            ${navIconsHtml}
          </div>
        </div>
        <div class="category-nav">
          <div class="category-chip">Box</div>
          <div class="category-chip">Scissors</div>
          <div class="category-chip">Pencil</div>
          <div class="category-chip">Paper</div>
          <div class="category-chip">Guitar</div>
        </div>
      </nav>
    </header>
    `;

    // Wire up logout button if customer is logged in
    if (isCustomer) {
      const logoutBtn = this.querySelector("#nav-logout-btn");
      if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
          e.preventDefault();
          if (window.OBK && OBK.logout) {
            OBK.logout("customer");
          } else {
            localStorage.removeItem("customerToken");
            localStorage.removeItem("customerID");
            localStorage.removeItem("customerEmail");
            window.location.href = "index.html";
          }
        });
      }

      const profileImg = this.querySelector(".nav-profile-img");
      if (profileImg) {
        const applyPicture = () => {
          if (!window.OBK || !OBK.getCustomerProfile) return false;
          OBK.getCustomerProfile().then((u) => {
            if (u && u.cPicture && /^https?:\/\//i.test(u.cPicture)) {
              profileImg.src = u.cPicture;
            }
          });
          return true;
        };
        if (!applyPicture()) {
          document.addEventListener("DOMContentLoaded", applyPicture, { once: true });
        }
      }
    }
  }
}
class adminNavBar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
    <header class="admin-nav">
      <div class="logo">
        <a href="index.html">
          <img
            src="https://i.ibb.co/DgPkg1vR/onebkeow.png"
            alt="Logo"
          />
        </a>
      </div>
      <div class="search-container">
        <div class="search-bar">
          <img
            src="https://img.icons8.com/?size=100&id=p8VkXMjDOpcE&format=png&color=000000"
            alt="Search Icon"
            style="width: 30px; height: 30px"
          />
          <input type="text" placeholder="Search Tools or Item.." />
        </div>
      </div>
      <div class="admin-header-text">Hi Admin ! // ADMIN CONSOLE</div>
    </header>`;
  }
}

class Footer extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer>
      <div class="meet-team">
        <a href="our-team.html">Meet Our Team</a>
      </div>
      <div class="education">
          <p><b>For Education</b></p>
          <p>Mahidol University - Faculty of Information and Communication Technology</p>
          <p>ITCS223 - Introduction to Web Development</p>
        </div>
      </div>
      <div class="footer-line"></div>
      <div class="footer-main">
        <div class="copyright">
          © 2026 OneBankKheaw Inc. All rights reserved.
        </div>
        <div class="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Help Center</a>
        </div>
      </div>
    </footer>
    `;
  }
}

customElements.define("nav-bar", NavBar);
customElements.define("admin-nav", adminNavBar);
customElements.define("footer-bar", Footer);
