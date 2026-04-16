<?php

namespace App\Middleware;

use App\Entity\Admin;
use App\Service\TokenService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class AuthMiddleware
{
    private TokenService $tokenService;

    public function __construct(TokenService $tokenService)
    {
        $this->tokenService = $tokenService;
    }

    public function authenticate(Request $request): ?Admin
    {
        $token = $request->headers->get('Authorization');

        if (!$token || !str_starts_with($token, 'Bearer ')) {
            return null;
        }

        $token = substr($token, 7);
        $payload = $this->tokenService->validateToken($token);

        if (!$payload) {
            return null;
        }

        return $payload['sub'] ?? null;
    }

    public function requireAuth(Request $request, $entityManager): JsonResponse|Admin|null
    {
        $token = $request->headers->get('Authorization');

        if (!$token || !str_starts_with($token, 'Bearer ')) {
            return new JsonResponse(['error' => 'Authentication required'], 401);
        }

        $token = substr($token, 7);
        $adminId = $this->tokenService->getAdminIdFromToken($token);

        if (!$adminId) {
            return new JsonResponse(['error' => 'Invalid or expired token'], 401);
        }

        $admin = $entityManager->find(Admin::class, $adminId);

        if (!$admin) {
            return new JsonResponse(['error' => 'Admin not found'], 404);
        }

        return $admin;
    }
}