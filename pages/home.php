<?php
$commentsFile = __DIR__ . '/../data/comments.json';
$comments = [];
if (is_file($commentsFile)) {
  $raw = file_get_contents($commentsFile);
  $comments = json_decode($raw, true) ?: [];
}
?>
<section class="splash" id="splash">
  <img class="bg" alt="Andromeda Galaxy" src="https://upload.wikimedia.org/wikipedia/commons/9/95/M31bobo.jpg">
  <div class="overlay-gradient"></div>
  <div class="cloud">
    <span class="phrase" data-group="1">Princess chained to a rock by the sea.</span>
    <span class="phrase" data-group="1">Named for the mythic Ethiopian princess.</span>
    <span class="phrase" data-group="1">A tale of pride, and Poseidon’s wrath.</span>
    <span class="phrase" data-group="1">Saved by Perseus from the sea monster.</span>
    <span class="phrase" data-group="1">Stars arranged like a royal silhouette.</span>
    <span class="phrase" data-group="1">Ancient navigators’ guide to autumn skies.</span>
    <span class="phrase" data-group="1">Name echoes throne rooms and crowns.</span>
    <span class="phrase" data-group="1">A constellation bound by heroic rescue.</span>
    <span class="phrase" data-group="1">Beauty celebrated, yet bound by fate.</span>
    <span class="phrase" data-group="1">The maiden cast under ocean skies.</span>

    <span class="phrase" data-group="2">Greeks wove her into Perseus’ saga.</span>
    <span class="phrase" data-group="2">Romans traced her as chained maiden.</span>
    <span class="phrase" data-group="2">Arabs called it al-Mar’ah al-Maslasalah.</span>
    <span class="phrase" data-group="2">Persians pictured a royal daughter.</span>
    <span class="phrase" data-group="2">Mariners read omens in her stars.</span>
    <span class="phrase" data-group="2">Story warned against boastful tongues.</span>
    <span class="phrase" data-group="2">A sky-etched parable of rescue.</span>
    <span class="phrase" data-group="2">Poets mapped love across the night.</span>
    <span class="phrase" data-group="2">Storytellers linked her to heroic journeys.</span>
    <span class="phrase" data-group="2">A crown, a chain, and a sea.</span>

    <span class="phrase" data-group="3">Spiral galaxy M31, our giant neighbor.</span>
    <span class="phrase" data-group="3">Two point five million light-years distant.</span>
    <span class="phrase" data-group="3">Larger than the Milky Way today.</span>
    <span class="phrase" data-group="3">Billions of suns in sweeping arms.</span>
    <span class="phrase" data-group="3">Blue clusters trace recent starbirth.</span>
    <span class="phrase" data-group="3">Dust lanes braid its shining core.</span>
    <span class="phrase" data-group="3">Satellites M32 and M110 trail close.</span>
    <span class="phrase" data-group="3">Approaching us at three hundred km/s.</span>
    <span class="phrase" data-group="3">On course to merge with the Milky Way.</span>
    <span class="phrase" data-group="3">Resulting remnant nicknamed Milkomeda.</span>
    <span class="phrase" data-group="3">Home to countless exoplanet candidates.</span>
    <span class="phrase" data-group="3">Globular clusters halo its outskirts.</span>
    <span class="phrase" data-group="3">Cepheid variables unlocked cosmic distances.</span>
    <span class="phrase" data-group="3">Radio, infrared, and X-rays reveal structure.</span>
  </div>
  <div class="intro">
    <p class="lead">Welcome to our humble team website. But before you watch us you must learn about Andromeda. So what is Andromeda?</p>
    <button class="btn" onclick="document.getElementById('landing').scrollIntoView({behavior:'smooth'});">Enter the Site</button>
  </div>
</section>

<section id="landing" class="section landing">
  <div class="slogan">ANDROMEDA — not a team, not people, but an endless passion.</div>
  <div class="logo-quote" aria-live="polite"></div>
  <div id="andromeda-3d"></div>
  <div class="team-intro">
    The Iraqi Andromeda Team is part of well-known international organizations, agencies, and laboratories. Its members represent Iraq and other countries such as Yemen, Egypt, Jordan, Lebanon, Libya, and other members from around the world. <strong>If you want more information you can find it in the sidebar.</strong>
  </div>

  <div class="comments">
    <h2>Comments</h2>
    <form id="commentForm" class="comment-form" method="post" action="/api/comment_post.php">
      <textarea name="comment" placeholder="Share your thoughts…" required></textarea>
      <div class="row">
        <small class="muted">Your real name will appear automatically when identity support is enabled.</small>
        <button type="submit" class="btn">Post Comment</button>
      </div>
    </form>
    <div class="comment-list">
      <?php foreach ($comments as $c): ?>
        <div class="comment">
          <div class="meta"><?= h($c['name'] ?? 'Stargazer') ?> • <?= h($c['time'] ?? '') ?></div>
          <div><?= h($c['text'] ?? '') ?></div>
        </div>
      <?php endforeach; ?>
    </div>
  </div>
</section>
