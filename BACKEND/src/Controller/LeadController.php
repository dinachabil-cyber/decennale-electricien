<?php

namespace App\Controller;

use App\Entity\Lead;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class LeadController extends AbstractController
{
    #[Route('/api/leads', name: 'create_lead', methods: ['POST'])]
    public function createLead(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['name']) || !isset($data['email']) || !isset($data['phone'])) {
            return new JsonResponse(['error' => 'Missing required fields'], 400);
        }

        $lead = new Lead();
        $lead->setName($data['name']);
        $lead->setEmail($data['email']);
        $lead->setPhone($data['phone']);
        $lead->setMessage($data['message'] ?? null);
        $lead->setCompany($data['company'] ?? null);
        $lead->setStatus($data['status'] ?? null);
        $lead->setTurnover($data['turnover'] ?? null);
        $lead->setCreatedAt(new \DateTimeImmutable());

        $entityManager->persist($lead);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Lead created successfully'], 201);
    }
}