<?php

namespace App\Controller;

use App\Entity\Admin;
use App\Middleware\AuthMiddleware;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController as BaseController;

abstract class AdminController extends BaseController
{
    protected AuthMiddleware $authMiddleware;

    public function __construct(AuthMiddleware $authMiddleware)
    {
        $this->authMiddleware = $authMiddleware;
    }

    protected function requireAdmin(Request $request, EntityManagerInterface $em): JsonResponse|Admin
    {
        $result = $this->authMiddleware->requireAuth($request, $em);
        
        if ($result instanceof JsonResponse) {
            return $result;
        }
        
        if ($result === null) {
            return new JsonResponse(['error' => 'Admin not found'], 404);
        }
        
        return $result;
    }
}
