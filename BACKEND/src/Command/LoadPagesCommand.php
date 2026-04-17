<?php

namespace App\Command;

use App\Entity\Page;
use App\Entity\Section;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand(
    name: 'app:load-pages',
    description: 'Load pages and sections from JSON data file'
)]
class LoadPagesCommand extends Command
{
    public function __construct(private EntityManagerInterface $em)
    {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $jsonFile = __DIR__ . '/../../DATA/pages_data.json';
        
        if (!file_exists($jsonFile)) {
            $output->writeln("<error>Data file not found: {$jsonFile}</error>");
            return Command::FAILURE;
        }

        $json = file_get_contents($jsonFile);
        $data = json_decode($json, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            $output->writeln("<error>Invalid JSON: " . json_last_error_msg() . "</error>");
            return Command::FAILURE;
        }

        $pagesData = $data['pages'] ?? [];
        $output->writeln("<info>Loading " . count($pagesData) . " pages...</info>");

        foreach ($pagesData as $pageData) {
            // Check if page with this slug already exists
            $existingPage = $this->em->getRepository(Page::class)->findOneBy(['slug' => $pageData['slug']]);
            
            if ($existingPage) {
                $output->writeln("<comment>Page '{$pageData['title']}' already exists (slug: {$pageData['slug']}), skipping.</comment>");
                continue;
            }

            $page = new Page();
            $page->setTitle($pageData['title']);
            $page->setSlug($pageData['slug']);
            $page->setIsPublished($pageData['isPublished'] ?? true);

            $position = 0;
            foreach ($pageData['sections'] as $sectionData) {
                $section = new Section();
                $section->setType($sectionData['type']);
                $section->setContent($sectionData['content']);
                $section->setPosition($position++);
                $section->setIsEnabled(true);
                $section->setPage($page);
                
                $this->em->persist($section);
            }

            $this->em->persist($page);
            $output->writeln("<info>✓ Created page '{$pageData['title']}' with " . count($pageData['sections']) . " sections</info>");
        }

        $this->em->flush();

        $output->writeln("<info>All pages loaded successfully!</info>");
        return Command::SUCCESS;
    }
}
