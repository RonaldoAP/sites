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

  /* Zona Sul — lista rolável; item mais centralizado fica ativo */
  const list = $('#zs-list'); const items = $$('.zs__item'); const media = $('.zs__media'); const imgs = $$('.zs__media img'); const cap = $('.zs__caption b');
  if (list && items.length) {
    let cur = -1;
    const pick = (n) => {
      if (n === cur) return; cur = n; const btn = items[n];
      items.forEach(i => i.classList.toggle('is-active', i === btn));
      const key = btn.dataset.img;
      imgs.forEach(i => i.classList.toggle('is-active', i.dataset.key === key));
      media.classList.toggle('is-empty', !key);
      cap.textContent = btn.querySelector('b').textContent; $('.zs__empty b').textContent = cap.textContent;
    };
    const fromScroll = () => {
      const lr = list.getBoundingClientRect(); const atEnd = list.scrollTop + list.clientHeight >= list.scrollHeight - 2;
      if (atEnd) return pick(items.length - 1);
      if (list.scrollTop <= 2) return pick(0);
      const mid = lr.top + lr.height / 2; let best = 0, bd = 1e9;
      items.forEach((it, i) => { const r = it.getBoundingClientRect(); const d = Math.abs(r.top + r.height / 2 - mid); if (d < bd) { bd = d; best = i; } });
      pick(best);
    };
    let raf; list.addEventListener('scroll', () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(fromScroll); }, { passive: true });
    items.forEach((b, i) => {
      b.addEventListener('click', () => { pick(i); b.scrollIntoView({ block: 'center', behavior: 'smooth' }); });
      b.addEventListener('mouseenter', () => { if (matchMedia('(hover:hover)').matches) pick(i); });
    });
    pick(0);
  }

  /* Hero video: fall back to poster if it fails */
  const v = $('.hero__media video');
  v?.addEventListener('error', () => { v.remove(); });
  if (v) { const on = () => v.classList.add('is-playing'); v.addEventListener('playing', on); v.addEventListener('timeupdate', () => { if (v.currentTime > 0.05) on(); }, { once: true }); v.play && v.play().catch(() => {}); }

  const form = $('#lead-form');
  form?.addEventListener('submit', e => { e.preventDefault(); if (!form.reportValidity()) return; $('.form-ok').classList.add('is-visible'); form.reset(); });
  document.addEventListener('click', e => { if (e.target.closest('a[href="#"]')) e.preventDefault(); });
  $$('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
})();
