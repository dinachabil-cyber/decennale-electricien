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
        $this->addSql('CREATE TABLE IF NOT EXISTS lead (id INT AUTO_INCREMENT NOT NULL, nom VARCHAR(255) DEFAULT NULL, email VARCHAR(255) DEFAULT NULL, tele VARCHAR(50) DEFAULT NULL, entreprise VARCHAR(255) DEFAULT NULL, statut VARCHAR(50) DEFAULT NULL, chiffre_affaires VARCHAR(50) DEFAULT NULL, created_at DATETIME NOT NULL, PRIMARY KEY(id))');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE lead');
    }
}