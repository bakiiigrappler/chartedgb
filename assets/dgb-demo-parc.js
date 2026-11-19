/* =========================================================================
   Données de démonstration du gabarit « Gestion du parc »
   Chaque page en liste est décrite ici : titre, colonnes, lignes, filtre
   et champs du formulaire d'ajout. application.html les rend toutes avec
   le même moteur (recherche, filtres, pagination, ajout, export).
   Toutes les valeurs sont fictives.
   ========================================================================= */
window.DGB_DEMO = {
  statuts: {
    'Validé': 'succes', 'Actif': 'succes', 'Terminé': 'succes', 'Conforme': 'succes', 'Réussie': 'succes', 'Clos': 'succes', 'En service': 'succes', 'Remis': 'succes',
    'En cours': 'info', 'À contrôler': 'info', 'Planifiée': 'info', 'Transféré': 'info',
    'À signer': 'attente', 'En attente': 'attente', 'Ouvert': 'attente', 'Expire bientôt': 'attente', 'En maintenance': 'attente', 'Écart': 'attente',
    'Rejeté': 'blocage', 'Expiré': 'blocage', 'Échec': 'blocage', 'À réformer': 'blocage', 'Urgent': 'blocage',
    'Brouillon': 'neutre', 'Saisie en cours': 'neutre', 'Inactif': 'neutre', 'En stock': 'neutre', 'Retourné': 'neutre'
  },

  listes: {
    dossiers: {
      titre: 'Dossiers à traiter', sous: '7 dossiers dans votre corbeille, dont 3 attendent une action de votre part',
      primaire: null, lien: 'dossier',
      colonnes: ['Référence', 'Objet', 'Structure', 'Étape du dossier', 'Reçu le', 'Statut', 'Valeur (FCFA)'],
      droite: [6], filtre: 5,
      lignes: [
        ['AFF-2026-0412', 'Ordinateur portable', 'Service de la solde', 'Signature électronique', '18/11/2026', 'À signer', '685 000'],
        ['AFF-2026-0409', 'Écran 24 pouces', 'DAF', 'Contrôle', '17/11/2026', 'À contrôler', '142 000'],
        ['MNT-2026-0087', 'Imprimante laser', 'Cabinet du DG', 'Saisie', '16/11/2026', 'Saisie en cours', '—'],
        ['REF-2026-0021', 'Réforme de 14 unités centrales', 'DSI', 'Rejeté au contrôle', '14/11/2026', 'Rejeté', '—'],
        ['AFF-2026-0398', 'Téléphone IP', 'Direction du budget', 'Terminé', '13/11/2026', 'Validé', '96 500'],
        ['AFF-2026-0395', 'Onduleur 1 500 VA', 'Service courrier', 'Signature électronique', '12/11/2026', 'À signer', '210 000'],
        ['TRF-2026-0044', 'Transfert de 3 postes', 'DGA', 'Contrôle', '10/11/2026', 'À contrôler', '—']
      ]
    },
    historique: {
      titre: 'Historique', sous: 'Les dernières actions enregistrées sur vos dossiers',
      colonnes: ['Date', 'Dossier', 'Événement', 'Acteur', 'Statut'], filtre: 4,
      lignes: [
        ['18/11/2026 09:12', 'AFF-2026-0412', 'Prévalidation, à signer et transmettre', 'Marie Ndong', 'En attente'],
        ['17/11/2026 16:40', 'AFF-2026-0398', 'Validation et génération du procès-verbal', 'Jean Mba', 'Validé'],
        ['17/11/2026 10:05', 'AFF-2026-0409', 'Signature et transmission électronique', 'Marie Ndong', 'Transféré'],
        ['16/11/2026 15:40', 'AFF-2026-0412', 'Pièce ajoutée : fiche de demande', 'Marie Ndong', 'Terminé'],
        ['14/11/2026 11:22', 'REF-2026-0021', 'Rejet du dossier : pièce justificative manquante', 'Clarisse Ondo', 'Rejeté'],
        ['13/11/2026 08:58', 'MNT-2026-0081', 'Clôture du ticket de maintenance', 'Paul Obiang', 'Clos'],
        ['12/11/2026 14:31', 'AFF-2026-0395', 'Initialisation du dossier', 'Marie Ndong', 'Terminé'],
        ['10/11/2026 09:47', 'TRF-2026-0044', 'Transfert de 3 postes vers la DGA', 'Marie Ndong', 'Transféré']
      ]
    },
    inventaire: {
      titre: 'Inventaire', sous: '1 284 équipements recensés, dont 1 097 affectés à un agent',
      primaire: 'Nouvel équipement', primaireVue: 'nouvel-equipement',
      colonnes: ['N° d’inventaire', 'Équipement', 'Catégorie', 'Affectataire', 'Structure', 'Fin de garantie', 'État'], filtre: 2,
      lignes: [
        ['DGB-PC-02817', 'Dell Latitude 5450', 'Portables', 'Paul Obiang', 'Service de la solde', '03/2029', 'En service'],
        ['DGB-PC-02790', 'HP EliteBook 840 G10', 'Portables', 'Clarisse Ondo', 'DAF', '11/2028', 'En service'],
        ['DGB-PC-02654', 'Lenovo ThinkPad T14', 'Portables', '—', 'DSI', '06/2027', 'En stock'],
        ['DGB-EC-01122', 'Dell P2425H 24 pouces', 'Écrans', 'Jean Mba', 'Direction du budget', '09/2029', 'En service'],
        ['DGB-EC-01087', 'Samsung S27 27 pouces', 'Écrans', 'Aline Moussavou', 'Cabinet du DG', '02/2028', 'En service'],
        ['DGB-IM-00412', 'HP LaserJet M428', 'Imprimantes', 'Service courrier', 'DGA', '01/2026', 'En maintenance'],
        ['DGB-IM-00398', 'Canon i-SENSYS MF455', 'Imprimantes', 'Secrétariat', 'DAF', '08/2027', 'En service'],
        ['DGB-RS-00076', 'Commutateur Cisco 2960', 'Réseau', 'Salle serveur', 'DSI', '12/2025', 'À réformer'],
        ['DGB-RS-00081', 'Borne Wi-Fi Ubiquiti U6', 'Réseau', '3e étage', 'DSI', '04/2029', 'En service'],
        ['DGB-PC-02421', 'Dell OptiPlex 7010', 'Portables', 'Rose Nzé', 'Service de la solde', '10/2025', 'À réformer']
      ],
      champs: [['Équipement', 'text', 'Dell Latitude 5450'], ['Catégorie', 'select', 'Portables|Écrans|Imprimantes|Réseau'], ['Structure', 'select', 'DSI|DAF|Direction du budget|Service de la solde|Cabinet du DG']]
    },
    affectations: {
      titre: 'Affectations', sous: 'Remises, transferts et retours d’équipements',
      primaire: 'Nouvelle affectation',
      colonnes: ['Référence', 'Équipement', 'Bénéficiaire', 'Structure', 'Date', 'Statut'], filtre: 5,
      groupes: { 'En cours': ['En attente', 'En cours', 'À signer'], 'Historique': ['Remis', 'Retourné', 'Transféré'] },
      lignes: [
        ['AFF-2026-0412', 'DGB-PC-02817 · Portable', 'Paul Obiang', 'Service de la solde', '18/11/2026', 'À signer'],
        ['AFF-2026-0409', 'DGB-EC-01122 · Écran', 'Jean Mba', 'Direction du budget', '17/11/2026', 'En cours'],
        ['AFF-2026-0395', 'DGB-OD-00031 · Onduleur', 'Service courrier', 'DGA', '12/11/2026', 'En attente'],
        ['AFF-2026-0398', 'DGB-TL-00210 · Téléphone IP', 'Aline Moussavou', 'Cabinet du DG', '13/11/2026', 'Remis'],
        ['RET-2026-0017', 'DGB-PC-02102 · Portable', 'Rose Nzé', 'Service de la solde', '05/11/2026', 'Retourné'],
        ['TRF-2026-0044', '3 postes de travail', 'DGA', 'DGA', '10/11/2026', 'Transféré']
      ],
      champs: [['Équipement', 'text', 'DGB-PC-02817'], ['Bénéficiaire', 'text', 'Prénom Nom'], ['Structure', 'select', 'DSI|DAF|Direction du budget|Service de la solde|Cabinet du DG']]
    },
    maintenance: {
      titre: 'Maintenance', sous: '46 équipements en maintenance, dont 12 hors garantie',
      primaire: 'Ouvrir un ticket',
      colonnes: ['Référence', 'Type', 'Équipement', 'Prestataire', 'Échéance', 'Statut'], filtre: 1,
      lignes: [
        ['MNT-2026-0087', 'Ticket', 'HP LaserJet M428 · DGA', 'Gabon Bureautique', '22/11/2026', 'Ouvert'],
        ['MNT-2026-0086', 'Ticket', 'Dell Latitude 5440 · DAF', 'Atelier DSI', '20/11/2026', 'En cours'],
        ['MNT-2026-0081', 'Ticket', 'Commutateur 2960 · DSI', 'Atelier DSI', '13/11/2026', 'Clos'],
        ['MNT-2026-0079', 'Ticket', 'Onduleur salle serveur', 'Énergie Services', '19/11/2026', 'Urgent'],
        ['CTR-2024-0007', 'Contrat', 'Parc d’imprimantes HP (38)', 'Gabon Bureautique', '31/12/2026', 'Expire bientôt'],
        ['CTR-2025-0003', 'Contrat', 'Postes Dell (412)', 'Dell Technologies', '30/06/2028', 'Actif'],
        ['CTR-2023-0011', 'Contrat', 'Climatisation salle serveur', 'Froid Équatorial', '31/10/2026', 'Expiré']
      ],
      champs: [['Équipement', 'text', 'DGB-IM-00412'], ['Type', 'select', 'Ticket|Contrat'], ['Prestataire', 'text', 'Atelier DSI']]
    },
    sites: {
      titre: 'Sites et localisations', sous: 'Bâtiments, étages et services de la DGB',
      primaire: 'Nouveau site',
      colonnes: ['Site', 'Adresse', 'Étages', 'Services', 'Équipements', 'Statut'], droite: [2, 3, 4], filtre: 5,
      lignes: [
        ['Siège DGB', 'Boulevard Triomphal, Libreville', '6', '14', '812', 'Actif'],
        ['Annexe Immeuble Arambo', 'Quartier Louis, Libreville', '3', '5', '264', 'Actif'],
        ['Direction provinciale Franceville', 'Centre-ville, Franceville', '2', '3', '118', 'Actif'],
        ['Entrepôt Owendo', 'Zone portuaire, Owendo', '1', '1', '90', 'Inactif']
      ],
      champs: [['Site', 'text', 'Nom du site'], ['Adresse', 'text', 'Quartier, ville']]
    },
    structures: {
      titre: 'Directions et services', sous: 'L’organisation de la DGB utilisée pour les affectations',
      primaire: 'Nouvelle structure',
      colonnes: ['Code', 'Structure', 'Responsable', 'Agents', 'Équipements', 'Statut'], droite: [3, 4], filtre: 5,
      lignes: [
        ['DG', 'Direction générale', 'Directeur général', '18', '64', 'Actif'],
        ['DGA', 'Direction générale adjointe', 'Directeur général adjoint', '12', '41', 'Actif'],
        ['DB', 'Direction du budget', 'Jean Mba', '96', '214', 'Actif'],
        ['DAF', 'Direction administrative et financière', 'Clarisse Ondo', '74', '268', 'Actif'],
        ['DSI', 'Direction des systèmes d’information', 'Hervé Nguema', '38', '186', 'Actif'],
        ['SOL', 'Service de la solde', 'Paul Obiang', '121', '312', 'Actif'],
        ['ARC', 'Service des archives', '—', '6', '22', 'Inactif']
      ],
      champs: [['Code', 'text', 'SIGLE'], ['Structure', 'text', 'Nom de la structure'], ['Responsable', 'text', 'Prénom Nom']]
    },
    categories: {
      titre: 'Catégories d’équipement', sous: 'Familles, modèles et durées d’amortissement',
      primaire: 'Nouvelle catégorie',
      colonnes: ['Code', 'Famille', 'Modèles', 'Amortissement', 'Équipements', 'Statut'], droite: [2, 4], filtre: 5,
      lignes: [
        ['PC', 'Ordinateurs portables', '9', '4 ans', '612', 'Actif'],
        ['EC', 'Écrans et périphériques', '14', '5 ans', '388', 'Actif'],
        ['IM', 'Imprimantes et copieurs', '6', '5 ans', '142', 'Actif'],
        ['RS', 'Équipements réseau', '11', '7 ans', '96', 'Actif'],
        ['TL', 'Téléphonie', '3', '5 ans', '46', 'Actif'],
        ['TB', 'Tablettes', '2', '3 ans', '0', 'Inactif']
      ],
      champs: [['Code', 'text', 'XX'], ['Famille', 'text', 'Nom de la famille'], ['Amortissement', 'select', '3 ans|4 ans|5 ans|7 ans']]
    },
    circuits: {
      titre: 'Circuits de validation', sous: 'Étapes, rôles et seuils de contrôle par type de dossier',
      primaire: 'Nouveau circuit',
      colonnes: ['Circuit', 'Étapes', 'Rôles concernés', 'Seuil de contrôle', 'Statut'], droite: [1], filtre: 4,
      lignes: [
        ['Affectation nominative', '5', 'Gestionnaire, valideur DAF', '≥ 500 000 FCFA', 'Actif'],
        ['Transfert entre structures', '4', 'Gestionnaire, DGA', 'Tous montants', 'Actif'],
        ['Réforme de matériel', '6', 'Gestionnaire, DAF, contrôleur', 'Tous montants', 'Actif'],
        ['Ticket de maintenance', '3', 'Gestionnaire, prestataire', '—', 'Actif'],
        ['Prêt temporaire', '2', 'Gestionnaire', '—', 'Brouillon']
      ],
      champs: [['Circuit', 'text', 'Nom du circuit'], ['Seuil de contrôle', 'text', 'Montant ou « Tous montants »']]
    },
    modeles: {
      titre: 'Modèles de courrier', sous: 'Actes, notes et correspondances types générés par l’application',
      primaire: 'Nouveau modèle',
      colonnes: ['Modèle', 'Type', 'Dernière modification', 'Auteur', 'Statut'], filtre: 4,
      lignes: [
        ['Procès-verbal de remise', 'Acte', '12/11/2026', 'Marie Ndong', 'Actif'],
        ['Note de service · affectation', 'Note', '03/11/2026', 'Hervé Nguema', 'Actif'],
        ['Bordereau de transfert', 'Bordereau', '28/10/2026', 'Marie Ndong', 'Actif'],
        ['Lettre de relance prestataire', 'Courrier', '15/10/2026', 'Paul Obiang', 'Brouillon']
      ],
      champs: [['Modèle', 'text', 'Nom du modèle'], ['Type', 'select', 'Acte|Note|Bordereau|Courrier']]
    },
    regles: {
      titre: 'Règles et délais', sous: 'Relances automatiques, échéances et calendrier',
      primaire: 'Nouvelle règle',
      colonnes: ['Règle', 'Délai', 'Relance', 'Portée', 'Statut'], filtre: 4,
      lignes: [
        ['Signature d’un dossier prévalidé', '2 jours ouvrés', 'J+1 puis J+2', 'Tous les circuits', 'Actif'],
        ['Contrôle par la DAF', '3 jours ouvrés', 'J+2', 'Affectations ≥ 500 000', 'Actif'],
        ['Fin de garantie', '60 jours avant', 'Hebdomadaire', 'Tout le parc', 'Actif'],
        ['Retour d’un prêt temporaire', '15 jours', 'J+15 puis J+20', 'Prêts', 'Inactif']
      ],
      champs: [['Règle', 'text', 'Intitulé'], ['Délai', 'text', '2 jours ouvrés']]
    },
    groupes: {
      titre: 'Groupes et permissions', sous: 'Ce que chaque fonction peut voir et faire dans l’application',
      primaire: 'Nouveau groupe',
      colonnes: ['Groupe', 'Membres', 'Permissions', 'Modifié le', 'Statut'], droite: [1, 2], filtre: 4,
      lignes: [
        ['Administrateurs SED', '3', '48', '02/11/2026', 'Actif'],
        ['Gestionnaires du parc', '7', '31', '14/10/2026', 'Actif'],
        ['Valideurs DAF', '4', '12', '14/10/2026', 'Actif'],
        ['Contrôleurs', '2', '9', '01/09/2026', 'Actif'],
        ['Consultation seule', '26', '6', '01/09/2026', 'Actif'],
        ['Prestataires externes', '0', '4', '20/06/2026', 'Inactif']
      ],
      champs: [['Groupe', 'text', 'Nom du groupe'], ['Permissions', 'select', 'Consultation|Saisie|Validation|Administration']]
    },
    sauvegardes: {
      titre: 'Sauvegardes et clés', sous: 'Export, restauration et rotation des secrets',
      primaire: 'Lancer une sauvegarde', primaireAction: 'sauvegarde',
      colonnes: ['Date', 'Type', 'Taille', 'Durée', 'Statut'], droite: [2, 3], filtre: 4,
      lignes: [
        ['19/11/2026 02:00', 'Complète', '4,8 Go', '18 min', 'Réussie'],
        ['18/11/2026 02:00', 'Complète', '4,8 Go', '17 min', 'Réussie'],
        ['17/11/2026 14:12', 'Manuelle', '4,7 Go', '19 min', 'Réussie'],
        ['16/11/2026 02:00', 'Complète', '—', '2 min', 'Échec'],
        ['15/11/2026 02:00', 'Complète', '4,7 Go', '18 min', 'Réussie']
      ]
    }
  },

  utilisateurs: [
    ['MN', 'Marie Ndong', 'Gestionnaire du parc', 'DSI', 'Actif'],
    ['JM', 'Jean Mba', 'Directeur du budget', 'DB', 'Actif'],
    ['CO', 'Clarisse Ondo', 'Valideur des affectations', 'DAF', 'Actif'],
    ['PO', 'Paul Obiang', 'Chef de service', 'Solde', 'Actif'],
    ['HN', 'Hervé Nguema', 'Administrateur', 'DSI', 'Actif'],
    ['AM', 'Aline Moussavou', 'Assistante de direction', 'Cabinet', 'Actif'],
    ['RN', 'Rose Nzé', 'Agent de saisie', 'Solde', 'Inactif'],
    ['SE', 'Serge Essono', 'Contrôleur', 'DAF', 'Actif']
  ],

  audit: [
    ['traiter', 'Connexion réussie', 'Marie Ndong · 192.168.12.44 · code à usage unique', '19/11 08:31'],
    ['signer', 'Signature électronique', 'AFF-2026-0409 · session sécurisée', '17/11 10:05'],
    ['utilisateurs', 'Habilitation modifiée', 'Rose Nzé passe en « Consultation seule »', '16/11 17:20'],
    ['alerte', 'Trois échecs de connexion', 'Compte s.essono · verrouillé 15 minutes', '16/11 08:02'],
    ['telecharger', 'Export de l’inventaire', '1 284 lignes · format Excel', '15/11 11:47'],
    ['cle', 'Rotation de la clé API', 'Clé SIGFiP renouvelée par Hervé Nguema', '14/11 09:15'],
    ['reglages', 'Paramètre modifié', 'Délai de relance porté à 2 jours ouvrés', '12/11 16:02']
  ],

  notifications: [
    ['attente', 'AFF-2026-0412 attend votre signature', 'Ordinateur portable · Service de la solde', 'il y a 12 min', true],
    ['succes', 'AFF-2026-0398 validé par la DAF', 'Le procès-verbal de remise est disponible', 'il y a 2 h', true],
    ['info', 'Commission d’affectation aujourd’hui à 10:00', 'Salle de réunion du 3e étage', 'hier', false],
    ['erreur', 'Garantie expirée : 4 imprimantes', 'Contrat CTR-2023-0011 · à renouveler', 'il y a 2 j', false]
  ],

  /* Notifications qui « arrivent » pendant la démonstration */
  arrivees: [
    ['attente', 'Nouveau dossier à contrôler', 'TRF-2026-0045 · transfert de 2 écrans vers la DAF'],
    ['succes', 'AFF-2026-0409 validé', 'Clarisse Ondo a validé l’affectation de l’écran 24 pouces'],
    ['info', 'Ticket MNT-2026-0086 mis à jour', 'L’atelier DSI a remplacé la batterie du portable'],
    ['attente', 'Garantie bientôt échue', '14 postes Dell arrivent en fin de garantie le 30/11']
  ]
};
