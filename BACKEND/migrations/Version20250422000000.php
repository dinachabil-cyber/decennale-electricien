<?php

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20250422000000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Drop global_settings table (unused)';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('DROP TABLE IF EXISTS global_settings');
    }

    public function down(Schema $schema): void
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
    }
}
