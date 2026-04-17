<?php

namespace App\Command;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Question\ConfirmationQuestion;

#[AsCommand(
    name: 'app:reset-pages',
    description: 'Reset all pages and load fresh fixture data (WARNING: deletes all pages)'
)]
class ResetPagesCommand extends Command
{
    public function __construct(private EntityManagerInterface $em)
    {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $helper = $this->getHelper('question');
        $question = new ConfirmationQuestion('<comment>⚠️  This will DELETE ALL PAGES and create fresh ones. Continue? (y/N): </comment>', false);

        if (!$helper->ask($input, $output, $question)) {
            $output->writeln('<info>Operation cancelled.</info>');
            return Command::SUCCESS;
        }

        // Delete all sections and pages
        $this->em->createQuery('DELETE FROM App\Entity\Section')->execute();
        $this->em->createQuery('DELETE FROM App\Entity\Page')->execute();

        $output->writeln('<info>All pages cleared.</info>');
        $output->writeln('<comment>Run doctrine:fixtures:load to load new pages.</comment>');

        return Command::SUCCESS;
    }
}

