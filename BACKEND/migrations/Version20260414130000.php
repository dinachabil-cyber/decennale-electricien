<?php

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260414130000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create lead table';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE lead (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, phone VARCHAR(30) NOT NULL, message TEXT DEFAULT NULL, created_at DATETIME NOT NULL, PRIMARY KEY (id))');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE lead');
    }
}