<?php

namespace App\Controller;

use App\Entity\Media;
use App\Controller\AdminController;
use App\Middleware\AuthMiddleware;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Filesystem\Filesystem;

class MediaController extends AdminController
{
    private string $uploadDir;

    public function __construct(AuthMiddleware $authMiddleware)
    {
        parent::__construct($authMiddleware);
        $this->uploadDir = __DIR__ . '/../../public/uploads';
        if (!is_dir($this->uploadDir)) {
            mkdir($this->uploadDir, 0777, true);
        }
    }

    #[Route('/api/media', name: 'list_media', methods: ['GET'])]
    public function listMedia(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $authResult = $this->requireAdmin($request, $em);
        if ($authResult instanceof JsonResponse) {
            return $authResult;
        }

        $mediaRepo = $em->getRepository(Media::class);
        $mediaItems = $mediaRepo->findAll();
        
        $result = [];
        foreach ($mediaItems as $media) {
            $result[] = [
                'id' => $media->getId(),
                'filename' => $media->getFilename(),
                'url' => '/uploads/' . $media->getFilename(),
                'mimeType' => $media->getMimeType(),
                'size' => $media->getSize(),
                'createdAt' => $media->getCreatedAt()?->format('c'),
            ];
        }
        
        // Sort by createdAt descending
        usort($result, function($a, $b) {
            return strtotime($b['createdAt']) - strtotime($a['createdAt']);
        });

        return new JsonResponse($result);
    }

    #[Route('/api/media', name: 'upload_media', methods: ['POST'])]
    public function uploadMedia(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $authResult = $this->requireAdmin($request, $em);
        if ($authResult instanceof JsonResponse) {
            return $authResult;
        }

        $file = $request->files->get('file');
        
        if (!$file) {
            return new JsonResponse(['error' => 'No file provided'], 400);
        }

        $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'pdf', 'doc', 'docx'];
        $extension = strtolower($file->getClientOriginalExtension());
        
        if (!in_array($extension, $allowedExtensions)) {
            return new JsonResponse(['error' => 'Invalid file type'], 400);
        }

        $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $filename = $originalName . '_' . time() . '.' . $extension;
        
        $file->move($this->uploadDir, $filename);

        // Create Media entity record
        $media = new Media();
        $media->setFilename($filename);
        $media->setPath('/uploads/' . $filename);
        $media->setMimeType($file->getClientMimeType() ?? 'application/octet-stream');
        $media->setSize($file->getSize());

        $em->persist($media);
        $em->flush();

        return new JsonResponse([
            'id' => $media->getId(),
            'filename' => $media->getFilename(),
            'url' => $media->getPath(),
            'mimeType' => $media->getMimeType(),
            'size' => $media->getSize(),
            'createdAt' => $media->getCreatedAt()?->format('c'),
        ], 201);
    }

    #[Route('/api/media/{filename}', name: 'delete_media', methods: ['DELETE'])]
    public function deleteMedia(string $filename, Request $request, EntityManagerInterface $em): JsonResponse
    {
        $authResult = $this->requireAdmin($request, $em);
        if ($authResult instanceof JsonResponse) {
            return $authResult;
        }

        $filePath = $this->uploadDir . '/' . $filename;
        
        if (!file_exists($filePath)) {
            return new JsonResponse(['error' => 'File not found'], 404);
        }

        // Delete file from filesystem
        unlink($filePath);

        // Delete Media entity record
        $mediaRepo = $em->getRepository(Media::class);
        $media = $mediaRepo->findOneBy(['filename' => $filename]);
        
        if ($media) {
            $em->remove($media);
            $em->flush();
        }

        return new JsonResponse(['message' => 'File deleted successfully']);
    }
}
