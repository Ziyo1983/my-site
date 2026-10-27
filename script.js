// Mavzu (qorong'i / yorug') — sahifa chizilishidan oldin o'rnatiladi, miltillamasligi uchun
(function () {
  var root = document.documentElement;
  var theme = "dark";
  try { theme = localStorage.getItem("theme") || "dark"; } catch (e) {}
  root.setAttribute("data-theme", theme);

  function apply(t) {
    root.setAttribute("data-theme", t);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", t === "light" ? "#f4f3f0" : "#0b0b0c");
  }

  document.addEventListener("DOMContentLoaded", function () {
    apply(root.getAttribute("data-theme"));

    var year = document.getElementById("y");
    if (year) year.textContent = new Date().getFullYear();

    var toggle = document.getElementById("theme-toggle");
    if (toggle) toggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      root.classList.add("theme-anim");
      apply(next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      setTimeout(function () { root.classList.remove("theme-anim"); }, 400);
    });
  });
})();
