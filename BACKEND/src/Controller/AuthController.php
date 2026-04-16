<?php

namespace App\Controller;

use App\Entity\Admin;
use App\Service\TokenService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class AuthController extends AbstractController
{
    #[Route('/api/auth/login', name: 'login', methods: ['POST'])]
    public function login(Request $request, EntityManagerInterface $em, TokenService $tokenService): JsonResponse
    {
        $content = $request->getContent();
        $data = json_decode($content, true);

        // Debug logging
        error_log("Login attempt - Raw content: " . $content);
        error_log("Login attempt - Decoded data: " . print_r($data, true));

        if (!isset($data['email']) || !isset($data['password'])) {
            return new JsonResponse(['error' => 'Email and password are required', 'debug' => $data], Response::HTTP_BAD_REQUEST);
        }

        $admin = $em->getRepository(Admin::class)->findOneByEmail($data['email']);

        if (!$admin || !password_verify($data['password'], $admin->getPassword())) {
            return new JsonResponse(['error' => 'Invalid credentials'], Response::HTTP_UNAUTHORIZED);
        }

        $token = $tokenService->generateToken($admin->getId(), $admin->getEmail());
        $admin->setLastLoginAt(new \DateTime());
        $em->flush();

        return new JsonResponse([
            'token' => $token,
            'admin' => [
                'id' => $admin->getId(),
                'email' => $admin->getEmail(),
                'role' => $admin->getRole()
            ]
        ], Response::HTTP_OK);
    }

    #[Route('/api/auth/register', name: 'register', methods: ['POST'])]
    public function register(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $existingAdmins = $em->getRepository(Admin::class)->findAll();
        if (!empty($existingAdmins)) {
            return new JsonResponse(['error' => 'Registration not allowed. Admin already exists.'], Response::HTTP_FORBIDDEN);
        }

        if (!isset($data['email']) || !isset($data['password'])) {
            return new JsonResponse(['error' => 'Email and password are required'], Response::HTTP_BAD_REQUEST);
        }

        $admin = new Admin();
        $admin->setEmail($data['email']);
        $admin->setPassword(password_hash($data['password'], PASSWORD_BCRYPT));
        $admin->setRole($data['role'] ?? 'admin');

        $em->persist($admin);
        $em->flush();

        return new JsonResponse([
            'id' => $admin->getId(),
            'email' => $admin->getEmail(),
            'role' => $admin->getRole()
        ], Response::HTTP_CREATED);
    }

    #[Route('/api/auth/verify', name: 'verify', methods: ['GET'])]
    public function verify(Request $request, TokenService $tokenService, EntityManagerInterface $em): JsonResponse
    {
        $token = $request->headers->get('Authorization');
        
        if (!$token || !str_starts_with($token, 'Bearer ')) {
            return new JsonResponse(['error' => 'No token provided'], Response::HTTP_UNAUTHORIZED);
        }

        $token = substr($token, 7);
        $payload = $tokenService->validateToken($token);

        if (!$payload) {
            return new JsonResponse(['error' => 'Invalid token'], Response::HTTP_UNAUTHORIZED);
        }

        $admin = $em->find(Admin::class, $payload['sub']);
        
        if (!$admin) {
            return new JsonResponse(['error' => 'Admin not found'], Response::HTTP_NOT_FOUND);
        }

        return new JsonResponse([
            'id' => $admin->getId(),
            'email' => $admin->getEmail(),
            'role' => $admin->getRole()
        ], Response::HTTP_OK);
    }

    #[Route('/api/auth/logout', name: 'logout', methods: ['POST'])]
    public function logout(): JsonResponse
    {
        return new JsonResponse(['message' => 'Logged out successfully'], Response::HTTP_OK);
    }

    #[Route('/api/admin/stats', name: 'admin_stats', methods: ['GET'])]
    public function getStats(
        Request $request,
        EntityManagerInterface $em,
        AuthMiddleware $authMiddleware
    ): JsonResponse {
        $authResponse = $authMiddleware->requireAuth($request, $em);
        if ($authResponse instanceof JsonResponse) {
            return $authResponse;
        }

        $leadRepo = $em->getRepository(\App\Entity\Lead::class);
        $pageRepo = $em->getRepository(\App\Entity\Page::class);
        
        $leads = $leadRepo->findAll();
        $pages = $pageRepo->findAll();

        $totalLeads = count($leads);
        $newLeadsThisMonth = 0;
        $now = new \DateTime();
        foreach ($leads as $lead) {
            if ($lead->getCreatedAt() && $lead->getCreatedAt()->format('Y-m') === $now->format('Y-m')) {
                $newLeadsThisMonth++;
            }
        }

        return new JsonResponse([
            'totalLeads' => $totalLeads,
            'newLeadsThisMonth' => $newLeadsThisMonth,
            'totalPages' => count($pages),
            'leadsByStatus' => []
        ], Response::HTTP_OK);
    }
}