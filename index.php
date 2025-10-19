<?php
session_start();

// Basic router and config
$allowedPages = [
  'home', 'founders', 'certificates', 'applications', 'competitions', 'biography', 'articles', 'magazine'
];
$page = isset($_GET['page']) ? strtolower(preg_replace('/[^a-z0-9_-]/i', '', $_GET['page'])) : 'home';
if (!in_array($page, $allowedPages, true)) {
  $page = 'home';
}

// Admin credentials (images-only admin)
const ADMIN_EMAIL = 'SLAHALDYNAMRMKY@GMAIL.COM';
const ADMIN_PASS = '@Ali0000';
$isAdmin = isset($_SESSION['is_admin']) && $_SESSION['is_admin'] === true;

// Util
function h($str) { return htmlspecialchars((string)$str, ENT_QUOTES, 'UTF-8'); }
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Andromeda Team</title>
  <meta name="theme-color" content="#0b0f1a" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&family=Orbitron:wght@600;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/css/styles.css?v=1" />
</head>
<body>
  <header class="site-header">
    <div class="brand" onclick="location.href='/?page=home'" role="button" tabindex="0" aria-label="Go Home">
      <span class="logo-glow">ANDROMEDA</span>
    </div>
    <nav class="top-actions">
      <button id="sidebarToggle" class="icon-btn" aria-controls="sidebar" aria-expanded="false" aria-label="Open menu">☰</button>
    </nav>
  </header>

  <!-- Right Sidebar -->
  <aside id="sidebar" class="sidebar" aria-hidden="true">
    <div class="sidebar-header">
      <h2>Navigation</h2>
      <button id="sidebarClose" class="icon-btn" aria-label="Close menu">✕</button>
    </div>
    <nav class="sidebar-nav">
      <ul>
        <li><a href="/?page=home">Home</a></li>
        <li><a href="/?page=founders">Team Founders</a></li>
        <li>
          <details>
            <summary>Team Certificates</summary>
            <ul>
              <li><a href="/?page=certificates#academic">Academic Certificates</a></li>
              <li><a href="/?page=certificates#training">Training Courses</a></li>
            </ul>
          </details>
        </li>
        <li><a href="/?page=competitions">Competitions & Participations</a></li>
        <li><a href="/?page=applications">Applications for Events</a></li>
        <li>
          <details>
            <summary>Articles</summary>
            <ul>
              <li><a href="/?page=articles">Daily Articles</a></li>
              <li><a href="/?page=magazine">Andromeda Magazine</a></li>
            </ul>
          </details>
        </li>
        <li><button class="linklike" data-open-contact>Inquiry / Contact</button></li>
      </ul>

      <div class="sidebar-section contact-section" id="contactSection">
        <h3>Contact</h3>
        <p>Email: <a href="mailto:ayyyahaam@gmail.com">ayyyahaam@gmail.com</a></p>
        <div class="social-links">
          <a href="https://www.facebook.com/share/16FZnTvuac/" target="_blank" rel="noopener">Facebook</a>
          <a href="https://www.instagram.com/0g.mc?igsh=MTRvdWo2MWZiZGJrbA==" target="_blank" rel="noopener">Instagram</a>
          <a href="https://t.me/Astronomy_by_salah" target="_blank" rel="noopener">Telegram</a>
          <a href="https://chat.whatsapp.com/JgsEZRet3ma6E2Y7cf1pLE?mode=wwc" target="_blank" rel="noopener">WhatsApp</a>
        </div>
        <p>Contact hours: 10:00–18:00 UTC, weekdays. We do not answer voice calls.</p>
      </div>

      <div class="sidebar-section admin-auth">
        <?php if ($isAdmin): ?>
          <form action="/api/logout.php" method="post">
            <button type="submit" class="btn small">Sign out (Owner)</button>
          </form>
        <?php else: ?>
          <details>
            <summary>Owner Sign In</summary>
            <form action="/api/auth.php" method="post" class="auth-form">
              <label>Email <input type="email" name="email" required></label>
              <label>Password <input type="password" name="password" required></label>
              <button type="submit" class="btn small">Sign In</button>
            </form>
          </details>
        <?php endif; ?>
      </div>
    </nav>
  </aside>

  <main id="app-main" class="main">
    <?php include __DIR__ . '/pages/' . $page . '.php'; ?>
  </main>

  <footer class="site-footer">
    <p>© <span id="year"></span> Andromeda Team. Stars guide the curious.</p>
  </footer>

  <div id="backdrop" class="backdrop" hidden></div>

  <script>document.getElementById('year').textContent = new Date().getUTCFullYear();</script>
  <script src="/assets/js/main.js?v=1"></script>
  <!-- WebGL module: safely no-op if container missing -->
  <script type="module" src="/assets/js/webgl-andromeda.js?v=1"></script>
</body>
</html>
