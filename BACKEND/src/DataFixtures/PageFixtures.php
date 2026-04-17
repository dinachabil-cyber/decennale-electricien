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
        $pageCount = 0;

        // ============================================
        // PAGE 1: ACCUEIL (Home)
        // ============================================
        $home = new Page();
        $home->setTitle('Accueil');
        $home->setSlug('home');
        $home->setIsPublished(true);

        // Hero
        $hero = new Section();
        $hero->setType('hero');
        $hero->setContent([
            'title' => 'Assurance Décennale Électricien',
            'subtitle' => 'Devis en quelques clics',
            'backgroundImage' => '/images/img.png',
            'ctaText' => 'Obtenir mon devis',
            'ctaLink' => '#devis'
        ]);
        $hero->setPosition(0);
        $hero->setIsEnabled(true);
        $home->addSection($hero);

        // FAQ
        $faq = new Section();
        $faq->setType('faq');
        $faq->setContent([
            'title' => 'Questions fréquentes',
            'items' => [
                ['question' => "L'assurance décennale est-elle obligatoire ?", 'answer' => "Oui, pour tout électricien intervenant sur des travaux de construction."],
                ['question' => "Quel est le prix moyen ?", 'answer' => "Entre 600€ et 2500€ par an selon le CA et le statut."],
                ['question' => "Auto-entrepreneur : obligation ?", 'answer' => "Oui, le statut n'exonère pas de l'obligation légale."],
                ['question' => "Couverture après 8 ans ?", 'answer' => "Oui, la garantie dure 10 ans après réception des travaux."],
                ['question' => "Différence décennale/RC pro ?", 'answer' => "Décennale : 10 ans après réception. RC pro : dommages pendant les travaux."]
            ]
        ]);
        $faq->setPosition(1);
        $faq->setIsEnabled(true);
        $home->addSection($faq);

        // Steps
        $steps = new Section();
        $steps->setType('steps');
        $steps->setContent([
            'title' => 'Comment ça marche ?',
            'steps' => [
                ['number' => '01', 'title' => 'Remplissez le formulaire', 'description' => 'En 2 minutes, donnez vos informations.'],
                ['number' => '02', 'title' => 'Analyse de votre profil', 'description' => 'Nos experts analysent votre situation.'],
                ['number' => '03', 'title' => 'Comparez les offres', 'description' => 'Recevez plusieurs devis personnalisés.'],
                ['number' => '04', 'title' => 'Souscrivez', 'description' => 'Choisissez et recevez votre attestation.']
            ]
        ]);
        $steps->setPosition(2);
        $steps->setIsEnabled(true);
        $home->addSection($steps);

        // Content: Introduction
        $intro = new Section();
        $intro->setType('content');
        $intro->setContent([
            'title' => 'Pourquoi choisir notre comparateur ?',
            'introduction' => 'Nous analysons votre situation et comparons les meilleurs contrats du marché pour vous orienter vers la garantie la mieux adaptée.',
            'sections' => [
                ['title' => 'Expertise construction', 'content' => 'Nos experts connaissent les spécificités du métier d\'électricien et les garanties essentielles.'],
                ['title' => 'Accès aux meilleurs tarifs', 'content' => 'Nous négocions pour vous les garanties les plus complètes au meilleur prix.']
            ],
            'ctaText' => 'Découvrir nos offres',
            'ctaLink' => '#offres'
        ]);
        $intro->setPosition(3);
        $intro->setIsEnabled(true);
        $home->addSection($intro);

        $manager->persist($home);
        $pageCount++;

        // ============================================
        // PAGE 2: ASSURANCE DÉCENNALE ÉLECTRICIEN (Rich Content)
        // ============================================
        $page2 = new Page();
        $page2->setTitle('Assurance Décennale Électricien');
        $page2->setSlug('assurance-decennale-electricien');
        $page2->setIsPublished(true);

        // 1. HERO
        $hero2 = new Section();
        $hero2->setType('hero');
        $hero2->setContent([
            'title' => 'Assurance Décennale Électricien : Comparez et Souscrivez',
            'subtitle' => 'Tout électricien qui intervient sur des travaux de construction ou de rénovation est soumis à une obligation légale claire : souscrire une assurance décennale avant l\'ouverture du premier chantier. Cette obligation découle directement de la loi Spinetta du 4 janvier 1978, codifiée à l\'article 1792 du Code civil. Sans cette couverture, vous exposez votre activité à des poursuites judiciaires, des pénalités financières lourdes et l\'impossibilité légale d\'exercer sur certains marchés publics ou privés.',
            'ctaText' => 'Obtenir mon devis',
            'ctaLink' => '#devis',
            'backgroundImage' => '/images/hero-electrician.jpg'
        ]);
        $hero2->setPosition(0);
        $hero2->setIsEnabled(true);
        $page2->addSection($hero2);

        // 2. CONTENT: I. Prix
        $section2 = new Section();
        $section2->setType('content');
        $section2->setContent([
            'title' => 'I. Prix assurance décennale électricien en ligne',
            'introduction' => 'Le tarif d\'une assurance décennale électricien dépend de plusieurs variables concrètes que les assureurs examinent systématiquement avant d\'établir une proposition.',
            'sections' => [
                [
                    'title' => 'Facteurs déterminants du tarif',
                    'content' => 'Le chiffre d\'affaires annuel est le premier critère de pondération. Un électricien réalisant 40 000 euros de CA sur des chantiers résidentiels ne paiera pas la même prime qu\'un artisan à 200 000 euros intervenant sur des bâtiments tertiaires. En pratique, les cotisations annuelles se situent entre 600 et 1 200 euros pour les profils à faible activité, et peuvent dépasser 2 500 euros pour les entreprises plus importantes ou intervenant sur des installations complexes (courants forts, haute tension, systèmes de sécurité incendie).<br><br><strong>Autres facteurs :</strong><br>• La nature des travaux : domotique, câblage résidentiel, installations industrielles<br>• L\'ancienneté de l\'entreprise et l\'historique de sinistres<br>• Le statut juridique : auto-entrepreneur, EURL, SARL, SAS<br>• La zone géographique d\'intervention'
                ],
                [
                    'title' => 'Comparaison en ligne',
                    'content' => 'Souscrire en ligne permet aujourd\'hui d\'obtenir des propositions tarifaires comparables en quelques minutes. Les plateformes de comparaison spécialisées dans l\'assurance construction permettent d\'accéder directement aux offres de plusieurs assureurs sans passer par de multiples rendez-vous. Nos experts vérifient la solidité des contrats proposés, notamment les exclusions et les plafonds de garantie souvent sous-estimés lors d\'une souscription rapide.<br><br><strong>Conseil de terrain :</strong> ne comparez jamais deux contrats sur le seul critère du prix. Un contrat à 700 euros avec un plafond de garantie à 300 000 euros sera insuffisant dès que la valeur de l\'ouvrage dépasse ce seuil. Le rapport garanties/prime est la seule métrique pertinente.'
                ]
            ],
            'ctaText' => 'Tarifez votre assurance décennale électricien en ligne',
            'ctaLink' => '#devis'
        ]);
        $section2->setPosition(1);
        $section2->setIsEnabled(true);
        $page2->addSection($section2);

        // 3. CONTENT: II. Garanties
        $section3 = new Section();
        $section3->setType('content');
        $section3->setContent([
            'title' => 'II. Garanties assurance décennale électricien',
            'introduction' => 'L\'assurance décennale électricien couvre les dommages de nature décennale survenant après la réception des travaux, pendant une durée de dix ans. Ce périmètre est défini par les articles 1792 et suivants du Code civil.',
            'sections' => [
                [
                    'title' => '1. Ce que la garantie prend en charge',
                    'content' => 'Pour un électricien, les dommages couverts concernent principalement :<br>• Les défauts d\'installation électrique compromettant la solidité de l\'ouvrage (court-circuit ayant provoqué un incendie structurel, par exemple)<br>• Les malfaçons rendant le bâtiment impropre à sa destination (absence de mise à la terre entraînant des risques électriques permanents, tableau électrique non conforme aux normes NFC 15-100)<br>• Les infiltrations ou dommages indirects liés à une installation défectueuse (percement mal exécuté ayant fragilisé une cloison porteuse)'
                ],
                [
                    'title' => '2. Les garanties complémentaires à considérer',
                    'content' => 'La décennale seule ne suffit pas à couvrir l\'intégralité des risques d\'un électricien. Plusieurs garanties viennent compléter le socle obligatoire :<br>• La <strong>Responsabilité Civile Professionnelle (RCP)</strong> : couvre les dommages causés pendant le chantier, avant réception<br>• La <strong>garantie de parfait achèvement</strong> : obligation légale durant un an après réception<br>• La <strong>garantie biennale</strong> : couvre les équipements dissociables de l\'ouvrage pendant deux ans<br><br><em>Un point souvent négligé : certains contrats décennaux excluent les installations photovoltaïques ou les bornes de recharge pour véhicules électriques (IRVE). Si votre activité intègre ces marchés en croissance, vérifiez explicitement que votre contrat les mentionne dans les risques couverts.</em>'
                ]
            ],
            'ctaText' => 'Découvrez les garanties décennale électriciens adaptés à votre activité',
            'ctaLink' => '#devis'
        ]);
        $section3->setPosition(2);
        $section3->setIsEnabled(true);
        $page2->addSection($section3);

        // 4. CONTENT: III. Auto-Entrepreneur
        $section4 = new Section();
        $section4->setType('content');
        $section4->setContent([
            'title' => 'III. Décennale auto-entrepreneur électricien',
            'introduction' => 'Un électricien auto-entrepreneur est soumis aux mêmes obligations légales de garantie décennale qu\'un électricien exerçant sous forme de société. Le statut micro-entrepreneur n\'exonère en aucun cas de l\'obligation d\'assurance construction prévue par la loi Spinetta.',
            'sections' => [
                [
                    'title' => 'Obligations légales et mentions sur les devis',
                    'content' => 'Depuis le 20 mars 2012, tout artisan du bâtiment, quel que soit son statut, doit obligatoirement faire figurer sur ses devis et factures :<br>• Le nom et les coordonnées de son assureur décennal<br>• Le numéro de contrat<br>• La couverture géographique du contrat<br><br><strong>Sanctions :</strong> amende jusqu\'à 75 000 euros et 2 ans d\'emprisonnement (article L243-3 du Code des assurances).'
                ],
                [
                    'title' => 'Spécificités tarifaires',
                    'content' => 'Les assureurs appliquent généralement une cotisation minimale forfaitaire aux auto-entrepreneurs (600-800 euros annuels). Au-delà d\'un certain seuil de CA (souvent 50 000 euros), le tarif bascule sur un mode proportionnel.<br><br>Certains assureurs refusent de couvrir les auto-entrepreneurs en première année d\'activité ou appliquent des surprimes importantes. Nos experts connaissent les contrats qui acceptent les jeunes entreprises sans pénalisation excessive.'
                ]
            ],
            'ctaText' => 'Protégez votre activité avec la décennale auto-entrepreneur',
            'ctaLink' => '#devis'
        ]);
        $section4->setPosition(3);
        $section4->setIsEnabled(true);
        $page2->addSection($section4);

        // 5. CONTENT: IV. Couverture
        $section5 = new Section();
        $section5->setType('content');
        $section5->setContent([
            'title' => 'IV. Que couvre la garantie décennale électricien',
            'introduction' => 'La garantie décennale couvre les dommages qui compromettent la solidité de l\'ouvrage ou qui le rendent impropre à l\'usage, lorsque ces dommages résultent d\'un vice de construction.',
            'sections' => [
                [
                    'title' => '1. Dommages directement liés aux travaux électriques',
                    'content' => '• Court-circuit provoqué par une installation mal réalisée causant un incendie structurel<br>• Installation électrique non conforme entraînant une mise hors service complète<br>• Câblage défectueux ayant causé des surchauffes répétées dans les cloisons'
                ],
                [
                    'title' => '2. Ce que la décennale NE couvre PAS',
                    'content' => '• Dommages immatériels purs (perte d\'exploitation) → à couvrir via la RCP<br>• Malfaçons esthétiques sans incidence sur la solidité<br>• Dommages pendant le chantier (avant réception)<br>• Travaux d\'entretien ou de maintenance'
                ],
                [
                    'title' => '3. La notion de réception des travaux',
                    'content' => 'La garantie ne s\'active qu\'à partir de la réception des travaux. Un PV de réception signé constitue le point de départ du délai de 10 ans.'
                ]
            ],
            'ctaText' => 'Évaluez ce que couvre la garantie pour votre activité',
            'ctaLink' => '#devis'
        ]);
        $section5->setPosition(4);
        $section5->setIsEnabled(true);
        $page2->addSection($section5);

        // 6. FAQ
        $faq2 = new Section();
        $faq2->setType('faq');
        $faq2->setContent([
            'title' => 'V. FAQ - Assurance Décennale Électricien',
            'items' => [
                ['question' => "L'assurance décennale est-elle obligatoire pour un électricien ?", 'answer' => "Oui. Tout constructeur au sens de l'article 1792-1 du Code civil est tenu de souscrire une assurance décennale avant l'ouverture du chantier. Cette obligation s'applique quelle que soit la forme juridique."],
                ['question' => "Quel est le prix moyen pour un électricien ?", 'answer' => "Entre 600 et 2 500 euros/an selon CA, nature des chantiers et historique de sinistres. Auto-entrepreneur : 600-900€/an. Entreprise 150k€ CA : 1 500-2 000€/an."],
                ['question' => "Auto-entrepreneur : doit-il souscrire ?", 'answer' => "Oui, sans exception. Les mentions de l'assureur, numéro de contrat et couverture géographique doivent figurer sur chaque devis et facture. Sanctions : amende 75 000€ et 2 ans d'emprisonnement."],
                ['question' => "Sinistre 8 ans après les travaux ?", 'answer' => "La garantie couvre les dommages survenus dans les 10 ans suivant la réception. Un sinistre à 8 ans est pris en charge si l'assureur était déclaré sur le contrat en vigueur au moment de la réception."],
                ['question' => "Différence décennale / RC pro ?", 'answer' => "Décennale : dommages après réception (10 ans). RCP : dommages pendant l'exécution des travaux (avant réception). Les deux sont complémentaires et généralement souscrites ensemble."]
            ]
        ]);
        $faq2->setPosition(5);
        $faq2->setIsEnabled(true);
        $page2->addSection($faq2);

        // 7. CTA
        $cta = new Section();
        $cta->setType('cta');
        $cta->setContent([
            'title' => 'VI. Devis assurance décennale électricien',
            'subtitle' => 'Obtenez votre devis assurance décennale électricien en quelques minutes. Nos experts analysent votre activité réelle, les types de chantiers et votre chiffre d\'affaires pour vous orienter vers les contrats les mieux calibrés. Que vous soyez en cours de création d\'entreprise, en recherche d\'un contrat plus compétitif ou confronté à un refus d\'assurance, nous disposons des accès aux contrats adaptés aux profils d\'électriciens, y compris les activités spécialisées comme les installations photovoltaïques, la domotique ou les IRVE.',
            'buttonText' => 'Obtenir mon devis maintenant',
            'buttonLink' => '#devis'
        ]);
        $cta->setPosition(6);
        $cta->setIsEnabled(true);
        $page2->addSection($cta);

        // 8. FORM
        $form = new Section();
        $form->setType('form');
        $form->setContent([
            'title' => 'Demande de devis assurance décennale',
            'description' => 'Transmettez vos informations d\'activité et recevez une comparaison claire des garanties et des tarifs applicables à votre situation.',
            'submitText' => 'Recevoir mon devis comparatif',
            'email' => 'contact@aksam-assurances.fr',
            'fields' => [
                ['name' => 'name', 'label' => 'Nom / Raison sociale', 'type' => 'text', 'required' => true],
                ['name' => 'email', 'label' => 'Email professionnel', 'type' => 'email', 'required' => true],
                ['name' => 'phone', 'label' => 'Téléphone', 'type' => 'tel', 'required' => true],
                ['name' => 'activity', 'label' => 'Type d\'activité', 'type' => 'select', 'options' => ['Electricien résidentiel', 'Electricien tertiaire', 'Domotique', 'Photovoltaïque', 'IRVE (bornes de recharge)'], 'required' => true],
                ['name' => 'ca', 'label' => 'Chiffre d\'affaires annuel', 'type' => 'text', 'placeholder' => 'Ex: 150 000 €', 'required' => true],
                ['name' => 'message', 'label' => 'Votre situation / questions', 'type' => 'textarea', 'required' => false]
            ]
        ]);
        $form->setPosition(7);
        $form->setIsEnabled(true);
        $page2->addSection($form);

        $manager->persist($page2);
        $pageCount++;

        // ============================================
        // PAGE 3: CONTACT
        // ============================================
        $contactPage = new Page();
        $contactPage->setTitle('Contact');
        $contactPage->setSlug('contact');
        $contactPage->setIsPublished(true);

        $contactHero = new Section();
        $contactHero->setType('hero');
        $contactHero->setContent([
            'title' => 'Contactez-nous',
            'subtitle' => 'Une question ? Notre équipe vous répond dans les 24h.',
            'ctaText' => 'Envoyer un message',
            'ctaLink' => '#contact-form'
        ]);
        $contactHero->setPosition(0);
        $contactHero->setIsEnabled(true);
        $contactPage->addSection($contactHero);

        $contactInfo = new Section();
        $contactInfo->setType('contact');
        $contactInfo->setContent([
            'title' => 'Nos coordonnées',
            'subtitle' => 'Retrouvez-nous à Paris',
            'email' => 'contact@aksam-assurances.fr',
            'phone' => '01 23 45 67 89',
            'address' => '10 Rue de Penthièvre, 75008 Paris',
            'showMap' => true
        ]);
        $contactInfo->setPosition(1);
        $contactInfo->setIsEnabled(true);
        $contactPage->addSection($contactInfo);

        $contactForm = new Section();
        $contactForm->setType('form');
        $contactForm->setContent([
            'title' => 'Formulaire de contact',
            'description' => 'Remplissez ce formulaire et nous vous répondrons dans les 24h.',
            'submitText' => 'Envoyer le message',
            'email' => 'contact@aksam-assurances.fr',
            'fields' => [
                ['name' => 'name', 'label' => 'Votre nom', 'type' => 'text', 'required' => true],
                ['name' => 'email', 'label' => 'Votre email', 'type' => 'email', 'required' => true],
                ['name' => 'subject', 'label' => 'Sujet', 'type' => 'text', 'required' => true],
                ['name' => 'message', 'label' => 'Message', 'type' => 'textarea', 'required' => true]
            ]
        ]);
        $contactForm->setPosition(2);
        $contactForm->setIsEnabled(true);
        $contactPage->addSection($contactForm);

        $manager->persist($contactPage);
        $pageCount++;

        // ============================================
        // PAGE 4: MENTIONS LÉGALES
        // ============================================
        $mentionsLegales = new Page();
        $mentionsLegales->setTitle('Mentions légales');
        $mentionsLegales->setSlug('mentions-legales');
        $mentionsLegales->setIsPublished(true);

        $mlHero = new Section();
        $mlHero->setType('hero');
        $mlHero->setContent([
            'title' => 'Mentions légales',
            'subtitle' => 'Informations légales relatives au site',
            'ctaText' => '',
            'ctaLink' => ''
        ]);
        $mlHero->setPosition(0);
        $mlHero->setIsEnabled(true);
        $mentionsLegales->addSection($mlHero);

        $mlContent = new Section();
        $mlContent->setType('content');
        $mlContent->setContent([
            'title' => 'Conditions juridiques',
            'introduction' => 'En envoyant un courrier électronique à la société ou en accédant et/ou utilisant le Site Internet www.assurance-decennale-electricien.fr, chaque personne physique (ci-après « l\'Utilisateur ») déclare et garantit qu\'elle a pris préalablement connaissances des présentes conditions juridiques, c\'est-à-dire des informations légales, des règles applicables à la protection des données à caractère personnelles et des conditions d\'utilisation et qu\'elle en accepte les termes et conditions sans réserve, modification ou restriction.',
            'sections' => [
                [
                    'title' => 'Éditeur',
                    'content' => 'Le site www.assurance-decennale-electricien.fr est édité par la société <strong>AKSAM ASSURANCES</strong> SARL AU au capital de 10.000 €.<br><br><strong>Siège social :</strong> 10 Rue de Penthièvre 75008 Paris<br><strong>SIRET :</strong> 84065346300033<br><strong>R.C.S Paris :</strong> 840 653 463<br><strong>ORIAS :</strong> 180 074 24'
                ],
                [
                    'title' => 'Hébergeur',
                    'content' => 'Le présent Site est hébergé par la société NAMECHEAP.<br><br><strong>Adresse :</strong> 4600 E Washington St suite 305, Phoenix, AZ 85034.'
                ],
                [
                    'title' => 'Protection des données personnelles',
                    'content' => 'Les informations personnelles recueillies font l\'objet d\'un traitement automatisé conformément à la loi française n° 78-17 du 6 janvier 1978.<br><br><strong>Contact :</strong> AKSAM ASSURANCES<br>10 Rue de Penthièvre 75008 Paris<br>Email: contact@aksam-assurances.fr'
                ],
                [
                    'title' => 'Utilisation des cookies',
                    'content' => 'Nous utilisons des cookies pour améliorer votre expérience sur notre site. Les cookies nous aident à analyser le trafic et à optimiser notre site web.'
                ]
            ],
            'ctaText' => 'Retour à l\'accueil',
            'ctaLink' => '/'
        ]);
        $mlContent->setPosition(1);
        $mlContent->setIsEnabled(true);
        $mentionsLegales->addSection($mlContent);

        $manager->persist($mentionsLegales);
        $pageCount++;

        // ============================================
        // PAGE 5: POLITIQUE DE CONFIDENTIALITÉ
        // ============================================
        $confidentialite = new Page();
        $confidentialite->setTitle('Politique de confidentialité');
        $confidentialite->setSlug('politique-confidentialite');
        $confidentialite->setIsPublished(true);

        $pcHero = new Section();
        $pcHero->setType('hero');
        $pcHero->setContent([
            'title' => 'Politique de confidentialité',
            'subtitle' => 'Comment nous protégeons vos données',
            'ctaText' => '',
            'ctaLink' => ''
        ]);
        $pcHero->setPosition(0);
        $pcHero->setIsEnabled(true);
        $confidentialite->addSection($pcHero);

        $pcContent = new Section();
        $pcContent->setType('content');
        $pcContent->setContent([
            'title' => 'Politique de confidentialité',
            'introduction' => '',
            'sections' => [
                [
                    'title' => '1. Collecte des données',
                    'content' => 'Nous collectons les données personnelles que vous nous fournissez via notre formulaire de devis, notamment : votre nom, adresse email, numéro de téléphone, nom de votre entreprise et statut juridique.'
                ],
                [
                    'title' => '2. Utilisation des données',
                    'content' => 'Les données collectées sont utilisées exclusivement pour :<br>- Vous contacter pour établir un devis d\'assurance décennale<br>- Analyser votre profil professionnel<br>- Comparer les offres d\'assurance adaptées à votre activité'
                ],
                [
                    'title' => '3. Conservation des données',
                    'content' => 'Vos données personnelles sont conservées pour une durée de 3 ans à compter de notre dernier contact, conformément à la réglementation en vigueur.'
                ],
                [
                    'title' => '4. Vos droits',
                    'content' => 'Conformément à la loi française n°78-17 du 6 janvier 1978 modifiée et au RGPD, vous disposez des droits d\'accès, de rectification, d\'effacement et de portabilité de vos données. Vous pouvez exercer ces droits en nous contactant à : contact@aksam-assurances.fr'
                ],
                [
                    'title' => '5. Sécurité',
                    'content' => 'Nous mettons en œuvre toutes les mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, modification, divulgation ou destruction.'
                ]
            ],
            'ctaText' => 'Retour à l\'accueil',
            'ctaLink' => '/'
        ]);
        $pcContent->setPosition(1);
        $pcContent->setIsEnabled(true);
        $confidentialite->addSection($pcContent);

        $manager->persist($confidentialite);
        $pageCount++;

        $manager->flush();

        echo "Created {$pageCount} pages with all sections.\n";
        echo "\nAdmin pages list will now show:\n";
        echo "1. Accueil (home)\n";
        echo "2. Assurance Décennale Électricien (assurance-decennale-electricien)\n";
        echo "3. Contact (contact)\n";
        echo "4. Mentions légales (mentions-legales)\n";
        echo "5. Politique de confidentialité (politique-confidentialite)\n";
    }
}
