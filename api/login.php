<?php
session_start();
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['error'=>'Method not allowed']); exit; }
// Owner credentials
$ownerEmail = 'SLAHALDYNAMRMKY@GMAIL.COM';
$ownerPass = '@Ali0000';
$email = $_POST['email'] ?? '';
$pass = $_POST['password'] ?? '';
if (hash_equals(strtolower($ownerEmail), strtolower($email)) && hash_equals($ownerPass, $pass)) {
  $_SESSION['admin'] = true;
  $_SESSION['display_name'] = 'Salah El-Din Amer';
  echo json_encode(['ok'=>true]);
} else {
  http_response_code(401); echo json_encode(['error'=>'Invalid credentials']);
}
