<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// En mode production, restreindre CORS à votre domaine
if ($_SERVER['HTTP_HOST'] !== 'localhost:5173') {
    header('Access-Control-Allow-Origin: https://veni6445.odns.fr');
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    die(json_encode(['error' => 'Method not allowed']));
}

try {
    // Get POST data
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!$data) {
        throw new Exception('Invalid request data');
    }

    // Validate required fields
    if (empty($data['to']) || empty($data['subject']) || empty($data['html'])) {
        throw new Exception('Missing required fields');
    }

    // Configuration SMTP O2switch
    ini_set('SMTP', 'smtp.o2switch.net');
    ini_set('smtp_port', '587');
    
    // Configure email headers
    $headers = [
        'MIME-Version: 1.0',
        'Content-type: text/html; charset=utf-8',
        'From: CollabSpace <sending@veni6445.odns.fr>', // Remplacez par votre email
        'Reply-To: sending@veni6445.odns.fr', // Remplacez par votre email
        'X-Mailer: PHP/' . phpversion()
    ];

    // Send to each recipient
    $success = true;
    $errors = [];
    
    foreach ($data['to'] as $recipient) {
        $to = $recipient['name'] 
            ? "{$recipient['name']} <{$recipient['email']}>" 
            : $recipient['email'];
        
        $sent = mail(
            $to,
            $data['subject'],
            $data['html'],
            implode("\r\n", $headers)
        );

        if (!$sent) {
            $success = false;
            $errors[] = 'Failed to send email to ' . $recipient['email'];
        }
    }

    if (!$success) {
        throw new Exception(implode(', ', $errors));
    }

    echo json_encode([
        'success' => true,
        'message' => 'Emails sent successfully'
    ]);
} catch (Exception $e) {
    error_log('Email error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'error' => $e->getMessage(),
        'details' => error_get_last()
    ]);
}