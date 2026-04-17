<?php

namespace App\Controller;

use App\Entity\GlobalSettings;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class SettingsController extends AbstractController
{
    #[Route('/api/settings', name: 'get_settings', methods: ['GET'])]
    public function getSettings(EntityManagerInterface $em): JsonResponse
    {
        $settings = $em->getRepository(GlobalSettings::class)->getSettings();
        
        if (!$settings) {
            $settings = new GlobalSettings();
            $em->persist($settings);
            $em->flush();
        }

        return new JsonResponse($settings->toArray());
    }

    #[Route('/api/settings', name: 'update_settings', methods: ['PUT'])]
    public function updateSettings(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $settings = $em->getRepository(GlobalSettings::class)->getSettings();
        
        if (!$settings) {
            $settings = new GlobalSettings();
            $em->persist($settings);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['siteTitle'])) {
            $settings->setSiteTitle($data['siteTitle']);
        }
        if (isset($data['siteSubtitle'])) {
            $settings->setSiteSubtitle($data['siteSubtitle']);
        }
        if (isset($data['phone'])) {
            $settings->setPhone($data['phone']);
        }
        if (isset($data['email'])) {
            $settings->setEmail($data['email']);
        }
        if (isset($data['address'])) {
            $settings->setAddress($data['address']);
        }
        if (isset($data['logo'])) {
            $settings->setLogo($data['logo']);
        }
        if (isset($data['footerText'])) {
            $settings->setFooterText($data['footerText']);
        }
        if (isset($data['footerLinks'])) {
            $settings->setFooterLinks($data['footerLinks']);
        }

        $em->flush();

        return new JsonResponse($settings->toArray());
    }

    #[Route('/api/settings/header', name: 'get_header_settings', methods: ['GET'])]
    public function getHeaderSettings(EntityManagerInterface $em): JsonResponse
    {
        $settings = $em->getRepository(GlobalSettings::class)->getSettings();
        
        if (!$settings) {
            return new JsonResponse([
                'siteTitle' => 'Assurance Décennale Électricien',
                'siteSubtitle' => 'Devis en quelques clics',
                'phone' => '01 82 83 48 00'
            ]);
        }

        return new JsonResponse([
            'siteTitle' => $settings->getSiteTitle(),
            'siteSubtitle' => $settings->getSiteSubtitle(),
            'phone' => $settings->getPhone()
        ]);
    }

    #[Route('/api/settings/footer', name: 'get_footer_settings', methods: ['GET'])]
    public function getFooterSettings(EntityManagerInterface $em): JsonResponse
    {
        $settings = $em->getRepository(GlobalSettings::class)->getSettings();
        
        if (!$settings) {
            return new JsonResponse([
                'footerText' => '© 2024 Assurance Décennale Électricien. Tous droits réservés.',
                'footerLinks' => []
            ]);
        }

        return new JsonResponse([
            'footerText' => $settings->getFooterText(),
            'footerLinks' => $settings->getFooterLinks(),
            'email' => $settings->getEmail(),
            'phone' => $settings->getPhone(),
            'address' => $settings->getAddress()
        ]);
    }
}