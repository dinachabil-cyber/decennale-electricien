<?php

namespace App\Entity;

use App\Repository\LeadRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: LeadRepository::class)]
#[ORM\Table(name: 'lead')]
class Lead
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $firstname = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $email = null;

    #[ORM\Column(length: 50, nullable: true)]
    private ?string $phone = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $company = null;

    #[ORM\Column(length: 50, nullable: true)]
    private ?string $status = null;

    #[ORM\Column(length: 50, nullable: true)]
    private ?string $turnover = null;

    #[ORM\Column(length: 50, nullable: true)]
    private ?string $demaree_activite = null;

    #[ORM\Column(length: 50, nullable: true)]
    private ?string $insured_currently = null;

    #[ORM\Column(length: 50, nullable: true)]
    private ?string $previous_resiliation = null;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $resiliation_reason = null;

    #[ORM\Column(length: 20, nullable: true)]
    private ?string $postcode = null;

    #[ORM\Column(type: 'datetime', nullable: true)]
    private ?\DateTime $created_at = null;

    public function __construct()
    {
        $this->created_at = new \DateTime();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFirstname(): ?string
    {
        return $this->firstname;
    }

    public function setFirstname(?string $firstname): static
    {
        $this->firstname = $firstname;
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

    public function getPhone(): ?string
    {
        return $this->phone;
    }

    public function setPhone(?string $phone): static
    {
        $this->phone = $phone;
        return $this;
    }

    public function getCompany(): ?string
    {
        return $this->company;
    }

    public function setCompany(?string $company): static
    {
        $this->company = $company;
        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(?string $status): static
    {
        $this->status = $status;
        return $this;
    }

    public function getTurnover(): ?string
    {
        return $this->turnover;
    }

    public function setTurnover(?string $turnover): static
    {
        $this->turnover = $turnover;
        return $this;
    }

    public function getDemareeActivite(): ?string
    {
        return $this->demaree_activite;
    }

    public function setDemareeActivite(?string $demaree_activite): static
    {
        $this->demaree_activite = $demaree_activite;
        return $this;
    }

    public function getInsuredCurrently(): ?string
    {
        return $this->insured_currently;
    }

    public function setInsuredCurrently(?string $insured_currently): static
    {
        $this->insured_currently = $insured_currently;
        return $this;
    }

    public function getPreviousResiliation(): ?string
    {
        return $this->previous_resiliation;
    }

    public function setPreviousResiliation(?string $previous_resiliation): static
    {
        $this->previous_resiliation = $previous_resiliation;
        return $this;
    }

    public function getResiliationReason(): ?string
    {
        return $this->resiliation_reason;
    }

    public function setResiliationReason(?string $resiliation_reason): static
    {
        $this->resiliation_reason = $resiliation_reason;
        return $this;
    }

    public function getPostcode(): ?string
    {
        return $this->postcode;
    }

    public function setPostcode(?string $postcode): static
    {
        $this->postcode = $postcode;
        return $this;
    }

    public function getCreatedAt(): ?\DateTime
    {
        return $this->created_at;
    }

    public function setCreatedAt(?\DateTime $created_at): static
    {
        $this->created_at = $created_at;
        return $this;
    }
}
