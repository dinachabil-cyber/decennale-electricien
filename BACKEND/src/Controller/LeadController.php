<?php

namespace App\Controller;

use App\Entity\Lead;
use App\Service\FormConfig;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api')]
class LeadController extends AbstractController
{
    private FormConfig $formConfig;

    public function __construct(FormConfig $formConfig)
    {
        $this->formConfig = $formConfig;
    }

    #[Route('/leads', name: 'lead_create', methods: ['POST'])]
    public function createLead(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        // Validate CSRF token if present
        $csrfToken = $data['_token'] ?? $data['csrf_token'] ?? null;
        // Add CSRF validation here if needed

        $errors = [];
        $leadData = [];

        // Get allowed field keys from configuration
        $allowedKeys = $this->formConfig->getAllowedKeys();

        // Process each field dynamically based on configuration
        foreach ($allowedKeys as $key) {
            if (array_key_exists($key, $data)) {
                $value = $data[$key];
                
                // Skip empty values for non-required fields
                if ($value === '' || $value === null) {
                    $leadData[$key] = null;
                    continue;
                }

                // Validate field value based on configuration
                $validation = $this->formConfig->validateFieldValue($key, $value);
                if (!$validation['valid']) {
                    $errors[] = $validation['error'];
                    continue;
                }

                $leadData[$key] = $value;
            }
        }

        // Special validation for email
        if (!empty($leadData['email']) && !filter_var($leadData['email'], FILTER_VALIDATE_EMAIL)) {
            $errors[] = 'Email invalide';
        }

        // Special validation for phone
        if (!empty($leadData['phone']) && !preg_match('/^[\d\s\+\-\(\)]{8,20}$/', $leadData['phone'])) {
            $errors[] = 'Numéro de téléphone invalide';
        }

        // Check if at least one contact field is provided
        $contactFields = ['firstname', 'email', 'phone', 'company'];
        $hasContactInfo = false;
        foreach ($contactFields as $field) {
            if (!empty($leadData[$field])) {
                $hasContactInfo = true;
                break;
            }
        }
        if (!$hasContactInfo) {
            $errors[] = 'Veuillez fournir au moins une information de contact (nom, prénom, email, téléphone ou entreprise)';
        }

        if (!empty($errors)) {
            return new JsonResponse(['success' => false, 'errors' => $errors], 400);
        }

        $lead = new Lead();
        
        // Map data to entity using dynamic field configuration
        $this->mapDataToLead($lead, $leadData);

        // Set created_at if not provided
        if ($lead->getCreatedAt() === null) {
            $lead->setCreatedAt(new \DateTime());
        }

        $em->persist($lead);

        try {
            $em->flush();
        } catch (\Exception $e) {
            return new JsonResponse([
                'success' => false,
                'message' => 'Erreur lors de la sauvegarde: ' . $e->getMessage()
            ], 500);
        }

        return new JsonResponse([
            'success' => true,
            'message' => 'Lead créé avec succès',
            'data' => [
                'id' => $lead->getId(),
                'createdAt' => $lead->getCreatedAt()->format('Y-m-d H:i:s')
            ]
        ], 201);
    }

    #[Route('/leads', name: 'lead_list', methods: ['GET'])]
    public function listLeads(EntityManagerInterface $em): JsonResponse
    {
        $leads = $em->getRepository(Lead::class)->findBy([], ['created_at' => 'DESC']);

        $data = array_map(function ($lead) {
            return [
                'id' => $lead->getId(),
                'firstname' => $lead->getFirstname(),
                'company' => $lead->getCompany(),
                'status' => $lead->getStatus(),
                'turnover' => $lead->getTurnover(),
                'phone' => $lead->getPhone(),
                'email' => $lead->getEmail(),
                'demaree_activite' => $lead->getDemareeActivite(),
                'insured_currently' => $lead->getInsuredCurrently(),
                'previous_resiliation' => $lead->getPreviousResiliation(),
                'resiliation_reason' => $lead->getResiliationReason(),
                'postcode' => $lead->getPostcode(),
                'created_at' => $lead->getCreatedAt() ? $lead->getCreatedAt()->format('Y-m-d H:i:s') : null
            ];
        }, $leads);

        return new JsonResponse($data);
    }

    #[Route('/leads/config', name: 'lead_config', methods: ['GET'])]
    public function getConfig(): JsonResponse
    {
        return new JsonResponse([
            'success' => true,
            'fields' => $this->formConfig->getVisibleFields()
        ]);
    }

    #[Route('/leads/config', name: 'lead_config_update', methods: ['POST'])]
    public function updateConfig(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['fields']) || !is_array($data['fields'])) {
            return new JsonResponse(['success' => false, 'message' => 'Invalid data format'], 400);
        }

        // Update field configurations
        $updates = [];
        foreach ($data['fields'] as $fieldData) {
            if (!isset($fieldData['key'])) {
                continue;
            }
            $key = $fieldData['key'];
            $updates[$key] = array_intersect_key($fieldData, array_flip([
                'label', 'type', 'required', 'visible', 'options', 
                'placeholder', 'inputType', 'order'
            ]));
        }

        $this->formConfig->updateFields($updates);

        return new JsonResponse([
            'success' => true,
            'message' => 'Configuration updated successfully',
            'fields' => $this->formConfig->getVisibleFields()
        ]);
    }

    #[Route('/leads/config/reset', name: 'lead_config_reset', methods: ['POST'])]
    public function resetConfig(): JsonResponse
    {
        $this->formConfig->resetToDefault();

        return new JsonResponse([
            'success' => true,
            'message' => 'Configuration reset to defaults',
            'fields' => $this->formConfig->getVisibleFields()
        ]);
    }

    /**
     * Map form data to Lead entity dynamically
     */
    private function mapDataToLead(Lead $lead, array $data): void
    {
        $setters = [
            'firstname' => 'setFirstname',
            'email' => 'setEmail',
            'phone' => 'setPhone',
            'company' => 'setCompany',
            'status' => 'setStatus',
            'turnover' => 'setTurnover',
            'demaree_activite' => 'setDemareeActivite',
            'insured_currently' => 'setInsuredCurrently',
            'previous_resiliation' => 'setPreviousResiliation',
            'resiliation_reason' => 'setResiliationReason',
            'postcode' => 'setPostcode',
            'created_at' => 'setCreatedAt',
        ];

        foreach ($setters as $field => $setter) {
            if (array_key_exists($field, $data)) {
                $value = $data[$field];
                
                // Handle date/datetime fields
                if (in_array($field, ['created_at']) && $value) {
                    if (is_string($value)) {
                        try {
                            $value = new \DateTime($value);
                        } catch (\Exception $e) {
                            $value = null;
                        }
                    }
                }
                
                $lead->$setter($value);
            }
        }
    }
}
