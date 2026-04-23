<?php

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260423113000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add custom_fields JSON column to lead table for dynamic form fields';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE lead ADD custom_fields JSON DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE lead DROP custom_fields');
    }
}
