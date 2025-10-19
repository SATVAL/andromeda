<?php
session_start();
header('Content-Type: application/json');
$path = __DIR__ . '/../data/comments.json';
if (!file_exists($path)) { file_put_contents($path, json_encode(['comments'=>[]], JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE)); }
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  readfile($path); exit;
}
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $name = trim($_POST['name'] ?? 'Visitor');
  $text = trim($_POST['text'] ?? '');
  if ($text === '') { http_response_code(400); echo json_encode(['error'=>'Empty']); exit; }
  $data = json_decode(file_get_contents($path), true);
  $data['comments'][] = [
    'name' => $name,
    'text' => $text,
    'ts' => time()*1000,
    'ip' => $_SERVER['REMOTE_ADDR'] ?? null,
    'ua' => $_SERVER['HTTP_USER_AGENT'] ?? null,
  ];
  file_put_contents($path, json_encode($data, JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE));
  echo json_encode(['ok'=>true]); exit;
}
http_response_code(405); echo json_encode(['error'=>'Method not allowed']);
