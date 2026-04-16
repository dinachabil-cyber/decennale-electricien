<?php

namespace App\DataFixtures;

use App\Entity\Page;
use App\Entity\Section;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class PageFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $page = new Page();
        $page->setTitle('Assurance Décennale Électricien');
        $page->setSlug('accueil');

        $heroSection = new Section();
        $heroSection->setPage($page);
        $heroSection->setType('hero');
        $heroSection->setContent([
            'title' => 'Assurance Décennale Électricien',
            'subtitle' => 'Comparez et Souscrivez',
            'ctaText' => 'Devis Gratuit'
        ]);
        $heroSection->setPosition(0);
        $manager->persist($heroSection);

        $content1 = new Section();
        $content1->setPage($page);
        $content1->setType('content');
        $content1->setContent([
            'title' => 'Prix assurance décennale électricien en ligne',
            'sections' => [
                [
                    'title' => 'I. Prix assurance décennale électricien',
                    'content' => "Le tarif d'une assurance décennale électricien dépend de plusieurs variables concrètes que les assureurs examinent systématiquement avant d'établir une proposition.\n\nLe chiffre d'affaires annuel est le premier critère de pondération. Un électricien réalisant 40 000 euros de CA sur des chantiers résidentiels ne paiera pas la même prime qu'un artisan à 200 000 euros intervenant sur des bâtiments tertiaires. En pratique, les cotisations annuelles se situent entre 600 et 1 200 euros pour les profils à faible activité, et peuvent dépasser 2 500 euros pour les entreprises plus importantes."
                ]
            ]
        ]);
        $content1->setPosition(1);
        $manager->persist($content1);

        $features = new Section();
        $features->setPage($page);
        $features->setType('features');
        $features->setContent([
            'title' => 'Pourquoi Nous Choisir',
            'features' => [
                ['icon' => '✓', 'title' => 'Comparateur Indépendant', 'description' => 'Nous comparons les offres de plusieurs assureurs pour trouver la meilleure couverture au meilleur prix.'],
                ['icon' => '✓', 'title' => 'Experts Certifiés', 'description' => 'Nos experts connaissent les spécificités du métier d\'électricien et vous orientent vers les contrats adaptés.'],
                ['icon' => '✓', 'title' => 'Souscription Rapide', 'description' => 'Obtenez votre devis en quelques minutes et souscrivez directement en ligne.']
            ]
        ]);
        $features->setPosition(2);
        $manager->persist($features);

        $pricing = new Section();
        $pricing->setPage($page);
        $pricing->setType('pricing');
        $pricing->setContent([
            'title' => 'Nos Tarifs',
            'plans' => [
                [
                    'name' => 'Débutant',
                    'price' => '600€',
                    'features' => ['Garantie décennale', 'RCP Pro', 'Support dédié'],
                    'featured' => false
                ],
                [
                    'name' => 'Artisan',
                    'price' => '900€',
                    'features' => ['Garantie décennale', 'RCP Pro', 'Garantie parfait achèvement', 'Support prioritaire'],
                    'featured' => true
                ],
                [
                    'name' => 'Entreprise',
                    'price' => '1500€',
                    'features' => ['Garantie décennale', 'RCP Pro', 'Toutes garanties', 'Conseil illimité', 'Gestion sinistres'],
                    'featured' => false
                ]
            ]
        ]);
        $pricing->setPosition(3);
        $manager->persist($pricing);

        $faq = new Section();
        $faq->setPage($page);
        $faq->setType('faq');
        $faq->setContent([
            'title' => 'FAQ - Assurance Décennale Électricien',
            'items' => [
                [
                    'question' => 'L\'assurance décennale est-elle obligatoire pour un électricien ?',
                    'answer' => 'Oui. Tout constructeur au sens de l\'article 1792-1 du Code civil, y compris un électricien intervenant sur un ouvrage de construction, est tenu de souscription une assurance décennale avant l\'ouverture du chantier.'
                ],
                [
                    'question' => 'Quel est le prix moyen d\'une assurance décennale pour un électricien ?',
                    'answer' => 'Le tarif annuel varie entre 600 et 2 500 euros selon le chiffre d\'affaires, la nature des chantiers et l\'historique de sinistres.'
                ],
                [
                    'question' => 'Un électricien auto-entrepreneur doit-il souscription une décennale ?',
                    'answer' => 'Oui, sans exception. Le statut auto-entrepreneur ne dispense pas de l\'obligation légale de garantie décennale.'
                ]
            ]
        ]);
        $faq->setPosition(4);
        $manager->persist($faq);

        $contact = new Section();
        $contact->setPage($page);
        $contact->setType('contact');
        $contact->setContent([
            'title' => 'Demandez votre devis',
            'subtitle' => 'Nos experts sont disponibles pour vous répondre',
            'buttonText' => 'Envoyer ma demande'
        ]);
        $contact->setPosition(5);
        $manager->persist($contact);

        $manager->persist($page);
        $manager->flush();
    }
}