<?php

namespace App\Command;

use App\Repository\PageRepository;
use App\Repository\SectionRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:update-hero-form-config',
    description: 'Update all hero section formConfig to use new clean field names'
)]
class UpdateHeroFormConfigCommand extends Command
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
        
        $io->progressStart(count($heroSections));
        
        $updated = 0;
        foreach ($heroSections as $section) {
            $content = $section->getContent();
            
            if (!isset($content['formConfig']) || !isset($content['formConfig']['steps'])) {
                $io->progressAdvance();
                continue;
            }
            
            $steps = $content['formConfig']['steps'];
            $needsUpdate = false;
            $newSteps = [];
            
            foreach ($steps as $step) {
                $oldKey = $step['key'] ?? '';
                
                // Map old keys (English or legacy) to new French keys
                $keyMap = [
                    // English to French
                    'firstname' => 'nom',
                    'company' => 'raisonSociale',
                    'phone' => 'tele',
                    'resiliation_reason' => 'motifResiliation',
                    'postcode' => 'codePostal',
                    'start_activity' => 'demarrageActivite',
                    'insured_currently' => 'activiteAssuree',
                    'previous_resiliation' => 'assuranceResilie',
                    // Legacy French (if any) to current French keys
                    'nom' => 'nom', // already fine
                    'raison_sociale' => 'raisonSociale',
                    'demaree_activite' => 'demarrageActivite',
                    'activite_assuree' => 'activiteAssuree',
                    'assurance_resilie' => 'assuranceResilie',
                    'motif_resiliation' => 'motifResiliation',
                    'code_postal' => 'codePostal',
                ];
                
                if (isset($keyMap[$oldKey])) {
                    $step['key'] = $keyMap[$oldKey];
                    $needsUpdate = true;
                }
                
                // Keep only valid French keys that exist in current schema
                $validKeys = [
                    'nom', 'prenom', 'raisonSociale', 'demarrageActivite',
                    'tele', 'email',
                    'activiteAssuree', 'assuranceResilie', 'motifResiliation',
                    'codePostal'
                ];
                
                if (in_array($step['key'], $validKeys, true)) {
                    $newSteps[] = $step;
                } else {
                    // Key not valid after mapping, mark as updated (will be removed)
                    $needsUpdate = true;
                }
            }
            
            if ($needsUpdate) {
                $content['formConfig']['steps'] = $newSteps;
                $section->setContent($content);
                $updated++;
                $io->note("Updated hero section ID: {$section->getId()}");
            }
            
            $io->progressAdvance();
        }
        
        $this->em->flush();
        
        $io->progressFinish();
        $io->success("Updated {$updated} hero section(s) with new French field keys.");
        
        return Command::SUCCESS;
    }
}
