<?php
header('Content-Type: application/json');
$quotesPath = __DIR__ . '/../data/quotes.json';
if (!file_exists($quotesPath)) {
  $seed = [
    'Curiosity is the engine of discovery.',
    'Through small steps, great distances are crossed.',
    'The night sky is a map of our questions.',
    'Measure carefully; wonder boldly.',
    'Where data leads, knowledge follows.',
    'Look up — your future is among the stars.',
    'In patience and rigor, we find truth.',
    'Every photon carries a story.',
    'Science is organized curiosity.',
    'Beyond fear, there is learning.',
  ];
  file_put_contents($quotesPath, json_encode(['quotes'=>$seed], JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE));
}
$data = json_decode(file_get_contents($quotesPath), true);
$quotes = $data['quotes'] ?? [];
$today = (new DateTime('now', new DateTimeZone('UTC')))->format('Y-m-d');
$idx = crc32($today) % max(1, count($quotes));
$quote = $quotes[$idx] ?? 'Keep looking up.';
echo json_encode(['date'=>$today,'quote'=>$quote]);
