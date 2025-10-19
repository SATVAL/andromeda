<?php
session_start();
header('Content-Type: application/json');
if (!isset($_SESSION['admin']) || $_SESSION['admin']!==true) { http_response_code(401); echo json_encode(['error'=>'Unauthorized']); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['error'=>'Method not allowed']); exit; }
if (!isset($_FILES['file'])) { http_response_code(400); echo json_encode(['error'=>'No file']); exit; }
$f = $_FILES['file'];
if ($f['error'] !== UPLOAD_ERR_OK) { http_response_code(400); echo json_encode(['error'=>'Upload error']); exit; }
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mime = finfo_file($finfo, $f['tmp_name']);
finfo_close($finfo);
$allowed = ['image/jpeg'=>'jpg','image/png'=>'png','image/webp'=>'webp'];
if (!isset($allowed[$mime])) { http_response_code(400); echo json_encode(['error'=>'Only images allowed']); exit; }
$ext = $allowed[$mime];
$destDir = __DIR__ . '/../uploads';
if (!is_dir($destDir)) mkdir($destDir, 0775, true);
$filename = 'founder_' . time() . '.' . $ext;
$dest = $destDir . '/' . $filename;
if (!move_uploaded_file($f['tmp_name'], $dest)) { http_response_code(500); echo json_encode(['error'=>'Save failed']); exit; }
$bioPath = __DIR__ . '/../data/bio.json';
$bio = ['image' => '/uploads/' . $filename, 'ts' => time()];
file_put_contents($bioPath, json_encode($bio, JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE));
echo json_encode(['ok'=>true,'path'=>$bio['image']]);
