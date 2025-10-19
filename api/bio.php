<?php
// Serves bio image and data
$bioPath = __DIR__ . '/../data/bio.json';
if (!file_exists($bioPath)) { header('Content-Type: application/json'); echo json_encode(['image'=>null]); exit; }
$bio = json_decode(file_get_contents($bioPath), true);
if (isset($_GET['img'])) {
  // Redirect to the image path for caching
  if (isset($bio['image'])) { header('Location: ' . $bio['image']); exit; }
}
header('Content-Type: application/json');
echo json_encode($bio);
