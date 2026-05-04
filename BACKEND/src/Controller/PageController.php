<?php

namespace App\Controller;

use App\Entity\Page;
use App\Entity\Section;
use App\Controller\AdminController;
use App\Middleware\AuthMiddleware;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class PageController extends AdminController
{
    public function __construct(AuthMiddleware $authMiddleware)
    {
        parent::__construct($authMiddleware);
    }

    #[Route('/api/pages', name: 'create_page', methods: ['POST'])]
    public function createPage(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $authResult = $this->requireAdmin($request, $em);
        if ($authResult instanceof JsonResponse) {
            return $authResult;
        }

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
            'slug' => $page->getSlug(),
            'createdAt' => $page->getCreatedAt()?->format('c'),
            'updatedAt' => $page->getUpdatedAt()?->format('c'),
        ], 201);
    }

    #[Route('/api/pages', name: 'list_pages', methods: ['GET'])]
    public function listPages(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $authResult = $this->requireAdmin($request, $em);
        if ($authResult instanceof JsonResponse) {
            return $authResult;
        }

        $pages = $em->getRepository(Page::class)->findAll();
        $result = [];
        foreach ($pages as $page) {
            $result[] = [
                'id' => $page->getId(),
                'title' => $page->getTitle(),
                'slug' => $page->getSlug(),
                'isPublished' => $page->isPublished(),
                'createdAt' => $page->getCreatedAt()?->format('c'),
                'updatedAt' => $page->getUpdatedAt()?->format('c'),
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
                'slug' => $page->getSlug(),
                'createdAt' => $page->getCreatedAt()?->format('c'),
                'updatedAt' => $page->getUpdatedAt()?->format('c'),
            ];
        }
        return new JsonResponse($result);
    }

    #[Route('/api/pages/{id}', name: 'get_page', methods: ['GET'], requirements: ['id' => '\d+'])]
    public function getPage(int $id, Request $request, EntityManagerInterface $em): JsonResponse
    {
        $authResult = $this->requireAdmin($request, $em);
        if ($authResult instanceof JsonResponse) {
            return $authResult;
        }

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
                'isEnabled' => $section->isEnabled(),
                'createdAt' => $section->getCreatedAt()?->format('c'),
                'updatedAt' => $section->getUpdatedAt()?->format('c'),
            ];
        }

        return new JsonResponse([
            'id' => $page->getId(),
            'title' => $page->getTitle(),
            'slug' => $page->getSlug(),
            'isPublished' => $page->isPublished(),
            'createdAt' => $page->getCreatedAt()?->format('c'),
            'updatedAt' => $page->getUpdatedAt()?->format('c'),
            'sections' => $sections
        ]);
    }

    #[Route('/api/pages/slug', name: 'get_page_by_slug_root', methods: ['GET'])]
    public function getPageBySlugRoot(Request $request, EntityManagerInterface $em): JsonResponse
    {
        return $this->getPageBySlug('', $request, $em);
    }

    #[Route('/api/pages/slug/{slug}', name: 'get_page_by_slug', methods: ['GET'])]
    public function getPageBySlug(string $slug, Request $request, EntityManagerInterface $em): JsonResponse
    {
        $slug = $slug ?: '/';
        $preview = $request->query->get('preview') === 'true';
        
        if ($preview) {
            $page = $em->getRepository(Page::class)->findOneBy(['slug' => $slug]);
        } else {
            $page = $em->getRepository(Page::class)->findOneBy(['slug' => $slug, 'isPublished' => true]);
        }
        
        if (!$page) {
            return new JsonResponse(['error' => 'Page not found'], 404);
        }

        $sections = [];
        $sectionQuery = $em->getRepository(Section::class)->createQueryBuilder('s')
            ->where('s.page = :page')
            ->orderBy('s.position', 'ASC');
        
        if (!$preview) {
            $sectionQuery->andWhere('s.isEnabled = :enabled')
                         ->setParameter('enabled', true);
        }
        $sectionQuery->setParameter('page', $page);
        
        foreach ($sectionQuery->getQuery()->getResult() as $section) {
            $sections[] = [
                'id' => $section->getId(),
                'type' => $section->getType(),
                'content' => $section->getContent(),
                'position' => $section->getPosition(),
                'isEnabled' => $section->isEnabled(),
                'createdAt' => $section->getCreatedAt()?->format('c'),
                'updatedAt' => $section->getUpdatedAt()?->format('c'),
            ];
        }

        return new JsonResponse([
            'id' => $page->getId(),
            'title' => $page->getTitle(),
            'slug' => $page->getSlug(),
            'isPublished' => $page->isPublished(),
            'createdAt' => $page->getCreatedAt()?->format('c'),
            'updatedAt' => $page->getUpdatedAt()?->format('c'),
            'sections' => $sections
        ]);
    }

    #[Route('/api/pages/{pageId}/sections', name: 'add_section', methods: ['POST'])]
    public function addSection(int $pageId, Request $request, EntityManagerInterface $em): JsonResponse
    {
        $authResult = $this->requireAdmin($request, $em);
        if ($authResult instanceof JsonResponse) {
            return $authResult;
        }

        $page = $em->find(Page::class, $pageId);
        if (!$page) {
            return new JsonResponse(['error' => 'Page not found'], 404);
        }

        $data = json_decode($request->getContent(), true);
        if (!isset($data['type'])) {
            return new JsonResponse(['error' => 'Section type is required'], 400);
        }

        $validTypes = ['hero', 'faq', 'content', 'cards', 'cta', 'form', 'steps', 'footer'];
        if (!in_array($data['type'], $validTypes)) {
            return new JsonResponse(['error' => 'Invalid section type'], 400);
        }

        $section = new Section();
        $section->setPage($page);
        $section->setType($data['type']);
        $section->setContent($data['content'] ?? []);
        $section->setIsEnabled(true);
        $section->setPosition($data['position'] ?? 0);

        $em->persist($section);
        $em->flush();

        return new JsonResponse([
            'id' => $section->getId(),
            'type' => $section->getType(),
            'content' => $section->getContent(),
            'position' => $section->getPosition(),
            'isEnabled' => $section->isEnabled(),
            'createdAt' => $section->getCreatedAt()?->format('c'),
            'updatedAt' => $section->getUpdatedAt()?->format('c'),
        ], 201);
    }

    #[Route('/api/pages/{id}/reorder-sections', name: 'reorder_sections', methods: ['POST'])]
    public function reorderSections(int $id, Request $request, EntityManagerInterface $em): JsonResponse
    {
        $authResult = $this->requireAdmin($request, $em);
        if ($authResult instanceof JsonResponse) {
            return $authResult;
        }

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
            if ($section && $section->getPage()?->getId() === $id) {
                $section->setPosition($order);
            }
        }

        $em->flush();

        return new JsonResponse(['message' => 'Sections reordered successfully']);
    }

    #[Route('/api/pages/{id}', name: 'update_page', methods: ['PUT'])]
    public function updatePage(int $id, Request $request, EntityManagerInterface $em): JsonResponse
    {
        $authResult = $this->requireAdmin($request, $em);
        if ($authResult instanceof JsonResponse) {
            return $authResult;
        }

        $page = $em->find(Page::class, $id);
        if (!$page) {
            return new JsonResponse(['error' => 'Page not found'], 404);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['title'])) {
            $page->setTitle($data['title']);
        }
        if (isset($data['slug'])) {
            $existing = $em->getRepository(Page::class)->findOneBySlug($data['slug']);
            if ($existing && $existing->getId() !== $id) {
                return new JsonResponse(['error' => 'Page with this slug already exists'], 400);
            }
            $page->setSlug($data['slug']);
        }

        $em->flush();

        return new JsonResponse([
            'id' => $page->getId(),
            'title' => $page->getTitle(),
            'slug' => $page->getSlug(),
            'isPublished' => $page->isPublished(),
            'createdAt' => $page->getCreatedAt()?->format('c'),
            'updatedAt' => $page->getUpdatedAt()?->format('c'),
        ]);
    }

    #[Route('/api/pages/{id}/publish', name: 'toggle_page_publish', methods: ['PATCH'])]
    public function togglePagePublish(int $id, Request $request, EntityManagerInterface $em): JsonResponse
    {
        $authResult = $this->requireAdmin($request, $em);
        if ($authResult instanceof JsonResponse) {
            return $authResult;
        }

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
    public function deletePage(int $id, Request $request, EntityManagerInterface $em): JsonResponse
    {
        $authResult = $this->requireAdmin($request, $em);
        if ($authResult instanceof JsonResponse) {
            return $authResult;
        }

        $page = $em->find(Page::class, $id);
        if (!$page) {
            return new JsonResponse(['error' => 'Page not found'], 404);
        }

        $em->remove($page);
        $em->flush();

        return new JsonResponse(['message' => 'Page deleted successfully']);
    }
}
