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

  const quotes = $$('.quote'); let q = 0;
  const show = n => { q = (n + quotes.length) % quotes.length; quotes.forEach((el, i) => el.classList.toggle('is-active', i === q)); };
  $('.qnav .prev')?.addEventListener('click', () => show(q - 1));
  $('.qnav .next')?.addEventListener('click', () => show(q + 1));
  if (quotes.length) { show(0); setInterval(() => show(q + 1), 7000); }


  $$('.acc details').forEach(d => {
    const sum = $('summary', d), body = $('p', d);
    sum.addEventListener('click', e => {
      e.preventDefault();
      if (d.dataset.anim) return;
      const opening = !d.open, start = d.offsetHeight;
      if (opening) d.open = true;
      const end = opening ? sum.offsetHeight + body.offsetHeight : sum.offsetHeight;
      d.dataset.anim = 1;
      d.animate({ height: [start + 'px', end + 'px'] }, { duration: 550, easing: 'cubic-bezier(.16,1,.3,1)' })
        .onfinish = () => { if (!opening) d.open = false; delete d.dataset.anim; };
      body.animate({ opacity: opening ? [0, 1] : [1, 0], transform: opening ? ['translateY(-6px)', 'none'] : ['none', 'translateY(-6px)'] }, { duration: 450, easing: 'ease', fill: 'none' });
    });
  });

  document.addEventListener('click', e => { if (e.target.closest('a[href="#"]')) e.preventDefault(); });
  $$('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
})();
