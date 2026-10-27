// ===================== SOZLAMALAR =====================
// Telegram: buyurtmalar shu akkauntga yuboriladi
var TELEGRAM = "Rebootauto";

// Onlayn to'lov. Merchant ma'lumotlari bo'sh bo'lsa, "To'lash" tugmasi chiqmaydi
// va buyurtma Telegram orqali qabul qilinadi (to'lov havolasini o'zingiz yuborasiz).
var PAYMENT = {
  payme: { merchantId: "", accountField: "order_id" },   // Payme Business kabinetidan
  click: { serviceId: "", merchantId: "" }               // Click Merchant kabinetidan
};

// DIQQAT: quyidagi mahsulotlar va narxlar NAMUNA. O'zingizniki bilan almashtiring.
// kind: bottle | spray | jar | cloth | sponge   price: so'mda
var PRODUCTS = [
  { id: "p1", name: "Qo'pol polirovka pastasi",  size: "500 ml",    price: 180000, cat: "Polirovka", kind: "jar",    color: "#ff4a2b" },
  { id: "p2", name: "Finish polirol",            size: "500 ml",    price: 190000, cat: "Polirovka", kind: "jar",    color: "#2f9bff" },
  { id: "p3", name: "Polirovka gubkasi",         size: "3 dona",    price: 95000,  cat: "Polirovka", kind: "sponge", color: "#f5b82e" },
  { id: "p4", name: "Keramik qoplama",           size: "50 ml",     price: 650000, cat: "Himoya",    kind: "bottle", color: "#8a5cff" },
  { id: "p5", name: "Kuzov uchun vosk",          size: "300 ml",    price: 140000, cat: "Himoya",    kind: "jar",    color: "#e8c46a" },
  { id: "p6", name: "Avto shampun",              size: "1 litr",    price: 85000,  cat: "Yuvish",    kind: "bottle", color: "#22b8cf" },
  { id: "p7", name: "Shina yaltiratgich",        size: "400 ml",    price: 70000,  cat: "Yuvish",    kind: "spray",  color: "#3a3a40" },
  { id: "p8", name: "Mikrofiber sochiq",         size: "3 dona",    price: 90000,  cat: "Yuvish",    kind: "cloth",  color: "#34c77b" },
  { id: "p9", name: "Salon tozalagich",          size: "500 ml",    price: 95000,  cat: "Salon",     kind: "spray",  color: "#ff7a45" },
  { id: "p10", name: "Teri konditsioneri",       size: "250 ml",    price: 110000, cat: "Salon",     kind: "bottle", color: "#c98b5a" }
];
// ======================================================

(function () {
  var $ = function (s) { return document.querySelector(s); };
  var grid = $("#grid"), chips = $("#chips");
  var cartBar = $("#cart-bar"), sheet = $("#sheet");
  var cart = {};          // { id: qty }
  var activeCat = "Hammasi";

  try { cart = JSON.parse(localStorage.getItem("cart") || "{}") || {}; } catch (e) { cart = {}; }
  // eskirgan mahsulotlarni tozalash
  Object.keys(cart).forEach(function (id) { if (!find(id) || !(cart[id] > 0)) delete cart[id]; });

  function find(id) { return PRODUCTS.filter(function (p) { return p.id === id; })[0]; }
  function save() { try { localStorage.setItem("cart", JSON.stringify(cart)); } catch (e) {} }
  function money(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " so'm"; }
  function count() { return Object.keys(cart).reduce(function (s, id) { return s + cart[id]; }, 0); }
  function total() { return Object.keys(cart).reduce(function (s, id) { return s + cart[id] * find(id).price; }, 0); }

  // ---------- mahsulot rasmi (SVG) ----------
  function art(kind, c) {
    var label = '<rect x="%x" y="%y" width="%w" height="%h" rx="4" fill="#fff" fill-opacity=".92"/><rect x="%lx" y="%ly" width="%lw" height="4" rx="2" fill="%c"/>';
    function lab(x, y, w, h) {
      return label.replace("%x", x).replace("%y", y).replace("%w", w).replace("%h", h)
        .replace("%lx", x + 6).replace("%ly", y + 8).replace("%lw", w - 12).replace("%c", c);
    }
    var inner = "";
    if (kind === "bottle") {
      inner = '<rect x="40" y="20" width="20" height="24" rx="3" fill="' + c + '"/><rect x="35" y="8" width="30" height="16" rx="4" fill="#1d1d21"/>' +
        '<rect x="24" y="38" width="52" height="76" rx="12" fill="' + c + '"/><rect x="24" y="38" width="14" height="76" rx="7" fill="#fff" fill-opacity=".18"/>' + lab(32, 62, 36, 32);
    } else if (kind === "spray") {
      inner = '<rect x="30" y="6" width="42" height="14" rx="4" fill="#1d1d21"/><rect x="64" y="10" width="20" height="6" rx="3" fill="#1d1d21"/>' +
        '<rect x="42" y="18" width="16" height="22" rx="3" fill="#1d1d21"/>' +
        '<rect x="24" y="36" width="52" height="78" rx="12" fill="' + c + '"/><rect x="24" y="36" width="14" height="78" rx="7" fill="#fff" fill-opacity=".18"/>' + lab(32, 62, 36, 32);
    } else if (kind === "jar") {
      inner = '<rect x="14" y="40" width="72" height="18" rx="5" fill="#1d1d21"/>' +
        '<rect x="18" y="56" width="64" height="52" rx="12" fill="' + c + '"/><rect x="18" y="56" width="14" height="52" rx="7" fill="#fff" fill-opacity=".18"/>' + lab(30, 68, 40, 28);
    } else if (kind === "cloth") {
      inner = '<rect x="20" y="72" width="64" height="26" rx="6" fill="' + c + '" fill-opacity=".6"/>' +
        '<rect x="16" y="56" width="68" height="26" rx="6" fill="' + c + '" fill-opacity=".8"/>' +
        '<rect x="12" y="38" width="72" height="28" rx="6" fill="' + c + '"/><path d="M20 46h56M20 54h56" stroke="#fff" stroke-opacity=".35" stroke-width="2"/>';
    } else { // sponge
      inner = '<rect x="16" y="52" width="68" height="40" rx="14" fill="' + c + '"/><rect x="16" y="40" width="68" height="40" rx="14" fill="' + c + '" fill-opacity=".85"/>' +
        '<circle cx="34" cy="58" r="3" fill="#000" fill-opacity=".18"/><circle cx="52" cy="52" r="3.5" fill="#000" fill-opacity=".18"/><circle cx="68" cy="62" r="3" fill="#000" fill-opacity=".18"/><circle cx="44" cy="70" r="2.5" fill="#000" fill-opacity=".18"/>';
    }
    return '<svg viewBox="0 0 100 120" aria-hidden="true">' + inner + "</svg>";
  }

  // ---------- kategoriyalar ----------
  function renderChips() {
    var cats = ["Hammasi"];
    PRODUCTS.forEach(function (p) { if (cats.indexOf(p.cat) < 0) cats.push(p.cat); });
    chips.innerHTML = cats.map(function (c) {
      return '<button class="chip" role="tab" type="button" data-cat="' + c + '" aria-selected="' + (c === activeCat) + '">' + c + "</button>";
    }).join("");
  }
  chips.addEventListener("click", function (e) {
    var b = e.target.closest(".chip"); if (!b) return;
    activeCat = b.dataset.cat; renderChips(); renderGrid();
  });

  // ---------- katalog ----------
  function ctl(id) {
    var q = cart[id] || 0;
    if (!q) return '<button class="p-add" type="button" data-act="add" data-id="' + id + '" aria-label="Savatga qo\'shish">+</button>';
    return '<div class="p-step"><button type="button" data-act="add" data-id="' + id + '" aria-label="Ko\'paytirish">+</button>' +
      "<span>" + q + '</span><button class="minus" type="button" data-act="sub" data-id="' + id + '" aria-label="Kamaytirish">−</button></div>';
  }
  function renderGrid() {
    grid.innerHTML = PRODUCTS.filter(function (p) { return activeCat === "Hammasi" || p.cat === activeCat; }).map(function (p) {
      return '<article class="p-card" data-card="' + p.id + '"><div class="p-ctl">' + ctl(p.id) + "</div>" +
        '<div class="p-art">' + art(p.kind, p.color) + "</div>" +
        "<h3>" + p.name + '</h3><div class="p-meta">' + p.size + "</div>" +
        '<div class="p-price">' + money(p.price) + "</div></article>";
    }).join("");
  }
  function refreshCard(id) {
    var el = grid.querySelector('[data-card="' + id + '"] .p-ctl');
    if (el) el.innerHTML = ctl(id);
  }

  function change(id, d) {
    cart[id] = Math.max(0, (cart[id] || 0) + d);
    if (!cart[id]) delete cart[id];
    save(); refreshCard(id); renderBar();
    if (sheet.open) renderLines();
  }
  grid.addEventListener("click", function (e) {
    var b = e.target.closest("button[data-act]"); if (!b) return;
    change(b.dataset.id, b.dataset.act === "add" ? 1 : -1);
  });

  // ---------- savat paneli ----------
  function renderBar() {
    var n = count();
    cartBar.hidden = n === 0;
    $("#cart-count").textContent = n ? "· " + n + " ta" : "";
    $("#cart-total").textContent = money(total());
  }

  function renderLines() {
    var ids = Object.keys(cart);
    var ul = $("#lines");
    if (!ids.length) {
      ul.innerHTML = '<li class="empty">Savat bo\'sh</li>';
      $("#order-form").hidden = true; $(".total-row").hidden = true; $("#sum").textContent = "";
      return;
    }
    $("#order-form").hidden = false; $(".total-row").hidden = false;
    ul.innerHTML = ids.map(function (id) {
      var p = find(id);
      return '<li class="line"><div class="thumb">' + art(p.kind, p.color) + "</div>" +
        "<div><b>" + p.name + "</b><small>" + p.size + " · " + money(p.price * cart[id]) + "</small></div>" +
        '<div class="qty"><button type="button" data-lact="sub" data-id="' + id + '" aria-label="Kamaytirish">−</button><span>' + cart[id] +
        '</span><button type="button" data-lact="add" data-id="' + id + '" aria-label="Ko\'paytirish">+</button></div></li>';
    }).join("");
    $("#sum").textContent = money(total());
  }
  $("#lines").addEventListener("click", function (e) {
    var b = e.target.closest("button[data-lact]"); if (!b) return;
    change(b.dataset.id, b.dataset.lact === "add" ? 1 : -1);
    if (!count()) renderBar();
  });

  function openSheet() {
    $("#view-cart").hidden = false; $("#view-done").hidden = true;
    $("#sheet-title").textContent = "Savat";
    $("#form-error").hidden = true;
    renderLines();
    if (!sheet.open) sheet.showModal();
  }
  cartBar.addEventListener("click", openSheet);
  sheet.addEventListener("click", function (e) { if (e.target === sheet) sheet.close(); }); // fonga bosilsa yopiladi
  $("#done-close").addEventListener("click", function () { sheet.close(); });

  // ---------- buyurtma ----------
  function utf8b64(s) { return btoa(unescape(encodeURIComponent(s))); }

  function payUrl(method, orderId, sum) {
    if (method === "payme" && PAYMENT.payme.merchantId) {
      var raw = "m=" + PAYMENT.payme.merchantId + ";ac." + PAYMENT.payme.accountField + "=" + orderId + ";a=" + (sum * 100);
      return "https://checkout.paycom.uz/" + utf8b64(raw);
    }
    if (method === "click" && PAYMENT.click.serviceId && PAYMENT.click.merchantId) {
      return "https://my.click.uz/services/pay?service_id=" + encodeURIComponent(PAYMENT.click.serviceId) +
        "&merchant_id=" + encodeURIComponent(PAYMENT.click.merchantId) +
        "&amount=" + sum + "&transaction_param=" + encodeURIComponent(orderId);
    }
    return "";
  }

  $("#order-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var f = e.target, err = $("#form-error");
    var el = f.elements;
    var name = el.name.value.trim(), phone = el.phone.value.trim(), note = el.note.value.trim();
    var method = el.pay.value;
    [el.name, el.phone].forEach(function (i) { i.classList.remove("invalid"); });

    var bad = null;
    if (name.length < 2) bad = el.name;
    else if (phone.replace(/\D/g, "").length < 9) bad = el.phone;
    if (bad) {
      bad.classList.add("invalid"); bad.focus();
      err.textContent = bad === el.name ? "Ismingizni kiriting." : "Telefon raqamini to'g'ri kiriting.";
      err.hidden = false; return;
    }
    err.hidden = true;

    var orderId = "RB-" + Date.now().toString(36).slice(-5).toUpperCase();
    var sum = total();
    var payName = { click: "Click", payme: "Payme", cash: "Naqd" }[method];
    var lines = Object.keys(cart).map(function (id) {
      var p = find(id); return "• " + p.name + " (" + p.size + ") × " + cart[id] + " — " + money(p.price * cart[id]);
    });
    var text = "Yangi buyurtma " + orderId + "\n\n" + lines.join("\n") + "\n\nJami: " + money(sum) +
      "\n\nIsm: " + name + "\nTelefon: " + phone + (note ? "\nManzil/izoh: " + note : "") + "\nTo'lov: " + payName;

    var pay = payUrl(method, orderId, sum);
    $("#order-id").textContent = orderId;
    $("#tg-link").href = "https://t.me/" + TELEGRAM + "?text=" + encodeURIComponent(text);
    var payLink = $("#pay-link");
    payLink.hidden = !pay;
    if (pay) { payLink.href = pay; payLink.textContent = payName + " orqali to'lash"; }
    $("#done-text").textContent = pay
      ? "Avval buyurtmani Telegramda yuboring, keyin " + payName + " orqali to'lang."
      : method === "cash"
        ? "Buyurtmani Telegramda yuboring. To'lov naqd, olib ketishda yoki yetkazilganda."
        : "Buyurtmani Telegramda yuboring. " + payName + " orqali to'lov havolasini biz yuboramiz.";

    $("#sheet-title").textContent = "Rahmat!";
    $("#view-cart").hidden = true; $("#view-done").hidden = false;
    cart = {}; save(); renderBar(); renderGrid();
  });

  renderChips(); renderGrid(); renderBar();
})();
