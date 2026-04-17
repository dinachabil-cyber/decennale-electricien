<?php

namespace App\Repository;

use App\Entity\GlobalSettings;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class GlobalSettingsRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, GlobalSettings::class);
    }

    public function getSettings(): ?GlobalSettings
    {
        return $this->findOneBy([]);
    }
}