/* Global state */
const state = {
  currentPage: document.body.dataset.initialPage || 'home',
  sidebarOpen: document.body.dataset.openSidebar === '1',
  phrases: [],
  quotes: [],
  displayName: null,
  articles: [],
};

const qs = (sel, el=document) => el.querySelector(sel);
const qsa = (sel, el=document) => Array.from(el.querySelectorAll(sel));

function getUTCDateKey() {
  const now = new Date();
  return now.toISOString().slice(0,10); // YYYY-MM-DD
}

async function fetchJSON(url) {
  const res = await fetch(url, { credentials: 'include' });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return await res.json();
}

function getURLParam(name) {
  const url = new URL(location.href);
  return url.searchParams.get(name);
}

function setURLParam(key, value) {
  const url = new URL(location.href);
  if (value === undefined || value === null) {
    url.searchParams.delete(key);
  } else {
    url.searchParams.set(key, value);
  }
  history.pushState({}, '', url);
}

/* Sidebar */
function initSidebar() {
  const sidebar = qs('#sidebar');
  const toggle = qs('#sidebarToggle');
  const open = state.sidebarOpen;
  if (open) sidebar.classList.add('open');
  toggle.addEventListener('click', () => sidebar.classList.toggle('open'));
  qsa('[data-nav]').forEach(btn => btn.addEventListener('click', (e) => {
    const page = e.currentTarget.dataset.nav;
    navigate(page);
    sidebar.classList.remove('open');
  }));
}

/* Intro phrases */
function loadPhrases() {
  // 34 phrases across 3 groups
  const group1 = [
    'Andromeda — “ruler of men.”',
    'Named for a mythic princess.',
    'Daughter of Cepheus and Cassiopeia.',
    'Chained upon the sea rock.',
    'Rescued by the hero Perseus.',
    'Her tale crowns autumn skies.',
    'Constellation beside Pegasus.',
    'Cassiopeia watches from the throne.',
    'Navigators traced her chains.',
    'Pride, peril, and redemption.',
  ];
  const group2 = [
    'Greeks told of a saved princess.',
    'Romans etched her in star-lore.',
    "Arab astronomers saw a 'small cloud'.",
    'Persian texts likened her to mist.',
    'Chinese notes marked a fuzzy star.',
    'Medieval scholars argued: comet or nebula?',
    'Voyagers read seasons by her rise.',
    'Sea-monsters haunted her legend.',
    'Poets made her a sign of deliverance.',
    'Astrolabes engraved her near Perseus.',
    'Charts mapped her chains on parchment.',
    'Myth bridged night and sky craft.',
  ];
  const group3 = [
    'M31 — a spiral neighbor.',
    'About 2.5 million light-years.',
    'Home to near a trillion stars.',
    'Blue-shifted toward the Milky Way.',
    'Disk spans ~220,000 light-years.',
    'Companions: M32 and M110.',
    'Star-forming rings in the disk.',
    'A central massive black hole.',
    'Halo rich in globular clusters.',
    'Dust lanes trace the spirals.',
    'Future Milkomeda in 4–5 Gyr.',
    'Visible to the unaided eye.',
  ];
  state.phrases = [
    ...group1.map(t => ({ text: t, group: 1 })),
    ...group2.map(t => ({ text: t, group: 2 })),
    ...group3.map(t => ({ text: t, group: 3 })),
  ];
}

function renderPhrases() {
  const wrap = qs('#phrases');
  if (!wrap) return;
  wrap.innerHTML = '';
  const W = wrap.clientWidth || 1000;
  const H = wrap.clientHeight || 500;
  // Place phrases concentrically and freely
  const cx = W / 2, cy = H / 2;
  const radiusBase = Math.min(W, H) * 0.12;
  const rings = [radiusBase, radiusBase*1.6, radiusBase*2.2, radiusBase*2.8];
  let i = 0;
  for (const p of state.phrases) {
    const ring = rings[i % rings.length];
    const angle = (i * 222.492) % 360; // golden-ish angle spread
    const rad = angle * Math.PI / 180;
    const x = cx + Math.cos(rad) * ring;
    const y = cy + Math.sin(rad) * ring * 0.72; // slight vertical squash
    const el = document.createElement('div');
    el.className = `phrase group${p.group}`;
    el.style.left = Math.max(6, Math.min(W-6, x)) + 'px';
    el.style.top = Math.max(6, Math.min(H-6, y)) + 'px';
    el.textContent = p.text;
    wrap.appendChild(el);
    i++;
  }
}

/* Enter flow */
function initEnterFlow() {
  const btn = qs('#enterBtn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    qs('#introHero').style.display = 'none';
    const main = qs('#main');
    main.hidden = false;
    navigate('home');
  });
}

/* 3D ANDROMEDA */
let three = { scene: null, camera: null, renderer: null, mesh: null };
function init3D() {
  const canvas = qs('#andromedaCanvas');
  if (!canvas) return;
  const W = canvas.clientWidth; const H = canvas.clientHeight;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(W, H); renderer.setPixelRatio(Math.min(2, window.devicePixelRatio||1));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, W/H, 0.1, 100);
  camera.position.set(0, 0.4, 6);
  const ambient = new THREE.AmbientLight(0x88ccff, 0.9); scene.add(ambient);
  const dir = new THREE.DirectionalLight(0xffffff, 0.8); dir.position.set(3, 4, 5); scene.add(dir);
  const loader = new THREE.FontLoader();
  loader.load('https://cdn.jsdelivr.net/npm/three@0.152.2/examples/fonts/helvetiker_regular.typeface.json', (font) => {
    const geo = new THREE.TextGeometry('ANDROMEDA', { font, size: 0.9, height: 0.28, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.02, bevelSegments: 8 });
    geo.center();
    const mat = new THREE.MeshPhysicalMaterial({ color: 0x7fe9ff, metalness: 0.7, roughness: 0.25, clearcoat: 1.0, clearcoatRoughness: 0.2, emissive: 0x0b2e3f, emissiveIntensity: 0.25 });
    const mesh = new THREE.Mesh(geo, mat); scene.add(mesh);
    three.mesh = mesh;
  });
  function animate(){ requestAnimationFrame(animate); if (three.mesh){ three.mesh.rotation.y += 0.004; three.mesh.rotation.x = Math.sin(Date.now()*0.0003)*0.05; } renderer.render(scene, camera); }
  animate();
  three = { scene, camera, renderer, mesh: null };
  window.addEventListener('resize', () => {
    const W2 = canvas.clientWidth; const H2 = canvas.clientHeight;
    renderer.setSize(W2, H2);
    camera.aspect = W2/H2; camera.updateProjectionMatrix();
  });
}

/* Daily quote */
async function loadDailyQuote() {
  try {
    const data = await fetchJSON('/api/quote.php');
    const el = qs('#quoteOfDay');
    el.textContent = '“' + data.quote + '”';
  } catch (e) { /* ignore */ }
}

/* Comments */
async function loadComments(){
  try {
    const data = await fetchJSON('/api/comment.php');
    const list = qs('#commentsList');
    list.innerHTML = '';
    data.comments.slice(-50).forEach(c => {
      const div = document.createElement('div');
      div.className = 'comment';
      div.innerHTML = `<div class="meta">${c.name} — ${new Date(c.ts).toUTCString()}</div><div class="text"></div>`;
      div.querySelector('.text').textContent = c.text;
      list.appendChild(div);
    });
  } catch (e) { /* ignore */ }
}

function setupCommentForm(){
  const form = qs('#commentForm');
  const hiddenName = qs('#commentName');
  // Auto-display name
  const urlName = getURLParam('name');
  const stored = localStorage.getItem('displayName');
  const derived = urlName || stored || (document.querySelector('#displayName')?.textContent || 'Visitor');
  hiddenName.value = derived;
  localStorage.setItem('displayName', derived);
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    try {
      const res = await fetch('/api/comment.php', { method:'POST', body: fd, credentials:'include' });
      if (!res.ok) throw new Error('Failed to post');
      form.reset(); hiddenName.value = derived;
      await loadComments();
    } catch (err) { alert('Unable to post comment.'); }
  });
}

/* Router */
function section(template){ const el = document.createElement('div'); el.innerHTML = template.trim(); return el.firstElementChild; }

function renderHome(){
  const r = qs('#contentRouter'); r.innerHTML = '';
}

function renderFounders(){
  const r = qs('#contentRouter');
  const tpl = `
  <section class="section">
    <h2>Team Founders</h2>
    <div class="cards">
      <div class="card">
        <h3>Section One — Vision and Founding</h3>
        <p>The team was founded on August 23, 2024. The team began at the NASA Space Apps Challenge hackathon held in Iraq / Baghdad. The team won second place nationally. Then the team moved to expand internationally and joined the IASC asteroid observation activity run by NASA and Harvard University and other astronomical organizations. The team organized successful camps then represented Iraq in international scientific competitions, namely the IAAC competition. In the final three members: two members placed within the top 15% of qualifiers and one member placed within the top 20% of qualifiers, and one member received an honorable mention. After that the team returned to its founding place and returned to the NASA hackathon held in Iraq in 2025. The team continues to represent Iraq in various global events and organizations.</p>
      </div>
      <div class="card">
        <h3>Section Two — Organizational Structure</h3>
        <p>The team's organizational structure varies depending on the event or competition that represents Iraq, so there is no fixed pattern or structure that continues. The team adapts according to the type of competition.</p>
      </div>
      <div class="card">
        <h3>Section Three — Founders' details</h3>
        <p>The team founder is Salah El-Din Amer. An amateur and lover of astronomy. He is 19 years old and aspires to study astronomy and space. (We will develop this later.)</p>
        <div style="margin-top:10px;">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;align-items:start;">
            <div class="card" style="background: rgba(9,15,30,0.5);">
              <h3 style="margin-top:0">Right Section — Iraqi part</h3>
              <p>Represented by Mr. Zahir Al-Taei (to be developed later).</p>
            </div>
            <div class="card" style="background: rgba(9,15,30,0.5);">
              <h3 style="margin-top:0">Second Section — Yemeni part</h3>
              <p>Represented by student Du'aa Rashid (to be developed later).</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>`;
  r.innerHTML = ''; r.appendChild(section(tpl));
}

function renderCertificatesAcademic(){
  const r = qs('#contentRouter');
  const tpl = `
  <section class="section">
    <h2>Academic Certificates — IAAC</h2>
    <div class="card">
      <h3>About IAAC</h3>
      <p>The International Astronomy and Astrophysics Competition (IAAC) is a global contest that challenges students to apply physics and astronomy to real problems. It fosters analytical thinking, creativity, and scientific communication across multiple rounds.</p>
    </div>
    <div class="card">
      <h3>Members</h3>
      <p><strong>Ambassador:</strong> Salah El-Din Amer</p>
      <p><strong>Round 1 participants (5):</strong> Salah El-Din Amer, Ali Sarhan Aboud, Maryam Hazem Bahr, Omar Mohammed Hassan, Khairi Shifan.</p>
      <p><strong>Semi-final qualifiers:</strong> Salah El-Din Amer, Ali Sarhan Aboud, Maryam Hazem Bahr.</p>
      <p><strong>Final qualifiers:</strong> Salah El-Din Amer (bronze, top 15%), Maryam Hazem Bahr (bronze, top 15%), Ali Sarhan Aboud (bronze, top 20%).</p>
    </div>
    <div class="card">
      <h3>Certificate Galleries</h3>
      <div class="gallery">
        <div class="placeholder">Round 1 — images later</div>
        <div class="placeholder">Semi-final — images later</div>
        <div class="placeholder">Final — images later</div>
      </div>
    </div>
  </section>`;
  r.innerHTML = ''; r.appendChild(section(tpl));
}

function renderCertificatesTraining(){
  const r = qs('#contentRouter');
  const tpl = `
  <section class="section">
    <h2>Training Courses — IASC Asteroid Observation</h2>
    <div class="card">
      <h3>About the event</h3>
      <p>The International Astronomical Search Collaboration (IASC) is an educational citizen-science program supported by NASA and research institutions. Participants analyze real astronomical imagery to identify and track near-Earth objects, applying rigorous methods used in professional surveys.</p>
    </div>
    <div class="card">
      <h3>Camp One</h3>
      <p>We are pleased to announce on 22/7 the completion of the first team led by Salah El-Din Amer, Zahir Al-Taei, for their outstanding participation in the first camp of season two of the IASC asteroid observation event. The team excelled with rigorous scientific methodology and showed exceptional commitment in analyzing astronomical data. Their teamwork was excellent and they contributed greatly to expanding our knowledge of near-Earth objects. Their participation was a beautiful model of ongoing research and reflected the values of diligence and dedication to reach scientific discoveries with real impact. This achievement is not only a major step in their research journey but also strengthens global scientific efforts to observe and track asteroids. We thank all team members for their considerable effort and look forward to more achievements.</p>
      <p><strong>Team members:</strong> Salah El-Din Amer, Zahir Al-Taei, Omar Mohammed, Najah Al-Salihi, Karrar Ammar, Ruba Taif, Damiya Amer.</p>
      <div class="gallery"><div class="placeholder">Certificates — later</div></div>
    </div>
    <div class="card">
      <h3>Camp Two — Iraq × Yemen</h3>
      <p>We are pleased to announce on 19/8 the completion of the first team led by: Salah El-Din Amer, Zahir Al-Taei, Du'aa Rashid for their outstanding participation in the second camp of season two of the IASC asteroid observation event. This camp was joint between Iraq and Yemen, making it a distinctive scientific and cooperative experience demonstrating depth of Arab cooperation in astronomy. The team showed exceptional commitment and high accuracy in analyzing astronomical data. Their integrated teamwork contributed effectively to expanding our knowledge of near-Earth objects. Their participation was a wonderful model of continuous research and reflected values of diligence and dedication to reach discoveries with real scientific impact. This achievement not only represents an important step in their research but adds strength to global efforts in asteroid tracking. We thank all team members for their great efforts and look forward to more achievements.</p>
      <p><strong>Team members:</strong> Salah El-Din Amer, Zahir Al-Taei, Du'aa Rashid, Razan Emad (Jordan), Zahra Ali.</p>
    </div>
    <div class="card">
      <h3>NASA Space Apps — 2024</h3>
      <p>Held for the first time in Baghdad, Iraq. The team chose the challenge “Beyond the Sun: an aquatic-chemical world,” exploring models of oceanic chemistry on exoplanets. <strong>Result:</strong> second place nationally.</p>
      <p><strong>Team members:</strong> Salah El-Din Amer, Hala Hazem, Mona Qasim, Badr Muhannad, Noor Abdulzahra, Ruba Taif.</p>
    </div>
    <div class="card">
      <h3>NASA Space Apps — 2025</h3>
      <p>Challenge: “Your Home in Space” — designing a habitation plan. <strong>Result:</strong> eighth place in Iraq.</p>
      <p><strong>Team members:</strong> Salah El-Din Amer, Du'aa Rashid, Zahra Ali, Ali Al-Akbar Ismail (Lebanon), Noor Abdulzahra, Ali Sarhan Aboud.</p>
    </div>
  </section>`;
  r.innerHTML = ''; r.appendChild(section(tpl));
}

function renderCompetitions(){
  const r = qs('#contentRouter');
  const tpl = `
  <section class="section">
    <h2>Competitions & Past Achievements</h2>
    <div class="card">
      <p>Our team participates in international scientific activities, hackathons, and olympiads. We value collaboration, rigor, and outreach. We aspire to expand our footprint across research, education, and citizen science, and to mentor new cohorts toward meaningful, verifiable achievements.</p>
    </div>
  </section>`;
  r.innerHTML = ''; r.appendChild(section(tpl));
}

function renderApplications(){
  const r = qs('#contentRouter');
  const tpl = `
  <section class="section">
    <h2>Applications for Events</h2>
    <div class="card">
      <h3>Introduction</h3>
      <p>The founder is an IAAC ambassador. Our workshops run in hybrid modes: partly in-person and partly online to maximize access and safety. We design each activity with clear learning objectives and hands-on practice.</p>
    </div>
    <div class="card">
      <h3>Section One — Lectures and Workshops</h3>
      <p>We plan public lectures on astronomy fundamentals, observational skills, and space careers. Announcements will come later.</p>
      <p><strong>Training workshops — IASC asteroid observation:</strong> A detailed hands-on program analyzing survey imagery and reporting potential NEOs to coordinators. Announcements will come later.</p>
      <p><strong>Astrophotography activity:</strong> Provided by NASA and reputable scientific labs. We will practice imaging, calibration, and post-processing. Announcements will come later.</p>
      <p><strong>Exoplanet research participation:</strong> Engaging with transit photometry and data vetting to contribute to ongoing studies. Announcements will come later.</p>
    </div>
    <div class="card">
      <h3>Scientific Evenings</h3>
      <p>Observational sessions and stargazing nights for the public and students.</p>
      <ul>
        <li>Scheduling depends on registration and national approvals.</li>
        <li>Events will be scheduled and announced after approvals are finalized.</li>
      </ul>
      <div class="card" style="margin-top:10px;">
        <h3>Application Model</h3>
        <p>Choose an event — each opens a Google Form (links to be added).</p>
        <div class="cards">
          <button class="menu-item" onclick="openForm('#')">Stargazing Night</button>
          <button class="menu-item" onclick="openForm('#')">Astrophotography Workshop</button>
          <button class="menu-item" onclick="openForm('#')">Exoplanet Session</button>
          <button class="menu-item" onclick="openForm('#')">IASC Training</button>
        </div>
      </div>
    </div>
  </section>`;
  r.innerHTML = ''; r.appendChild(section(tpl));
}

function renderContact(){
  const r = qs('#contentRouter');
  const tpl = `
  <section class="section">
    <h2>Contact & Inquiry</h2>
    <div class="card">
      <h3>Email</h3>
      <p>For inquiries and collaboration, contact: <a href="mailto:ayyyahaam@gmail.com">ayyyahaam@gmail.com</a>.</p>
    </div>
    <div class="card">
      <h3>Social Media</h3>
      <ul>
        <li>Facebook: <a target="_blank" rel="noopener" href="https://www.facebook.com/share/16FZnTvuac/">Open</a></li>
        <li>Instagram: <a target="_blank" rel="noopener" href="https://www.instagram.com/0g.mc?igsh=MTRvdWo2MWZiZGJrbA==">Open</a></li>
        <li>Telegram channel: <a target="_blank" rel="noopener" href="https://t.me/Astronomy_by_salah">Open</a></li>
        <li>WhatsApp channel: <a target="_blank" rel="noopener" href="https://chat.whatsapp.com/JgsEZRet3ma6E2Y7cf1pLE?mode=wwc">Open</a></li>
      </ul>
    </div>
    <div class="card">
      <h3>Contact Details</h3>
      <p>We reply to messages during typical evening hours in UTC+3. Please use text messages; we do not answer voice calls. For urgent coordination, leave a detailed message and we will respond as soon as possible.</p>
      <button class="menu-item" onclick="openSidebar()">Open Inquiry Sidebar</button>
    </div>
  </section>`;
  r.innerHTML = ''; r.appendChild(section(tpl));
}

function renderFounderBio(){
  const r = qs('#contentRouter');
  const tpl = `
  <section class="section">
    <h2>Salah El-Din Amer — Biography</h2>
    <div class="bio">
      <img id="bioPortrait" class="portrait" alt="Founder portrait" src="/api/bio.php?img=1" onerror="this.style.display='none'" />
      <div>
        <p>Team founder and organizing member with the Egyptian PARADOX team, and member of the World Federation of Astronomy and Space Sciences.</p>
        <div class="cards">
          <div class="card">
            <h3>Certificates & Activities</h3>
            <ul>
              <li>Letter of thanks from astronaut Rayyana Barnawi.</li>
              <li>Three certificates from “Ureed University” in space economy and space tourism.</li>
              <li>IAAC Ambassador; IPHR and OPOH Open Physics participation.</li>
              <li>Accepted in MMARS analog astronaut program — first Iraqi accepted.</li>
              <li>Organizer with the Egyptian PARADOX team.</li>
              <li>12 certificates in training and organizing IASC events.</li>
              <li>Coursera certificate in Black Holes.</li>
              <li>African Laboratory of Science — ARRIS event (talk with ISS astronauts).</li>
              <li>Arab Federation — astronomical skills course certificate.</li>
              <li>Honorary appreciation from Adam Orion within NASA Global Fan Relations.</li>
              <li>NASA’s Exoplanet Watch program certificate.</li>
              <li>Participant in two global exoplanet research papers.</li>
              <li>“Cassiopeia” astrophotography camp certificate.</li>
              <li>NASA Space Apps Hackathon certificates 2024 and 2025.</li>
            </ul>
            <p>All activities and certificates are documented on Instagram.</p>
            <button class="menu-item" onclick="window.open('https://www.instagram.com/salah_king33?igsh=NWFnZzFpdDhlZjNn','_blank')">Open Instagram</button>
            <p style="margin-top:10px; font-weight:600;">For more information <a href="#" onclick="navigate('founder-bio'); openSidebar(); return false;">click here</a> — see the “Salah El-Din Amer biography” menu.</p>
          </div>
          <div class="card">
            <h3>Upload Portrait (owner)</h3>
            <div class="upload-box">
              <form id="uploadForm">
                <input type="file" name="file" accept="image/*" required />
                <button type="submit">Upload Image</button>
              </form>
              <small>Image persists after reload.</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>`;
  r.innerHTML = ''; r.appendChild(section(tpl));
  const form = qs('#uploadForm');
  if (form) form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    try {
      const res = await fetch('/api/upload.php', { method:'POST', body: fd, credentials:'include' });
      if (!res.ok) throw new Error('Upload failed');
      qs('#bioPortrait').style.display='block';
      qs('#bioPortrait').src = '/api/bio.php?img=1&ts=' + Date.now();
      alert('Uploaded.');
    } catch (e) { alert('Owner sign-in required to upload.'); }
  });
}

function renderArticles(){
  const r = qs('#contentRouter');
  const tpl = `
  <section class="section">
    <h2>Andromeda Magazine</h2>
    <div class="card">
      <p>One article is published each day, automatically linked to the previous, forming an accessible series for readers.</p>
    </div>
    <div id="articleMount" class="cards"></div>
    <div id="articleAdmin" class="card" style="margin-top:12px; display:none;">
      <h3>Publish Today (owner)</h3>
      <form id="articleForm">
        <input type="text" name="title" placeholder="Title" required style="width:100%; padding:10px; margin-bottom:8px;" />
        <textarea name="content" placeholder="Content..." required style="width:100%; min-height:120px;"></textarea>
        <button type="submit">Publish</button>
      </form>
    </div>
  </section>`;
  r.innerHTML = ''; r.appendChild(section(tpl));
  loadArticles();
}

async function loadArticles(){
  try {
    const data = await fetchJSON('/api/articles.php');
    const mount = qs('#articleMount');
    mount.innerHTML = '';
    data.list.slice(-10).reverse().forEach(a => {
      const card = document.createElement('div');
      card.className = 'card';
      const prevLink = a.prevId ? `<a href="#" onclick="openArticle('${a.prevId}')">Previous</a>` : '';
      card.innerHTML = `<h3>${a.title}</h3><div style="white-space:pre-wrap">${a.content}</div><div class="hint">${new Date(a.date).toUTCString()} ${prevLink}</div>`;
      mount.appendChild(card);
    });
    if (data.isOwner) { qs('#articleAdmin').style.display = 'block'; initArticleForm(); }
  } catch (e) { /* ignore */ }
}

function openArticle(id){
  // Fetch and show a single article (optional enhancement)
}

function initArticleForm(){
  const form = qs('#articleForm');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    try {
      const res = await fetch('/api/articles.php', { method:'POST', body: fd, credentials:'include' });
      if (!res.ok) throw new Error('Publish failed');
      form.reset();
      await loadArticles();
    } catch (e) { alert('Owner sign-in required to publish.'); }
  });
}

/* Navigation */
function navigate(page){
  state.currentPage = page;
  setURLParam('page', page);
  switch(page){
    case 'home': renderHome(); break;
    case 'founders': renderFounders(); break;
    case 'certificates-academic': renderCertificatesAcademic(); break;
    case 'certificates-training': renderCertificatesTraining(); break;
    case 'competitions': renderCompetitions(); break;
    case 'applications': renderApplications(); break;
    case 'contact': renderContact(); break;
    case 'articles': renderArticles(); break;
    case 'founder-bio': renderFounderBio(); break;
    default: renderHome(); break;
  }
}

/* Owner auth */
function initAuth(){
  const form = qs('#loginForm');
  if (form) form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    try {
      const res = await fetch('/api/login.php', { method:'POST', body: fd, credentials:'include' });
      if (!res.ok) throw new Error('Login failed');
      location.reload();
    } catch (e) { alert('Invalid credentials.'); }
  });
  const logout = qs('#logoutBtn');
  if (logout) logout.addEventListener('click', async () => {
    await fetch('/api/logout.php', { method:'POST', credentials:'include' });
    location.reload();
  });
}

/* Helpers */
function openSidebar(){ qs('#sidebar').classList.add('open'); }
function openForm(url){ if (url && url !== '#') window.open(url, '_blank'); }

/* Init */
window.addEventListener('DOMContentLoaded', async () => {
  // Footer year
  const y = new Date().getUTCFullYear(); qs('#year').textContent = y;
  // Phrases
  loadPhrases(); renderPhrases();
  window.addEventListener('resize', renderPhrases);
  // Enter flow
  initEnterFlow();
  // Sidebar
  initSidebar();
  // 3D
  init3D();
  // Quote
  loadDailyQuote();
  // Comments
  setupCommentForm(); loadComments();
  // Auth
  initAuth();
  // If initial param asks to open sidebar
  if (document.body.dataset.openSidebar === '1') openSidebar();
});
