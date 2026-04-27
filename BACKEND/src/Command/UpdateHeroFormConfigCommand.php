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
                
                // Map old keys to new ones
                $keyMap = [
                    'nom' => 'firstname',
                    'entreprise' => 'company',
                    'statut' => 'status',
                    'chiffreAffaires' => 'turnover',
                    'tele' => 'phone',
                    'resiliation_motif' => 'resiliation_reason',
                ];
                
                if (isset($keyMap[$oldKey])) {
                    $step['key'] = $keyMap[$oldKey];
                    $needsUpdate = true;
                }
                
                // Remove any completely unknown/custom field keys that don't match our schema
                // Keep only keys that exist in our new FORM_SCHEMA
                $validKeys = [
                    'firstname', 'company', 'status', 'turnover', 'phone', 'email',
                    'start_activity', 'insured_currently', 'previous_resiliation',
                    'resiliation_reason', 'postcode'
                ];
                
                if (in_array($step['key'], $validKeys)) {
                    $newSteps[] = $step;
                }
                
                // If we removed or changed something, mark as updated
                if ($oldKey !== $step['key'] || !in_array($step['key'], $validKeys)) {
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
        $io->success("Updated {$updated} hero section(s) with new field keys.");
        
        return Command::SUCCESS;
    }
}
