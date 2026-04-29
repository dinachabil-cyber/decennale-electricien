<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Add tele column for French telephone field
 */
final class Version20260429000003 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add tele column to lead table';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE lead ADD tele VARCHAR(50) DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE lead DROP COLUMN tele');
    }
}
