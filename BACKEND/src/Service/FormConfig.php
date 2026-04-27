<?php

namespace App\Service;

use Symfony\Component\Cache\Adapter\FilesystemAdapter;
use Symfony\Contracts\Cache\ItemInterface;

/**
 * FormConfig manages the dynamic form field configurations.
 * Provides methods to get, update, and persist field configurations.
 * Configurations are cached for performance.
 * 
 * Clean naming - NO duplicates:
 * - firstname (not nom)
 * - phone (not tele)
 * - company (not entreprise)
 * - status (not statut)
 * - turnover (not chiffreAffaires)
 * - resiliation_reason (not resiliation_motif)
 * - demaree_activite (not start_activity)
 */
class FormConfig
{
    private const CACHE_KEY = 'form_field_config';
    private const CACHE_TTL = 3600; // 1 hour

    /**
     * Default form field configuration matching the lead table structure.
     * This serves as the base configuration that can be modified via admin UI.
     * 13 fields total, no duplicates.
     */
    private const DEFAULT_CONFIG = [
        [
            'key' => 'firstname',
            'label' => 'Prénom',
            'type' => 'input',
            'required' => true,
            'visible' => true,
            'options' => null,
            'placeholder' => 'Votre prénom',
            'inputType' => 'text',
            'order' => 1,
        ],
        [
            'key' => 'company',
            'label' => 'Entreprise',
            'type' => 'input',
            'required' => false,
            'visible' => true,
            'options' => null,
            'placeholder' => 'Nom de votre entreprise',
            'inputType' => 'text',
            'order' => 2,
        ],
        [
            'key' => 'status',
            'label' => 'Statut Juridique',
            'type' => 'select',
            'required' => true,
            'visible' => true,
            'options' => [
                ['value' => 'auto-entrepreneur', 'label' => 'Auto-entrepreneur'],
                ['value' => 'ei', 'label' => 'Entreprise Individuelle'],
                ['value' => 'eurl', 'label' => 'EURL'],
                ['value' => 'sarl', 'label' => 'SARL'],
                ['value' => 'sas', 'label' => 'SAS'],
            ],
            'placeholder' => 'Sélectionnez un statut',
            'inputType' => null,
            'order' => 3,
        ],
        [
            'key' => 'turnover',
            'label' => 'Chiffre d\'affaires',
            'type' => 'select',
            'required' => true,
            'visible' => true,
            'options' => [
                ['value' => '0-30k', 'label' => "Moins de 30,000€"],
                ['value' => '30-60k', 'label' => "30,000€ - 60,000€"],
                ['value' => '60-100k', 'label' => "60,000€ - 100,000€"],
                ['value' => '100k+', 'label' => "Plus de 100,000€"],
            ],
            'placeholder' => 'Sélectionnez une tranche',
            'inputType' => null,
            'order' => 4,
        ],
        [
            'key' => 'phone',
            'label' => 'Téléphone',
            'type' => 'input',
            'required' => true,
            'visible' => true,
            'options' => null,
            'placeholder' => 'Votre numéro',
            'inputType' => 'tel',
            'consentRequired' => true,
            'consentText' => 'J\'accepte d\'être contacté par téléphone.',
            'order' => 5,
        ],
        [
            'key' => 'email',
            'label' => 'Email',
            'type' => 'input',
            'required' => true,
            'visible' => true,
            'options' => null,
            'placeholder' => 'Votre email',
            'inputType' => 'email',
            'consentRequired' => true,
            'consentText' => 'J\'accepte d\'être contacté par email.',
            'order' => 6,
        ],
        [
            'key' => 'demaree_activite',
            'label' => 'Démarrée activité ?',
            'type' => 'select',
            'required' => false,
            'visible' => true,
            'options' => [
                ['value' => 'oui', 'label' => 'Oui'],
                ['value' => 'non', 'label' => 'Non'],
            ],
            'placeholder' => 'Sélectionnez une option',
            'inputType' => null,
            'order' => 7,
        ],
        [
            'key' => 'insured_currently',
            'label' => 'Êtes-vous actuellement assuré ?',
            'type' => 'select',
            'required' => false,
            'visible' => true,
            'options' => [
                ['value' => 'yes', 'label' => 'Oui'],
                ['value' => 'no', 'label' => 'Non'],
            ],
            'placeholder' => 'Sélectionnez une option',
            'inputType' => null,
            'order' => 8,
        ],
        [
            'key' => 'previous_resiliation',
            'label' => 'Avez-vous déjà résilié une assurance ?',
            'type' => 'select',
            'required' => false,
            'visible' => true,
            'options' => [
                ['value' => 'yes', 'label' => 'Oui'],
                ['value' => 'no', 'label' => 'Non'],
            ],
            'placeholder' => 'Sélectionnez une option',
            'inputType' => null,
            'order' => 9,
        ],
        [
            'key' => 'resiliation_reason',
            'label' => 'Motif de résiliation',
            'type' => 'select',
            'required' => false,
            'visible' => true,
            'options' => [
                ['value' => 'sinistre', 'label' => 'Sinistre'],
                ['value' => 'non_paiement', 'label' => 'Non paiement'],
                ['value' => 'suspension_paiement', 'label' => 'Suspension de paiement'],
                ['value' => 'fausse_declaration', 'label' => 'Fausse déclaration'],
                ['value' => 'echeance', 'label' => 'Échéance'],
                ['value' => 'autre', 'label' => 'Autre'],
            ],
            'placeholder' => 'Sélectionnez un motif',
            'inputType' => null,
            'order' => 10,
        ],
        [
            'key' => 'postcode',
            'label' => 'Code postal',
            'type' => 'input',
            'required' => false,
            'visible' => true,
            'options' => null,
            'placeholder' => 'Votre code postal',
            'inputType' => 'text',
            'order' => 11,
        ],
        [
            'key' => 'created_at',
            'label' => 'Date de création',
            'type' => 'datetime',
            'required' => false,
            'visible' => false, // System field - hidden from forms
            'options' => null,
            'placeholder' => null,
            'inputType' => null,
            'order' => 12,
        ],
    ];

    private FilesystemAdapter $cache;

    public function __construct()
    {
        $this->cache = new FilesystemAdapter();
    }

    /**
     * Get all form fields configuration
     */
    public function getFields(): array
    {
        return $this->cache->get(self::CACHE_KEY, function (ItemInterface $item) {
            $item->expiresAfter(self::CACHE_TTL);
            return self::DEFAULT_CONFIG;
        });
    }

    /**
     * Get visible fields only (for frontend rendering)
     */
    public function getVisibleFields(): array
    {
        $fields = $this->getFields();
        $visibleFields = array_filter($fields, fn($field) => $field['visible'] === true);
        
        // Sort by order
        usort($visibleFields, fn($a, $b) => ($a['order'] ?? 999) <=> ($b['order'] ?? 999));
        
        return array_values($visibleFields);
    }

    /**
     * Get a specific field by key
     */
    public function getField(string $key): ?array
    {
        $fields = $this->getFields();
        foreach ($fields as $field) {
            if ($field['key'] === $key) {
                return $field;
            }
        }
        return null;
    }

    /**
     * Update field configuration
     */
    public function updateField(string $key, array $updates): bool
    {
        $fields = $this->getFields();
        $updated = false;

        foreach ($fields as &$field) {
            if ($field['key'] === $key) {
                $field = array_merge($field, $updates);
                $updated = true;
                break;
            }
        }

        if ($updated) {
            $this->saveFields($fields);
        }

        return $updated;
    }

    /**
     * Update multiple fields at once
     */
    public function updateFields(array $updates): bool
    {
        $fields = $this->getFields();
        
        foreach ($updates as $key => $fieldUpdates) {
            foreach ($fields as &$field) {
                if ($field['key'] === $key) {
                    $field = array_merge($field, $fieldUpdates);
                    break;
                }
            }
        }

        $this->saveFields($fields);
        return true;
    }

    /**
     * Reorder fields
     */
    public function reorderFields(array $order): bool
    {
        $fields = $this->getFields();
        
        foreach ($fields as &$field) {
            $key = $field['key'];
            if (isset($order[$key])) {
                $field['order'] = $order[$key];
            }
        }

        $this->saveFields($fields);
        return true;
    }

    /**
     * Save fields to cache
     */
    private function saveFields(array $fields): void
    {
        $cacheItem = $this->cache->getItem(self::CACHE_KEY);
        $cacheItem->set($fields);
        $cacheItem->expiresAfter(self::CACHE_TTL);
        $this->cache->save($cacheItem);
    }

    /**
     * Reset to default configuration
     */
    public function resetToDefault(): bool
    {
        $cacheItem = $this->cache->getItem(self::CACHE_KEY);
        $cacheItem->set(self::DEFAULT_CONFIG);
        $cacheItem->expiresAfter(self::CACHE_TTL);
        return $this->cache->save($cacheItem);
    }

    /**
     * Get allowed keys for form submission (prevents mass assignment)
     */
    public function getAllowedKeys(): array
    {
        return array_map(fn($field) => $field['key'], $this->getFields());
    }

    /**
     * Validate field value based on field type
     */
    public function validateFieldValue(string $key, $value): array
    {
        $field = $this->getField($key);
        
        if (!$field) {
            return ['valid' => false, 'error' => "Unknown field: $key"];
        }

        // Check required
        if ($field['required'] && empty($value) && $value !== '0') {
            return ['valid' => false, 'error' => "{$field['label']} is required"];
        }

        // Type-specific validation
        if (!empty($value)) {
            switch ($field['type']) {
                case 'email':
                    if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
                        return ['valid' => false, 'error' => "Invalid email format"];
                    }
                    break;
                case 'tel':
                    if (!preg_match('/^[\d\s\+\-\(\)]{8,20}$/', $value)) {
                        return ['valid' => false, 'error' => "Invalid phone number format"];
                    }
                    break;
                case 'date':
                    if (!strtotime($value)) {
                        return ['valid' => false, 'error' => "Invalid date format"];
                    }
                    break;
            }
        }

        return ['valid' => true];
    }
}
