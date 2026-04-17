<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Filesystem\Filesystem;

class MediaController extends AbstractController
{
    private string $uploadDir;

    public function __construct()
    {
        $this->uploadDir = __DIR__ . '/../../public/uploads';
        if (!is_dir($this->uploadDir)) {
            mkdir($this->uploadDir, 0777, true);
        }
    }

    #[Route('/api/media', name: 'list_media', methods: ['GET'])]
    public function listMedia(): JsonResponse
    {
        $files = [];
        if (is_dir($this->uploadDir)) {
            $items = scandir($this->uploadDir);
            foreach ($items as $item) {
                if ($item !== '.' && $item !== '..' && !is_dir($this->uploadDir . '/' . $item)) {
                    $extension = strtolower(pathinfo($item, PATHINFO_EXTENSION));
                    if (in_array($extension, ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'])) {
                        $files[] = [
                            'filename' => $item,
                            'url' => '/uploads/' . $item,
                            'created' => filectime($this->uploadDir . '/' . $item)
                        ];
                    }
                }
            }
        }
        
        usort($files, function($a, $b) {
            return $b['created'] - $a['created'];
        });

        return new JsonResponse(array_map(function($f) {
            unset($f['created']);
            return $f;
        }, $files));
    }

    #[Route('/api/media', name: 'upload_media', methods: ['POST'])]
    public function uploadMedia(Request $request): JsonResponse
    {
        $file = $request->files->get('file');
        
        if (!$file) {
            return new JsonResponse(['error' => 'No file provided'], 400);
        }

        $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
        $extension = strtolower($file->getClientOriginalExtension());
        
        if (!in_array($extension, $allowedExtensions)) {
            return new JsonResponse(['error' => 'Invalid file type'], 400);
        }

        $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $filename = $originalName . '_' . time() . '.' . $extension;
        
        $file->move($this->uploadDir, $filename);

        return new JsonResponse([
            'filename' => $filename,
            'url' => '/uploads/' . $filename
        ], 201);
    }

    #[Route('/api/media/{filename}', name: 'delete_media', methods: ['DELETE'])]
    public function deleteMedia(string $filename): JsonResponse
    {
        $filePath = $this->uploadDir . '/' . $filename;
        
        if (!file_exists($filePath)) {
            return new JsonResponse(['error' => 'File not found'], 404);
        }

        unlink($filePath);

        return new JsonResponse(['message' => 'File deleted successfully']);
    }
}