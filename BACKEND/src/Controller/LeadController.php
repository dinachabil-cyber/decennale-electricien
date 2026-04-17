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

        $errors = [];
        if (!empty($data['email']) && !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $errors[] = 'Email invalide';
        }
        if (!empty($data['tele']) && !preg_match('/^[\d\s\+\-\(\)]{8,20}$/', $data['tele'])) {
            $errors[] = 'Téléphone invalide';
        }
        if (empty($data['nom']) && empty($data['email']) && empty($data['tele'])) {
            $errors[] = 'Veuillez fournir au moins un champ';
        }
        if (!empty($errors)) {
            return new JsonResponse(['success' => false, 'errors' => $errors], 400);
        }

        $lead = new Lead();
        $lead->setNom($data['nom'] ?? null);
        $lead->setEmail($data['email'] ?? null);
        $lead->setTele($data['tele'] ?? null);
        $lead->setEntreprise($data['entreprise'] ?? null);
        $lead->setStatut($data['statut'] ?? null);
        $lead->setChiffreAffaires($data['chiffreAffaires'] ?? null);

        $em->persist($lead);

        try {
            $em->flush();
        } catch (\Exception $e) {
            return new JsonResponse([
                'success' => false,
                'message' => 'Erreur: ' . $e->getMessage()
            ], 500);
        }

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