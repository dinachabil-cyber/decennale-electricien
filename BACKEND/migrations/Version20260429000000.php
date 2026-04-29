<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260429000000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add timestamps to page and section tables';
    }

    public function up(Schema $schema): void
    {
        // Add timestamps to page table
        $this->addSql('ALTER TABLE page ADD created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP');
        $this->addSql('ALTER TABLE page ADD updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP');

        // Add timestamps to section table
        $this->addSql('ALTER TABLE section ADD created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP');
        $this->addSql('ALTER TABLE section ADD updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP');
    }

    public function down(Schema $schema): void
    {
        // Remove timestamps from section
        $this->addSql('ALTER TABLE section DROP COLUMN created_at');
        $this->addSql('ALTER TABLE section DROP COLUMN updated_at');

        // Remove timestamps from page
        $this->addSql('ALTER TABLE page DROP COLUMN created_at');
        $this->addSql('ALTER TABLE page DROP COLUMN updated_at');
    }
}
