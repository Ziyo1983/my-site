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

    // Menyu: ekrandagi bo'limga mos havolani urg'u rangida ko'rsatish
    var links = document.querySelectorAll(".nav a[href^='#']");
    if (links.length && "IntersectionObserver" in window) {
      var byId = {};
      links.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          links.forEach(function (a) { a.classList.remove("is-active"); });
          var link = byId[e.target.id];
          if (link) link.classList.add("is-active");
        });
      }, { rootMargin: "-35% 0px -60% 0px" });
      Object.keys(byId).forEach(function (id) {
        var el = document.getElementById(id);
        if (el) io.observe(el);
      });
    }
  });
})();
