<?php
session_start();
// Simple router via URL parameters
$page = $_GET['page'] ?? 'home';
$openSidebar = isset($_GET['open']) && $_GET['open'] === 'sidebar';
$loggedIn = isset($_SESSION['admin']) && $_SESSION['admin'] === true;
$displayName = $_SESSION['display_name'] ?? ($loggedIn ? 'Site Owner' : 'Visitor');
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ANDROMEDA — Iraqi Andromeda Team</title>
  <meta name="description" content="Iraqi Andromeda Team — science, astronomy, education, and passion." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;800&family=Inter:wght@300;400;600;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/assets/css/styles.css" />
  <script defer src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r152/three.min.js"></script>
  <script defer src="https://cdn.jsdelivr.net/npm/three@0.152.2/examples/js/loaders/FontLoader.js"></script>
  <script defer src="https://cdn.jsdelivr.net/npm/three@0.152.2/examples/js/geometries/TextGeometry.js"></script>
  <script defer src="/assets/js/main.js"></script>
</head>
<body data-initial-page="<?php echo htmlspecialchars($page); ?>" data-open-sidebar="<?php echo $openSidebar ? '1' : '0'; ?>">
  <div id="app">

    <!-- Right-side Sidebar -->
    <aside id="sidebar" class="sidebar" aria-hidden="true">
      <button id="sidebarToggle" class="sidebar-toggle" aria-label="Toggle sidebar" title="Toggle sidebar">☰</button>
      <div class="sidebar-inner">
        <div class="brand">ANDROMEDA</div>
        <nav class="menu">
          <button class="menu-item" data-nav="home">Home</button>
          <button class="menu-item" data-nav="founders">Team Founders</button>
          <details class="menu-item details">
            <summary>Team Certificates</summary>
            <button class="submenu-item" data-nav="certificates-academic">Academic Certificates</button>
            <button class="submenu-item" data-nav="certificates-training">Training Courses</button>
          </details>
          <button class="menu-item" data-nav="competitions">Competitions and Team Participations</button>
          <button class="menu-item" data-nav="applications">Applications for Events & Lectures</button>
          <button class="menu-item" data-nav="contact">Contact / Inquiry</button>
          <details class="menu-item details">
            <summary>Articles — Andromeda Magazine</summary>
            <button class="submenu-item" data-nav="articles">Open Magazine</button>
          </details>
          <details class="menu-item details">
            <summary>Salah El-Din Amer biography</summary>
            <button class="submenu-item" data-nav="founder-bio">Biography</button>
          </details>
        </nav>

        <div class="sidebar-footer">
          <div class="user">Signed as: <span id="displayName"><?php echo htmlspecialchars($displayName); ?></span></div>
          <div class="auth">
            <?php if (!$loggedIn): ?>
              <form id="loginForm" class="login-form" autocomplete="off">
                <input type="email" name="email" placeholder="Owner email" required />
                <input type="password" name="password" placeholder="Owner password" required />
                <button type="submit">Owner Sign in</button>
                <small>Owner-only features: images, articles, bio edits.</small>
              </form>
            <?php else: ?>
              <button id="logoutBtn" class="logout-button">Sign out</button>
            <?php endif; ?>
          </div>
        </div>
      </div>
    </aside>

    <!-- Intro Hero (first visible) -->
    <section id="introHero" class="intro-hero">
      <img class="hero-bg" alt="Andromeda Galaxy" src="https://cdn.spacetelescope.org/archives/images/large/heic1502a.jpg" />
      <div class="hero-overlay">
        <h1 class="site-welcome">Welcome to our humble team website.</h1>
        <p class="site-welcome-sub">But before you watch us you must learn about Andromeda. So what is Andromeda?</p>

        <div id="phrases" class="phrases" aria-label="Andromeda facts"></div>

        <p class="transition-line">And now that you know Andromeda according to science, it is time to get to know Andromeda our way.</p>
        <button id="enterBtn" class="enter-button" title="Enter the site">Enter ANDROMEDA</button>
      </div>
    </section>

    <!-- Main Content Wrapper (hidden until enter) -->
    <main id="main" class="main" hidden>
      <header class="hero-3d">
        <div class="tagline">ANDROMEDA — not a team, not people, but an endless passion.</div>
        <div id="quoteOfDay" class="quote"></div>
        <canvas id="andromedaCanvas" class="andromeda-canvas" aria-label="3D ANDROMEDA"></canvas>
      </header>

      <section id="teamIntro" class="section">
        <h2>Who we are</h2>
        <p>
          The Iraqi Andromeda Team is part of well-known international organizations, agencies, and laboratories. 
          Its members represent Iraq and other countries such as Yemen, Egypt, Jordan, Lebanon, Libya, and other members from around the world.
        </p>
        <p class="hint">If you want more information you can find it in the sidebar.</p>
      </section>

      <section id="contentRouter" class="section-router">
        <!-- Routed sections mount here -->
      </section>

      <section id="commentsSection" class="section">
        <h2>Comments</h2>
        <div id="commentsList" class="comments-list"></div>
        <form id="commentForm" class="comment-form">
          <input type="hidden" name="name" id="commentName" />
          <textarea name="text" placeholder="Write your comment..." required></textarea>
          <button type="submit">Post Comment</button>
          <small>Your name appears automatically.</small>
        </form>
      </section>

      <footer class="footer">© <span id="year"></span> Andromeda Team</footer>
    </main>

  </div>
</body>
</html>
