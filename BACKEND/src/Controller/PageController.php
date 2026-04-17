<?php

namespace App\Controller;

use App\Entity\Page;
use App\Entity\Section;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class PageController extends AbstractController
{
    #[Route('/api/pages', name: 'create_page', methods: ['POST'])]
    public function createPage(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['title']) || !isset($data['slug'])) {
            return new JsonResponse(['error' => 'Title and slug are required'], 400);
        }

        $existing = $em->getRepository(Page::class)->findOneBySlug($data['slug']);
        if ($existing) {
            return new JsonResponse(['error' => 'Page with this slug already exists'], 400);
        }

        $page = new Page();
        $page->setTitle($data['title']);
        $page->setSlug($data['slug']);

        $em->persist($page);
        $em->flush();

        return new JsonResponse([
            'id' => $page->getId(),
            'title' => $page->getTitle(),
            'slug' => $page->getSlug()
        ], 201);
    }

    #[Route('/api/pages', name: 'list_pages', methods: ['GET'])]
    public function listPages(EntityManagerInterface $em): JsonResponse
    {
        $pages = $em->getRepository(Page::class)->findAll();
        $result = [];
        foreach ($pages as $page) {
            $result[] = [
                'id' => $page->getId(),
                'title' => $page->getTitle(),
                'slug' => $page->getSlug(),
                'isPublished' => $page->isPublished()
            ];
        }
        return new JsonResponse($result);
    }

    #[Route('/api/pages/published', name: 'list_published_pages', methods: ['GET'])]
    public function listPublishedPages(EntityManagerInterface $em): JsonResponse
    {
        $pages = $em->getRepository(Page::class)->findBy(['isPublished' => true]);
        $result = [];
        foreach ($pages as $page) {
            $result[] = [
                'id' => $page->getId(),
                'title' => $page->getTitle(),
                'slug' => $page->getSlug()
            ];
        }
        return new JsonResponse($result);
    }

    #[Route('/api/pages/{id}', name: 'get_page', methods: ['GET'])]
    public function getPage(int $id, EntityManagerInterface $em): JsonResponse
    {
        $page = $em->find(Page::class, $id);
        if (!$page) {
            return new JsonResponse(['error' => 'Page not found'], 404);
        }

$sections = [];
        foreach ($page->getSections() as $section) {
            $sections[] = [
                'id' => $section->getId(),
                'type' => $section->getType(),
                'content' => $section->getContent(),
                'position' => $section->getPosition(),
                'isEnabled' => $section->isEnabled()
            ];
        }

        return new JsonResponse([
            'id' => $page->getId(),
            'title' => $page->getTitle(),
            'slug' => $page->getSlug(),
            'isPublished' => $page->isPublished(),
            'sections' => $sections
        ]);
    }

    #[Route('/api/sections/{id}/toggle', name: 'toggle_section', methods: ['PATCH'])]
    public function toggleSection(int $id, EntityManagerInterface $em): JsonResponse
    {
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

    #[Route('/api/sections/{id}', name: 'update_section', methods: ['PUT'])]
    public function updateSection(int $id, Request $request, EntityManagerInterface $em): JsonResponse
    {
        $section = $em->find(Section::class, $id);
        if (!$section) {
            return new JsonResponse(['error' => 'Section not found'], 404);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['type'])) {
$validTypes = ['hero', 'faq', 'pricing', 'features', 'contact', 'content', 'cta', 'testimonials', 'gallery'];
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
            'type' => $section->getType(),
            'content' => $section->getContent(),
            'position' => $section->getPosition(),
            'isEnabled' => $section->isEnabled()
        ]);
    }

    #[Route('/api/sections/{id}', name: 'delete_section', methods: ['DELETE'])]
    public function deleteSection(int $id, EntityManagerInterface $em): JsonResponse
    {
        $section = $em->find(Section::class, $id);
        if (!$section) {
            return new JsonResponse(['error' => 'Section not found'], 404);
        }

        $em->remove($section);
        $em->flush();

        return new JsonResponse(['message' => 'Section deleted successfully']);
    }

    #[Route('/api/pages/{id}/reorder', name: 'reorder_sections', methods: ['PATCH'])]
    public function reorderSections(int $id, Request $request, EntityManagerInterface $em): JsonResponse
    {
        $page = $em->find(Page::class, $id);
        if (!$page) {
            return new JsonResponse(['error' => 'Page not found'], 404);
        }

        $data = json_decode($request->getContent(), true);
        if (!isset($data['sections']) || !is_array($data['sections'])) {
            return new JsonResponse(['error' => 'Sections array is required'], 400);
        }

        foreach ($data['sections'] as $order => $sectionId) {
            $section = $em->find(Section::class, $sectionId);
            if ($section && $section->getPage()->getId() === $id) {
                $section->setPosition($order);
            }
        }

        $em->flush();

        return new JsonResponse(['message' => 'Sections reordered successfully']);
    }

    #[Route('/api/pages/{id}/publish', name: 'toggle_page_publish', methods: ['PATCH'])]
    public function togglePagePublish(int $id, EntityManagerInterface $em): JsonResponse
    {
        $page = $em->find(Page::class, $id);
        if (!$page) {
            return new JsonResponse(['error' => 'Page not found'], 404);
        }

        $page->setIsPublished(!$page->isPublished());
        $em->flush();

        return new JsonResponse([
            'id' => $page->getId(),
            'isPublished' => $page->isPublished()
        ]);
    }

    #[Route('/api/pages/{id}', name: 'delete_page', methods: ['DELETE'])]
    public function deletePage(int $id, EntityManagerInterface $em): JsonResponse
    {
        $page = $em->find(Page::class, $id);
        if (!$page) {
            return new JsonResponse(['error' => 'Page not found'], 404);
        }

        $em->remove($page);
        $em->flush();

        return new JsonResponse(['message' => 'Page deleted successfully']);
    }

    #[Route('/api/pages/slug/{slug}', name: 'get_page_by_slug', methods: ['GET'])]
    public function getPageBySlug(string $slug, EntityManagerInterface $em): JsonResponse
    {
        $page = $em->getRepository(Page::class)->findOneBySlug($slug);
        if (!$page) {
            return new JsonResponse(['error' => 'Page not found'], 404);
        }

        $sections = [];
        foreach ($page->getSections() as $section) {
            $sections[] = [
                'id' => $section->getId(),
                'type' => $section->getType(),
                'content' => $section->getContent(),
                'position' => $section->getPosition(),
                'isEnabled' => $section->isEnabled()
            ];
        }

        return new JsonResponse([
            'id' => $page->getId(),
            'title' => $page->getTitle(),
            'slug' => $page->getSlug(),
            'isPublished' => $page->isPublished(),
            'sections' => $sections
        ]);
    }

    #[Route('/api/pages/{pageId}/sections', name: 'add_section', methods: ['POST'])]
    public function addSection(int $pageId, Request $request, EntityManagerInterface $em): JsonResponse
    {
        $page = $em->find(Page::class, $pageId);
        if (!$page) {
            return new JsonResponse(['error' => 'Page not found'], 404);
        }

        $data = json_decode($request->getContent(), true);
        if (!isset($data['type'])) {
            return new JsonResponse(['error' => 'Section type is required'], 400);
        }

        $validTypes = ['hero', 'faq', 'pricing', 'features', 'contact', 'content', 'cta', 'testimonials', 'gallery'];
        if (!in_array($data['type'], $validTypes)) {
            return new JsonResponse(['error' => 'Invalid section type'], 400);
        }

        $section = new Section();
        $section->setPage($page);
        $section->setType($data['type']);
        $section->setContent($data['content'] ?? []);
        $section->setIsEnabled(true);

        // Set position to the next available position
        $maxPosition = $em->getRepository(Section::class)
            ->createQueryBuilder('s')
            ->select('MAX(s.position)')
            ->where('s.page = :page')
            ->setParameter('page', $page)
            ->getQuery()
            ->getSingleScalarResult() ?? 0;
        $section->setPosition($maxPosition + 1);

        $em->persist($section);
        $em->flush();

        return new JsonResponse([
            'id' => $section->getId(),
            'type' => $section->getType(),
            'content' => $section->getContent(),
            'position' => $section->getPosition(),
            'isEnabled' => $section->isEnabled()
        ], 201);
    }
}