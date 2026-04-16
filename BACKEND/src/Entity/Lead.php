<?php

namespace App\Entity;

use App\Repository\LeadRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: LeadRepository::class)]
class Lead
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

<<<<<<< HEAD
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $nom = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $email = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $tele = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $entreprise = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $statut = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $chiffreAffaires = null;

    #[ORM\Column(type: 'datetime', nullable: true)]
    private ?\DateTime $createdAt = null;

    public function __construct()
    {
        $this->createdAt = new \DateTime();
    }

=======
    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column(length: 255)]
    private ?string $email = null;

    #[ORM\Column(length: 30)]
    private ?string $phone = null;

    #[ORM\Column(type: "text", nullable: true)]
    private ?string $message = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $company = null;

    #[ORM\Column(length: 50, nullable: true)]
    private ?string $status = null;

    #[ORM\Column(length: 50, nullable: true)]
    private ?string $turnover = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
    }

    // ID
>>>>>>> d94e20d84ccf633d4a2b62929d4bbdb750bfd1e8
    public function getId(): ?int
    {
        return $this->id;
    }

<<<<<<< HEAD
    public function getNom(): ?string
    {
        return $this->nom;
    }

    public function setNom(?string $nom): static
    {
        $this->nom = $nom;
        return $this;
    }

=======
    // NAME
    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;
        return $this;
    }

    // EMAIL
>>>>>>> d94e20d84ccf633d4a2b62929d4bbdb750bfd1e8
    public function getEmail(): ?string
    {
        return $this->email;
    }

<<<<<<< HEAD
    public function setEmail(?string $email): static
=======
    public function setEmail(string $email): static
>>>>>>> d94e20d84ccf633d4a2b62929d4bbdb750bfd1e8
    {
        $this->email = $email;
        return $this;
    }

<<<<<<< HEAD
    public function getTele(): ?string
    {
        return $this->tele;
    }

    public function setTele(?string $tele): static
    {
        $this->tele = $tele;
        return $this;
    }

    public function getEntreprise(): ?string
    {
        return $this->entreprise;
    }

    public function setEntreprise(?string $entreprise): static
    {
        $this->entreprise = $entreprise;
        return $this;
    }

    public function getStatut(): ?string
    {
        return $this->statut;
    }

    public function setStatut(?string $statut): static
    {
        $this->statut = $statut;
        return $this;
    }

    public function getChiffreAffaires(): ?string
    {
        return $this->chiffreAffaires;
    }

    public function setChiffreAffaires(?string $chiffreAffaires): static
    {
        $this->chiffreAffaires = $chiffreAffaires;
        return $this;
    }

    public function getCreatedAt(): ?\DateTime
=======
    // PHONE
    public function getPhone(): ?string
    {
        return $this->phone;
    }

    public function setPhone(string $phone): static
    {
        $this->phone = $phone;
        return $this;
    }

    // MESSAGE
    public function getMessage(): ?string
    {
        return $this->message;
    }

    public function setMessage(?string $message): static
    {
        $this->message = $message;
        return $this;
    }

    // COMPANY
    public function getCompany(): ?string
    {
        return $this->company;
    }

    public function setCompany(?string $company): static
    {
        $this->company = $company;
        return $this;
    }

    // STATUS
    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(?string $status): static
    {
        $this->status = $status;
        return $this;
    }

    // TURNOVER
    public function getTurnover(): ?string
    {
        return $this->turnover;
    }

    public function setTurnover(?string $turnover): static
    {
        $this->turnover = $turnover;
        return $this;
    }

    // CREATED AT
    public function getCreatedAt(): ?\DateTimeImmutable
>>>>>>> d94e20d84ccf633d4a2b62929d4bbdb750bfd1e8
    {
        return $this->createdAt;
    }

<<<<<<< HEAD
    public function setCreatedAt(?\DateTime $createdAt): static
=======
    public function setCreatedAt(\DateTimeImmutable $createdAt): static
>>>>>>> d94e20d84ccf633d4a2b62929d4bbdb750bfd1e8
    {
        $this->createdAt = $createdAt;
        return $this;
    }
<<<<<<< HEAD
}
=======
}
>>>>>>> d94e20d84ccf633d4a2b62929d4bbdb750bfd1e8
