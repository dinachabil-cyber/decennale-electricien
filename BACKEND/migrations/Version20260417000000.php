<?php

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260417000000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create global_settings table, add isPublished to page, add isEnabled to section';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE global_settings (
            id INT AUTO_INCREMENT PRIMARY KEY,
            site_title VARCHAR(255) DEFAULT "Assurance Décennale Électricien",
            site_subtitle VARCHAR(255) DEFAULT "Devis en quelques clics",
            phone VARCHAR(50) DEFAULT "01 82 83 48 00",
            email VARCHAR(255) DEFAULT "contact@ecennale-electricien.fr",
            address VARCHAR(255) DEFAULT "",
            logo VARCHAR(255) DEFAULT "",
            footer_text VARCHAR(255) DEFAULT "© 2024 Assurance Décennale Électricien. Tous droits réservés.",
            footer_links JSON DEFAULT NULL,
            is_published TINYINT(1) DEFAULT 1
        )');

        $this->addSql('ALTER TABLE page ADD is_published TINYINT(1) DEFAULT 0');
        $this->addSql('ALTER TABLE section ADD is_enabled TINYINT(1) DEFAULT 1');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE global_settings');
        $this->addSql('ALTER TABLE page DROP COLUMN is_published');
        $this->addSql('ALTER TABLE section DROP COLUMN is_enabled');
    }
}