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
    name: 'app:set-homepage-hero-form',
    description: 'Set homepage hero (ID 75) formConfig with clean fields'
)]
class SetHomepageHeroFormConfigCommand extends Command
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
        
        // Find hero section for homepage (ID 75)
        $section = $this->sectionRepository->find(75);
        
        if (!$section) {
            $io->error('Hero section ID 75 not found.');
            return Command::FAILURE;
        }
        
        $content = $section->getContent();
        
        // Set a clean formConfig with the new field names
        $content['formConfig'] = [
            'steps' => [
                [
                    'key' => 'company',
                    'label' => 'Entreprise',
                    'type' => 'input',
                    'required' => false,
                    'visible' => true,
                    'placeholder' => 'Nom de votre entreprise',
                    'icon' => 'fa-building',
                    'inputType' => 'text',
                    'validation' => ['required' => false]
                ],
                [
                    'key' => 'status',
                    'label' => 'Statut Juridique',
                    'type' => 'select',
                    'required' => true,
                    'visible' => true,
                    'options' => 'LEGAL_STATUSES',
                    'placeholder' => 'Sélectionnez un statut',
                    'icon' => 'fa-balance-scale',
                    'validation' => ['required' => true]
                ],
                [
                    'key' => 'turnover',
                    'label' => 'Chiffre d\'affaires',
                    'type' => 'select',
                    'required' => true,
                    'visible' => true,
                    'options' => 'REVENUE_OPTIONS',
                    'placeholder' => 'Sélectionnez une tranche',
                    'icon' => 'fa-euro-sign',
                    'validation' => ['required' => true]
                ],
                [
                    'key' => 'phone',
                    'label' => 'Téléphone',
                    'type' => 'input',
                    'required' => true,
                    'visible' => true,
                    'placeholder' => 'Votre numéro',
                    'icon' => 'fa-phone',
                    'inputType' => 'tel',
                    'consentRequired' => true,
                    'consentText' => 'J\'accepte d\'être contacté par téléphone.',
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
                    'consentText' => 'J\'accepte d\'être contacté par email.',
                    'validation' => [
                        'required' => true,
                        'pattern' => '/^[^\s@]+@[^\s@]+\.[^\s@]+$/'
                    ]
                ],
                [
                    'key' => 'demaree_activite',
                    'label' => 'Démarrée activité ?',
                    'type' => 'select',
                    'required' => false,
                    'visible' => true,
                    'options' => 'YES_NO_OPTIONS',
                    'placeholder' => 'Sélectionnez une option',
                    'icon' => 'fa-calendar',
                    'validation' => [
                        'required' => false
                    ]
                ],
                [
                    'key' => 'resiliation_reason',
                    'label' => 'Motif de résiliation',
                    'type' => 'select',
                    'required' => false,
                    'visible' => true,
                    'options' => 'RESILIATION_REASONS',
                    'placeholder' => 'Sélectionnez un motif',
                    'icon' => 'fa-comment',
                    'validation' => [
                        'required' => false
                    ]
                ],
            ],
            'options' => [
                'LEGAL_STATUSES' => [
                    ['value' => 'auto-entrepreneur', 'label' => 'Auto-entrepreneur', 'icon' => 'fa-user'],
                    ['value' => 'ei', 'label' => 'Entreprise Individuelle', 'icon' => 'fa-building'],
                    ['value' => 'eurl', 'label' => 'EURL', 'icon' => 'fa-building'],
                    ['value' => 'sarl', 'label' => 'SARL', 'icon' => 'fa-users'],
                    ['value' => 'sas', 'label' => 'SAS', 'icon' => 'fa-users'],
                ],
                'REVENUE_OPTIONS' => [
                    ['value' => '0-30k', 'label' => "Moins de 30,000€"],
                    ['value' => '30-60k', 'label' => "30,000€ - 60,000€"],
                    ['value' => '60-100k', 'label' => "60,000€ - 100,000€"],
                    ['value' => '100k+', 'label' => "Plus de 100,000€"],
                ],
                'RESILIATION_REASONS' => [
                    ['value' => 'sinistre', 'label' => 'Sinistre'],
                    ['value' => 'non_paiement', 'label' => 'Non paiement'],
                    ['value' => 'suspension_paiement', 'label' => 'Suspension de paiement'],
                    ['value' => 'fausse_declaration', 'label' => 'Fausse déclaration'],
                    ['value' => 'echeance', 'label' => 'Échéance'],
                    ['value' => 'autre', 'label' => 'Autre'],
                ],
                'YES_NO_OPTIONS' => [
                    ['value' => 'oui', 'label' => 'Oui'],
                    ['value' => 'non', 'label' => 'Non'],
                ]
            ]
        ];
        
        $section->setContent($content);
        $this->em->flush();
        
        $io->success('Homepage hero (ID 75) formConfig updated successfully!');
        $io->note('Fields: company, status, turnover, phone, email, demaree_activite, resiliation_reason');
        
        return Command::SUCCESS;
    }
}
