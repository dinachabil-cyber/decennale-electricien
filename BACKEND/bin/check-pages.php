<?php
// BACKEND/bin/check-pages.php
// Run: php bin/check-pages.php

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../config/bootstrap.php';

use App\Entity\Page;
use Doctrine\ORM\Tools\Setup;
use Doctrine\ORM\EntityManager;

$kernel = new App\Kernel();
$entityManager = $kernel->getContainer()->get('doctrine.orm.entity_manager');

$pages = $entityManager->getRepository(Page::class)->findAll();

echo "\n=== PAGES IN DATABASE ===\n";
echo "Total: " . count($pages) . "\n\n";

foreach ($pages as $page) {
    echo "ID: " . $page->getId() . "\n";
    echo "Title: " . $page->getTitle() . "\n";
    echo "Slug: " . $page->getSlug() . "\n";
    echo "Sections count: " . count($page->getSections()) . "\n";
    echo "------------------------\n";
}
