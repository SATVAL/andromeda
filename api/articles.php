<?php
session_start();
header('Content-Type: application/json');
$path = __DIR__ . '/../data/articles.json';
if (!file_exists($path)) { file_put_contents($path, json_encode(['list'=>[]], JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE)); }
$data = json_decode(file_get_contents($path), true);
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  echo json_encode(['list'=>$data['list'], 'isOwner'=>isset($_SESSION['admin']) && $_SESSION['admin']===true]);
  exit;
}
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  if (!isset($_SESSION['admin']) || $_SESSION['admin']!==true) { http_response_code(401); echo json_encode(['error'=>'Unauthorized']); exit; }
  $title = trim($_POST['title'] ?? 'Untitled');
  $content = trim($_POST['content'] ?? '');
  if ($content==='') { http_response_code(400); echo json_encode(['error'=>'Empty']); exit; }
  $date = gmdate('c');
  $prevId = count($data['list']) ? end($data['list'])['id'] : null;
  $id = bin2hex(random_bytes(8));
  $data['list'][] = ['id'=>$id,'title'=>$title,'content'=>$content,'date'=>$date,'prevId'=>$prevId];
  file_put_contents($path, json_encode($data, JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE));
  echo json_encode(['ok'=>true,'id'=>$id]); exit;
}
http_response_code(405); echo json_encode(['error'=>'Method not allowed']);
