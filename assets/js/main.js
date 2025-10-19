// Sidebar toggle and contact shortcuts
(function(){
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('backdrop');
  const toggle = document.getElementById('sidebarToggle');
  const closeBtn = document.getElementById('sidebarClose');
  const contactBtns = document.querySelectorAll('[data-open-contact]');

  function openSidebar(){ sidebar.classList.add('open'); sidebar.setAttribute('aria-hidden','false'); backdrop.hidden = false; toggle.setAttribute('aria-expanded','true'); }
  function closeSidebar(){ sidebar.classList.remove('open'); sidebar.setAttribute('aria-hidden','true'); backdrop.hidden = true; toggle.setAttribute('aria-expanded','false'); }

  toggle?.addEventListener('click', openSidebar);
  closeBtn?.addEventListener('click', closeSidebar);
  backdrop?.addEventListener('click', closeSidebar);
  contactBtns.forEach(btn => btn.addEventListener('click', openSidebar));

  // Smooth scroll for internal anchors
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href')?.slice(1);
      const el = id ? document.getElementById(id) : null;
      if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });
})();

// Floating phrases positions (free, unbounded, layered)
(function(){
  const cloud = document.querySelector('.splash .cloud');
  if(!cloud) return;
  const phrases = cloud.querySelectorAll('.phrase');
  const { innerWidth:w, innerHeight:h } = window;
  phrases.forEach((p, i) => {
    const x = Math.random() * (w * 0.8);
    const y = Math.random() * (h * 0.7);
    p.style.left = `${x}px`;
    p.style.top = `${y}px`;
    p.style.animationDelay = `${(Math.random()*10).toFixed(2)}s`;
  });
})();

// Daily quote (UTC) shown in the logo area
(async function(){
  const quoteEl = document.querySelector('.logo-quote');
  if(!quoteEl) return;
  try {
    const res = await fetch('/data/quotes.json', { cache: 'no-store' });
    if(!res.ok) return;
    const quotes = await res.json();
    const now = new Date();
    const start = Date.UTC(now.getUTCFullYear(), 0, 1);
    const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
    const dayOfYear = Math.floor((today - start) / (24*3600*1000));
    const idx = quotes.length ? (dayOfYear % quotes.length) : 0;
    quoteEl.textContent = quotes[idx] || '';
  } catch(e) { /* silent */ }
})();

// Comments: progressive enhancement
(function(){
  const form = document.getElementById('commentForm');
  if(!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const textarea = form.querySelector('textarea[name=comment]');
    const msg = (textarea?.value || '').trim();
    if (!msg) return;
    const btn = form.querySelector('button[type=submit]');
    btn.disabled = true; btn.textContent = 'Posting…';
    try {
      const res = await fetch('/api/comment_post.php', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ comment: msg }) });
      const data = await res.json();
      if (data && data.ok) {
        textarea.value = '';
        const list = document.querySelector('.comment-list');
        if (list) {
          const item = document.createElement('div');
          item.className = 'comment';
          const meta = document.createElement('div');
          meta.className = 'meta';
          meta.textContent = `${data.comment.name} • ${new Date(data.comment.time).toLocaleString()}`;
          const body = document.createElement('div');
          body.textContent = data.comment.text;
          item.appendChild(meta); item.appendChild(body);
          list.prepend(item);
        }
      }
    } catch (e) { /* ignore */ }
    finally { btn.disabled = false; btn.textContent = 'Post Comment'; }
  });
})();
