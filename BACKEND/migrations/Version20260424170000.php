<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Add missing columns and rename to clean English naming
 */
final class Version20260424170000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add missing columns (status, turnover) and ensure clean naming';
    }

    public function up(Schema $schema): void
    {
        // Add missing columns that don't exist yet
        $this->addSql('ALTER TABLE lead ADD status VARCHAR(50) DEFAULT NULL');
        $this->addSql('ALTER TABLE lead ADD turnover VARCHAR(50) DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE lead DROP status');
        $this->addSql('ALTER TABLE lead DROP turnover');
    }
}
