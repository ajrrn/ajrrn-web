// Progressive enhancement only: collapse the navigation behind a "Menu"
// button on narrow screens.  Without JavaScript the full menu is shown.
(function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (!toggle || !nav) return;
  var mq = window.matchMedia("(max-width: 52em)");

  function apply() {
    if (mq.matches) {
      toggle.hidden = false;
      nav.classList.add("is-collapsed");
      toggle.setAttribute("aria-expanded", "false");
    } else {
      toggle.hidden = true;
      nav.classList.remove("is-collapsed");
    }
  }
  toggle.addEventListener("click", function () {
    var open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", open ? "false" : "true");
    nav.classList.toggle("is-collapsed", open);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && mq.matches && toggle.getAttribute("aria-expanded") === "true") {
      toggle.setAttribute("aria-expanded", "false");
      nav.classList.add("is-collapsed");
      toggle.focus();
    }
  });
  if (mq.addEventListener) mq.addEventListener("change", apply); else mq.addListener(apply);
  apply();
})();
