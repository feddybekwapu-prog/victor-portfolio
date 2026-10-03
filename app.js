/* Portfolio renderer. Reads everything from /content so edits in the dashboard show up automatically. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const safe = u => (/^\s*(javascript|data|vbscript):/i.test(u) ? '#' : u);
  const img = p => (!p ? '' : /^https?:\/\//i.test(p) ? p : String(p).replace(/^\/+/, ''));
  const fmt = (d, o) => {
    if (!d) return '';
    const dt = new Date(String(d).slice(0, 10) + 'T00:00:00');
    return isNaN(dt) ? '' : dt.toLocaleDateString('en-US', o);
  };

  /* ---------- Minimal markdown ---------- */
  function inline(t) {
    t = esc(t);
    t = t.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (m, a, u) => `<img src="${safe(img(u))}" alt="${a}" loading="lazy">`);
    t = t.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, a, u) => {
      const ext = /^https?:/i.test(u);
      return `<a href="${safe(u)}"${ext ? ' target="_blank" rel="noopener"' : ''}>${a}</a>`;
    });
    t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    t = t.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
    t = t.replace(/`([^`]+)`/g, '<code>$1</code>');
    return t;
  }
  function md(src) {
    const text = String(src || '').replace(/\r/g, '').trim().replace(/^(#{1,3} .*)$/gm, '$1\n');
    if (!text) return '';
    return text.split(/\n{2,}/).map(b => {
      b = b.trim();
      if (!b) return '';
      const h = b.match(/^(#{1,3})\s+(.*)$/);
      if (h) { const l = h[1].length + 1; return `<h${l}>${inline(h[2])}</h${l}>`; }
      const lines = b.split('\n');
      if (lines.every(l => /^\s*[-*]\s+/.test(l))) return `<ul>${lines.map(l => `<li>${inline(l.replace(/^\s*[-*]\s+/, ''))}</li>`).join('')}</ul>`;
      if (lines.every(l => /^\s*\d+\.\s+/.test(l))) return `<ol>${lines.map(l => `<li>${inline(l.replace(/^\s*\d+\.\s+/, ''))}</li>`).join('')}</ol>`;
      if (lines.every(l => /^>/.test(l))) return `<blockquote>${inline(lines.map(l => l.replace(/^>\s?/, '')).join(' '))}</blockquote>`;
      return `<p>${lines.map(inline).join('<br>')}</p>`;
    }).join('');
  }

  /* ---------- Data ---------- */
  const getJSON = async url => {
    const r = await fetch(url, { cache: 'no-cache' });
    if (!r.ok) throw new Error(url);
    return r.json();
  };
  const loadAll = async (folder, slugs) => {
    const out = await Promise.all((slugs || []).map(s => getJSON(`content/${folder}/${s}.json`).then(d => ({ ...d, slug: s })).catch(() => null)));
    return out.filter(Boolean);
  };
  const state = { settings: {}, projects: [], posts: [] };

  /* ---------- Home sections ---------- */
  function renderHero(s) {
    const hero = s.hero || {};
    $('#brand').textContent = s.name || '';
    $('#hero-name').textContent = s.name || '';
    $('#hero-title').textContent = s.title || '';
    if (hero.headline) $('#hero-headline').textContent = hero.headline;
    $('#hero-intro').textContent = s.intro || '';
    if (hero.primary_cta) $('#hero-cta1').textContent = hero.primary_cta;
    if (hero.secondary_cta) $('#hero-cta2').textContent = hero.secondary_cta;
    $('#rw-before').textContent = hero.before || '';
    $('#rw-after').textContent = hero.after || '';
    if (hero.caption) $('#rw-caption').textContent = hero.caption;
    if (!hero.before && !hero.after) $('.rewrite').hidden = true;
    const desc = document.querySelector('meta[name="description"]');
    if (desc && s.intro) desc.content = s.intro;
  }
  function playRewrite() {
    const r = $('.rewrite');
    if (!r || r.hidden) return;
    if (reduceMotion) { r.classList.remove('armed', 'go'); return; }
    r.classList.remove('go');
    r.classList.add('armed');
    void r.offsetWidth;
    requestAnimationFrame(() => r.classList.add('go'));
  }
  function renderAbout(s) {
    const a = s.about || {};
    const fig = $('#portrait');
    fig.innerHTML = a.photo
      ? `<img src="${esc(img(a.photo))}" alt="Portrait of ${esc(s.name || '')}">`
      : `<div class="mono" aria-hidden="true">${esc((s.name || '?').trim().charAt(0))}</div>`;
    $('#about-body').innerHTML = md(a.body);
  }

  function filterBar(el, labels, onPick) {
    if (labels.length < 2) { el.innerHTML = ''; return; }
    el.innerHTML = ['All', ...labels].map((l, i) => `<button type="button" class="filter" aria-pressed="${i === 0}" data-v="${esc(l)}">${esc(l)}</button>`).join('');
    el.onclick = e => {
      const b = e.target.closest('.filter');
      if (!b) return;
      el.querySelectorAll('.filter').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      onPick(b.dataset.v);
    };
  }

  function projectCard(p) {
    const cover = p.cover
      ? `<img src="${esc(img(p.cover))}" alt="" loading="lazy">`
      : `<span class="cover-mark" aria-hidden="true">${esc((p.client || p.title || '?').trim().charAt(0))}</span>`;
    const chips = (p.tags || []).length ? `<ul class="chips">${p.tags.map(t => `<li class="chip">${esc(t)}</li>`).join('')}</ul>` : '';
    return `<article class="pcard${p.featured ? ' is-featured' : ''}">
      <div class="pcard-cover">${cover}</div>
      <div class="pcard-body">
        ${p.client ? `<p class="pcard-client">${esc(p.client)}</p>` : ''}
        <h3><a href="#/projects/${esc(p.slug)}">${esc(p.title)}</a></h3>
        ${p.summary ? `<p>${esc(p.summary)}</p>` : ''}
        ${chips}
      </div></article>`;
  }
  function renderProjects() {
    const grid = $('#project-grid');
    const draw = tag => {
      const list = state.projects.filter(p => tag === 'All' || (p.tags || []).includes(tag));
      grid.innerHTML = list.map(projectCard).join('');
    };
    const tags = [...new Set(state.projects.flatMap(p => p.tags || []))];
    filterBar($('#project-filters'), tags, draw);
    draw('All');
  }

  const readTime = body => `${Math.max(1, Math.round(((body || '').match(/\S+/g) || []).length / 200))} min read`;
  const typeLabel = t => (t === 'Article' ? 'Articles' : 'Quick takes');
  function renderPosts() {
    const ul = $('#post-list');
    const draw = f => {
      const list = state.posts.filter(p => f === 'All' || typeLabel(p.type) === f);
      ul.innerHTML = list.map(p => `<li class="post-row">
        <div class="post-meta"><span>${esc(fmt(p.date, { month: 'short', day: 'numeric', year: 'numeric' }))}</span><span class="badge${p.type === 'Article' ? ' article' : ''}">${esc(p.type || 'Quick take')}</span></div>
        <div><h3><a href="#/blog/${esc(p.slug)}">${esc(p.title)}</a></h3>${p.excerpt ? `<p>${esc(p.excerpt)}</p>` : ''}</div></li>`).join('');
    };
    const labels = [...new Set(state.posts.map(p => typeLabel(p.type)))];
    filterBar($('#post-filters'), labels, draw);
    draw('All');
  }

  function renderSkills(data) {
    const groups = (data.groups || []).filter(g => g.category || (g.items || []).length);
    $('#skill-groups').innerHTML = groups.map(g => `<div><h3>${esc(g.category)}</h3><ul>${(g.items || []).map(i => `<li>${esc(i)}</li>`).join('')}</ul></div>`).join('');
    return groups.length;
  }
  function renderEducation(data) {
    const items = data.entries || [];
    $('#edu-list').innerHTML = items.map(e => `<li><h3>${esc(e.qualification)}</h3><p class="when">${esc(e.period || '')}</p><p>${esc([e.school, e.details].filter(Boolean).join('. '))}</p></li>`).join('');
    return items.length;
  }
  function renderContact(s) {
    const c = s.contact || {};
    if (c.heading) $('#contact-heading').textContent = c.heading;
    $('#contact-text').textContent = c.text || '';
    const links = [];
    if (c.email) links.push(['Email', c.email, `mailto:${c.email}`, false]);
    if (c.linkedin) links.push(['LinkedIn', c.linkedin.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, ''), c.linkedin, true]);
    const wa = String(c.whatsapp || '').replace(/\D/g, '');
    if (wa) links.push(['WhatsApp', 'Message me', `https://wa.me/${wa}${c.whatsapp_message ? '?text=' + encodeURIComponent(c.whatsapp_message) : ''}`, true]);
    $('#contact-links').innerHTML = links.map(([l, v, h, ext]) => `<a class="contact-link" href="${esc(safe(h))}"${ext ? ' target="_blank" rel="noopener"' : ''}>${esc(l)}<span>${esc(v)}</span></a>`).join('');
  }
  function dropSection(id) {
    const sec = document.getElementById(id);
    if (sec) sec.remove();
    document.querySelectorAll(`#nav a[href="#${id}"]`).forEach(a => a.remove());
  }

  /* ---------- Detail pages ---------- */
  const ctaBlock = text => `<div class="detail-cta"><h2>${esc(text)}</h2><a class="btn btn-grey" href="#contact">Get in touch</a></div>`;
  function projectDetail(p) {
    const meta = [['Client', p.client], ['Role', p.role], ['Date', fmt(p.date, { month: 'long', year: 'numeric' })]].filter(m => m[1]);
    const results = (p.results || []).filter(r => r.value || r.label);
    const samples = (p.samples || []).filter(s => s.image || s.text);
    const t = p.testimonial || {};
    return `<article class="detail"><div class="wrap">
      <a class="back" href="#projects">Back to projects</a>
      <h1>${esc(p.title)}</h1>
      ${p.summary ? `<p class="detail-summary">${esc(p.summary)}</p>` : ''}
      ${meta.length ? `<dl class="meta">${meta.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>` : ''}
      ${p.cover ? `<figure class="detail-cover"><img src="${esc(img(p.cover))}" alt=""></figure>` : ''}
      ${results.length ? `<ul class="results">${results.map(r => `<li><strong>${esc(r.value)}</strong><span>${esc(r.label)}</span></li>`).join('')}</ul>` : ''}
      ${p.challenge ? `<section class="d-section"><h2>The challenge</h2><div class="prose">${md(p.challenge)}</div></section>` : ''}
      ${p.approach ? `<section class="d-section"><h2>The approach</h2><div class="prose">${md(p.approach)}</div></section>` : ''}
      ${p.before || p.after ? `<section class="d-section"><h2>The message, rewritten</h2><div class="ba"><div class="b"><h3>Before</h3><p>${esc(p.before)}</p></div><div class="a"><h3>After</h3><p>${esc(p.after)}</p></div></div></section>` : ''}
      ${samples.length ? `<section class="d-section"><h2>Samples</h2><div class="samples">${samples.map(s => `<figure class="sample">${s.image ? `<img src="${esc(img(s.image))}" alt="${esc(s.caption || '')}" loading="lazy">` : ''}${s.text ? `<div class="text">${esc(s.text)}</div>` : ''}${s.caption ? `<figcaption>${esc(s.caption)}</figcaption>` : ''}</figure>`).join('')}</div></section>` : ''}
      ${t.quote ? `<figure class="testimonial"><blockquote>${esc(t.quote)}</blockquote><footer>${t.photo ? `<img src="${esc(img(t.photo))}" alt="">` : ''}<div>${esc(t.name || '')}${t.role ? `<span>${esc(t.role)}</span>` : ''}</div></footer></figure>` : ''}
      ${ctaBlock('Want a message that lands like this?')}
    </div></article>`;
  }
  function postDetail(p) {
    return `<article class="detail"><div class="wrap article">
      <a class="back" href="#blog">Back to blog</a>
      <header class="post-head">
        <h1>${esc(p.title)}</h1>
        <div class="post-meta"><span>${esc(fmt(p.date, { month: 'long', day: 'numeric', year: 'numeric' }))}</span><span class="badge${p.type === 'Article' ? ' article' : ''}">${esc(p.type || 'Quick take')}</span><span>${readTime(p.body)}</span></div>
      </header>
      ${p.cover ? `<figure class="detail-cover"><img src="${esc(img(p.cover))}" alt=""></figure>` : ''}
      <div class="prose">${md(p.body)}</div>
      ${ctaBlock('Have a message that is not landing?')}
    </div></article>`;
  }

  /* ---------- Routing ---------- */
  const home = $('#home'), detail = $('#detail');
  const baseTitle = document.title;
  let savedY = 0, inDetail = false;

  function route() {
    const m = location.hash.match(/^#\/(projects|blog)\/([\w-]+)/);
    if (m) {
      const item = (m[1] === 'projects' ? state.projects : state.posts).find(x => x.slug === m[2]);
      if (item) {
        if (!inDetail) savedY = window.scrollY;
        detail.innerHTML = m[1] === 'projects' ? projectDetail(item) : postDetail(item);
        home.hidden = true; detail.hidden = false; inDetail = true;
        document.title = `${item.title} | ${state.settings.name || ''}`;
        window.scrollTo(0, 0);
        return;
      }
    }
    const id = location.hash.replace('#', '');
    const wasDetail = inDetail;
    detail.hidden = true; home.hidden = false; inDetail = false;
    document.title = baseTitle;
    const target = id && !id.startsWith('/') ? document.getElementById(id) : null;
    if (target) target.scrollIntoView();
    else if (wasDetail) window.scrollTo(0, savedY);
  }

  /* ---------- Mobile menu ---------- */
  const toggle = $('.nav-toggle'), nav = $('#nav');
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? 'Close' : 'Menu';
  });
  nav.addEventListener('click', e => {
    if (e.target.closest('a')) { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); toggle.textContent = 'Menu'; }
  });

  /* ---------- Boot ---------- */
  async function boot() {
    const [settings, skills, education, manifest] = await Promise.all([
      getJSON('content/settings.json').catch(() => ({})),
      getJSON('content/skills.json').catch(() => ({})),
      getJSON('content/education.json').catch(() => ({})),
      getJSON('content/manifest.json').catch(() => ({ projects: [], posts: [] }))
    ]);
    state.settings = settings;
    const byDate = (a, b) => String(b.date || '').localeCompare(String(a.date || ''));
    state.projects = (await loadAll('projects', manifest.projects)).sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || byDate(a, b));
    state.posts = (await loadAll('posts', manifest.posts)).sort(byDate);

    renderHero(settings);
    if (settings.about && (settings.about.body || settings.about.photo)) renderAbout(settings); else dropSection('about');
    if (state.projects.length) renderProjects(); else dropSection('projects');
    if (state.posts.length) renderPosts(); else dropSection('blog');
    if (!renderSkills(skills)) dropSection('skills');
    if (!renderEducation(education)) dropSection('education');
    renderContact(settings);
    $('#footer-text').textContent = `\u00A9 ${new Date().getFullYear()} ${settings.name || ''}${settings.footer_note ? '. ' + settings.footer_note : ''}`;

    $('#rw-replay').addEventListener('click', playRewrite);
    window.addEventListener('hashchange', route);
    if (location.hash) route(); else playRewrite();
    if (location.hash && !inDetail) playRewrite();
  }
  boot();
})();
