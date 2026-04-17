<?php

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260417152000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Verify lead table columns (no-op - table already correct)';
    }

    public function up(Schema $schema): void
    {
        // Table already has correct columns: nom, email, tele, entreprise, statut, chiffre_affaires, created_at
    }

    public function down(Schema $schema): void
    {
        // No-op
    }
}