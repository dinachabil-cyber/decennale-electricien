<?php

namespace App\Entity;

use App\Repository\GlobalSettingsRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: GlobalSettingsRepository::class)]
#[ORM\Table(name: 'global_settings')]
class GlobalSettings
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $siteTitle = 'Assurance Décennale Électricien';

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $siteSubtitle = 'Devis en quelques clics';

    #[ORM\Column(length: 50, nullable: true)]
    private ?string $phone = '01 82 83 48 00';

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $email = 'contact@ecennale-electricien.fr';

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $address = '';

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $logo = '';

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $footerText = '© 2024 Assurance Décennale Électricien. Tous droits réservés.';

    #[ORM\Column(type: 'json', nullable: true)]
    private ?array $footerLinks = [];

    #[ORM\Column(type: 'boolean')]
    private bool $isPublished = true;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getSiteTitle(): ?string
    {
        return $this->siteTitle;
    }

    public function setSiteTitle(?string $siteTitle): static
    {
        $this->siteTitle = $siteTitle;
        return $this;
    }

    public function getSiteSubtitle(): ?string
    {
        return $this->siteSubtitle;
    }

    public function setSiteSubtitle(?string $siteSubtitle): static
    {
        $this->siteSubtitle = $siteSubtitle;
        return $this;
    }

    public function getPhone(): ?string
    {
        return $this->phone;
    }

    public function setPhone(?string $phone): static
    {
        $this->phone = $phone;
        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(?string $email): static
    {
        $this->email = $email;
        return $this;
    }

    public function getAddress(): ?string
    {
        return $this->address;
    }

    public function setAddress(?string $address): static
    {
        $this->address = $address;
        return $this;
    }

    public function getLogo(): ?string
    {
        return $this->logo;
    }

    public function setLogo(?string $logo): static
    {
        $this->logo = $logo;
        return $this;
    }

    public function getFooterText(): ?string
    {
        return $this->footerText;
    }

    public function setFooterText(?string $footerText): static
    {
        $this->footerText = $footerText;
        return $this;
    }

    public function getFooterLinks(): ?array
    {
        return $this->footerLinks;
    }

    public function setFooterLinks(?array $footerLinks): static
    {
        $this->footerLinks = $footerLinks;
        return $this;
    }

    public function isPublished(): bool
    {
        return $this->isPublished;
    }

    public function setIsPublished(bool $isPublished): static
    {
        $this->isPublished = $isPublished;
        return $this;
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'siteTitle' => $this->siteTitle,
            'siteSubtitle' => $this->siteSubtitle,
            'phone' => $this->phone,
            'email' => $this->email,
            'address' => $this->address,
            'logo' => $this->logo,
            'footerText' => $this->footerText,
            'footerLinks' => $this->footerLinks,
            'isPublished' => $this->isPublished
        ];
    }
}