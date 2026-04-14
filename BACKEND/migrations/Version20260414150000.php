<?php

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260414150000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add company, status, turnover columns to lead table';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE lead ADD company VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE lead ADD status VARCHAR(50) DEFAULT NULL');
        $this->addSql('ALTER TABLE lead ADD turnover VARCHAR(50) DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE lead DROP COLUMN company');
        $this->addSql('ALTER TABLE lead DROP COLUMN status');
        $this->addSql('ALTER TABLE lead DROP COLUMN turnover');
    }
}