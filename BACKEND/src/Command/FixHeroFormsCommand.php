<?php

namespace App\Command;

use App\Repository\SectionRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:fix-hero-forms',
    description: 'Fix all hero sections formConfig to complete French schema'
)]
class FixHeroFormsCommand extends Command
{
    public function __construct(
        private SectionRepository $sectionRepository,
        private EntityManagerInterface $em
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        
        $heroSections = $this->sectionRepository->findBy(['type' => 'hero']);
        
        $fixedFormConfig = [
            'steps' => [
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
                    'placeholder' => 'Raison sociale de l\'entreprise',
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
                        'required' => true
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
            ],
            'options' => [
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
            ]
        ];
        
        $updated = 0;
        foreach ($heroSections as $section) {
            $content = $section->getContent();
            $content['formConfig'] = $fixedFormConfig;
            $section->setContent($content);
            $updated++;
            $io->note("Updated hero section ID: {$section->getId()}");
        }
        
        $this->em->flush();
        
        $io->success("Fixed {$updated} hero section(s).");
        
        return Command::SUCCESS;
    }
}
