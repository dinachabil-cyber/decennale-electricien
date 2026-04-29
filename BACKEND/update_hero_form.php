<?php
// Update hero section formConfig to French fields
require_once __DIR__.'/vendor/autoload.php';

$entityManager = require __DIR__.'/config/doctrine.php';

$repo = $entityManager->getRepository('App\Entity\Section');
foreach ([74, 75, 76] as $id) {
    $section = $repo->find($id);
    if (!$section) continue;
    
    $content = $section->getContent();
    if (!isset($content['formConfig'])) {
        $content['formConfig'] = [];
    }
    
    $content['formConfig']['steps'] = [
        [
            'key' => 'nom',
            'label' => 'Nom',
            'type' => 'input',
            'required' => false,
            'visible' => true,
            'placeholder' => 'Votre nom',
            'icon' => 'fa-user',
            'inputType' => 'text',
            'order' => 1,
            'validation' => ['required' => false]
        ],
        [
            'key' => 'prenom',
            'label' => 'Prénom',
            'type' => 'input',
            'required' => true,
            'visible' => true,
            'placeholder' => 'Votre prénom',
            'icon' => 'fa-user',
            'inputType' => 'text',
            'order' => 2,
            'validation' => ['required' => true, 'minLength' => 1]
        ],
        [
            'key' => 'raisonSociale',
            'label' => 'Raison Sociale',
            'type' => 'input',
            'required' => false,
            'visible' => true,
            'placeholder' => 'Raison sociale',
            'icon' => 'fa-building',
            'inputType' => 'text',
            'order' => 3,
            'validation' => ['required' => false]
        ],
        [
            'key' => 'demarrageActivite',
            'label' => 'Démarrée activité ?',
            'type' => 'select',
            'required' => false,
            'visible' => true,
            'options' => 'YES_NO_OPTIONS',
            'placeholder' => 'Sélectionnez une option',
            'icon' => 'fa-calendar',
            'order' => 4,
            'validation' => ['required' => false]
        ],
        [
            'key' => 'tele',
            'label' => 'Téléphone',
            'type' => 'input',
            'required' => true,
            'visible' => true,
            'placeholder' => 'Votre numéro',
            'icon' => 'fa-phone',
            'inputType' => 'tel',
            'consentRequired' => true,
            'consentText' => "J'accepte d'être contacté par téléphone.",
            'order' => 5,
            'validation' => [
                'required' => true,
                'pattern' => '/^[+]?[0-9\s\-()]+$/',
                'minLength' => 8
            ]
        ],
        [
            'key' => 'email',
            'label' => 'Email',
            'type' => 'input',
            'required' => true,
            'visible' => true,
            'placeholder' => 'Votre email',
            'icon' => 'fa-envelope',
            'inputType' => 'email',
            'consentRequired' => true,
            'consentText' => "J'accepte d'être contacté par email.",
            'order' => 6,
            'validation' => [
                'required' => true,
                'pattern' => '/^[^\s@]+@[^\s@]+\.[^\s@]+$/'
            ]
        ],
        [
            'key' => 'activiteAssuree',
            'label' => 'Êtes-vous actuellement assuré ?',
            'type' => 'select',
            'required' => false,
            'visible' => true,
            'options' => 'INSURED_OPTIONS',
            'placeholder' => 'Sélectionnez une option',
            'icon' => 'fa-shield-alt',
            'order' => 7,
            'validation' => ['required' => false]
        ],
        [
            'key' => 'assuranceResilie',
            'label' => 'Avez-vous déjà résilié une assurance ?',
            'type' => 'select',
            'required' => false,
            'visible' => true,
            'options' => 'RESILIATION_OPTIONS',
            'placeholder' => 'Sélectionnez une option',
            'icon' => 'fa-file-alt',
            'order' => 8,
            'validation' => ['required' => false]
        ],
        [
            'key' => 'motifResiliation',
            'label' => 'Motif de résiliation',
            'type' => 'select',
            'required' => false,
            'visible' => true,
            'options' => 'RESILIATION_REASONS',
            'placeholder' => 'Sélectionnez un motif',
            'icon' => 'fa-comment',
            'order' => 9,
            'validation' => ['required' => false]
        ],
        [
            'key' => 'codePostal',
            'label' => 'Code postal',
            'type' => 'input',
            'required' => false,
            'visible' => true,
            'placeholder' => 'Votre code postal',
            'icon' => 'fa-map-marker-alt',
            'inputType' => 'text',
            'order' => 10,
            'validation' => ['required' => false]
        ]
    ];
    
    $content['formConfig']['options'] = [
        'INSURED_OPTIONS' => [
            ['value' => 'yes', 'label' => 'Oui'],
            ['value' => 'no', 'label' => 'Non']
        ],
        'RESILIATION_OPTIONS' => [
            ['value' => 'yes', 'label' => 'Oui'],
            ['value' => 'no', 'label' => 'Non']
        ],
        'RESILIATION_REASONS' => [
            ['value' => 'sinistre', 'label' => 'Sinistre'],
            ['value' => 'non_paiement', 'label' => 'Non paiement'],
            ['value' => 'suspension_paiement', 'label' => 'Suspension de paiement'],
            ['value' => 'fausse_declaration', 'label' => 'Fausse déclaration'],
            ['value' => 'echeance', 'label' => 'Échéance'],
            ['value' => 'autre', 'label' => 'Autre']
        ],
        'YES_NO_OPTIONS' => [
            ['value' => 'oui', 'label' => 'Oui'],
            ['value' => 'non', 'label' => 'Non']
        ]
    ];
    
    $section->setContent($content);
    $entityManager->flush();
    echo "Updated section ID: {$id}\n";
}

echo "Done.\n";
