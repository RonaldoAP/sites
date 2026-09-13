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

  /* Zona Sul — sticky scroller */
  const wrap = $('.zs-wrap'); const list = $('#zs-list'); const items = $$('.zs__item'); const media = $('.zs__media'); const imgs = $$('.zs__media img'); const cap = $('.zs__caption b');
  if (wrap && items.length) {
    const track = document.createElement('div'); track.className = 'zs__track'; items.forEach(i => track.appendChild(i)); list.appendChild(track);
    const prog = document.createElement('div'); prog.className = 'zs__progress'; prog.innerHTML = '<i></i>'; list.parentElement.appendChild(prog);
    let cur = -1;
    const pick = (n) => {
      n = Math.max(0, Math.min(items.length - 1, n)); if (n === cur) return; cur = n;
      const btn = items[n];
      items.forEach(i => i.classList.toggle('is-active', i === btn));
      const key = btn.dataset.img;
      imgs.forEach(i => i.classList.toggle('is-active', i.dataset.key === key));
      media.classList.toggle('is-empty', !key);
      cap.textContent = btn.querySelector('b').textContent; $('.zs__empty b').textContent = cap.textContent;
      // keep active item in view inside the list
      const lh = list.clientHeight, top = btn.offsetTop, h = btn.offsetHeight, th = track.scrollHeight;
      let y = top - lh / 2 + h / 2; y = Math.max(0, Math.min(th - lh, y));
      track.style.transform = `translateY(${-y}px)`;
      prog.firstChild.style.width = ((n + 1) / items.length * 100) + '%';
    };
    const onScroll = () => {
      const r = wrap.getBoundingClientRect(); const total = wrap.offsetHeight - innerHeight;
      if (total <= 0) return;
      const p = Math.min(1, Math.max(0, -r.top / total));
      pick(Math.floor(p * items.length));
    };
    addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', onScroll); onScroll(); if (cur < 0) pick(0);
    // click jumps the page to that item's scroll position
    items.forEach((b, i) => b.addEventListener('click', () => {
      const total = wrap.offsetHeight - innerHeight; const y = wrap.offsetTop + (i + 0.5) / items.length * total; scrollTo({ top: y, behavior: 'smooth' });
    }));
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
