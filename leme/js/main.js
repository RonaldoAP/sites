(function () {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  const header = $('.header');
  const onScroll = () => header.classList.toggle('is-scrolled', scrollY > 30);
  onScroll(); addEventListener('scroll', onScroll, { passive: true });

  const mnav = $('.mnav');
  const set = o => { mnav.classList.toggle('is-open', o); document.body.style.overflow = o ? 'hidden' : ''; };
  $('.burger')?.addEventListener('click', () => set(true));
  $('.mnav__close')?.addEventListener('click', () => set(false));
  $$('a', mnav).forEach(a => a.addEventListener('click', () => set(false)));

  // reveal + linha de topo animada (.svc li, .step)
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); } }), { threshold: .06 });
  $$('.reveal, .svc li, .step').forEach(el => io.observe(el));
  const force = () => $$('.reveal:not(.is-visible)').forEach(el => { const r = el.getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0) el.classList.add('is-visible'); });
  setTimeout(force, 500); addEventListener('scroll', force, { passive: true });

  document.addEventListener('click', e => { if (e.target.closest('a[href="#"]')) e.preventDefault(); });
  $$('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
})();
