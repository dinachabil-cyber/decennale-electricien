<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 * 
 * Migration to update lead table structure for dynamic form system.
 * Adds missing columns: start_activity, insured_currently,
 * previous_resiliation, resiliation_motif, postcode, phone.
 * Removes deprecated custom_fields column (no longer needed).
 * Note: firstname and company already added by previous migrations.
 */
final class Version20260424160000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Update lead table structure for dynamic form system - add missing columns and remove custom_fields';
    }

    public function up(Schema $schema): void
    {
        // Add only missing columns (firstname and company already exist from previous migrations)
        $this->addSql('ALTER TABLE lead ADD start_activity DATETIME DEFAULT NULL');
        $this->addSql('ALTER TABLE lead ADD insured_currently VARCHAR(50) DEFAULT NULL');
        $this->addSql('ALTER TABLE lead ADD previous_resiliation VARCHAR(50) DEFAULT NULL');
        $this->addSql('ALTER TABLE lead ADD resiliation_motif TEXT DEFAULT NULL');
        $this->addSql('ALTER TABLE lead ADD postcode VARCHAR(20) DEFAULT NULL');
        $this->addSql('ALTER TABLE lead ADD phone VARCHAR(50) DEFAULT NULL');
        
        // Drop the custom_fields column as it\'s no longer needed
        // Data should be migrated to proper columns before running this in production
        $this->addSql('ALTER TABLE lead DROP custom_fields');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE lead ADD custom_fields JSON DEFAULT NULL');
        $this->addSql('ALTER TABLE lead DROP start_activity');
        $this->addSql('ALTER TABLE lead DROP insured_currently');
        $this->addSql('ALTER TABLE lead DROP previous_resiliation');
        $this->addSql('ALTER TABLE lead DROP resiliation_motif');
        $this->addSql('ALTER TABLE lead DROP postcode');
        $this->addSql('ALTER TABLE lead DROP phone');
    }
}
