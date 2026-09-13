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

  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); } }), { threshold: .06 });
  $$('.reveal').forEach(el => io.observe(el));
  const force = () => $$('.reveal:not(.is-visible)').forEach(el => { const r = el.getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0) el.classList.add('is-visible'); });
  setTimeout(force, 500); addEventListener('scroll', force, { passive: true });

  /* Zona Sul */
  const items = $$('.zs__item'); const media = $('.zs__media'); const imgs = $$('.zs__media img'); const cap = $('.zs__caption b');
  const pick = (btn) => {
    items.forEach(i => i.classList.toggle('is-active', i === btn));
    const key = btn.dataset.img;
    imgs.forEach(i => i.classList.toggle('is-active', i.dataset.key === key));
    media.classList.toggle('is-empty', !key);
    cap.textContent = btn.querySelector('b').textContent;
    $('.zs__empty b').textContent = btn.querySelector('b').textContent;
  };
  items.forEach(b => { b.addEventListener('click', () => pick(b)); b.addEventListener('mouseenter', () => { if (matchMedia('(hover:hover)').matches) pick(b); }); });
  if (items.length) pick(items[0]);

  /* Hero video: fall back to poster if it fails */
  const v = $('.hero__media video');
  v?.addEventListener('error', () => { v.remove(); });

  const form = $('#lead-form');
  form?.addEventListener('submit', e => { e.preventDefault(); if (!form.reportValidity()) return; $('.form-ok').classList.add('is-visible'); form.reset(); });
  document.addEventListener('click', e => { if (e.target.closest('a[href="#"]')) e.preventDefault(); });
  $$('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
})();
