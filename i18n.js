/* RPX embedded sites i18n — lê ?lang da URL (controlado pelo site pai) */
(function () {
  "use strict";
  var LANGS = ["pt", "en", "es"];
  var DICT = { en: (window.RPX_SITE_EN || {}), es: (window.RPX_SITE_ES || {}) };
  var lang = "pt";
  try {
    var u = new URLSearchParams(location.search).get("lang");
    if (u && LANGS.indexOf(u) >= 0) lang = u;
  } catch (e) {}

  function tr(str) {
    if (lang === "pt" || !str) return null;
    var key = str.trim();
    if (!key) return null;
    var d = DICT[lang];
    if (d && Object.prototype.hasOwnProperty.call(d, key)) return d[key];
    return null;
  }
  function applyText(root) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        var p = n.parentNode;
        if (!p) return NodeFilter.FILTER_REJECT;
        var t = p.nodeName;
        if (t === "SCRIPT" || t === "STYLE" || t === "NOSCRIPT") return NodeFilter.FILTER_REJECT;
        if (!n.nodeValue || !n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var nodes = [], n;
    while ((n = walker.nextNode())) nodes.push(n);
    nodes.forEach(function (node) {
      var raw = node.nodeValue, t = tr(raw);
      if (t != null) node.nodeValue = raw.match(/^\s*/)[0] + t + raw.match(/\s*$/)[0];
    });
  }
  var ATTRS = ["alt", "title", "placeholder", "aria-label", "value", "content"];
  function applyAttrs(root) {
    ATTRS.forEach(function (a) {
      var els = root.querySelectorAll("[" + a + "]");
      Array.prototype.forEach.call(els, function (el) {
        var t = tr(el.getAttribute(a));
        if (t != null) el.setAttribute(a, t);
      });
    });
  }
  function run() {
    if (lang !== "pt") {
      applyText(document.body);
      applyAttrs(document.documentElement);
      var tt = tr(document.title);
      if (tt != null) document.title = tt;
    }
    document.documentElement.setAttribute("lang", lang === "pt" ? "pt-BR" : lang);
    document.documentElement.setAttribute("translate", "no");
    document.documentElement.classList.add("notranslate");
    if (!document.querySelector('meta[name="google"][content="notranslate"]')) {
      var mt = document.createElement("meta");
      mt.name = "google"; mt.content = "notranslate";
      document.head.appendChild(mt);
    }
  }
  if (document.body) run();
  else document.addEventListener("DOMContentLoaded", run);
})();
