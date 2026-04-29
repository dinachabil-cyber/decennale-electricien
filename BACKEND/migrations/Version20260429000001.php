<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260429000001 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create settings and media tables';
    }

    public function up(Schema $schema): void
    {
        // Create settings table
        $this->addSql('CREATE TABLE settings (
            id INT AUTO_INCREMENT NOT NULL,
            site_title VARCHAR(255) NOT NULL DEFAULT "Assurance Décennale Électricien",
            site_subtitle VARCHAR(255) DEFAULT NULL,
            phone VARCHAR(50) DEFAULT NULL,
            email VARCHAR(255) DEFAULT NULL,
            address VARCHAR(255) DEFAULT NULL,
            logo VARCHAR(255) DEFAULT NULL,
            footer_text VARCHAR(255) DEFAULT NULL,
            footer_links JSON DEFAULT NULL,
            is_published TINYINT(1) NOT NULL DEFAULT 1,
            PRIMARY KEY(id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');

        // Insert default settings
        $this->addSql('INSERT INTO settings (site_title, site_subtitle, phone, email, footer_text, is_published) VALUES 
            ("Assurance Décennale Électricien", "Devis en quelques clics", "01 82 83 48 00", "contact@ecennale-electricien.fr", "© 2024 Assurance Décennale Électricien. Tous droits réservés.", 1)');

        // Create media table
        $this->addSql('CREATE TABLE media (
            id INT AUTO_INCREMENT NOT NULL,
            filename VARCHAR(255) NOT NULL,
            path VARCHAR(255) NOT NULL,
            mime_type VARCHAR(255) NOT NULL,
            size INT NOT NULL,
            created_at DATETIME NOT NULL,
            PRIMARY KEY(id)
        ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE media');
        $this->addSql('DROP TABLE settings');
    }
}
