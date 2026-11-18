<?php

/*
|--------------------------------------------------------------------------
| Suite DSI · DGB — réglages propres à chaque application
|--------------------------------------------------------------------------
| Seul ce fichier change d'une application à l'autre : le gabarit, les
| barres et la page de connexion restent identiques.
*/

return [

    'nom' => env('SUITE_NOM', 'Gestion du parc'),
    'slogan' => env('SUITE_SLOGAN', 'Suite DSI · DGB'),
    'version' => env('SUITE_VERSION', '2.4.0'),

    /*
    | Valeurs par défaut du panneau « Personnaliser ». L'agent peut les changer
    | pour son poste si 'personnalisable' est vrai.
    */
    'marque' => env('SUITE_MARQUE', 'dgb'),               // dgb | abat | cobalt | sarcelle | indigo | prune | olive | ardoise | nuit | lagon | fuchsia | sable
    'police' => env('SUITE_POLICE', 'institution'),        // institution | editoriale | technique | plex | condensee
    'disposition' => env('SUITE_DISPOSITION', 'sidebar'), // sidebar (OKANDAH) | topnav (ABAT)
    'theme' => 'clair',                                    // clair | sombre | systeme
    'densite' => 'confortable',                            // compacte | confortable | aeree
    'espace' => 'serre',                                   // serre | standard | ample (marges de page)
    'sidebar' => 'groupes',                                // groupes (sous-menus) | plat
    'conteneur' => 'fluide',                               // fluide | encadre
    'personnalisable' => true,

    // Badge d'environnement (null en production)
    'environnement' => env('SUITE_ENV_LIBELLE', 'Préprod'),

    'connexion' => [
        'surtitre' => 'Courrier · identité · projets',
        // Scènes du volet bleu : parc | courrier | projet
        'scene' => env('SUITE_CONNEXION_SCENE', 'courrier'),
        'scenes' => ['courrier', 'projet', 'parc'],
        'titre_carte' => 'Bienvenue sur votre espace',
        'invite' => 'Connectez-vous pour accéder à la gestion du parc informatique.',
        'titre' => 'Chaque dossier trouve<br>son circuit.',
        'texte' => "Un courrier arrive, une identité est vérifiée, un projet avance : les applications du SED partagent la même maison, les mêmes règles et le même accès.",
        'atouts' => [
            ['icone' => 'dossier', 'libelle' => 'Inventaire centralisé'],
            ['icone' => 'traiter', 'libelle' => 'Circuit de validation tracé'],
            ['icone' => 'cadenas', 'libelle' => 'Accès habilité par fonction'],
        ],
        'mention' => "Accès réservé aux agents habilités de la DGB. Chaque connexion est journalisée. En cas de difficulté, contactez le support applicatif du SED (poste 2410).",
        'otp' => env('SUITE_OTP', true),
    ],

    // Applications de la suite (menu « Applications » de la barre)
    'applications' => [
        ['nom' => 'Gestion du parc', 'description' => 'Équipements informatiques', 'couleur' => '#155a9c', 'url' => env('SUITE_URL_PARC', '#')],
        ['nom' => 'ABAT', 'description' => 'Investissements publics', 'couleur' => '#12805f', 'url' => env('SUITE_URL_ABAT', '#')],
        ['nom' => 'OKANDAH', 'description' => 'Gestion du courrier', 'couleur' => '#134d83', 'url' => env('SUITE_URL_OKANDAH', '#')],
        ['nom' => 'OLIA', 'description' => 'Annuaire des agents', 'couleur' => '#475569', 'url' => env('SUITE_URL_OLIA', '#')],
    ],

    /*
    | Menu : rubriques → liens. En Sidebar, les rubriques sont des titres de
    | section pliables ; en Top Nav, elles deviennent les modules de l'entête et
    | leurs liens la sous-navigation (même logique qu'OKANDAH).
    | 'route' : nom de route · 'permission' : capacité Gate (facultatif)
    | 'compteur' : clé fournie par un View Composer · 'desactive' : visible mais inerte
    | 'enfants' : sous-niveaux affichés dans la rubrique ouverte (Sidebar)
    */
    'menu' => [
        ['rubrique' => 'Pilotage', 'liens' => [
            ['libelle' => 'Tableau de bord', 'icone' => 'tableau', 'route' => 'tableau-de-bord'],
            ['libelle' => 'Dossiers à traiter', 'icone' => 'traiter', 'route' => 'dossiers.attente', 'compteur' => 'attente'],
            ['libelle' => 'À signer', 'icone' => 'signer', 'route' => 'dossiers.signature', 'compteur' => 'signature'],
        ]],
        ['rubrique' => 'Parc', 'liens' => [
            ['libelle' => 'Nouvel équipement', 'icone' => 'plus', 'route' => 'equipements.create', 'permission' => 'creer-equipement'],
            ['libelle' => 'Inventaire', 'icone' => 'ordinateur', 'route' => 'equipements.index', 'enfants' => [
                ['libelle' => 'Ordinateurs portables', 'route' => 'equipements.index', 'filtre' => 'portable'],
                ['libelle' => 'Écrans et périphériques', 'route' => 'equipements.index', 'filtre' => 'peripherique'],
                ['libelle' => 'Imprimantes', 'route' => 'equipements.index', 'filtre' => 'imprimante'],
            ]],
            ['libelle' => 'Affectations', 'icone' => 'echange', 'route' => 'affectations.index', 'enfants' => [
                ['libelle' => 'En cours', 'route' => 'affectations.index', 'filtre' => 'en-cours'],
                ['libelle' => 'Historique', 'route' => 'affectations.index', 'filtre' => 'historique'],
            ]],
            ['libelle' => 'Maintenance', 'icone' => 'outil', 'route' => 'maintenance.index', 'enfants' => [
                ['libelle' => 'Tickets ouverts', 'route' => 'maintenance.index', 'filtre' => 'ouverts'],
                ['libelle' => 'Contrats de garantie', 'route' => 'maintenance.garanties'],
            ]],
        ]],
        ['rubrique' => 'Configuration', 'liens' => [
            ['libelle' => 'Directions et services', 'icone' => 'batiment', 'route' => 'config.structures', 'permission' => 'configurer'],
            ['libelle' => 'Catégories', 'icone' => 'etiquette', 'route' => 'config.categories', 'permission' => 'configurer'],
            ['libelle' => 'Rapports', 'icone' => 'rapport', 'route' => 'rapports.index', 'desactive' => true],
        ]],
        ['rubrique' => 'Administration', 'liens' => [
            ['libelle' => 'Utilisateurs', 'icone' => 'utilisateurs', 'route' => 'admin.utilisateurs', 'permission' => 'administrer'],
            ['libelle' => 'Groupes et permissions', 'icone' => 'bouclier', 'route' => 'admin.groupes', 'permission' => 'administrer'],
            ['libelle' => "Journal d'audit", 'icone' => 'horloge', 'route' => 'admin.audit', 'permission' => 'administrer'],
            ['libelle' => 'Paramètres', 'icone' => 'reglages', 'route' => 'admin.parametres', 'permission' => 'administrer'],
        ]],
    ],
];
