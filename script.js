// Mavzu (qorong'i / yorug') — sahifa chizilishidan oldin o'rnatiladi, miltillamasligi uchun
(function () {
  var root = document.documentElement;
  var theme = "dark";
  try { theme = localStorage.getItem("theme") || "dark"; } catch (e) {}
  root.setAttribute("data-theme", theme);

  // Scroll'da paydo bo'lish: harakat cheklanmagan va brauzer qo'llasagina yoqiladi, aks holda hammasi ko'rinib turadi
  var reveal = "IntersectionObserver" in window &&
    !(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
  if (reveal) root.classList.add("js-reveal");

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

    // Mavzu boshqa oynada (masalan, telefon oynasi ichida) o'zgarsa, shu oynada ham yangilanadi
    window.addEventListener("storage", function (e) {
      if (e.key === "theme" && e.newValue) apply(e.newValue);
    });

    // Mobil ko'rinish: telefon oynasi. Sayt nusxasi (iframe) faqat birinchi ochilganda yuklanadi.
    // iframe ichidagi nusxada bu tugma ishlamaydi (window.top tekshiruvi).
    var mvOpen = document.getElementById("mv-open");
    var mv = document.getElementById("mv-modal");
    if (mvOpen && mv && window.self === window.top) {
      var mvFrame = mv.querySelector(".mv-frame");
      var mvShow = function () {
        if (!mvFrame.getAttribute("src")) mvFrame.setAttribute("src", "index.html");
        mv.hidden = false;
        mv.classList.add("is-open");
        root.classList.add("mv-lock");
        mv.querySelector(".mv-close").focus();
      };
      var mvHide = function () {
        mv.hidden = true;
        mv.classList.remove("is-open");
        root.classList.remove("mv-lock");
        mvOpen.focus();   // fokus doim ochuvchi tugmaga qaytadi
      };
      mvOpen.addEventListener("click", mvShow);
      mv.addEventListener("click", function (e) { if (e.target.closest("[data-close]")) mvHide(); });
      document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !mv.hidden) mvHide(); });
    }

    // Elementlar ekranga kirganda bir marta yumshoq ko'tarilib chiqadi; birga kirganlar 60 ms oraliqda
    if (reveal) {
      var rio = new IntersectionObserver(function (entries) {
        var n = 0;
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          e.target.style.setProperty("--d", Math.min(n++, 4) * 60 + "ms");
          e.target.classList.add("in");
          rio.unobserve(e.target);
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.1 });
      document.querySelectorAll(".label, .about, .card, .work, .review, .faq-item, .contact h2, .contact-item")
        .forEach(function (el) { el.classList.add("reveal"); rio.observe(el); });
    }

    // Menyu: ekrandagi bo'limga mos havolani urg'u rangida ko'rsatish
    var nav = document.querySelector(".nav");
    var links = document.querySelectorAll(".nav a[href^='#']");
    if (nav) {
      // qator oxiriga yetganda o'ng chetdagi xiralik yo'qoladi
      var edge = function () { nav.classList.toggle("nav-end", nav.scrollLeft + nav.clientWidth >= nav.scrollWidth - 2); };
      nav.addEventListener("scroll", edge, { passive: true });
      window.addEventListener("resize", edge);
      edge();
    }
    if (links.length && "IntersectionObserver" in window) {
      var byId = {};
      links.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          links.forEach(function (a) { a.classList.remove("is-active"); });
          var link = byId[e.target.id];
          if (link) {
            link.classList.add("is-active");
            // Telefonda menyu qatori siljiydi: joriy havola doim ko'rinadigan bo'lsin
            var nr = nav.getBoundingClientRect(), lr = link.getBoundingClientRect();
            nav.scrollTo({ left: nav.scrollLeft + (lr.left - nr.left) - (nr.width - lr.width) / 2, behavior: reveal ? "smooth" : "auto" });
          }
        });
      }, { rootMargin: "-35% 0px -60% 0px" });
      Object.keys(byId).forEach(function (id) {
        var el = document.getElementById(id);
        if (el) io.observe(el);
      });
    }
  });
})();
