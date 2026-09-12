/* Alto Padrão — interações da landing */
(function () {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* Mobile nav */
  const mnav = $('.mobile-nav');
  const openBtn = $('.menu-toggle');
  const closeBtn = $('.mobile-nav__close');
  const setNav = (open) => {
    mnav.classList.toggle('is-open', open);
    openBtn.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  };
  openBtn?.addEventListener('click', () => setNav(true));
  closeBtn?.addEventListener('click', () => setNav(false));
  $$('a', mnav).forEach(a => a.addEventListener('click', () => setNav(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setNav(false); });

  /* Hero showcase */
  const slides = $$('.hero-showcase__slide');
  const nums = $$('.hero-showcase__num');
  const bar = $('.hero-showcase__bar');
  let cur = 0, timer;
  const go = (n) => {
    cur = (n + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle('is-active', i === cur));
    nums.forEach((s, i) => s.classList.toggle('is-active', i === cur));
    if (bar) { bar.classList.remove('is-running'); void bar.offsetWidth; bar.classList.add('is-running'); }
    clearTimeout(timer);
    timer = setTimeout(() => go(cur + 1), 5000);
  };
  nums.forEach((b, i) => b.addEventListener('click', () => go(i)));
  if (slides.length) go(0);

  /* Service cards */
  const cards = $$('.service-card');
  const activate = (card) => {
    cards.forEach(c => c.classList.toggle('is-active', c === card));
    if (matchMedia('(max-width:900px)').matches) card.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' });
  };
  cards.forEach(c => {
    c.addEventListener('click', () => activate(c));
    c.addEventListener('mouseenter', () => { if (matchMedia('(hover:hover)').matches) activate(c); });
  });

  /* Reveal on scroll */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); } });
  }, { threshold: 0.06, rootMargin: '0px 0px -4% 0px' });
  $$('.reveal').forEach(el => io.observe(el));
  const force = () => $$('.reveal:not(.is-visible)').forEach(el => {
    const r = el.getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0) el.classList.add('is-visible');
  });
  setTimeout(force, 500); addEventListener('scroll', force, { passive: true });

  /* Formulário (sem envio, apenas feedback) */
  const form = $('#estimate-form');
  form?.addEventListener('submit', ev => {
    ev.preventDefault();
    if (!form.reportValidity()) return;
    $('.form-feedback')?.classList.add('is-visible');
    form.reset();
  });

  $$('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
})();

/* Botões sem redirecionamento */
document.addEventListener('click', e => {
  const a = e.target.closest('a[href="#"]');
  if (a) e.preventDefault();
});
