(function () {
  var CART_PATH_PATTERN = /\/cart\/?$/;
  var BUTTON_SELECTOR = "[data-share-cart-pro-button]";
  var SUMMARY_SELECTORS = [
    "[data-cart-summary]",
    "[data-cart-totals]",
    ".cart-summary",
    ".cart__summary",
    ".cart__footer",
    ".cart-footer",
    ".cart__blocks",
    ".cart__ctas",
    ".totals",
    "#main-cart-footer",
    "cart-items + div",
  ];

  function getMerchantToken() {
    try {
      var token = sessionStorage.getItem("shareCartProMerchantToken");
      var expiresAt = sessionStorage.getItem("shareCartProMerchantTokenExpiresAt");
      var isValid = Boolean(token && expiresAt && new Date(expiresAt).getTime() > Date.now());
      return isValid ? token : "";
    } catch (_error) {
      return "";
    }
  }

  function canShowButton() {
    var config = window.ShareCartPro || {};
    return Boolean(config.canGenerate || getMerchantToken());
  }

  function findCheckoutButton() {
    return document.querySelector('form[action*="/cart"] [name="checkout"], form[action*="/cart"] button[type="submit"], form[action*="/cart"] input[type="submit"], button[name="checkout"], input[name="checkout"]');
  }

  function findFallbackTarget() {
    for (var i = 0; i < SUMMARY_SELECTORS.length; i += 1) {
      var target = document.querySelector(SUMMARY_SELECTORS[i]);
      if (target) return target;
    }

    return document.querySelector('form[action*="/cart"]') || document.querySelector("main");
  }

  function createButtonBlock() {
    var wrapper = document.createElement("div");
    wrapper.setAttribute("data-share-cart-pro-block", "true");
    wrapper.style.margin = "12px 0 0";
    wrapper.style.width = "100%";

    var button = document.createElement("button");
    button.type = "button";
    button.textContent = "Generate Link";
    button.setAttribute("data-share-cart-pro-button", "true");
    button.style.width = "100%";
    button.style.minHeight = "44px";
    button.style.cursor = "pointer";

    var message = document.createElement("div");
    message.setAttribute("data-share-cart-pro-message", "true");
    message.setAttribute("role", "status");
    message.style.marginTop = "8px";
    message.style.fontSize = "14px";

    wrapper.appendChild(button);
    wrapper.appendChild(message);

    function setMessage(text, isError) {
      message.textContent = text;
      message.style.color = isError ? "#8a1f11" : "#0a7a35";
    }

    button.addEventListener("click", async function () {
      var config = window.ShareCartPro || {};
      button.disabled = true;
      button.textContent = "Generating...";
      setMessage("", false);

      try {
        var cartResponse = await fetch("/cart.js", { headers: { Accept: "application/json" } });
        if (!cartResponse.ok) throw new Error("Could not read the current cart.");
        var cart = await cartResponse.json();

        var saveResponse = await fetch(config.generateEndpoint || "/apps/saved-cart/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ cart: cart, merchantToken: getMerchantToken() }),
        });
        var responseText = await saveResponse.text();
        var result = {};
        try {
          result = responseText ? JSON.parse(responseText) : {};
        } catch (_error) {
          result = { error: responseText };
        }
        if (!saveResponse.ok) throw new Error(result.error || ("Could not generate the saved cart link. HTTP " + saveResponse.status));

        var absoluteUrl = new URL(result.url, window.location.origin).href;
        await navigator.clipboard.writeText(absoluteUrl);
        setMessage("Saved cart link copied to clipboard.", false);
      } catch (error) {
        setMessage(error.message || "Could not generate the saved cart link.", true);
      } finally {
        button.disabled = false;
        button.textContent = "Generate Link";
      }
    });

    return wrapper;
  }

  function mountButton() {
    if (!CART_PATH_PATTERN.test(window.location.pathname)) return true;
    if (!canShowButton()) return true;
    if (document.querySelector(BUTTON_SELECTOR)) return true;

    var block = createButtonBlock();
    var checkoutButton = findCheckoutButton();

    if (checkoutButton) {
      checkoutButton.insertAdjacentElement("afterend", block);
      return true;
    }

    var target = findFallbackTarget();
    if (!target || !target.parentNode) return false;

    target.parentNode.insertBefore(block, target);
    return true;
  }

  function boot() {
    if (mountButton()) return;

    var startedAt = Date.now();
    var observer = new MutationObserver(function () {
      if (mountButton() || Date.now() - startedAt > 10000) {
        observer.disconnect();
      }
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();


