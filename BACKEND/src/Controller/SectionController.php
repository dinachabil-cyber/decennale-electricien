<?php

namespace App\Controller;

use App\Entity\Section;
use App\Entity\Page;
use App\Controller\AdminController;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class SectionController extends AdminController
{
    #[Route('/api/sections', name: 'list_sections', methods: ['GET'])]
    public function listSections(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $authResult = $this->requireAdmin($request, $em);
        if ($authResult instanceof JsonResponse) {
            return $authResult;
        }

        $sections = $em->getRepository(Section::class)->findAll();
        $result = [];
        foreach ($sections as $section) {
            $result[] = [
                'id' => $section->getId(),
                'pageId' => $section->getPage()?->getId(),
                'type' => $section->getType(),
                'content' => $section->getContent(),
                'position' => $section->getPosition(),
                'isEnabled' => $section->isEnabled(),
                'createdAt' => $section->getCreatedAt()?->format('c'),
                'updatedAt' => $section->getUpdatedAt()?->format('c'),
            ];
        }
        return new JsonResponse($result);
    }

    #[Route('/api/sections', name: 'create_section', methods: ['POST'])]
    public function createSection(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $authResult = $this->requireAdmin($request, $em);
        if ($authResult instanceof JsonResponse) {
            return $authResult;
        }

        $data = json_decode($request->getContent(), true);

        if (!isset($data['pageId']) || !isset($data['type'])) {
            return new JsonResponse(['error' => 'Page ID and type are required'], 400);
        }

        $page = $em->find(Page::class, $data['pageId']);
        if (!$page) {
            return new JsonResponse(['error' => 'Page not found'], 404);
        }

        $validTypes = ['hero', 'faq', 'content', 'cards', 'cta', 'form', 'steps', 'footer'];
        if (!in_array($data['type'], $validTypes)) {
            return new JsonResponse(['error' => 'Invalid section type'], 400);
        }

        $section = new Section();
        $section->setPage($page);
        $section->setType($data['type']);
        $section->setContent($data['content'] ?? []);
        $section->setPosition($data['position'] ?? 0);
        $section->setIsEnabled($data['isEnabled'] ?? true);

        $em->persist($section);
        $em->flush();

        return new JsonResponse([
            'id' => $section->getId(),
            'pageId' => $section->getPage()->getId(),
            'type' => $section->getType(),
            'content' => $section->getContent(),
            'position' => $section->getPosition(),
            'isEnabled' => $section->isEnabled(),
            'createdAt' => $section->getCreatedAt()?->format('c'),
            'updatedAt' => $section->getUpdatedAt()?->format('c'),
        ], 201);
    }

    #[Route('/api/sections/{id}', name: 'get_section', methods: ['GET'])]
    public function getSection(int $id, Request $request, EntityManagerInterface $em): JsonResponse
    {
        $authResult = $this->requireAdmin($request, $em);
        if ($authResult instanceof JsonResponse) {
            return $authResult;
        }

        $section = $em->find(Section::class, $id);
        if (!$section) {
            return new JsonResponse(['error' => 'Section not found'], 404);
        }

        return new JsonResponse([
            'id' => $section->getId(),
            'pageId' => $section->getPage()?->getId(),
            'type' => $section->getType(),
            'content' => $section->getContent(),
            'position' => $section->getPosition(),
            'isEnabled' => $section->isEnabled(),
            'createdAt' => $section->getCreatedAt()?->format('c'),
            'updatedAt' => $section->getUpdatedAt()?->format('c'),
        ]);
    }

    #[Route('/api/sections/{id}', name: 'update_section', methods: ['PUT'])]
    public function updateSection(int $id, Request $request, EntityManagerInterface $em): JsonResponse
    {
        $authResult = $this->requireAdmin($request, $em);
        if ($authResult instanceof JsonResponse) {
            return $authResult;
        }

        $section = $em->find(Section::class, $id);
        if (!$section) {
            return new JsonResponse(['error' => 'Section not found'], 404);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['pageId'])) {
            $page = $em->find(Page::class, $data['pageId']);
            if (!$page) {
                return new JsonResponse(['error' => 'Page not found'], 404);
            }
            $section->setPage($page);
        }

        if (isset($data['type'])) {
            $validTypes = ['hero', 'faq', 'content', 'cards', 'cta', 'form', 'steps', 'footer'];
            if (!in_array($data['type'], $validTypes)) {
                return new JsonResponse(['error' => 'Invalid section type'], 400);
            }
            $section->setType($data['type']);
        }

        if (isset($data['content'])) {
            $section->setContent($data['content']);
        }

        if (isset($data['position'])) {
            $section->setPosition($data['position']);
        }

        if (isset($data['isEnabled'])) {
            $section->setIsEnabled($data['isEnabled']);
        }

        $em->flush();

        return new JsonResponse([
            'id' => $section->getId(),
            'pageId' => $section->getPage()?->getId(),
            'type' => $section->getType(),
            'content' => $section->getContent(),
            'position' => $section->getPosition(),
            'isEnabled' => $section->isEnabled(),
            'createdAt' => $section->getCreatedAt()?->format('c'),
            'updatedAt' => $section->getUpdatedAt()?->format('c'),
        ]);
    }

    #[Route('/api/sections/{id}', name: 'delete_section', methods: ['DELETE'])]
    public function deleteSection(int $id, Request $request, EntityManagerInterface $em): JsonResponse
    {
        $authResult = $this->requireAdmin($request, $em);
        if ($authResult instanceof JsonResponse) {
            return $authResult;
        }

        $section = $em->find(Section::class, $id);
        if (!$section) {
            return new JsonResponse(['error' => 'Section not found'], 404);
        }

        $em->remove($section);
        $em->flush();

        return new JsonResponse(['message' => 'Section deleted successfully']);
    }

    #[Route('/api/sections/{id}/toggle', name: 'toggle_section', methods: ['PATCH'])]
    public function toggleSection(int $id, Request $request, EntityManagerInterface $em): JsonResponse
    {
        $authResult = $this->requireAdmin($request, $em);
        if ($authResult instanceof JsonResponse) {
            return $authResult;
        }

        $section = $em->find(Section::class, $id);
        if (!$section) {
            return new JsonResponse(['error' => 'Section not found'], 404);
        }

        $section->setIsEnabled(!$section->isEnabled());
        $em->flush();

        return new JsonResponse([
            'id' => $section->getId(),
            'isEnabled' => $section->isEnabled()
        ]);
    }
}
