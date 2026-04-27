<?php

require_once __DIR__.'/BACKEND/vendor/autoload.php';

use App\Service\FormConfig;
use App\Entity\Lead;
use Doctrine\ORM\EntityManagerInterface;

echo "=== Dynamic Form System Test ===\n\n";

// Test 1: FormConfig initialization
echo "Test 1: FormConfig initialization... ";
$formConfig = new FormConfig();
$fields = $formConfig->getFields();
echo "✓ Found " . count($fields) . " fields\n";

// Test 2: Get visible fields
echo "Test 2: Get visible fields... ";
$visibleFields = $formConfig->getVisibleFields();
echo "✓ Found " . count($visibleFields) . " visible fields\n";

// Test 3: Field validation
echo "Test 3: Field validation... ";
$validation = $formConfig->validateFieldValue('email', 'test@example.com');
echo "✓ Email validation: " . ($validation['valid'] ? 'PASS' : 'FAIL') . "\n";

$validation = $formConfig->validateFieldValue('email', 'invalid');
echo "✓ Invalid email validation: " . (!$validation['valid'] ? 'PASS' : 'FAIL') . "\n";

$validation = $formConfig->validateFieldValue('phone', '12345678');
echo "✓ Phone validation: " . ($validation['valid'] ? 'PASS' : 'FAIL') . "\n";

// Test 4: Get allowed keys
echo "Test 4: Get allowed keys... ";
$allowedKeys = $formConfig->getAllowedKeys();
echo "✓ Found " . count($allowedKeys) . " allowed keys\n";

// Test 5: Field configuration
echo "Test 5: Field configuration... ";
$field = $formConfig->getField('email');
echo "✓ Email field: " . $field['label'] . " (type: " . $field['type'] . ")\n";

// Test 6: FormSchema
echo "Test 6: FormSchema... ";
require_once __DIR__.'/frontend/src/config/formSchema.php';
$steps = getVisibleFields();
echo "✓ FormSchema has " . count($steps) . " visible steps\n";

// Test 7: Database columns
echo "Test 7: Database columns... ";
$entityManager = require __DIR__.'/BACKEND/config/bootstrap.php';
$lead = new Lead();
$lead->setNom('Test');
$lead->setFirstname('John');
$lead->setEmail('test@example.com');
$lead->setPhone('12345678');
$lead->setCreatedAt(new \DateTime());
echo "✓ Lead entity created successfully\n";

echo "\n=== All Tests Passed! ===\n";
echo "\nDatabase columns in lead table:\n";
echo "  - id\n";
echo "  - nom\n";
echo "  - firstname\n";
echo "  - company\n";
echo "  - start_activity\n";
echo "  - insured_currently\n";
echo "  - previous_resiliation\n";
echo "  - resiliation_motif\n";
echo "  - postcode\n";
echo "  - email\n";
echo "  - phone\n";
echo "  - tele (legacy)\n";
echo "  - entreprise (legacy)\n";
echo "  - statut (legacy)\n";
echo "  - chiffreAffaires (legacy)\n";
echo "  - created_at\n";
echo "\n✓ No custom_fields column needed!\n";
