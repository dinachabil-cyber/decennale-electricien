<?php

namespace App\DataFixtures;

use App\Entity\Admin;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AdminFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $admin = new Admin();
        $admin->setEmail('admin@electricien.fr');
        $admin->setPassword(password_hash('electricien123', PASSWORD_BCRYPT));
        $admin->setRole('admin');
        
        $manager->persist($admin);
        $manager->flush();
    }
}