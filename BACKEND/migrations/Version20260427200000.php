<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Rename start_activity to demaree_activite and change from DATETIME to VARCHAR(50)
 * for yes/no selection instead of date picker
 */
final class Version20260427200000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Rename start_activity to demaree_activite and change to yes/no select';
    }

    public function up(Schema $schema): void
    {
        // Rename column and change type from DATETIME to VARCHAR(50)
        $this->addSql('ALTER TABLE lead CHANGE start_activity demaree_activite VARCHAR(50) DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        // Revert: change back to DATETIME and rename to start_activity
        $this->addSql('ALTER TABLE lead CHANGE demaree_activite start_activity DATETIME DEFAULT NULL');
    }
}
