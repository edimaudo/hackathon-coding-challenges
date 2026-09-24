(function () {
  "use strict";

  function setCookie(name, value) {
    var oneYear = 60 * 60 * 24 * 365;
    document.cookie = name + "=" + value + "; path=/; max-age=" + oneYear + "; SameSite=Lax";
  }

  function applyTheme(theme) {
    document.body.setAttribute("data-theme", theme);
    document.querySelectorAll("[data-theme-btn]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(btn.getAttribute("data-theme-btn") === theme));
    });
    setCookie("qms_theme", theme);
  }

  function applyFontScale(scale) {
    document.body.setAttribute("data-font-scale", scale);
    document.querySelectorAll("[data-font-btn]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(btn.getAttribute("data-font-btn") === scale));
    });
    setCookie("qms_font_scale", scale);
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-theme-btn]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyTheme(btn.getAttribute("data-theme-btn"));
      });
    });
    document.querySelectorAll("[data-font-btn]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyFontScale(btn.getAttribute("data-font-btn"));
      });
    });
  });
})();
