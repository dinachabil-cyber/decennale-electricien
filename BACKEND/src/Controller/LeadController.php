<?php

namespace App\Controller;

use App\Entity\Lead;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api')]
class LeadController extends AbstractController
{
    #[Route('/leads', name: 'lead_create', methods: ['POST'])]
    public function createLead(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $lead = new Lead();
        $lead->setNom($data['nom'] ?? null);
        $lead->setEmail($data['email'] ?? null);
        $lead->setTele($data['tele'] ?? null);
        $lead->setEntreprise($data['entreprise'] ?? null);
        $lead->setStatut($data['statut'] ?? null);
        $lead->setChiffreAffaires($data['chiffreAffaires'] ?? null);

        $em->persist($lead);
        $em->flush();

        return new JsonResponse([
            'success' => true,
            'message' => 'Lead créé avec succès'
        ], 201);
    }

    #[Route('/leads', name: 'lead_list', methods: ['GET'])]
    public function listLeads(EntityManagerInterface $em): JsonResponse
    {
        $leads = $em->getRepository(Lead::class)->findBy([], ['createdAt' => 'DESC']);

        $data = array_map(function ($lead) {
            return [
                'id' => $lead->getId(),
                'nom' => $lead->getNom(),
                'email' => $lead->getEmail(),
                'tele' => $lead->getTele(),
                'entreprise' => $lead->getEntreprise(),
                'statut' => $lead->getStatut(),
                'chiffreAffaires' => $lead->getChiffreAffaires(),
                'createdAt' => $lead->getCreatedAt()->format('Y-m-d H:i:s')
            ];
        }, $leads);

        return new JsonResponse($data);
    }
}