<?php

namespace App\Service;

use Symfony\Component\Cache\Adapter\FilesystemAdapter;
use Symfony\Contracts\Cache\ItemInterface;

/**
 * FormConfig manages the controlled form field configurations.
 * 
 * STRICT REQUIREMENTS:
 * - All fields are PREDEFINED in DEFAULT_CONFIG
 * - NO adding new fields
 * - NO deleting fields
 * - Admin can ONLY toggle: visible, required, order
 * 
 * Field naming matches the lead database columns (French):
 * - nom, prenom, raisonSociale, demarrageActivite, tele
 * - email, activiteAssuree, assuranceResilie, motifResiliation
 * - codePostal, createdAt (system field)
 */
class FormConfig
{
    private const CACHE_KEY = 'form_field_config';
    private const CACHE_TTL = 3600; // 1 hour
    
/**
     * STRICTLY ALLOWED KEYS - Only these properties can be updated via API
     * LOCKED: type, options, inputType cannot be modified
     */
    private const ALLOWED_UPDATE_KEYS = [
        'visible',
        'required',
        'order',
        'label',
        'placeholder',
    ];

    /**
     * Default form field configuration - 11 predefined fields
     */
    private const DEFAULT_CONFIG = [
        [
            'key' => 'nom',
            'label' => 'Nom',
            'type' => 'input',
            'required' => false,
            'visible' => true,
            'options' => null,
            'placeholder' => 'Votre nom',
            'inputType' => 'text',
            'order' => 1,
        ],
        [
            'key' => 'prenom',
            'label' => 'Prénom',
            'type' => 'input',
            'required' => true,
            'visible' => true,
            'options' => null,
            'placeholder' => 'Votre prénom',
            'inputType' => 'text',
            'order' => 2,
        ],
        [
            'key' => 'raisonSociale',
            'label' => 'Raison Sociale',
            'type' => 'input',
            'required' => false,
            'visible' => true,
            'options' => null,
            'placeholder' => 'Raison sociale de l\'entreprise',
            'inputType' => 'text',
            'order' => 3,
        ],
        [
            'key' => 'demarrageActivite',
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
            'order' => 4,
        ],
        [
            'key' => 'tele',
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
            'key' => 'activiteAssuree',
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
            'order' => 7,
        ],
        [
            'key' => 'assuranceResilie',
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
            'order' => 8,
        ],
        [
            'key' => 'motifResiliation',
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
            'order' => 9,
        ],
        [
            'key' => 'codePostal',
            'label' => 'Code postal',
            'type' => 'input',
            'required' => false,
            'visible' => true,
            'options' => null,
            'placeholder' => 'Votre code postal',
            'inputType' => 'text',
            'order' => 10,
        ],
        [
            'key' => 'createdAt',
            'label' => 'Date de création',
            'type' => 'datetime',
            'required' => false,
            'visible' => false,
            'options' => null,
            'placeholder' => null,
            'inputType' => null,
            'order' => 11,
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
     * Get allowed update keys (security: prevent mass assignment)
     * @return string[]
     */
    public function getAllowedUpdateKeys(): array
    {
        return self::ALLOWED_UPDATE_KEYS;
    }

    /**
     * Update field configuration - filters to only allowed keys
     * STRICT: Only updates visible, required, order
     */
    public function updateField(string $key, array $updates): bool
    {
        $fields = $this->getFields();
        $updated = false;

        // FILTER: Only allow specific keys to be updated
        $allowedUpdates = array_intersect_key($updates, array_flip(self::ALLOWED_UPDATE_KEYS));

        foreach ($fields as &$field) {
            if ($field['key'] === $key) {
                $field = array_merge($field, $allowedUpdates);
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
     * Update multiple fields at once - filters to only allowed keys
     * STRICT: Only updates visible, required, order
     */
    public function updateFields(array $updates): bool
    {
        $fields = $this->getFields();
        
        foreach ($updates as $key => $fieldUpdates) {
            // FILTER: Only allow specific keys to be updated
            $allowedUpdates = array_intersect_key($fieldUpdates, array_flip(self::ALLOWED_UPDATE_KEYS));
            
            foreach ($fields as &$field) {
                if ($field['key'] === $key) {
                    $field = array_merge($field, $allowedUpdates);
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
                case 'input':
                    if ($field['inputType'] === 'email' && !filter_var($value, FILTER_VALIDATE_EMAIL)) {
                        return ['valid' => false, 'error' => "Invalid email format"];
                    }
                    if ($field['inputType'] === 'tel' && !preg_match('/^[\d\s\+\-\(\)]{8,20}$/', $value)) {
                        return ['valid' => false, 'error' => "Invalid phone number format"];
                    }
                    break;
                case 'datetime':
                    if (!strtotime($value)) {
                        return ['valid' => false, 'error' => "Invalid date format"];
                    }
                    break;
            }
        }

        return ['valid' => true];
    }
}
