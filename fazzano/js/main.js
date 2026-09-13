(function () {
  const $ = (s, c = document) => c.querySelector(s); const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const header = $('.header');
  const onScroll = () => header.classList.toggle('is-scrolled', scrollY > 30);
  onScroll(); addEventListener('scroll', onScroll, { passive: true });
  const mnav = $('.mnav'); const set = o => { mnav.classList.toggle('is-open', o); document.body.style.overflow = o ? 'hidden' : ''; };
  $('.burger')?.addEventListener('click', () => set(true)); $('.mnav__close')?.addEventListener('click', () => set(false));
  $$('a', mnav).forEach(a => a.addEventListener('click', () => set(false)));
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); } }), { threshold: .06 });
  $$('.reveal').forEach(el => io.observe(el));
  const force = () => $$('.reveal:not(.is-visible)').forEach(el => { const r = el.getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0) el.classList.add('is-visible'); });
  setTimeout(force, 500); addEventListener('scroll', force, { passive: true });

  /* Hero slider */
  const slides = $$('.hero__slide'); const dots = $$('.hero__dots button'); const count = $('.hero__count'); let cur = 0, timer;
  const go = n => { cur = (n + slides.length) % slides.length; slides.forEach((s, i) => s.classList.toggle('is-active', i === cur)); dots.forEach((d, i) => { d.classList.remove('is-active'); if (i === cur) { void d.offsetWidth; d.classList.add('is-active'); } }); const d = window.__slides && window.__slides[cur]; if (d) { $('#hero-name').textContent = d[0]; $('#hero-meta').innerHTML = `<span><b>${d[1]}</b>Status</span><span><b>${d[2]}</b>Apartamentos</span><span><b>${d[3]}</b>Pouso Alegre - MG</span>`; } if (count) count.textContent = String(cur + 1).padStart(2, '0') + ' / ' + String(slides.length).padStart(2, '0'); clearTimeout(timer); timer = setTimeout(() => go(cur + 1), 7000); };
  dots.forEach((d, i) => d.addEventListener('click', () => go(i)));
  $('.hero__arrow.prev')?.addEventListener('click', () => go(cur - 1)); $('.hero__arrow.next')?.addEventListener('click', () => go(cur + 1));
  if (slides.length) go(0);

  const form = $('#lead-form'); form?.addEventListener('submit', e => { e.preventDefault(); if (!form.reportValidity()) return; $('.form-ok').classList.add('is-visible'); form.reset(); });
  document.addEventListener('click', e => { if (e.target.closest('a[href="#"]')) e.preventDefault(); });
  $$('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
})();
