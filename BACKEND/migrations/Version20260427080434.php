<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260427080434 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE admin DROP last_login_at');
        $this->addSql('ALTER TABLE lead CHANGE resiliation_reason resiliation_reason LONGTEXT DEFAULT NULL');
        $this->addSql('ALTER TABLE page CHANGE is_published is_published TINYINT NOT NULL');
        $this->addSql('ALTER TABLE section CHANGE is_enabled is_enabled TINYINT NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE admin ADD last_login_at DATETIME DEFAULT NULL');
        $this->addSql('ALTER TABLE lead CHANGE resiliation_reason resiliation_reason TEXT DEFAULT NULL');
        $this->addSql('ALTER TABLE page CHANGE is_published is_published TINYINT DEFAULT 0');
        $this->addSql('ALTER TABLE section CHANGE is_enabled is_enabled TINYINT DEFAULT 1');
    }
}
