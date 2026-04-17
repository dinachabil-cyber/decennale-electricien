<?php
// BACKEND/bin/check-pages-simple.php
// Run: php bin/check-pages-simple.php

require_once __DIR__ . '/../vendor/autoload.php';

$kernel = new App\Kernel();
$container = $kernel->getContainer();
$em = $container->get('doctrine.orm.entity_manager');

$pages = $em->createQuery('SELECT p.id, p.title, p.slug, COUNT(s.id) as sectionCount FROM App\Entity\Page p LEFT JOIN p.sections s GROUP BY p.id')->getResult();

echo "\n=== PAGES IN DATABASE ===\n";
echo "Total: " . count($pages) . "\n\n";

foreach ($pages as $row) {
    echo "ID: {$row['id']}\n";
    echo "Title: {$row['title']}\n";
    echo "Slug: {$row['slug']}\n";
    echo "Sections: {$row['sectionCount']}\n";
    echo "------------------------\n";
}

echo "\n✅ If you see 3 pages above, your admin will show 3 pages.\n";
echo "   Refresh /admin in your browser now.\n\n";
