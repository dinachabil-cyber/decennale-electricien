<?php

require 'vendor/autoload.php';

use App\Entity\Admin;
use Doctrine\ORM\Tools\Setup;
use Doctrine\ORM\EntityManager;

$paths = [__DIR__ . '/src/Entity'];
$isDevMode = true;

$config = Setup::createAnnotationMetadataConfiguration($paths, $isDevMode);

// Database connection from environment
$dbParams = [
    'driver' => 'pdo_mysql',
    'host' => getenv('DBHOST') ?: '127.0.0.1',
    'port' => getenv('DBPORT') ?: '3306',
    'dbname' => getenv('DBNAME') ?: 'default',
    'user' => getenv('DBUSER') ?: 'root',
    'password' => getenv('DBPASSWORD') ?: '',
    'charset' => 'utf8mb4'
];

try {
    $em = EntityManager::create($dbParams, $config);
    
    // Check if admin exists
    $existing = $em->getRepository(Admin::class)->findOneBy(['email' => 'admin@electricien.fr']);
    
    if ($existing) {
        echo "Admin already exists!\n";
    } else {
        $admin = new Admin();
        $admin->setEmail('admin@electricien.fr');
        $admin->setPassword(password_hash('electricien123', PASSWORD_BCRYPT));
        $admin->setRole('admin');
        
        $em->persist($admin);
        $em->flush();
        
        echo "Admin created successfully!\n";
        echo "Email: admin@electricien.fr\n";
        echo "Password: electricien123\n";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}