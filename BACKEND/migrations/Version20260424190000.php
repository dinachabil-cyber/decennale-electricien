<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Remove legacy duplicate columns (nom, tele, entreprise, statut, chiffre_affaires)
 * These are replaced by the clean naming: firstname, phone, company, status, turnover
 */
final class Version20260424190000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Remove legacy duplicate columns to maintain clean, non-duplicated schema';
    }

    public function up(Schema $schema): void
    {
        // Drop legacy columns if they exist
        $this->addSql('ALTER TABLE lead DROP COLUMN IF EXISTS nom');
        $this->addSql('ALTER TABLE lead DROP COLUMN IF EXISTS tele');
        $this->addSql('ALTER TABLE lead DROP COLUMN IF EXISTS entreprise');
        $this->addSql('ALTER TABLE lead DROP COLUMN IF EXISTS statut');
        $this->addSql('ALTER TABLE lead DROP COLUMN IF EXISTS chiffre_affaires');
    }

    public function down(Schema $schema): void
    {
        // Restore legacy columns (if needed for rollback)
        $this->addSql('ALTER TABLE lead ADD nom VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE lead ADD tele VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE lead ADD entreprise VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE lead ADD statut VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE lead ADD chiffre_affaires VARCHAR(255) DEFAULT NULL');
    }
}
