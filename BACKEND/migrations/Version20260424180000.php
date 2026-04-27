<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Rename resiliation_motif to resiliation_reason for clean English naming
 */
final class Version20260424180000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Rename resiliation_motif column to resiliation_reason for consistent naming';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE lead CHANGE resiliation_motif resiliation_reason TEXT DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE lead CHANGE resiliation_reason resiliation_motif TEXT DEFAULT NULL');
    }
}
