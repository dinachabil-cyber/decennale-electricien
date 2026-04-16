<?php

namespace App\Controller;

use App\Entity\Admin;
use App\Entity\Lead;
use App\Middleware\AuthMiddleware;
use App\Repository\LeadRepository;
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
    public function listLeads(
        Request $request,
        LeadRepository $leadRepository,
        EntityManagerInterface $em,
        AuthMiddleware $authMiddleware
    ): JsonResponse {
        $authResponse = $authMiddleware->requireAuth($request, $em);
        if ($authResponse instanceof JsonResponse) {
            return $authResponse;
        }

        $leads = $leadRepository->findBy([], ['createdAt' => 'DESC']);

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

    #[Route('/leads/{id}', name: 'lead_delete', methods: ['DELETE'])]
    public function deleteLead(
        int $id,
        Request $request,
        EntityManagerInterface $em,
        AuthMiddleware $authMiddleware
    ): JsonResponse {
        $authResponse = $authMiddleware->requireAuth($request, $em);
        if ($authResponse instanceof JsonResponse) {
            return $authResponse;
        }

        $lead = $em->find(Lead::class, $id);
        if (!$lead) {
            return new JsonResponse(['error' => 'Lead not found'], 404);
        }

        $em->remove($lead);
        $em->flush();

        return new JsonResponse(['message' => 'Lead deleted successfully']);
    }

    #[Route('/leads/{id}', name: 'lead_update', methods: ['PUT'])]
    public function updateLead(
        int $id,
        Request $request,
        EntityManagerInterface $em,
        AuthMiddleware $authMiddleware
    ): JsonResponse {
        $authResponse = $authMiddleware->requireAuth($request, $em);
        if ($authResponse instanceof JsonResponse) {
            return $authResponse;
        }

        $lead = $em->find(Lead::class, $id);
        if (!$lead) {
            return new JsonResponse(['error' => 'Lead not found'], 404);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['nom'])) $lead->setNom($data['nom']);
        if (isset($data['email'])) $lead->setEmail($data['email']);
        if (isset($data['tele'])) $lead->setTele($data['tele']);
        if (isset($data['entreprise'])) $lead->setEntreprise($data['entreprise']);
        if (isset($data['statut'])) $lead->setStatut($data['statut']);
        if (isset($data['chiffreAffaires'])) $lead->setChiffreAffaires($data['chiffreAffaires']);

        $em->flush();

        return new JsonResponse([
            'id' => $lead->getId(),
            'nom' => $lead->getNom(),
            'email' => $lead->getEmail(),
            'tele' => $lead->getTele(),
            'entreprise' => $lead->getEntreprise(),
            'statut' => $lead->getStatut(),
            'chiffreAffaires' => $lead->getChiffreAffaires(),
            'createdAt' => $lead->getCreatedAt()->format('Y-m-d H:i:s')
        ]);
    }
}
