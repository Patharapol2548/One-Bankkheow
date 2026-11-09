/**
 * exchange-rate.js
 * Adds CNY equivalent prices to shopping-cart and checkout pages.
 * Requires config.js (OBK.getExchangeRate) to be loaded first.
 */
(function () {
  const UNIT_PRICE = 20; // all products are 20 THB

  function parseTHB(text) {
    // Extract numeric value from strings like "40฿", "฿ 40", "120฿", "-0฿"
    const m = text.replace(/,/g, "").match(/-?\d+(\.\d+)?/);
    return m ? parseFloat(m[0]) : null;
  }

  function formatCNY(thb, rate) {
    return (thb * rate).toFixed(2);
  }

  async function applyExchangeRate() {
    if (typeof OBK === "undefined" || !OBK.getExchangeRate) return;

    const rateData = await OBK.getExchangeRate();
    if (!rateData || !rateData.rate) return;

    const rate = rateData.rate;

    // --- Shopping Cart page ---

    // Individual item prices (class "item-price") – e.g. "20"
    document.querySelectorAll(".item-price").forEach(function (el) {
      const thb = parseTHB(el.textContent);
      if (thb == null) return;
      if (el.getAttribute("data-cny-done")) return;
      el.setAttribute("data-cny-done", "1");
      el.innerHTML =
        thb +
        ' <span style="font-size:12px;color:#888;font-weight:normal;">(~ ' +
        formatCNY(thb, rate) +
        " ¥)</span>";
    });

    // Item totals (class "item-total") – e.g. "40฿"
    document.querySelectorAll(".item-total").forEach(function (el) {
      const thb = parseTHB(el.textContent);
      if (thb == null) return;
      if (el.getAttribute("data-cny-done")) return;
      el.setAttribute("data-cny-done", "1");
      el.innerHTML =
        thb +
        "฿" +
        ' <span style="font-size:11px;color:#888;font-weight:normal;">(~ ' +
        formatCNY(thb, rate) +
        " ¥)</span>";
    });

    // Order summary values (class "value" or "total-value")
    document
      .querySelectorAll(
        ".summary-row .value, .summary-total .total-value"
      )
      .forEach(function (el) {
        const thb = parseTHB(el.textContent);
        if (thb == null) return;
        if (el.getAttribute("data-cny-done")) return;
        el.setAttribute("data-cny-done", "1");
        el.innerHTML =
          el.textContent.trim() +
          ' <span style="font-size:11px;color:#888;font-weight:normal;">(~ ' +
          formatCNY(thb, rate) +
          " ¥)</span>";
      });

    // --- Checkout page ---

    // Price values (class "price-value") – e.g. "฿ 40"
    document.querySelectorAll(".price-value").forEach(function (el) {
      const thb = parseTHB(el.textContent);
      if (thb == null) return;
      if (el.getAttribute("data-cny-done")) return;
      el.setAttribute("data-cny-done", "1");
      el.innerHTML =
        el.textContent.trim() +
        ' <span style="font-size:11px;color:#888;font-weight:normal;">(~ ' +
        formatCNY(thb, rate) +
        " ¥)</span>";
    });
  }

  document.addEventListener("DOMContentLoaded", applyExchangeRate);
})();
