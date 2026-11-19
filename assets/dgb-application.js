/* =========================================================================
   Gabarit « Gestion du parc » — toutes les pages navigables
   Routage par ancre (#inventaire, #signer…), moteur de listes, fenêtres,
   signature par code à usage unique, formulaires, notifications simulées.
   Dépend de dgb-suite.js (DGB), dgb-viz.js (DGB_VIZ) et dgb-demo-parc.js.
   ========================================================================= */
(function () {
  'use strict';
  var D = window.DGB_DEMO, $ = function (s, r) { return (r || document).querySelector(s); }, $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function puce(v) { var t = D.statuts[v]; return t ? '<span class="puce puce-' + t + '">' + esc(v) + '</span>' : esc(v); }
  function maintenant() { var d = new Date(); return ('0' + d.getDate()).slice(-2) + '/' + ('0' + (d.getMonth() + 1)).slice(-2) + '/' + d.getFullYear() + ' ' + ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); }

  /* =======================================================================
     Fenêtre modale générique
     ======================================================================= */
  var modaleActive = null;
  function modale(o) {
    fermerModale();
    var v = document.createElement('div');
    v.className = 'modale-voile';
    v.innerHTML = '<div class="modale" role="dialog" aria-modal="true" aria-labelledby="modale-titre">' +
      '<div class="modale-tete"><span class="rond-ico"><svg class="ico"><use href="#i-' + (o.icone || 'info') + '"/></svg></span><div><h2 id="modale-titre">' + esc(o.titre) + '</h2>' + (o.texte ? '<p>' + o.texte + '</p>' : '') + '</div></div>' +
      '<div class="modale-corps">' + (o.corps || '') + '</div>' +
      '<div class="modale-pied"><button class="bouton-secondaire" type="button" data-modale-annuler>Annuler</button><button class="' + (o.danger ? 'bouton-danger' : 'bouton-primaire') + '" type="button" data-modale-valider>' + esc(o.valider || 'Valider') + '</button></div></div>';
    document.body.appendChild(v);
    modaleActive = { voile: v, retour: document.activeElement };
    v.addEventListener('click', function (e) {
      if (e.target === v || e.target.closest('[data-modale-annuler]')) fermerModale();
      if (e.target.closest('[data-modale-valider]') && o.surValider) o.surValider(v.querySelector('.modale'), fermerModale);
    });
    var premier = v.querySelector('input, select, textarea, [data-modale-valider]');
    setTimeout(function () { premier.focus(); }, 30);
    if (o.surOuvrir) o.surOuvrir(v.querySelector('.modale'));
    return v;
  }
  function fermerModale() {
    if (!modaleActive) return;
    modaleActive.voile.remove();
    if (modaleActive.retour && modaleActive.retour.focus) modaleActive.retour.focus();
    modaleActive = null;
  }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') fermerModale(); });
  function succesDansModale(m, titre, texte) {
    m.querySelector('.modale-tete').remove();
    m.querySelector('.modale-pied').remove();
    m.querySelector('.modale-corps').innerHTML = '<div class="succes-anime"><svg viewBox="0 0 52 52" fill="none"><circle class="anneau" cx="26" cy="26" r="24" stroke="currentColor" stroke-width="3"/><path class="coche" d="M15 27l7.5 7.5L38 19" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg><h2 style="font-size:18px">' + esc(titre) + '</h2><p style="font-size:14px;color:var(--p-600)">' + esc(texte) + '</p></div>';
  }

  /* =======================================================================
     Signature électronique : code à usage unique (démonstration : 315120)
     ======================================================================= */
  var CODE = '315120';
  function demanderCode(objet, surSucces) {
    modale({
      titre: 'Signature électronique sécurisée', icone: 'cle', valider: 'Signer et transmettre',
      texte: 'Un code à usage unique vient d’être envoyé à <b>m.n•••@budget.gouv.ga</b>. Il signe : ' + esc(objet) + '.',
      corps: '<div class="code-otp-app" role="group" aria-label="Code de vérification">' + [1, 2, 3, 4, 5, 6].map(function (i) { return '<input inputmode="numeric" maxlength="1" aria-label="Chiffre ' + i + '"' + (i === 1 ? ' autocomplete="one-time-code"' : '') + '>'; }).join('') + '</div>' +
        '<p class="indice-demo">Démonstration : le code est <b>' + CODE + '</b>. Il reste valable 15 minutes.</p><p class="message-champ" data-otp-erreur hidden>Code incorrect. Vérifiez les six chiffres reçus par e-mail.</p>',
      surOuvrir: function (m) {
        var c = $$('.code-otp-app input', m);
        c.forEach(function (x, i) {
          x.addEventListener('input', function () { x.value = x.value.replace(/\D/g, '').slice(0, 1); if (x.value && c[i + 1]) c[i + 1].focus(); if (c.every(function (y) { return y.value; })) m.querySelector('[data-modale-valider]').click(); });
          x.addEventListener('keydown', function (e) { if (e.key === 'Backspace' && !x.value && c[i - 1]) c[i - 1].focus(); });
          x.addEventListener('paste', function (e) { var t = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, 6); if (!t) return; e.preventDefault(); t.split('').forEach(function (ch, j) { if (c[j]) c[j].value = ch; }); if (t.length === 6) m.querySelector('[data-modale-valider]').click(); });
        });
      },
      surValider: function (m, fermer) {
        var code = $$('.code-otp-app input', m).map(function (x) { return x.value; }).join('');
        if (code !== CODE) {
          m.querySelector('[data-otp-erreur]').hidden = false;
          var g = m.querySelector('.code-otp-app'); g.classList.remove('secoue'); void g.offsetWidth; g.classList.add('secoue');
          DGB.son('erreur');
          $$('.code-otp-app input', m).forEach(function (x) { x.value = ''; }); m.querySelector('.code-otp-app input').focus();
          return;
        }
        succesDansModale(m, 'Signature enregistrée', 'Le dossier est transmis à l’acteur suivant du circuit.');
        DGB.son('validation');
        setTimeout(function () { fermer(); surSucces(); }, 1400);
      }
    });
  }

  /* =======================================================================
     Compteurs (barre latérale, menus, cloche)
     ======================================================================= */
  function compteur(nom, delta, absolu) {
    $$('[data-compteur="' + nom + '"]').forEach(function (c) {
      var n = absolu != null ? absolu : Math.max(0, Number(c.textContent) + delta);
      c.textContent = n; c.hidden = n === 0;
      c.classList.remove('pulse'); void c.offsetWidth; c.classList.add('pulse');
    });
  }

  /* =======================================================================
     Moteur de listes : recherche, filtres par statut, pagination, ajout
     ======================================================================= */
  var PAR_PAGE = 8, etatListes = {};
  function valeursFiltre(cfg) {
    if (cfg.groupes) return Object.keys(cfg.groupes);
    var vus = []; cfg.lignes.forEach(function (l) { if (vus.indexOf(l[cfg.filtre]) < 0) vus.push(l[cfg.filtre]); }); return vus;
  }
  function correspond(cfg, l, filtre) {
    if (!filtre) return true;
    if (cfg.groupes) return cfg.groupes[filtre].indexOf(l[cfg.filtre]) >= 0;
    return l[cfg.filtre] === filtre;
  }
  function rendreListe(hote, nom, filtreInitial) {
    var cfg = D.listes[nom];
    var et = etatListes[nom] = etatListes[nom] || { q: '', filtre: null, page: 1 };
    if (filtreInitial !== undefined) { et.filtre = filtreInitial; et.page = 1; }
    var actions = '<button class="bouton-secondaire" type="button" data-exporter="' + esc(cfg.titre.toLowerCase()) + '"><svg class="ico ico-4"><use href="#i-telecharger"/></svg>Exporter</button>';
    if (cfg.primaire) actions += cfg.primaireVue ? '<a class="bouton-primaire" href="#' + cfg.primaireVue + '"><svg class="ico ico-4"><use href="#i-plus"/></svg>' + esc(cfg.primaire) + '</a>'
      : '<button class="bouton-primaire" type="button" data-ajouter="' + nom + '"><svg class="ico ico-4"><use href="#i-plus"/></svg>' + esc(cfg.primaire) + '</button>';
    var haut = (HAUTS[nom] ? HAUTS[nom]() : '') + rangeeGraphes(nom);
    hote.setAttribute('data-titre', cfg.titre); hote.setAttribute('data-soustitre', cfg.sous);
    hote.innerHTML = '<div class="entete-page"><div class="titres"><h1>' + esc(cfg.titre) + '</h1><p>' + esc(cfg.sous) + '</p></div><div class="actions">' + actions + '</div></div>' + haut +
      '<section class="carte"><div class="barre-filtres"><input class="champ" type="search" placeholder="Rechercher dans ' + esc(cfg.titre.toLowerCase()) + '…" aria-label="Rechercher" data-q value="' + esc(et.q) + '">' +
      '<div class="pastilles-filtre" role="group" aria-label="Filtrer par ' + esc(cfg.colonnes[cfg.filtre].toLowerCase()) + '"></div></div>' +
      '<div class="tableau-zone"><table class="tableau"><thead><tr>' + cfg.colonnes.map(function (c, i) { return '<th' + ((cfg.droite || []).indexOf(i) >= 0 ? ' class="droite"' : '') + '>' + esc(c) + '</th>'; }).join('') + (cfg.lien ? '<th><span class="sr-only">Accès</span></th>' : '') + '</tr></thead><tbody></tbody></table></div>' +
      '<div class="tableau-pied"><span data-total></span><div class="pagination" data-pages></div></div></section>';
    var champ = $('[data-q]', hote);
    champ.addEventListener('input', function () { et.q = champ.value; et.page = 1; corps(); });
    function corps() {
      var q = et.q.trim().toLowerCase();
      var lignes = cfg.lignes.filter(function (l) { return correspond(cfg, l, et.filtre) && (!q || l.join(' ').toLowerCase().indexOf(q) >= 0); });
      var nb = Math.max(1, Math.ceil(lignes.length / PAR_PAGE)); et.page = Math.min(et.page, nb);
      var page = lignes.slice((et.page - 1) * PAR_PAGE, et.page * PAR_PAGE);
      $('tbody', hote).innerHTML = page.length ? page.map(function (l) {
        return '<tr>' + l.map(function (v, i) {
          var cls = i === 0 ? 'reference' : ((cfg.droite || []).indexOf(i) >= 0 ? 'droite' : '');
          var contenu = i === cfg.filtre || D.statuts[v] ? puce(v) : esc(v);
          if (i === 0 && cfg.lien) contenu = '<a href="#' + cfg.lien + '">' + esc(v) + '</a>';
          return '<td' + (cls ? ' class="' + cls + '"' : '') + '>' + contenu + '</td>';
        }).join('') + (cfg.lien ? '<td><a class="bouton-fantome" href="#' + cfg.lien + '" aria-label="Ouvrir ' + esc(l[0]) + '"><svg class="ico ico-4"><use href="#i-fleche"/></svg></a></td>' : '') + '</tr>';
      }).join('') : '<tr class="vide-ligne"><td colspan="' + (cfg.colonnes.length + 1) + '">Aucun résultat. Modifiez la recherche ou retirez le filtre.</td></tr>';
      $('[data-total]', hote).textContent = lignes.length + ' élément' + (lignes.length > 1 ? 's' : '') + (lignes.length !== cfg.lignes.length ? ' sur ' + cfg.lignes.length : '');
      var p = ''; for (var i = 1; i <= nb; i++) p += '<button type="button" data-page="' + i + '"' + (i === et.page ? ' aria-current="true"' : '') + '>' + i + '</button>';
      $('[data-pages]', hote).innerHTML = nb > 1 ? p : '';
      var tous = '<button class="pastille-filtre" type="button" data-filtre="" aria-pressed="' + !et.filtre + '">Tous <span class="nb">' + cfg.lignes.length + '</span></button>';
      $('.pastilles-filtre', hote).innerHTML = tous + valeursFiltre(cfg).map(function (v) {
        var n = cfg.lignes.filter(function (l) { return correspond(cfg, l, v); }).length;
        return '<button class="pastille-filtre" type="button" data-filtre="' + esc(v) + '" aria-pressed="' + (et.filtre === v) + '">' + esc(v) + ' <span class="nb">' + n + '</span></button>';
      }).join('');
    }
    hote.onclick = function (e) {
      var f = e.target.closest('[data-filtre]'); if (f) { et.filtre = f.getAttribute('data-filtre') || null; et.page = 1; corps(); DGB.son('clic'); }
      var pg = e.target.closest('[data-page]'); if (pg) { et.page = Number(pg.getAttribute('data-page')); corps(); }
    };
    corps();
    if (window.DGB_VIZ) DGB_VIZ.rendreTout(hote);
  }
  /* =======================================================================
     Graphes en tête des pages en liste
     Chaque page reçoit une rangée de cartes (même gabarit que Indicateurs).
     Les jeux de données propres au gabarit sont ajoutés à DGB_VIZ.jeux.
     ======================================================================= */
  var J = window.DGB_VIZ ? DGB_VIZ.jeux : {};
  var MOIS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov'];
  var SIX = ['Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov'];
  Object.assign(J, {
    dossiersStatuts: { segments: [{ n: 'À signer', v: 2, c: 'var(--attente-600)' }, { n: 'À contrôler', v: 2, c: 'var(--m-600)' }, { n: 'Saisie en cours', v: 1, c: 'var(--p-400)' }, { n: 'Rejeté', v: 1, c: 'var(--blocage-600)' }, { n: 'Validé', v: 1, c: 'var(--succes-600)' }], centre: '7', sous: 'dossiers' },
    historiqueActeurs: { libelles: ['Marie Ndong', 'Jean Mba', 'Clarisse Ondo', 'Paul Obiang', 'Hervé Nguema'], valeurs: [42, 18, 15, 9, 7], unite: 'actions' },
    affectTypes: { segments: [{ n: 'Nominatives', v: 412, c: 'var(--m-600)' }, { n: 'Transferts', v: 96, c: 'var(--m-300)' }, { n: 'Retours', v: 58, c: 'var(--p-400)' }, { n: 'Prêts', v: 31, c: 'var(--attente-600)' }], centre: '597', sous: 'en 2026' },
    affectDelais: { libelles: SIX, series: [{ n: 'Demandes', v: [44, 39, 58, 66, 52, 48], c: 'viz-trait' }, { n: 'Remises', v: [40, 37, 51, 62, 50, 41], c: 'viz-trait-2' }], max: 80 },
    sitesEquipements: { segments: [{ n: 'Siège DGB', v: 812, c: 'var(--m-600)' }, { n: 'Annexe Arambo', v: 264, c: 'var(--m-300)' }, { n: 'Franceville', v: 118, c: 'var(--m-200)' }, { n: 'Entrepôt Owendo', v: 90, c: 'var(--p-400)' }], centre: '1 284', sous: 'équipements' },
    sitesOccupation: { lignes: [{ n: 'Siège DGB · 6 étages', v: 94, c: 'attente' }, { n: 'Annexe Immeuble Arambo', v: 71, c: '' }, { n: 'Direction provinciale Franceville', v: 58, c: '' }, { n: 'Entrepôt Owendo', v: 22, c: 'succes' }] },
    structuresAgents: { libelles: ['DG', 'DGA', 'DB', 'DAF', 'DSI', 'SOL', 'ARC'], valeurs: [18, 12, 96, 74, 38, 121, 6], unite: 'agents' },
    structuresRatio: { libelles: ['Service de la solde', 'DAF', 'Direction du budget', 'DSI', 'DGA', 'Direction générale'], valeurs: [2.6, 3.6, 2.2, 4.9, 3.4, 3.6], unite: 'équipements par agent' },
    categoriesParc: { segments: [{ n: 'Portables', v: 612, c: 'var(--m-600)' }, { n: 'Écrans', v: 388, c: 'var(--m-300)' }, { n: 'Imprimantes', v: 142, c: 'var(--m-200)' }, { n: 'Réseau', v: 96, c: 'var(--p-400)' }, { n: 'Téléphonie', v: 46, c: 'var(--attente-600)' }], centre: '1 284', sous: 'équipements' },
    circuitsVolume: { libelles: ['Affectation nominative', 'Ticket de maintenance', 'Transfert', 'Réforme', 'Prêt temporaire'], valeurs: [219, 87, 44, 21, 6], unite: 'dossiers' },
    modelesUsage: { libelles: MOIS, valeurs: [61, 58, 72, 66, 80, 91, 64, 57, 84, 96, 78], max: 120, unite: 'documents générés' },
    modelesTypes: { segments: [{ n: 'Procès-verbaux', v: 412, c: 'var(--m-600)' }, { n: 'Notes de service', v: 186, c: 'var(--m-300)' }, { n: 'Bordereaux', v: 132, c: 'var(--m-200)' }, { n: 'Courriers', v: 77, c: 'var(--p-400)' }], centre: '807', sous: 'documents' },
    reglesDelais: { sous: 'délais respectés' },
    reglesRelances: { libelles: SIX, series: [{ n: 'Relances envoyées', v: [34, 28, 41, 37, 30, 26], c: 'viz-v1' }, { n: 'Restées sans suite', v: [6, 5, 8, 4, 3, 2], c: 'viz-attente' }], max: 50 },
    groupesMembres: { libelles: ['Consultation seule', 'Gestionnaires du parc', 'Valideurs DAF', 'Administrateurs SED', 'Contrôleurs'], valeurs: [26, 7, 4, 3, 2], unite: 'membres' },
    groupesSecurite: { lignes: [{ n: 'Comptes avec double vérification', v: 100, c: 'succes' }, { n: 'Mots de passe changés depuis moins de 90 jours', v: 82, c: '' }, { n: 'Comptes actifs ce mois-ci', v: 74, c: '' }, { n: 'Habilitations revues cette année', v: 45, c: 'attente' }] },
    sauvegardesTaille: { libelles: ['13/11', '14/11', '15/11', '16/11', '17/11', '18/11', '19/11'], series: [{ n: 'Taille (Go)', v: [4.5, 4.6, 4.7, 0, 4.7, 4.8, 4.8], c: 'viz-trait' }], max: 6 },
    sauvegardesFiabilite: { sous: 'sauvegardes réussies' }
  });
  /* [titre, sous-titre, type, jeu, étiquette, options] — options : { valeur, large } */
  var GRAPHES = {
    dossiers: [['Dossiers par statut', 'Votre corbeille', 'donut', 'dossiersStatuts', 'Statut'], ['Dossiers au fil du circuit', 'Depuis le 1er janvier', 'entonnoir', 'entonnoir', 'Circuit'], ['Reçus et traités', '6 derniers mois', 'ligne', 'dossiers', 'Flux']],
    historique: [['Actions par agent', '30 derniers jours', 'barres-h', 'historiqueActeurs', 'Acteurs'], ['Activité par jour de la semaine', 'Actions enregistrées', 'chaleur', 'chaleur', 'Activité', { large: true }]],
    affectations: [['Affectations par mois', '2026', 'barres', 'arrivees', 'Volume'], ['Par type d’opération', 'Depuis le 1er janvier', 'donut', 'affectTypes', 'Types'], ['Demandes et remises', '6 derniers mois', 'ligne', 'affectDelais', 'Délais']],
    inventaire: [['État du parc', 'Tous équipements confondus', 'donut', 'etats', 'État'], ['Équipements par structure', 'Parc affecté', 'barres-h', 'services', 'Structures'], ['Coût de maintenance selon l’âge', 'Chaque point est un équipement', 'nuage', 'dispersion', 'Âge']],
    maintenance: [['Interventions par mois', 'Par nature', 'empilees', 'maintenance', 'Volume'], ['Objectifs du plan de maintenance', 'Avancement au 19 novembre', 'progression', 'objectifs', 'Plan'], ['Disponibilité du parc', 'Équipements en état de marche', 'jauge', null, 'Parc', { valeur: 94 }]],
    sites: [['Équipements par site', 'Répartition géographique', 'donut', 'sitesEquipements', 'Sites'], ['Taux d’occupation des locaux', 'Postes occupés', 'progression', 'sitesOccupation', 'Locaux']],
    structures: [['Agents par structure', 'Effectifs affectés', 'barres', 'structuresAgents', 'Effectifs'], ['Équipements par agent', 'Moyenne par structure', 'barres-h', 'structuresRatio', 'Dotation']],
    categories: [['Parc par catégorie', 'Équipements recensés', 'donut', 'categoriesParc', 'Familles'], ['Coût de maintenance selon l’âge', 'Aide au calcul de l’amortissement', 'nuage', 'dispersion', 'Âge']],
    circuits: [['Dossiers par circuit', 'Depuis le 1er janvier', 'barres-h', 'circuitsVolume', 'Volume'], ['Délai moyen par étape', 'En jours, 2025 et 2026', 'groupees', 'delais', 'Délais'], ['Dossiers au fil du circuit', 'Taux de passage', 'entonnoir', 'entonnoir', 'Circuit']],
    modeles: [['Documents générés par mois', '2026', 'barres', 'modelesUsage', 'Volume'], ['Par type de modèle', 'Depuis le 1er janvier', 'donut', 'modelesTypes', 'Types']],
    regles: [['Respect des délais', 'Toutes règles confondues', 'jauge', 'reglesDelais', 'Délais', { valeur: 87 }], ['Relances automatiques', '6 derniers mois', 'groupees', 'reglesRelances', 'Relances', { large: true }]],
    groupes: [['Membres par groupe', 'Comptes actifs', 'barres-h', 'groupesMembres', 'Groupes'], ['Hygiène des comptes', 'Contrôles de sécurité', 'progression', 'groupesSecurite', 'Sécurité'], ['Qualité de service', 'Indice sur 100', 'radar', 'radar', 'Synthèse']],
    sauvegardes: [['Taille des sauvegardes', '7 derniers jours, en Go', 'ligne', 'sauvegardesTaille', 'Volume', { large: true }], ['Fiabilité', '30 derniers jours', 'jauge', 'sauvegardesFiabilite', 'Contrôle', { valeur: 96 }]]
  };
  function rangeeGraphes(nom) {
    var g = GRAPHES[nom];
    if (!g) return '';
    return '<div class="viz-grille">' + g.map(function (c) {
      var o = c[5] || {};
      return '<article class="viz-carte' + (o.large ? ' viz-large' : '') + '"><div class="viz-tete"><div><h3>' + esc(c[0]) + '</h3><p>' + esc(c[1]) + '</p></div><span class="viz-tag">' + esc(c[4]) + '</span></div>' +
        '<div class="viz-corps"><div data-graphe="' + c[2] + '"' + (c[3] ? ' data-jeu="' + c[3] + '"' : '') + (o.valeur != null ? ' data-valeur="' + o.valeur + '"' : '') + ' data-titre="' + esc(c[0]) + '"></div></div></article>';
    }).join('') + '</div>';
  }

  /* Blocs propres à certaines listes, au-dessus du tableau */
  var HAUTS = {
    inventaire: function () {
      return '<section class="statistiques"><div class="statistique"><span class="etiquette">Portables</span><div class="valeur">612</div><div class="detail">48 en stock</div></div>' +
        '<div class="statistique"><span class="etiquette">Écrans et périphériques</span><div class="valeur">388</div><div class="detail">21 en stock</div></div>' +
        '<div class="statistique"><span class="etiquette">Imprimantes</span><div class="valeur ton-attente">142</div><div class="detail">9 en maintenance</div></div>' +
        '<div class="statistique"><span class="etiquette">À réformer</span><div class="valeur ton-blocage">20</div><div class="detail">dossier REF-2026-0021</div></div></section>';
    }
  };
  /* Liste courte du tableau de bord */
  function listeCourte(hote, nom) {
    var cfg = D.listes[nom];
    hote.innerHTML = '<div class="tableau-zone"><table class="tableau"><thead><tr>' + cfg.colonnes.map(function (c, i) { return '<th' + ((cfg.droite || []).indexOf(i) >= 0 ? ' class="droite"' : '') + '>' + esc(c) + '</th>'; }).join('') + '<th><span class="sr-only">Accès</span></th></tr></thead><tbody>' +
      cfg.lignes.slice(0, 5).map(function (l) { return '<tr>' + l.map(function (v, i) { return '<td class="' + (i === 0 ? 'reference' : ((cfg.droite || []).indexOf(i) >= 0 ? 'droite' : '')) + '">' + (i === cfg.filtre ? puce(v) : esc(v)) + '</td>'; }).join('') + '<td><a class="bouton-fantome" href="#dossier" aria-label="Ouvrir ' + esc(l[0]) + '"><svg class="ico ico-4"><use href="#i-fleche"/></svg></a></td></tr>'; }).join('') + '</tbody></table></div>';
  }

  /* Ajout générique depuis une liste */
  function ajouter(nom) {
    var cfg = D.listes[nom];
    var champs = cfg.champs || [[cfg.colonnes[1], 'text', '']];
    modale({
      titre: cfg.primaire, icone: 'plus', valider: 'Enregistrer',
      texte: 'L’élément sera ajouté en tête de la liste « ' + esc(cfg.titre) + ' ».',
      corps: champs.map(function (c, i) {
        var id = 'aj-' + i, ctrl = c[1] === 'select' ? '<select class="champ" id="' + id + '">' + c[2].split('|').map(function (o) { return '<option>' + esc(o) + '</option>'; }).join('') + '</select>'
          : '<input class="champ" id="' + id + '" placeholder="' + esc(c[2]) + '">';
        return '<div><label class="etiquette" for="' + id + '">' + esc(c[0]) + ' *</label>' + ctrl + '<p class="message-champ" hidden>Ce champ est obligatoire.</p></div>';
      }).join(''),
      surValider: function (m, fermer) {
        var ok = true, valeurs = {};
        champs.forEach(function (c, i) {
          var x = m.querySelector('#aj-' + i), vide = !x.value.trim();
          x.classList.toggle('champ-erreur', vide); x.nextElementSibling.hidden = !vide; if (vide) ok = false; valeurs[c[0]] = x.value.trim();
        });
        if (!ok) { DGB.son('erreur'); return; }
        var ref = (cfg.lignes[0][0].match(/^[A-Z]+-\d{4}-/) || [''])[0];
        var ligne = cfg.colonnes.map(function (col, i) {
          if (valeurs[col]) return valeurs[col];
          if (i === 0) return ref ? ref + String(Math.floor(500 + Math.random() * 400)).padStart(4, '0') : valeurs[champs[0][0]];
          if (i === cfg.filtre) return cfg.groupes ? cfg.groupes[Object.keys(cfg.groupes)[0]][0] : (D.statuts['En attente'] && valeursFiltre(cfg).indexOf('En attente') >= 0 ? 'En attente' : valeursFiltre(cfg)[0]);
          if (/date|le$/i.test(col)) return maintenant().slice(0, 10);
          return '—';
        });
        cfg.lignes.unshift(ligne);
        succesDansModale(m, 'Enregistré', ligne[0] + ' a été ajouté.');
        DGB.son('validation');
        setTimeout(function () { fermer(); route(); DGB.toast({ ton: 'succes', titre: cfg.primaire + ' enregistrée', texte: ligne[0] + ' · ' + cfg.titre, son: false }); }, 1100);
      }
    });
  }

  /* =======================================================================
     Pages spécifiques
     ======================================================================= */
  function rendreUtilisateurs() {
    var q = ($('#util-recherche').value || '').toLowerCase();
    $('#util-cartes').innerHTML = D.utilisateurs.filter(function (u) { return !q || u.join(' ').toLowerCase().indexOf(q) >= 0; }).map(function (u) {
      return '<article class="carte carte-utilisateur"><div class="tete"><span class="av">' + u[0] + '</span><div><b>' + esc(u[1]) + '</b><small>' + esc(u[2]) + '</small></div></div>' +
        '<div style="display:flex;justify-content:space-between;align-items:center"><span class="puce puce-neutre sans-point">' + esc(u[3]) + '</span>' + puce(u[4]) + '</div></article>';
    }).join('') || '<p style="color:var(--p-500)">Aucun agent ne correspond à cette recherche.</p>';
  }
  function rendreAudit() {
    $('#audit-liste').innerHTML = D.audit.map(function (a) { return '<li><span class="pt"><svg class="ico"><use href="#i-' + a[0] + '"/></svg></span><span><b>' + esc(a[1]) + '</b><small>' + esc(a[2]) + '</small></span><time>' + a[3] + '</time></li>'; }).join('');
  }
  function rendreApparence() {
    var h = '';
    DGB.reglages.forEach(function (r) {
      if (['mode', 'app', 'neutre', 'densite', 'nav'].indexOf(r.cle) < 0) return;
      h += '<div class="reglage"><span class="titre">' + r.titre + '</span><div class="options" style="grid-template-columns:repeat(' + (r.pastilles ? 6 : Math.min(r.options.length, 4)) + ',minmax(0,1fr))">' + r.options.map(function (o) {
        var vis = r.pastilles ? '<span class="pastille" style="background:' + o[2] + '"></span>' : '<svg class="ico"><use href="#i-' + o[2] + '"/></svg>';
        var actif = (r.cle === 'mode' ? (document.documentElement.getAttribute('data-mode-choisi') || document.documentElement.getAttribute('data-mode')) : document.documentElement.getAttribute(r.attr)) === o[0];
        return '<button class="option" type="button" data-reglage="' + r.cle + '" data-valeur="' + o[0] + '" aria-pressed="' + actif + '">' + vis + o[1] + '</button>';
      }).join('') + '</div></div>';
    });
    $('#par-apparence-corps').innerHTML = h;
  }

  /* =======================================================================
     Notifications : menu, page, arrivées simulées
     ======================================================================= */
  var ICO = { attente: 'horloge', succes: 'traiter', info: 'info', erreur: 'alerte' };
  var COULEUR = { attente: 'var(--attente-600)', succes: 'var(--succes-600)', info: 'var(--m-500)', erreur: 'var(--blocage-600)' };
  function rendreNotifs() {
    var nonLues = D.notifications.filter(function (n) { return n[4]; }).length;
    compteur('notifs', 0, nonLues);
    $$('[data-notif-menu]').forEach(function (z) {
      z.innerHTML = D.notifications.slice(0, 4).map(function (n) {
        return '<a class="menu-item" href="#notifications" style="border-left:4px solid ' + (n[4] ? COULEUR[n[0]] : 'transparent') + '"><span><b style="font-weight:' + (n[4] ? 600 : 500) + ';color:var(--encre)">' + esc(n[1]) + '</b><small>' + esc(n[3]) + '</small></span></a>';
      }).join('');
    });
    var page = $('#notif-page');
    if (page) page.innerHTML = D.notifications.map(function (n, i) {
      return '<li class="' + (n[4] ? 'non-lue' : '') + '" style="padding:10px;border-radius:6px"><span class="pt" style="color:' + COULEUR[n[0]] + '"><svg class="ico"><use href="#i-' + ICO[n[0]] + '"/></svg></span><span><b>' + esc(n[1]) + '</b><small>' + esc(n[2]) + '</small></span><time>' + esc(n[3]) + '</time></li>';
    }).join('');
  }
  var prochaine = 0;
  function arrivee() {
    var a = D.arrivees[prochaine++ % D.arrivees.length];
    D.notifications.unshift([a[0], a[1], a[2], 'à l’instant', true]);
    rendreNotifs();
    $$('[data-cloche]').forEach(function (b) { b.classList.remove('sonne'); void b.offsetWidth; b.classList.add('sonne'); });
    DGB.toast({ ton: a[0] === 'succes' ? 'succes' : (a[0] === 'info' ? 'info' : 'attente'), titre: a[1], texte: a[2], son: 'notification' });
  }

  /* =======================================================================
     Routage
     ======================================================================= */
  var ALIAS = {
    'inventaire-portables': ['inventaire', 'Portables'], 'inventaire-ecrans': ['inventaire', 'Écrans'], 'inventaire-imprimantes': ['inventaire', 'Imprimantes'],
    'affectations-en-cours': ['affectations', 'En cours'], 'affectations-historique': ['affectations', 'Historique'],
    'maintenance-tickets': ['maintenance', 'Ticket'], 'maintenance-contrats': ['maintenance', 'Contrat'],
    'securite': ['parametres', 'securite'], 'parametres-general': ['parametres', 'general'], 'parametres-notifs': ['parametres', 'notifs'], 'parametres-apparence': ['parametres', 'apparence'],
    'dossiers-controle': ['dossiers', 'À contrôler'], 'dossiers-rejetes': ['dossiers', 'Rejeté'], 'dossiers-brouillons': ['dossiers', 'Saisie en cours'],
    'inventaire-reseau': ['inventaire', 'Réseau'], 'structures-actives': ['structures', 'Actif'], 'structures-inactives': ['structures', 'Inactif'],
    'circuits-actifs': ['circuits', 'Actif'], 'circuits-brouillons': ['circuits', 'Brouillon']
  };
  function route() {
    var h = location.hash.slice(1) || 'tableau-de-bord';
    var alias = ALIAS[h], nom = alias ? alias[0] : h;
    var vue = $('[data-vue="' + nom + '"]');
    if (!vue) { nom = h = 'tableau-de-bord'; vue = $('[data-vue="tableau-de-bord"]'); alias = null; }
    $$('[data-vue]').forEach(function (s) { s.hidden = s !== vue; });

    if (vue.hasAttribute('data-liste')) rendreListe(vue, vue.getAttribute('data-liste'), alias ? alias[1] : (ALIAS[h] ? undefined : null));
    if (nom === 'utilisateurs') rendreUtilisateurs();
    if (nom === 'audit') rendreAudit();
    if (nom === 'parametres') { rendreApparence(); var onglet = $('#tp-' + (alias ? alias[1] : 'general')); if (onglet) onglet.click(); }
    if (nom === 'aide') $('#liste-raccourcis').innerHTML = RACCOURCIS.map(function (r) { return '<div class="raccourci"><span>' + esc(r[1]) + '</span><span>' + r[0].map(function (k) { return '<kbd>' + esc(k) + '</kbd>'; }).join('') + '</span></div>'; }).join('');
    if (nom === 'notifications') rendreNotifs();
    if (nom === 'tableau-de-bord') listeCourte($('[data-liste-courte]'), 'dossiers');
    if (window.DGB_VIZ && !vue.hasAttribute('data-liste')) DGB_VIZ.rendreTout(vue);
    $$('.statistique .valeur', vue).forEach(function (v) { if (window.DGB_VIZ) DGB_VIZ.compter(v); });

    /* lien actif, section, module, sous-navigation */
    $$('[data-vue-lien]').forEach(function (a) { a.classList.toggle('actif', a.getAttribute('data-vue-lien') === h || (!ALIAS[h] && a.getAttribute('data-vue-lien') === nom)); a.toggleAttribute('aria-current', a.classList.contains('actif')); });
    var lien = $('.laterale [data-vue-lien="' + h + '"]') || $('.laterale [data-vue-lien="' + nom + '"]');
    /* Sous-menus : on repère la page parente de chaque sous-page, pour l'option « Page active » */
    $$('.section-liens').forEach(function (bloc) {
      var parent = null, groupe = [];
      function clore() { if (!parent) return; var ouvert = parent.classList.contains('actif') || groupe.some(function (x) { return x.classList.contains('actif'); }); parent.classList.toggle('parent-ouvert', ouvert && groupe.length > 0); groupe.forEach(function (x) { x.classList.toggle('visible', ouvert); }); }
      Array.prototype.forEach.call(bloc.children, function (el) { if (el.classList.contains('sous')) groupe.push(el); else { clore(); parent = el; groupe = []; } });
      clore();
    });
    /* Le lien actif est ramené dans la partie visible de la barre latérale, sans faire défiler la page */
    if (lien) setTimeout(function () { var nav = $('.laterale nav'), r = lien.getBoundingClientRect(), n = nav.getBoundingClientRect(); if (r.top < n.top + 8 || r.bottom > n.bottom - 8) nav.scrollTop += r.top - n.top - n.height / 2 + r.height / 2; }, 60);
    var section = lien ? lien.closest('[data-section]') : $('[data-section="Pilotage"]');
    if (lien && section) { var b = $('.section-tete', section); if (b.getAttribute('aria-expanded') === 'false') b.click(); }
    var nomSection = section ? section.getAttribute('data-section') : 'Pilotage';
    $$('.module[data-module]').forEach(function (m) { m.classList.toggle('actif', m.getAttribute('data-module') === nomSection); });
    $('#sous-nav-liens').setAttribute('aria-label', nomSection);
    $('#sous-nav-liens').innerHTML = section ? $$('.lien-nav[data-vue-lien]:not(.sous)', section).map(function (a) {
      var v = a.getAttribute('data-vue-lien');
      return '<a href="#' + v + '"' + (v === nom ? ' class="actif"' : '') + '>' + esc($('.texte', a).textContent) + '</a>';
    }).join('') : '';

    /* barre d'application (disposition sidebar) */
    $('[data-barre-titre]').textContent = vue.getAttribute('data-titre') || '';
    $('[data-barre-soustitre]').textContent = vue.getAttribute('data-soustitre') || '';
    var act = $('.entete-page .actions', vue);
    $('[data-barre-actions]').innerHTML = act ? act.innerHTML : '';
    document.title = (vue.getAttribute('data-titre') || 'Gestion du parc') + ' · Gestion du parc';
    $('.app').classList.remove('menu-ouvert');
    var cont = $('#contenu'); if (cont && window.scrollY > 120) window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  window.addEventListener('hashchange', route);

  /* =======================================================================
     Interactions
     ======================================================================= */
  document.addEventListener('click', function (e) {
    var t;
    if ((t = e.target.closest('[data-exporter]'))) { DGB.toast({ ton: 'info', titre: 'Export en préparation', texte: 'Le fichier « ' + t.getAttribute('data-exporter') + ' » sera prêt dans quelques secondes.', son: 'clic' }); setTimeout(function () { DGB.toast({ ton: 'succes', titre: 'Export terminé', texte: 'Le fichier « ' + t.getAttribute('data-exporter') + ' » est disponible dans vos téléchargements.' }); }, 1800); }
    if ((t = e.target.closest('[data-ajouter]'))) ajouter(t.getAttribute('data-ajouter'));
    if ((t = e.target.closest('[data-enregistrer]'))) DGB.toast({ ton: 'succes', titre: 'Modifications enregistrées', texte: 'Les ' + t.getAttribute('data-enregistrer') + ' sont à jour.' });
    if ((t = e.target.closest('[data-tester-son]'))) DGB.son(t.getAttribute('data-tester-son'));
    if (e.target.closest('[data-tout-lu]')) { D.notifications.forEach(function (n) { n[4] = false; }); rendreNotifs(); DGB.toast({ ton: 'info', titre: 'Notifications lues', texte: 'Toutes les notifications sont marquées comme lues.', son: 'clic', duree: 2500 }); }
    if (e.target.closest('[data-simuler-notif]')) arrivee();
    if ((t = e.target.closest('[data-fonction]'))) {
      var f = t.getAttribute('data-fonction');
      $$('[data-fonction-active]').forEach(function (x) { x.textContent = f; });
      $$('[data-fonction]').forEach(function (x) { x.querySelector('svg').style.opacity = x.getAttribute('data-fonction') === f ? 1 : 0; });
      DGB.toast({ ton: 'info', titre: 'Fonction changée', texte: 'Vous travaillez maintenant en tant que ' + f + '.', son: 'clic' });
    }
    if (e.target.closest('[data-ajout-utilisateur]')) {
      modale({ titre: 'Inviter un agent', icone: 'utilisateurs', valider: 'Envoyer l’invitation', texte: 'L’agent reçoit un e-mail pour activer son compte.',
        corps: '<div><label class="etiquette" for="inv-nom">Prénom et nom *</label><input class="champ" id="inv-nom"></div><div><label class="etiquette" for="inv-mail">Adresse e-mail professionnelle *</label><input class="champ" id="inv-mail" type="email" placeholder="prenom.nom@budget.gouv.ga"></div><div><label class="etiquette" for="inv-fonction">Fonction</label><select class="champ" id="inv-fonction"><option>Agent de saisie</option><option>Gestionnaire du parc</option><option>Valideur des affectations</option><option>Consultation seule</option></select></div>',
        surValider: function (m, fermer) {
          var nom = m.querySelector('#inv-nom').value.trim(), mail = m.querySelector('#inv-mail').value.trim();
          var okNom = !!nom, okMail = /^[^@\s]+@budget\.gouv\.ga$/i.test(mail);
          m.querySelector('#inv-nom').classList.toggle('champ-erreur', !okNom); m.querySelector('#inv-mail').classList.toggle('champ-erreur', !okMail);
          if (!okNom || !okMail) { DGB.son('erreur'); DGB.toast({ ton: 'erreur', titre: 'Invitation incomplète', texte: okMail ? 'Indiquez le nom de l’agent.' : 'L’adresse doit se terminer par @budget.gouv.ga.', son: false }); return; }
          var init = nom.split(/\s+/).map(function (p) { return p[0]; }).join('').slice(0, 2).toUpperCase();
          D.utilisateurs.unshift([init, nom, m.querySelector('#inv-fonction').value, 'DSI', 'En attente']);
          succesDansModale(m, 'Invitation envoyée', mail); DGB.son('validation');
          setTimeout(function () { fermer(); rendreUtilisateurs(); }, 1100);
        } });
    }
    if ((t = e.target.closest('[data-action="sauvegarde"]'))) { /* réservé */ }
  });
  document.addEventListener('input', function (e) {
    if (e.target.id === 'util-recherche') rendreUtilisateurs();
    if (e.target.id === 'mdp-nouveau') {
      var v = e.target.value, n = 0;
      if (v.length >= 8) n++; if (v.length >= 12) n++; if (/[A-Z]/.test(v) && /\d/.test(v)) n++; if (/[^A-Za-z0-9]/.test(v)) n++;
      $('#force-mdp').setAttribute('data-niveau', v ? Math.max(1, n) : 0);
      $('#force-texte').textContent = !v ? '12 caractères au moins, avec majuscules, chiffres et symboles.' : ['Trop faible', 'Trop faible', 'Moyen', 'Bon', 'Excellent'][n] + ' · ' + v.length + ' caractères';
    }
  });
  document.addEventListener('change', function (e) {
    if (e.target.id === 'par-sons') DGB.choisir('sons', e.target.checked ? 'actifs' : 'muets');
    if (e.target.classList.contains('interrupteur') && e.target.id !== 'par-sons') DGB.toast({ ton: 'info', titre: 'Préférence enregistrée', texte: e.target.closest('.ligne-reglage').querySelector('b').textContent + (e.target.checked ? ' : activé' : ' : désactivé'), son: 'clic', duree: 2400 });
    if (e.target.id === 'indic-periode') DGB_VIZ.rendreTout($('[data-vue="indicateurs"]'));
  });
  document.addEventListener('dgb:sons', function (e) { var c = $('#par-sons'); if (c) c.checked = e.detail !== 'muets'; });

  /* Bouton « Lancer une sauvegarde » de la liste dédiée */
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-ajouter="sauvegardes"]'); if (!b) return;
    e.stopImmediatePropagation(); fermerModale();
    b.disabled = true; b.innerHTML = '<svg class="ico ico-4"><use href="#i-horloge"/></svg>Sauvegarde en cours…';
    DGB.toast({ ton: 'attente', titre: 'Sauvegarde lancée', texte: 'Copie complète de la base et des pièces jointes.', son: 'clic' });
    setTimeout(function () {
      D.listes.sauvegardes.lignes.unshift([maintenant(), 'Manuelle', '4,8 Go', '3 s (démo)', 'Réussie']);
      DGB.toast({ ton: 'succes', titre: 'Sauvegarde terminée', texte: '4,8 Go copiés et vérifiés.' }); route();
    }, 2600);
  }, true);

  /* ---------- Dossier : signer ou annuler la prévalidation ---------- */
  document.addEventListener('change', function (e) {
    if (e.target.name !== 'action') return;
    var annuler = e.target.value === 'annuler';
    $('#commentaire-oblig').textContent = annuler ? '(obligatoire pour une annulation)' : '(facultatif)';
    $('#dossier-confirmer').className = annuler ? 'bouton-danger' : 'bouton-primaire';
  });
  var dossierSigne = false;
  document.addEventListener('click', function (e) {
    if (!e.target.closest('#dossier-confirmer')) return;
    var action = ($('input[name="action"]:checked') || {}).value;
    var com = $('#commentaire');
    if (action === 'annuler') {
      if (!com.value.trim()) { com.classList.add('champ-erreur'); com.focus(); DGB.son('erreur'); DGB.toast({ ton: 'erreur', titre: 'Motif manquant', texte: 'Indiquez pourquoi vous annulez la prévalidation.', son: false }); return; }
      com.classList.remove('champ-erreur');
      modale({ titre: 'Annuler la prévalidation ?', icone: 'alerte', danger: true, valider: 'Annuler la prévalidation', texte: 'Le dossier AFF-2026-0412 revient à l’étape de saisie. Motif : « ' + esc(com.value.trim()) + ' ».',
        surValider: function (m, fermer) { fermer(); appliquerDossier('annule', com.value.trim()); DGB.toast({ ton: 'attente', titre: 'Prévalidation annulée', texte: 'AFF-2026-0412 revient à la saisie.' }); } });
      return;
    }
    demanderCode('le dossier AFF-2026-0412', function () { appliquerDossier('signe', com.value.trim()); });
  });
  function appliquerDossier(etat, commentaire) {
    var etapes = $$('#dossier-parcours li');
    if (etat === 'signe') {
      dossierSigne = true;
      etapes[2].className = 'faite'; etapes[2].querySelector('.rond').innerHTML = '<svg class="ico ico-4"><use href="#i-coche"/></svg>'; etapes[2].querySelector('.detail').textContent = maintenant().slice(0, 10);
      etapes[3].className = 'encours';
      $('#dossier-puce').className = 'puce puce-info'; $('#dossier-puce').textContent = 'À contrôler';
      $('#dossier-etat').textContent = 'Dossier signé et transmis à la DAF pour contrôle.';
      $('#dossier-bandeau').className = 'bandeau bandeau-info'; $('#dossier-bandeau').innerHTML = '<svg class="ico"><use href="#i-traiter"/></svg><span>Aucune action de votre part n’est attendue : le dossier est chez le contrôleur de la DAF.</span>';
      compteur('signer', -1); compteur('dossiers', -1);
      D.listes.dossiers.lignes[0][3] = 'Contrôle'; D.listes.dossiers.lignes[0][5] = 'À contrôler';
      var tr = $('#signer-lignes tr[data-ref="AFF-2026-0412"]'); if (tr) tr.remove();
      DGB.toast({ ton: 'succes', titre: 'AFF-2026-0412 signé', texte: 'Transmis à la DAF pour contrôle.', son: false });
    } else {
      etapes[1].className = 'encours'; etapes[1].querySelector('.rond').textContent = '2'; etapes[2].className = '';
      $('#dossier-puce').className = 'puce puce-neutre'; $('#dossier-puce').textContent = 'Saisie en cours';
      $('#dossier-etat').textContent = 'Prévalidation annulée : le dossier est revenu à la saisie.';
      compteur('signer', -1);
    }
    $('#dossier-choix').hidden = true; $('#dossier-commentaire').hidden = true; $('#dossier-confirmer').hidden = true;
    $('#dossier-historique').insertAdjacentHTML('afterbegin', '<tr><td class="reference">' + (etat === 'signe' ? 'Signature et transmission électronique' : 'Annulation de la prévalidation') + '</td><td>' + esc(commentaire || '—') + '</td><td>Marie Ndong</td><td class="droite">' + maintenant() + '</td></tr>');
    D.listes.historique.lignes.unshift([maintenant(), 'AFF-2026-0412', etat === 'signe' ? 'Signature et transmission électronique' : 'Annulation de la prévalidation', 'Marie Ndong', etat === 'signe' ? 'Transféré' : 'En attente']);
    route();
  }

  /* ---------- À signer : sélection multiple ---------- */
  function majSelection() {
    var cases = $$('#signer-lignes .case-tableau'), choisies = cases.filter(function (c) { return c.checked; });
    cases.forEach(function (c) { c.closest('tr').classList.toggle('ligne-choisie', c.checked); });
    $('#signer-barre').classList.toggle('visible', choisies.length > 0);
    $('#signer-nb').textContent = choisies.length + ' dossier' + (choisies.length > 1 ? 's sélectionnés' : ' sélectionné');
    $$('#signer-selection, [data-barre-actions] #signer-selection').forEach(function (b) { b.disabled = !choisies.length; b.lastChild.textContent = choisies.length ? 'Signer la sélection (' + choisies.length + ')' : 'Signer la sélection'; });
    $('#signer-tout').checked = cases.length > 0 && choisies.length === cases.length;
  }
  document.addEventListener('change', function (e) {
    if (e.target.id === 'signer-tout') { $$('#signer-lignes .case-tableau').forEach(function (c) { c.checked = e.target.checked; }); majSelection(); }
    else if (e.target.closest('#signer-lignes')) majSelection();
  });
  document.addEventListener('click', function (e) {
    if (e.target.closest('#signer-tout-retirer')) { $$('#signer-lignes .case-tableau').forEach(function (c) { c.checked = false; }); majSelection(); }
    if (!e.target.closest('#signer-selection')) return;
    var lignes = $$('#signer-lignes tr').filter(function (tr) { return tr.querySelector('.case-tableau').checked; });
    var refs = lignes.map(function (tr) { return tr.getAttribute('data-ref'); });
    demanderCode(refs.length > 1 ? refs.length + ' dossiers (' + refs.join(', ') + ')' : 'le dossier ' + refs[0], function () {
      lignes.forEach(function (tr) { tr.remove(); });
      compteur('signer', -refs.length);
      if (refs.indexOf('AFF-2026-0412') >= 0 && !dossierSigne) { appliquerDossier('signe', ''); location.hash = 'signer'; }
      majSelection();
      if (!$$('#signer-lignes tr').length) $('#signer-lignes').innerHTML = '<tr class="vide-ligne"><td colspan="6">Plus aucun dossier à signer. Beau travail.</td></tr>';
      DGB.toast({ ton: 'succes', titre: refs.length + ' signature' + (refs.length > 1 ? 's' : '') + ' enregistrée' + (refs.length > 1 ? 's' : ''), texte: refs.join(', ') + ' · transmis au contrôle', son: false });
    });
  });

  /* ---------- Nouvel équipement : validation en direct ---------- */
  var form = $('#form-equipement');
  function verifierChamp(x) {
    var ok = x.checkValidity() && (x.id !== 'eq-valeur' || /^\d[\d\s]*$/.test(x.value.trim()));
    x.classList.toggle('champ-erreur', !ok);
    var msg = x.parentElement.querySelector('.message-champ');
    if (!ok && !msg) { msg = document.createElement('p'); msg.className = 'message-champ'; x.insertAdjacentElement('afterend', msg); }
    if (msg) { msg.hidden = ok; msg.textContent = x.validity.valueMissing ? 'Ce champ est obligatoire.' : (x.id === 'eq-serie' ? 'Au moins 6 lettres ou chiffres, sans espace.' : 'Indiquez un montant en chiffres.'); }
    return ok;
  }
  form.addEventListener('blur', function (e) { if (e.target.matches('[required]')) verifierChamp(e.target); }, true);
  form.addEventListener('input', function (e) {
    if (e.target.id === 'eq-valeur') { var n = e.target.value.replace(/\D/g, ''); e.target.value = n ? Number(n).toLocaleString('fr-FR') : ''; }
    if (e.target.classList.contains('champ-erreur')) verifierChamp(e.target);
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var champs = $$('[required]', form), ok = champs.map(verifierChamp).every(Boolean);
    if (!ok) { DGB.son('erreur'); DGB.toast({ ton: 'erreur', titre: 'Formulaire incomplet', texte: champs.filter(function (c) { return c.classList.contains('champ-erreur'); }).length + ' champ(s) à corriger avant l’enregistrement.', son: false }); champs.filter(function (c) { return c.classList.contains('champ-erreur'); })[0].focus(); return; }
    var cat = $('#eq-categorie').value, code = { 'Portables': 'PC', 'Écrans': 'EC', 'Imprimantes': 'IM', 'Réseau': 'RS' }[cat];
    var num = 'DGB-' + code + '-0' + Math.floor(2900 + Math.random() * 90);
    var garantie = $('#eq-garantie').value ? $('#eq-garantie').value.split('-').reverse().join('/') : '—';
    D.listes.inventaire.lignes.unshift([num, $('#eq-nom').value.trim(), cat, $('#eq-agent').value.trim() || '—', $('#eq-structure').value || 'DSI', garantie, $('#eq-structure').value ? 'En service' : 'En stock']);
    DGB.toast({ ton: 'succes', titre: 'Équipement enregistré', texte: num + ' · ' + $('#eq-nom').value.trim() + ' ajouté à l’inventaire.' });
    form.reset(); $('#eq-date').value = '2026-11-19';
    etatListes.inventaire = { q: '', filtre: null, page: 1 };
    location.hash = 'inventaire';
  });

  /* ---------- Profil : mot de passe ---------- */
  $('#form-mdp').addEventListener('submit', function (e) {
    e.preventDefault();
    var a = $('#mdp-actuel'), n = $('#mdp-nouveau'), c = $('#mdp-confirme'), niveau = Number($('#force-mdp').getAttribute('data-niveau'));
    [a, n, c].forEach(function (x) { x.classList.remove('champ-erreur'); });
    var erreur = !a.value ? [a, 'Saisissez votre mot de passe actuel.'] : (niveau < 3 ? [n, 'Choisissez un mot de passe plus robuste (niveau « Bon » au moins).'] : (n.value !== c.value ? [c, 'Les deux mots de passe ne correspondent pas.'] : null));
    if (erreur) { erreur[0].classList.add('champ-erreur'); erreur[0].focus(); DGB.son('erreur'); DGB.toast({ ton: 'erreur', titre: 'Mot de passe non modifié', texte: erreur[1], son: false }); return; }
    e.target.reset(); $('#force-mdp').setAttribute('data-niveau', 0);
    DGB.toast({ ton: 'succes', titre: 'Mot de passe mis à jour', texte: 'Il sera demandé à votre prochaine connexion. Vos autres sessions sont fermées.' });
  });

  /* ---------- Compte : fonction, raccourcis, déconnexion, aide ---------- */
  var RACCOURCIS = [
    [['Ctrl', 'K'], 'Ouvrir la palette de commandes'],
    [['?'], 'Afficher les raccourcis clavier'],
    [['↑', '↓'], 'Se déplacer dans la palette ou un sous-menu'],
    [['Entrée'], 'Ouvrir l’élément choisi'],
    [['Échap'], 'Fermer un menu, une fenêtre ou le panneau'],
    [['Alt', 'N'], 'Afficher les notifications'],
    [['Alt', 'S'], 'Aller aux dossiers à signer']
  ];
  function fenetreRaccourcis() {
    modale({ titre: 'Raccourcis clavier', icone: 'cle', valider: 'Compris',
      corps: RACCOURCIS.map(function (r) { return '<div class="raccourci"><span>' + esc(r[1]) + '</span><span>' + r[0].map(function (k) { return '<kbd>' + esc(k) + '</kbd>'; }).join('') + '</span></div>'; }).join(''),
      surValider: function (m, fermer) { fermer(); } });
  }
  document.addEventListener('keydown', function (e) {
    var saisie = /input|textarea|select/i.test(e.target.tagName) || e.target.isContentEditable;
    if (saisie) return;
    if (e.key === '?') { e.preventDefault(); fenetreRaccourcis(); }
    if (e.altKey && e.key.toLowerCase() === 'n') { e.preventDefault(); location.hash = 'notifications'; }
    if (e.altKey && e.key.toLowerCase() === 's') { e.preventDefault(); location.hash = 'signer'; }
  });
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-raccourcis]')) fenetreRaccourcis();
    if (e.target.closest('[data-changer-fonction]')) {
      var active = ($('[data-fonction-active]') || {}).textContent;
      var fonctions = [['Gestionnaire du parc · DSI', 'GEST_DSI'], ['Valideur des affectations · DAF', 'VAL_DAF']];
      modale({ titre: 'Changer de fonction', icone: 'echange', valider: 'Changer',
        texte: 'Les menus et les dossiers affichés s’adaptent à la fonction choisie.',
        corps: '<div style="display:grid;gap:8px">' + fonctions.map(function (f, i) {
          return '<label class="choix"><input type="radio" name="fct-modale" value="' + esc(f[0]) + '"' + (f[0] === active || (!active && !i) ? ' checked' : '') + '>' + esc(f[0]) + '<span style="margin-left:auto;font-size:11px;color:var(--p-500)">' + f[1] + '</span></label>';
        }).join('') + '</div>',
        surValider: function (m, fermer) {
          var v = m.querySelector('input:checked').value; fermer();
          var b = $('[data-fonction="' + v + '"]'); if (b) b.click();
        } });
    }
    if (e.target.closest('[data-deconnexion]')) {
      modale({ titre: 'Se déconnecter ?', icone: 'sortie', danger: true, valider: 'Se déconnecter',
        texte: 'Votre session et votre session de signature sécurisée seront fermées. Les saisies non enregistrées seront perdues.',
        surValider: function (m, fermer) {
          succesDansModale(m, 'À bientôt', 'Fermeture de la session…'); DGB.son('clic');
          setTimeout(function () { location.href = 'connexion.html'; }, 900);
        } });
    }
    if (e.target.closest('[data-ticket-aide]')) {
      modale({ titre: 'Signaler un problème', icone: 'alerte', valider: 'Envoyer au support',
        texte: 'Le support applicatif du SED vous répond en 4 heures en moyenne.',
        corps: '<div><label class="etiquette" for="tk-objet">Objet *</label><input class="champ" id="tk-objet" placeholder="Code de vérification non reçu"></div>' +
          '<div><label class="etiquette" for="tk-type">Catégorie</label><select class="champ" id="tk-type"><option>Connexion et signature</option><option>Dossier bloqué</option><option>Affichage</option><option>Autre</option></select></div>' +
          '<div><label class="etiquette" for="tk-texte">Description *</label><textarea class="champ" id="tk-texte" rows="4" placeholder="Ce que vous faisiez, ce qui s’est passé"></textarea></div>',
        surValider: function (m, fermer) {
          var o = m.querySelector('#tk-objet'), t = m.querySelector('#tk-texte'), ok = true;
          [o, t].forEach(function (x) { var vide = !x.value.trim(); x.classList.toggle('champ-erreur', vide); if (vide) ok = false; });
          if (!ok) { DGB.son('erreur'); return; }
          succesDansModale(m, 'Demande envoyée', 'Ticket SUP-2026-' + Math.floor(1000 + Math.random() * 8000) + ' · réponse par e-mail.'); DGB.son('validation');
          setTimeout(fermer, 1500);
        } });
    }
  });

  /* ---------- Lanceur d'applications : recherche et liens externes ---------- */
  document.addEventListener('input', function (e) {
    if (!e.target.hasAttribute('data-filtre-applis')) return;
    var q = e.target.value.trim().toLowerCase(), menu = e.target.closest('.lanceur');
    $$('.tuile-app', menu).forEach(function (t) { t.hidden = q && t.textContent.toLowerCase().indexOf(q) < 0; });
  });
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-externe]'); if (!t) return;
    e.preventDefault();
    DGB.toast({ ton: 'info', titre: t.getAttribute('data-externe') + ' s’ouvre dans un nouvel onglet', texte: 'Lien externe : votre session de la suite DSI reste ouverte ici.', son: 'clic', duree: 3200 });
  });

  /* ---------- Démarrage ---------- */
  rendreNotifs();
  route();
  setTimeout(arrivee, 25000);
  setInterval(arrivee, 120000);
})();
