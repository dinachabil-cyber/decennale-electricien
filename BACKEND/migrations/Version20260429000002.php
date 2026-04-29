<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Keep only French column names in lead table
 */
final class Version20260429000002 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Keep only French column names in lead table';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE lead DROP COLUMN IF EXISTS firstname');
        $this->addSql('ALTER TABLE lead DROP COLUMN IF EXISTS company');
        $this->addSql('ALTER TABLE lead DROP COLUMN IF EXISTS phone');
        $this->addSql('ALTER TABLE lead DROP COLUMN IF EXISTS postcode');
        $this->addSql('ALTER TABLE lead DROP COLUMN IF EXISTS demarrage_activite');
        $this->addSql('ALTER TABLE lead DROP COLUMN IF EXISTS status');
        $this->addSql('ALTER TABLE lead DROP COLUMN IF EXISTS turnover');
        $this->addSql('ALTER TABLE lead DROP COLUMN IF EXISTS insured_currently');
        $this->addSql('ALTER TABLE lead DROP COLUMN IF EXISTS previous_resiliation');
        $this->addSql('ALTER TABLE lead DROP COLUMN IF EXISTS resiliation_reason');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE lead ADD COLUMN IF NOT EXISTS firstname VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE lead ADD COLUMN IF NOT EXISTS company VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE lead ADD COLUMN IF NOT EXISTS phone VARCHAR(50) DEFAULT NULL');
        $this->addSql('ALTER TABLE lead ADD COLUMN IF NOT EXISTS postcode VARCHAR(20) DEFAULT NULL');
        $this->addSql('ALTER TABLE lead ADD COLUMN IF NOT EXISTS demarrage_activite VARCHAR(50) DEFAULT NULL');
        $this->addSql('ALTER TABLE lead ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT NULL');
        $this->addSql('ALTER TABLE lead ADD COLUMN IF NOT EXISTS turnover VARCHAR(50) DEFAULT NULL');
        $this->addSql('ALTER TABLE lead ADD COLUMN IF NOT EXISTS insured_currently VARCHAR(50) DEFAULT NULL');
        $this->addSql('ALTER TABLE lead ADD COLUMN IF NOT EXISTS previous_resiliation VARCHAR(50) DEFAULT NULL');
        $this->addSql('ALTER TABLE lead ADD COLUMN IF NOT EXISTS resiliation_reason TEXT DEFAULT NULL');
    }
}
