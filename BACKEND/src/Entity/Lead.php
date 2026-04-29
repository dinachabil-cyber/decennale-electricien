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
    private ?string $nom = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $prenom = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $email = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $raison_sociale = null;

    #[ORM\Column(length: 50, nullable: true)]
    private ?string $demaree_activite = null;

    #[ORM\Column(name: 'activite_assuree', length: 255, nullable: true)]
    private ?string $insured_currently = null;

    #[ORM\Column(name: 'assurance_resilie', length: 255, nullable: true)]
    private ?string $previous_resiliation = null;

    #[ORM\Column(name: 'motif_resiliation', type: 'string', length: 255, nullable: true)]
    private ?string $resiliation_reason = null;

    #[ORM\Column(name: 'code_postal', length: 255, nullable: true)]
    private ?string $code_postal = null;

    #[ORM\Column(name: 'tele', length: 50, nullable: true)]
    private ?string $tele = null;

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

    public function getNom(): ?string
    {
        return $this->nom;
    }

    public function setNom(?string $nom): static
    {
        $this->nom = $nom;
        return $this;
    }

    public function getPrenom(): ?string
    {
        return $this->prenom;
    }

    public function setPrenom(?string $prenom): static
    {
        $this->prenom = $prenom;
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

    public function getTele(): ?string
    {
        return $this->tele;
    }

    public function setTele(?string $tele): static
    {
        $this->tele = $tele;
        return $this;
    }

    public function getRaisonSociale(): ?string
    {
        return $this->raison_sociale;
    }

    public function setRaisonSociale(?string $raison_sociale): static
    {
        $this->raison_sociale = $raison_sociale;
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

    public function getCodePostal(): ?string
    {
        return $this->code_postal;
    }

    public function setCodePostal(?string $code_postal): static
    {
        $this->code_postal = $code_postal;
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
