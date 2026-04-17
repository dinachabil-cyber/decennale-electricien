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
        $page->setTitle('Accueil');
        $page->setSlug('home');
        $page->setIsPublished(true);

        $heroSection = new Section();
        $heroSection->setPage($page);
        $heroSection->setType('hero');
        $heroSection->setContent([
            'title' => 'Assurance Décennale Électricien',
            'subtitle' => 'Devis en quelques clics',
            'image' => '/images/img.png',
            'buttonText' => 'Obtenir mon devis',
            'formTitle' => 'Complétez ce formulaire pour obtenir un tarif',
            'successTitle' => 'Merci !',
            'successMessage' => 'Votre demande a été envoyée. Un expert vous contactera rapidement.'
        ]);
        $heroSection->setPosition(0);
        $heroSection->setIsEnabled(true);
        $manager->persist($heroSection);

        $features = new Section();
        $features->setPage($page);
        $features->setType('features');
        $features->setContent([
            'title' => 'Assurance Décennale Électricien',
            'introText' => 'Tout électricien qui intervient sur des travaux de construction ou de rénovation est soumis à une obligation légale claire : souscription une assurance décennale avant l\'ouverture du premier chantier.',
            'features' => [
                [
                    'icon' => 'euro-sign',
                    'title' => 'Prix Assurance Décennale',
                    'description' => 'Le tarif dépend de plusieurs facteurs : chiffre d\'affaires, nature des chantiers, statut juridique.',
                    'items' => [
                        'Auto-entrepreneur : 600-900€/an',
                        'Artisan : 1000-2000€/an',
                        'Société : Sur devis'
                    ]
                ],
                [
                    'icon' => 'shield-alt',
                    'title' => 'Garanties Incluses',
                    'items' => [
                        'Responsabilité Civile Décennale',
                        'Dommages aux existants',
                        'RC Professionnelle',
                        'Protection 10 ans'
                    ]
                ],
                [
                    'icon' => 'user-clock',
                    'title' => 'Auto-Entrepreneur',
                    'items' => [
                        'Obligation légale (loi Spinetta)',
                        'Mentions obligatoires sur devis'
                    ]
                ],
                [
                    'icon' => 'question-circle',
                    'title' => 'Que Couvre la Décennale ?',
                    'items' => [
                        'Défauts d\'installation électrique',
                        'Incendies d\'origine électrique',
                        'Non-conformité normes NFC 15-100',
                        'Installations photovoltaïques'
                    ]
                ]
            ],
            'steps' => [
                ['number' => '01', 'title' => 'Remplissez le formulaire', 'description' => 'En 2 minutes, donnez vos informations.'],
                ['number' => '02', 'title' => 'Analyse de votre profil', 'description' => 'Nos experts analysent votre situation.'],
                ['number' => '03', 'title' => 'Comparez les offre', 'description' => 'Recevez plusieurs devis personnalisés.'],
                ['number' => '04', 'title' => 'Souscrivez', 'description' => 'Choisissez et recevez votre attestation.']
            ],
            'ctaTitle' => 'Devis assurance décennale électricien',
            'ctaDescription' => 'Pour obtenir un devis d\'assurance décennale électricien, complétez le formulaire en haut de page. Nos experts vous orientent vers les meilleures garanties adaptées à votre activité.',
            'ctaButton' => 'Obtenir mon devis maintenant'
        ]);
        $features->setPosition(1);
        $features->setIsEnabled(true);
        $manager->persist($features);

        $faq = new Section();
        $faq->setPage($page);
        $faq->setType('faq');
        $faq->setContent([
            'title' => 'Questions fréquentes',
            'items' => [
                [
                    'question' => 'L\'assurance décennale est-elle obligatoire pour un électricien ?',
                    'answer' => 'Oui. Tout constructeur au sens de l\'article 1792-1 du Code civil, y compris un électricien intervenant sur un ouvrage de construction, est tenu de souscription une assurance décennale avant l\'ouverture du chantier. Cette obligation s\'applique quelle que soit la forme juridique de l\'entreprise : auto-entrepreneur, artisan, EURL ou SARL. Le défaut d\'assurance constitue un délit pénal.'
                ],
                [
                    'question' => 'Quel est le prix moyen d\'une assurance décennale pour un électricien ?',
                    'answer' => 'Le tarif annuel varie entre 600 et 2 500 euros selon le chiffre d\'affaires, la nature des chantiers et l\'historique de sinistres. Un électricien auto-entrepreneur avec un CA inférieur à 50 000 euros paiera généralement entre 600 et 900 euros par an. Une entreprise réalisant 150 000 euros de CA sur des chantiers mixtes se situera davantage autour de 1 500 à 2 000 euros.'
                ],
                [
                    'question' => 'Un électricien auto-entrepreneur doit-il souscription une décennale ?',
                    'answer' => 'Oui, sans exception. Le statut auto-entrepreneur ne dispense pas de l\'obligation légale de garantie décennale. Les mentions de l\'assureur, du numéro de contrat et de la couverture géographique doivent figurer sur chaque devis et chaque facture émis.'
                ],
                [
                    'question' => 'Que se passe-t-il si un sinistre survient 8 ans après les travaux ?',
                    'answer' => 'La garantie décennale couvre les dommages survenus dans les dix ans suivant la réception des travaux. Un sinistre constaté 8 ans après la réception est donc pris en charge, à condition que l\'assureur ait été déclaré sur le contrat en vigueur au moment de la réception.'
                ],
                [
                    'question' => 'Quelle différence entre décennale et responsabilité civile professionnelle ?',
                    'answer' => 'La décennale couvre les dommages survenant après la réception des travaux, pendant dix ans, lorsqu\'ils compromettent la solidité ou la destination de l\'ouvrage. La RCP couvre les dommages causés pendant l\'exécution des travaux (avant réception).'
                ]
            ]
        ]);
        $faq->setPosition(2);
        $faq->setIsEnabled(true);
        $manager->persist($faq);

        $manager->persist($page);
        $manager->flush();
    }
}