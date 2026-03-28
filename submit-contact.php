<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || empty($input['name']) || empty($input['email'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Name and email are required']);
    exit;
}

// Sanitize inputs — strip_tags only (plain-text email, no HTML encoding needed)
$name    = strip_tags($input['name']);
$company = strip_tags($input['company'] ?? '');
$email   = filter_var($input['email'], FILTER_SANITIZE_EMAIL);
$brand   = strip_tags($input['q0'] ?? '');
$stage   = strip_tags($input['q1'] ?? '');
$matters = strip_tags($input['q2'] ?? '');
$audience = strip_tags($input['q3'] ?? '');
$partner = strip_tags($input['q4'] ?? '');
$pitchResult = strip_tags($input['pitchResult'] ?? '');
$pitchHeading = strip_tags($input['pitchHeading'] ?? '');
$pitchBody = strip_tags($input['pitchBody'] ?? '');
$labels = $input['labels'] ?? [];
$timestamp = date('Y-m-d H:i:s');

// Build email body with full-text answers
$body  = "New EA1 Contact Submission\n";
$body .= "========================\n\n";
$body .= "Name:    $name\n";
$body .= "Company: $company\n";
$body .= "Email:   $email\n";
$body .= "Date:    $timestamp\n\n";
$body .= "--- Quiz Responses ---\n\n";

for ($i = 0; $i < 5; $i++) {
    $key = 'q' . $i;
    if (isset($labels[$key])) {
        $qText = strip_tags($labels[$key]['question'] ?? '');
        $aText = strip_tags($labels[$key]['answer'] ?? '');
        $body .= "$qText\n→ $aText\n\n";
    }
}

$body .= "--- Quiz Result ---\n";
$body .= "Type: $pitchResult\n\n";
$body .= "Heading shown:\n\"$pitchHeading\"\n\n";
$body .= "Body shown:\n\"$pitchBody\"\n\n";

// Send email
$to = 'hello@ea1.co';
$subject = "EA1 Contact: $name — $company ($brand)";
$headers  = "From: EA1 Website <noreply@shey.net>\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$mailSent = mail($to, $subject, $body, $headers);

// Log to CSV
$csvFile = __DIR__ . '/contact-log.csv';
$isNew = !file_exists($csvFile);

$fp = fopen($csvFile, 'a');
if ($fp) {
    if ($isNew) {
        fputcsv($fp, ['Timestamp', 'Name', 'Company', 'Email', 'Brand Type', 'Current Stage', 'What Matters', 'Audience', 'Partner Type', 'Pitch Result']);
    }
    fputcsv($fp, [$timestamp, $name, $company, $email, $brand, $stage, $matters, $audience, $partner, $pitchResult]);
    fclose($fp);
}

if ($mailSent) {
    echo json_encode(['success' => true, 'message' => 'Submission received']);
} else {
    // Still log even if mail fails
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Logged (mail delivery pending)']);
}
