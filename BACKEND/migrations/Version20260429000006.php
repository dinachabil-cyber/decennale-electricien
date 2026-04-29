<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Drop unused settings and media tables
 */
final class Version20260429000006 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Drop settings and media tables (unused CMS scaffolding)';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('DROP TABLE IF EXISTS settings');
        $this->addSql('DROP TABLE IF EXISTS media');
    }

    public function down(Schema $schema): void
    {
        // No rollback - tables were unused
    }
}
