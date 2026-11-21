/* 딴짓플레이 — 다크 모드 초기화 + 전환 버튼
 * <head>에서 동기 실행해 첫 페인트 전에 테마를 정한다(깜빡임 방지).
 * 저장이 막힌 브라우저(시크릿 모드·용량 초과)에서도 화면은 정상 동작한다.
 */
(function () {
  "use strict";

  var KEY = "ddanjit-theme";
  var root = document.documentElement;
  var mq = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

  function read() {
    try {
      var v = window.localStorage.getItem(KEY);
      return v === "dark" || v === "light" ? v : null;
    } catch (e) {
      return null;
    }
  }

  function write(v) {
    try { window.localStorage.setItem(KEY, v); } catch (e) { /* 저장 실패는 무시 */ }
  }

  function prefersDark() {
    return !!(mq && mq.matches);
  }

  function apply(theme) {
    root.setAttribute("data-theme", theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#0f1317" : "#ffffff");
  }

  function current() {
    return root.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  function syncButtons() {
    var isDark = current() === "dark";
    var label = isDark ? "라이트 모드로 전환" : "다크 모드로 전환";
    var buttons = document.querySelectorAll("[data-theme-toggle]");
    for (var i = 0; i < buttons.length; i++) {
      var btn = buttons[i];
      btn.setAttribute("aria-pressed", isDark ? "true" : "false");
      btn.setAttribute("aria-label", label);
      btn.setAttribute("title", label);
      btn.textContent = isDark ? "☀️" : "🌙";
    }
  }

  function set(theme) {
    apply(theme);
    write(theme);
    syncButtons();
  }

  apply(read() || (prefersDark() ? "dark" : "light"));

  if (mq) {
    var onChange = function () {
      if (!read()) apply(prefersDark() ? "dark" : "light");
    };
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

  function init() {
    syncButtons();
    var buttons = document.querySelectorAll("[data-theme-toggle]");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener("click", function () {
        set(current() === "dark" ? "light" : "dark");
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.SLTheme = {
    get: current,
    set: set,
    toggle: function () { set(current() === "dark" ? "light" : "dark"); }
  };
})();
