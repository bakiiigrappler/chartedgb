/* =========================================================================
   Suite DSI · DGB — comportements communs (aucune dépendance)
   - jeu d'icônes en sprite :  <svg class="ico"><use href="#i-accueil"/></svg>
   - disposition sidebar / topnav (mémorisée sur le poste)
   - menus déroulants, tiroir mobile, onglets, affichage du mot de passe
   ========================================================================= */
(function () {
  'use strict';

  /* ---------- Icônes : tracés outline 24×24 (même famille qu'OKANDAH / Heroicons) ---------- */
  var I = {
    accueil: '<path d="M2.25 12 11.2 3.05a1.13 1.13 0 0 1 1.6 0L21.75 12M4.5 9.75v10.13c0 .62.5 1.12 1.13 1.12H9.75v-4.88c0-.62.5-1.12 1.13-1.12h2.25c.62 0 1.12.5 1.12 1.13V21h4.13c.62 0 1.12-.5 1.12-1.13V9.76"/>',
    tableau: '<path d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25zM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18zM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25zM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18z"/>',
    dossier: '<path d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.06-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.38a1.5 1.5 0 0 1-1.06-.44z"/>',
    traiter: '<path d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>',
    signer: '<path d="m16.86 4.49 1.69-1.69a1.88 1.88 0 1 1 2.65 2.65L10.58 16.07a4.5 4.5 0 0 1-1.9 1.13L6 18l.8-2.68a4.5 4.5 0 0 1 1.13-1.9zm0 0L19.5 7.13M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"/>',
    ordinateur: '<path d="M9 17.25v1.01a3 3 0 0 1-.88 2.12L7.5 21h9l-.62-.62A3 3 0 0 1 15 18.26v-1.01m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25"/>',
    echange: '<path d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"/>',
    outil: '<path d="M11.42 15.17 17.25 21A2.65 2.65 0 0 0 21 17.25l-5.88-5.88M11.42 15.17l2.5-3.03c.32-.38.74-.62 1.2-.76M11.42 15.17l-4.65 5.65a2.55 2.55 0 1 1-3.59-3.58l6.84-5.63m5.1-.24c.56-.16 1.17-.19 1.75-.14a4.5 4.5 0 0 0 4.49-6.33l-3.28 3.27a3 3 0 0 1-2.25-2.25l3.28-3.28a4.5 4.5 0 0 0-6.34 4.49c.09 1.07-.07 2.26-.9 2.95l-.1.08"/>',
    rapport: '<path d="M3 13.13c0-.63.5-1.13 1.13-1.13h2.25c.62 0 1.12.5 1.12 1.13v6.75c0 .62-.5 1.12-1.12 1.12H4.13C3.5 21 3 20.5 3 19.88zM9.75 8.63c0-.63.5-1.13 1.13-1.13h2.25c.62 0 1.12.5 1.12 1.13v11.25c0 .62-.5 1.12-1.12 1.12h-2.25c-.63 0-1.13-.5-1.13-1.12zM16.5 4.13c0-.63.5-1.13 1.13-1.13h2.25C20.5 3 21 3.5 21 4.13v15.75c0 .62-.5 1.12-1.12 1.12h-2.25c-.63 0-1.13-.5-1.13-1.12z"/>',
    batiment: '<path d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.38c0-.62.5-1.12 1.13-1.12h2.25c.62 0 1.12.5 1.12 1.13V21"/>',
    etiquette: '<path d="M9.57 3H5.25A2.25 2.25 0 0 0 3 5.25v4.32c0 .6.24 1.17.66 1.59l9.58 9.58c.7.7 1.78.87 2.6.33a18.1 18.1 0 0 0 5.23-5.22c.54-.83.37-1.91-.33-2.61L11.16 3.66A2.25 2.25 0 0 0 9.57 3z"/><path d="M6 6h.01"/>',
    utilisateurs: '<path d="M15 19.13a9.38 9.38 0 0 0 2.63.37 9.34 9.34 0 0 0 4.12-.95 4.13 4.13 0 0 0-7.53-2.5M15 19.13v-.01c0-1.11-.29-2.16-.79-3.07M15 19.13v.1A12.32 12.32 0 0 1 8.62 21a12.3 12.3 0 0 1-6.37-1.77v-.11a6.38 6.38 0 0 1 11.96-3.07M12 6.38a3.38 3.38 0 1 1-6.75 0 3.38 3.38 0 0 1 6.75 0zm8.25 2.25a2.63 2.63 0 1 1-5.25 0 2.63 2.63 0 0 1 5.25 0z"/>',
    bouclier: '<path d="M9 12.75 11.25 15 15 9.75m-3-7.04A11.96 11.96 0 0 1 3.6 6 12 12 0 0 0 3 9.75c0 5.59 3.82 10.29 9 11.62 5.18-1.33 9-6.03 9-11.62 0-1.31-.21-2.57-.6-3.75h-.15c-3.2 0-6.1-1.25-8.25-3.29z"/>',
    reglages: '<path d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"/>',
    horloge: '<path d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>',
    profil: '<path d="M17.98 18.73A7.49 7.49 0 0 0 12 15.75a7.49 7.49 0 0 0-5.98 2.98m11.96 0a9 9 0 1 0-11.96 0m11.96 0A8.97 8.97 0 0 1 12 21a8.97 8.97 0 0 1-5.98-2.27M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>',
    sortie: '<path d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"/>',
    cloche: '<path d="M14.86 17.08a23.85 23.85 0 0 0 5.45-1.31A8.97 8.97 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.97 8.97 0 0 1-2.31 6.02c1.73.64 3.56 1.09 5.45 1.31m5.72 0a24.26 24.26 0 0 1-5.72 0m5.72 0a3 3 0 1 1-5.72 0"/>',
    applis: '<path d="M3.75 6A2.25 2.25 0 0 1 6 3.75h.75A2.25 2.25 0 0 1 9 6v.75A2.25 2.25 0 0 1 6.75 9H6a2.25 2.25 0 0 1-2.25-2.25zM15 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v.75A2.25 2.25 0 0 1 18 9h-.75A2.25 2.25 0 0 1 15 6.75zM3.75 17.25A2.25 2.25 0 0 1 6 15h.75A2.25 2.25 0 0 1 9 17.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18zM15 17.25A2.25 2.25 0 0 1 17.25 15H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-.75A2.25 2.25 0 0 1 15 18zM9.38 6.38h5.25M9.38 17.63h5.25"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    chevronBas: '<path d="m19 9-7 7-7-7"/>',
    chevronDroite: '<path d="m9 5 7 7-7 7"/>',
    fleche: '<path d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/>',
    plus: '<path d="M12 4.5v15m7.5-7.5h-15"/>',
    filtre: '<path d="M12 3c2.76 0 5.47.23 8.11.68.53.09.89.55.89 1.09v1.04c0 .6-.24 1.17-.66 1.59l-5.68 5.68a2.25 2.25 0 0 0-.66 1.59v2.93a2.25 2.25 0 0 1-1.24 2.01L9.75 21v-6.57c0-.6-.24-1.17-.66-1.59L3.41 7.16A2.25 2.25 0 0 1 2.75 5.57V4.77c0-.54.36-1 .89-1.09A48.4 48.4 0 0 1 12 3z"/>',
    telecharger: '<path d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"/>',
    document: '<path d="M19.5 14.25v-2.63a3.38 3.38 0 0 0-3.38-3.37h-1.5A1.13 1.13 0 0 1 13.5 7.13v-1.5a3.38 3.38 0 0 0-3.38-3.38H8.25m2.25 0H5.63c-.63 0-1.13.5-1.13 1.13v17.25c0 .62.5 1.12 1.13 1.12h12.75c.62 0 1.12-.5 1.12-1.12V11.25a9 9 0 0 0-9-9z"/>',
    oeil: '<path d="M2.04 12.32a1 1 0 0 1 0-.64C3.42 7.51 7.36 4.5 12 4.5c4.64 0 8.57 3 9.96 7.18.07.2.07.43 0 .64C20.58 16.49 16.64 19.5 12 19.5c-4.64 0-8.57-3-9.96-7.18z"/><path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>',
    oeilBarre: '<path d="M3.98 8.22A10.48 10.48 0 0 0 1.93 12C3.23 16.34 7.24 19.5 12 19.5c.99 0 1.95-.14 2.86-.4M6.23 6.23A10.45 10.45 0 0 1 12 4.5c4.76 0 8.77 3.16 10.07 7.5a10.52 10.52 0 0 1-4.3 5.77M6.23 6.23 3 3m3.23 3.23 3.65 3.65m7.89 7.89L21 21m-3.23-3.23-3.65-3.65m0 0a3 3 0 1 0-4.24-4.24m4.24 4.24L9.88 9.88"/>',
    coche: '<path d="m4.5 12.75 6 6 9-13.5"/>',
    cadenas: '<path d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25z"/>',
    cle: '<path d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.03 5.91c-.56-.1-1.16.03-1.56.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.82c0-.6.24-1.17.66-1.59l6.5-6.5c.4-.4.53-1 .43-1.56A6 6 0 1 1 21.75 8.25z"/>',
    info: '<path d="m11.25 11.25.04-.02a.75.75 0 0 1 1.06.85l-.7 2.84a.75.75 0 0 0 1.06.85l.04-.02M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0zm-9-3.75h.01"/>',
    alerte: '<path d="M12 9v3.75m-9.3 3.38c-.87 1.5.21 3.37 1.94 3.37h14.72c1.73 0 2.81-1.87 1.94-3.37L13.95 3.38c-.87-1.5-3.03-1.5-3.9 0zM12 15.75h.01"/>',
    barreLaterale: '<path d="M3.75 4.5h16.5c.41 0 .75.34.75.75v13.5c0 .41-.34.75-.75.75H3.75A.75.75 0 0 1 3 18.75V5.25c0-.41.34-.75.75-.75zM9 4.5v15"/>',
    barreHaut: '<path d="M3.75 4.5h16.5c.41 0 .75.34.75.75v13.5c0 .41-.34.75-.75.75H3.75A.75.75 0 0 1 3 18.75V5.25c0-.41.34-.75.75-.75zM3 9h18"/>',
    courrier: '<path d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.24a2.25 2.25 0 0 1-1.07 1.92l-7.5 4.61a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.92v-.24"/>'
  };
  var sprite = '<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">';
  Object.keys(I).forEach(function (k) { sprite += '<symbol id="i-' + k + '" viewBox="0 0 24 24">' + I[k] + '</symbol>'; });
  document.body.insertAdjacentHTML('afterbegin', sprite + '</svg>');

  /* ---------- Préférences du poste (facultatives) ---------- */
  function lire(cle) { try { return localStorage.getItem('dgb.' + cle); } catch (e) { return null; } }
  function ecrire(cle, v) { try { localStorage.setItem('dgb.' + cle, v); } catch (e) { /* indisponible */ } }

  var root = document.documentElement;
  var app = document.querySelector('.app');

  /* ---------- Réglages « Personnaliser » (modèle : panneau Customize de la démo dashboardpack) ----------
     Chaque réglage est un attribut de <html>. La valeur posée par l'application sert de défaut ;
     le choix de l'agent est mémorisé sur le poste. */
  var REGLAGES = [
    { cle: 'mode', titre: 'Thème', groupe: 'Couleurs', attr: 'data-mode', defaut: 'clair', options: [
      ['clair', 'Clair', 'soleil'], ['sombre', 'Sombre', 'lune'], ['systeme', 'Système', 'ecran']] },
    { cle: 'app', titre: 'Couleur', attr: 'data-app', defaut: 'dgb', pastilles: true, options: [
      ['dgb', 'Bleu DGB', '#155a9c'], ['abat', 'Sève', '#12805f'], ['cobalt', 'Cobalt', '#1d4ed8'],
      ['sarcelle', 'Sarcelle', '#0d8075'], ['indigo', 'Indigo', '#4338ca'], ['prune', 'Prune', '#832a70'],
      ['olive', 'Olive', '#5d6d26'], ['ardoise', 'Ardoise', '#3f4f69'], ['nuit', 'Nuit', '#24407c'],
      ['lagon', 'Lagon', '#0c6a86'], ['fuchsia', 'Fuchsia', '#971c95'], ['sable', 'Sable', '#7a624e'],
      ['azur', 'Azur', '#1c75bc'], ['ocean', 'Océan', '#0369a1'], ['violet', 'Violet', '#6d28d9'],
      ['pin', 'Pin', '#1f6f59'], ['marine', 'Marine', '#1e40af'], ['graphite', 'Graphite', '#4b5563']] },
    { cle: 'neutre', titre: 'Neutres', attr: 'data-neutre', defaut: 'marque', pastilles: true, options: [
      ['marque', 'Selon la marque', 'conic-gradient(#e2e8f0 0 50%, #f8fafc 0)'], ['froid', 'Froids', '#cbd5e1'],
      ['chaud', 'Chauds', '#dccfc0'], ['vert', 'Verts', '#c1cac7'], ['bleute', 'Bleutés', '#c6cedb']] },
    { cle: 'police', titre: 'Police', groupe: 'Typographie', attr: 'data-police', defaut: 'institution', polices: true, options: [
      ['institution', 'Institution', 'Archivo'], ['editoriale', 'Éditoriale', 'Newsreader'],
      ['technique', 'Technique', 'Sora'], ['plex', 'OKANDAH', 'IBM Plex Sans'],
      ['condensee', 'Condensée', 'Barlow Semi Condensed'], ['franklin', 'Franklin', 'Libre Franklin'],
      ['officielle', 'Officielle', 'Source Serif 4'], ['noto', 'Noto', 'Noto Sans'],
      ['courrier', 'Courrier', 'Merriweather'], ['dossier', 'Dossier', 'Roboto Slab']] },
    { cle: 'texte', titre: 'Taille du texte', attr: 'data-texte', defaut: 'normal', options: [
      ['petit', 'Petite', 'textePetit'], ['normal', 'Normale', 'texteNormal'], ['grand', 'Grande', 'texteGrand']] },
    { cle: 'densite', titre: 'Densité', groupe: 'Mise en page', attr: 'data-densite', defaut: 'confortable', options: [
      ['compacte', 'Compacte', 'compacte'], ['confortable', 'Confortable', 'confortable'], ['aeree', 'Aérée', 'aeree']] },
    { cle: 'espace', titre: 'Marges', attr: 'data-espace', defaut: 'standard', options: [
      ['serre', 'Serrées', 'margeSerree'], ['standard', 'Standard', 'margeStandard'], ['ample', 'Amples', 'margeLarge']] },
    { cle: 'nav', titre: 'Disposition', attr: 'data-nav', defaut: 'sidebar', options: [
      ['sidebar', 'Sidebar', 'barreLaterale'], ['topnav', 'Top Nav', 'barreHaut']] },
    { cle: 'sidebar', titre: 'Sous-menus latéraux', attr: 'data-sidebar', defaut: 'groupes', options: [
      ['groupes', 'Tous ouverts', 'barreLaterale'], ['actifs', 'Page active', 'arbre'], ['plat', 'Masqués', 'menu']] },
    { cle: 'laterale', titre: 'Style de la barre latérale', attr: 'data-laterale', defaut: 'sombre', options: [
      ['sombre', 'Sombre', 'lateraleSombre'], ['marque', 'Teintée', 'lateraleMarque'], ['claire', 'Claire', 'lateraleClaire']] },
    { cle: 'arrondi', titre: 'Angles', attr: 'data-arrondi', defaut: 'standard', options: [
      ['franc', 'Francs', 'angleFranc'], ['standard', 'Standard', 'angleStandard'], ['doux', 'Doux', 'angleDoux']] },
    { cle: 'conteneur', titre: 'Conteneur', attr: 'data-conteneur', defaut: 'fluide', options: [
      ['fluide', 'Fluide', 'fluide'], ['encadre', 'Encadré', 'encadre']] },
    { cle: 'animations', titre: 'Animations', groupe: 'Confort', attr: 'data-animations', defaut: 'completes', options: [
      ['completes', 'Complètes', 'animation'], ['aucune', 'Aucune', 'pause']] },
    { cle: 'contraste', titre: 'Contraste', attr: 'data-contraste', defaut: 'normal', options: [
      ['normal', 'Normal', 'contrasteNormal'], ['eleve', 'Élevé', 'contrasteEleve']] },
    { cle: 'sons', titre: 'Sons', attr: 'data-sons', defaut: 'actifs', testSons: true, options: [
      ['actifs', 'Activés', 'sonOn'], ['muets', 'Coupés', 'sonOff']] }
  ];
  REGLAGES.forEach(function (r) { r.defaut = root.getAttribute(r.attr) || r.defaut; });
  var sombreSysteme = window.matchMedia ? matchMedia('(prefers-color-scheme: dark)') : null;

  function appliquer(r, v) {
    if (r.cle === 'mode') {
      root.setAttribute('data-mode-choisi', v);
      v = v === 'systeme' ? (sombreSysteme && sombreSysteme.matches ? 'sombre' : 'clair') : v;
    }
    root.setAttribute(r.attr, v);
  }
  function valeur(r) { return r.cle === 'mode' ? (root.getAttribute('data-mode-choisi') || root.getAttribute('data-mode')) : root.getAttribute(r.attr); }
  REGLAGES.forEach(function (r) {
    // Seules les pages marquées data-personnalisable reprennent les choix de l'agent (pas la connexion).
    var v = root.hasAttribute('data-personnalisable') ? lire(r.cle) : null;
    if (v && r.options.some(function (o) { return o[0] === v; })) appliquer(r, v); else appliquer(r, r.defaut);
  });
  if (sombreSysteme && sombreSysteme.addEventListener) sombreSysteme.addEventListener('change', function () {
    if (root.getAttribute('data-mode-choisi') === 'systeme') appliquer(REGLAGES[0], 'systeme');
  });

  /* Lien direct pour la démonstration : application.html?nav=topnav&app=lagon
     l'emporte sur le choix mémorisé, sans rien réécrire sur le poste. */
  (function () {
    var q;
    try { q = new URLSearchParams(location.search); } catch (e) { return; }
    REGLAGES.forEach(function (r) {
      var v = q.get(r.cle);
      if (v && r.options.some(function (o) { return o[0] === v; })) appliquer(r, v);
    });
  })();

  function majBoutons() {
    REGLAGES.forEach(function (r) {
      var v = valeur(r);
      document.querySelectorAll('[data-reglage="' + r.cle + '"]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-valeur') === v)); });
    });
    var n = root.getAttribute('data-nav');
    document.querySelectorAll('[data-disposition]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-disposition') === n)); });
  }
  function choisir(cle, v) {
    var r = REGLAGES.filter(function (x) { return x.cle === cle; })[0];
    appliquer(r, v); ecrire(cle, v); majBoutons();
    document.dispatchEvent(new CustomEvent('dgb:' + cle, { detail: v }));
  }

  // Petites icônes propres au panneau
  I.soleil = '<path d="M12 3v2.25m6.36.39-1.59 1.59M21 12h-2.25m-.39 6.36-1.59-1.59M12 18.75V21m-4.77-4.23-1.59 1.59M5.25 12H3m4.23-4.77L5.64 5.64M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0z"/>';
  I.lune = '<path d="M21.75 15A9.72 9.72 0 0 1 18 15.75 9.75 9.75 0 0 1 8.25 6c0-1.33.27-2.6.75-3.75A9.75 9.75 0 0 0 3 11.25 9.75 9.75 0 0 0 12.75 21a9.75 9.75 0 0 0 9-6z"/>';
  I.ecran = '<path d="M9 17.25v1.01a3 3 0 0 1-.88 2.12L7.5 21h9l-.62-.62A3 3 0 0 1 15 18.26v-1.01M3 5.25A2.25 2.25 0 0 1 5.25 3h13.5A2.25 2.25 0 0 1 21 5.25V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15z"/>';
  I.compacte = '<path d="M4 6h16M4 10h16M4 14h16M4 18h16"/>';
  I.confortable = '<path d="M4 6h16M4 12h16M4 18h16"/>';
  I.aeree = '<path d="M4 5h16M4 12h16M4 19h16" stroke-width="2.2"/>';
  I.fluide = '<path d="M3 9V5a2 2 0 0 1 2-2h4M15 3h4a2 2 0 0 1 2 2v4M21 15v4a2 2 0 0 1-2 2h-4M9 21H5a2 2 0 0 1-2-2v-4"/>';
  I.encadre = '<path d="M7 3v18M17 3v18M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>';
  I.palette = '<path d="M4.1 15.85a8.25 8.25 0 1 1 15.8-3.35c0 1.24-1 2.25-2.25 2.25h-2.53a1.97 1.97 0 0 0-1.52 3.21l.17.2A1.8 1.8 0 0 1 12.38 21 8.25 8.25 0 0 1 4.1 15.85z"/><path d="M7.5 10.5h.01M10.5 7.5h.01M15 7.5h.01M17.25 10.5h.01" stroke-width="2.6"/>';
  I.croix = '<path d="M6 18 18 6M6 6l12 12"/>';
  I.margeSerree = '<path d="M4 4h16M4 20h16M4 8v8M20 8v8"/><path d="M9 12h6M12 9v6" stroke-width="1.2"/>';
  I.margeStandard = '<path d="M4 4h16M4 20h16M4 7v10M20 7v10"/><path d="M8 12h8M12 9v6" stroke-width="1.2"/>';
  I.sonOn = '<path d="M19.11 4.89a10 10 0 0 1 0 14.22M15.54 8.46a5 5 0 0 1 0 7.08M6.75 8.25l4.72-3.78a.75.75 0 0 1 1.22.59v13.88a.75.75 0 0 1-1.22.59l-4.72-3.78H4.51c-.88 0-1.7-.51-1.95-1.36A9 9 0 0 1 2.25 12c0-.83.11-1.64.33-2.4.24-.84 1.07-1.35 1.95-1.35z"/>';
  I.sonOff = '<path d="m17.25 9.75 4.5 4.5m0-4.5-4.5 4.5M6.75 8.25l4.72-3.78a.75.75 0 0 1 1.22.59v13.88a.75.75 0 0 1-1.22.59l-4.72-3.78H4.51c-.88 0-1.7-.51-1.95-1.36A9 9 0 0 1 2.25 12c0-.83.11-1.64.33-2.4.24-.84 1.07-1.35 1.95-1.35z"/>';
  I.textePetit = '<path d="M7 18 11 7l4 11M8.5 14h5" stroke-width="1.5"/>';
  I.texteNormal = '<path d="M5 19 11 5l6 14M7.4 14h7.2"/>';
  I.texteGrand = '<path d="M3 20 11 3l8 17M5.8 14.5h10.4" stroke-width="2.2"/>';
  I.arbre = '<path d="M5 4v15M5 9h6M5 15h6M14 7h6M14 13h6M14 19h6"/>';
  I.lateraleSombre = '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 6a2 2 0 0 1 2-2h4v16H5a2 2 0 0 1-2-2z" fill="currentColor"/>';
  I.lateraleMarque = '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 6a2 2 0 0 1 2-2h4v16H5a2 2 0 0 1-2-2z" fill="currentColor" fill-opacity=".45"/>';
  I.lateraleClaire = '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/>';
  I.angleFranc = '<path d="M5 19V5h14"/>';
  I.angleStandard = '<path d="M5 19V9a4 4 0 0 1 4-4h10"/>';
  I.angleDoux = '<path d="M5 19v-4A10 10 0 0 1 15 5h4"/>';
  I.animation = '<path d="M5 12a7 7 0 0 1 12-5M19 12a7 7 0 0 1-12 5M17 3v4h-4M7 21v-4h4"/>';
  I.pause = '<path d="M9 6v12M15 6v12"/>';
  I.contrasteNormal = '<circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor" fill-opacity=".35"/>';
  I.contrasteEleve = '<circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor"/>';
  I.recherche = '<path d="m21 21-5.2-5.2m0 0A7.5 7.5 0 1 0 5.2 5.2a7.5 7.5 0 0 0 10.6 10.6z"/>';
  I.entree = '<path d="M9 15 4 10m0 0 5-5m-5 5h11a5 5 0 0 1 0 10h-1"/>';
  I.margeLarge = '<path d="M4 4h16M4 20h16M4 5v14M20 5v14"/><path d="M7 12h10M12 9v6" stroke-width="1.2"/>';
  var ajout = '';
  ['soleil', 'lune', 'ecran', 'compacte', 'confortable', 'aeree', 'fluide', 'encadre', 'palette', 'croix', 'margeSerree', 'margeStandard', 'margeLarge', 'sonOn', 'sonOff', 'recherche', 'entree', 'textePetit', 'texteNormal', 'texteGrand', 'arbre', 'lateraleSombre', 'lateraleMarque', 'lateraleClaire', 'angleFranc', 'angleStandard', 'angleDoux', 'animation', 'pause', 'contrasteNormal', 'contrasteEleve'].forEach(function (k) { ajout += '<symbol id="i-' + k + '" viewBox="0 0 24 24">' + I[k] + '</symbol>'; });
  document.querySelector('body > svg').insertAdjacentHTML('beforeend', ajout);

  function construireTiroir() {
    var h = '<div class="tiroir-voile" data-fermer-tiroir></div><aside class="tiroir" role="dialog" aria-modal="true" aria-labelledby="tiroir-titre">' +
      '<div class="tiroir-tete"><div><h2 id="tiroir-titre">Personnaliser</h2><p>Adaptez l’affichage à votre façon de travailler.</p></div>' +
      '<button class="bouton-barre" type="button" data-fermer-tiroir aria-label="Fermer"><svg class="ico"><use href="#i-croix"/></svg></button></div><div class="tiroir-corps">';
    REGLAGES.forEach(function (r) {
      if (r.groupe) h += '<p class="tiroir-rubrique">' + r.groupe + '</p>';
      var colonnes = r.pastilles || r.polices ? ' style="grid-template-columns:repeat(' + (r.polices ? 5 : 4) + ',minmax(0,1fr))"' : (r.options.length === 4 ? ' style="grid-template-columns:repeat(4,minmax(0,1fr))"' : '');
      h += '<div class="reglage"><span class="titre">' + r.titre + '</span><div class="options' + (r.options.length === 2 ? ' deux' : '') + '"' + colonnes + '>';
      r.options.forEach(function (o) {
        var vis;
        if (r.pastilles) vis = '<span class="pastille" style="background:' + o[2] + '"></span>';
        else if (r.polices) vis = '<span class="echantillon" style="font-family:\'' + o[2] + '\',serif">Aa</span>';
        else vis = '<svg class="ico"><use href="#i-' + o[2] + '"/></svg>';
        h += '<button class="option" type="button" data-reglage="' + r.cle + '" data-valeur="' + o[0] + '" aria-pressed="false">' + vis + o[1] + '</button>';
      });
      h += '</div>';
      if (r.testSons) h += '<div class="tester-sons"><span>Écouter :</span><button type="button" data-ecouter="validation">Validation</button><button type="button" data-ecouter="notification">Notification</button><button type="button" data-ecouter="erreur">Erreur</button></div>';
      h += '</div>';
    });
    h += '</div><div class="tiroir-pied"><button class="bouton-secondaire bouton-bloc" type="button" data-reinitialiser>Rétablir les réglages par défaut</button></div></aside>';
    var c = document.createElement('div'); c.id = 'personnaliser'; c.hidden = true; c.innerHTML = h;
    document.body.appendChild(c);
  }
  if (document.querySelector('[data-action="personnaliser"]')) construireTiroir();
  majBoutons();

  /* ---------- Menus ---------- */
  function fermerMenus(sauf) {
    document.querySelectorAll('[data-menu][aria-expanded="true"]').forEach(function (b) {
      if (b === sauf) return;
      b.setAttribute('aria-expanded', 'false');
      var m = document.getElementById(b.getAttribute('data-menu'));
      if (m) m.hidden = true;
    });
  }

  /* ---------- Sous-menus des modules (disposition topnav) ---------- */
  function liensSousMenu(id) {
    var m = document.getElementById(id);
    return m ? Array.prototype.slice.call(m.querySelectorAll('a[href]')) : [];
  }
  function fermerSousMenus(sauf, redonnerFocus) {
    document.querySelectorAll('[data-sous-menu][aria-expanded="true"]').forEach(function (b) {
      if (b === sauf) return;
      b.setAttribute('aria-expanded', 'false');
      var m = document.getElementById(b.getAttribute('data-sous-menu'));
      if (m) m.hidden = true;
      if (redonnerFocus) b.focus();
    });
  }
  function ouvrirSousMenu(b, premierLien) {
    var id = b.getAttribute('data-sous-menu');
    var m = document.getElementById(id);
    if (!m) return;
    fermerSousMenus(b);
    b.setAttribute('aria-expanded', 'true');
    m.hidden = false;
    placerSousMenu(b, m);
    if (premierLien) {
      var l = liensSousMenu(id);
      if (l.length) l[0].focus();
    }
  }
  function placerSousMenu(b, m) {
    var r = b.getBoundingClientRect();
    var marge = 12;
    var largeur = Math.min(312, window.innerWidth - marge * 2);
    var gauche = Math.min(Math.max(marge, r.left), window.innerWidth - largeur - marge);
    var haut = r.bottom + 10;
    m.style.width = largeur + 'px';
    m.style.left = Math.round(gauche) + 'px';
    m.style.top = Math.round(haut) + 'px';
    m.style.maxHeight = Math.max(160, window.innerHeight - haut - marge) + 'px';
  }
  window.addEventListener('resize', function () { fermerSousMenus(); });

  document.addEventListener('click', function (e) {
    var sm = e.target.closest('[data-sous-menu]');
    if (sm) {
      if (sm.getAttribute('aria-expanded') === 'true') fermerSousMenus();
      else ouvrirSousMenu(sm);
      return;
    }
    if (e.target.closest('.sous-menu a')) { fermerSousMenus(); return; }
    if (!e.target.closest('.sous-menu')) fermerSousMenus();

    var b = e.target.closest('[data-menu]');
    if (b) {
      var m = document.getElementById(b.getAttribute('data-menu'));
      var ouvert = b.getAttribute('aria-expanded') === 'true';
      fermerMenus(b);
      b.setAttribute('aria-expanded', String(!ouvert));
      if (m) m.hidden = ouvert;
      return;
    }
    if (!e.target.closest('.menu')) fermerMenus();

    var sec = e.target.closest('[data-section-bouton]');
    if (sec) {
      var ouvert = sec.getAttribute('aria-expanded') === 'true';
      sec.setAttribute('aria-expanded', String(!ouvert));
      var liens = sec.parentElement.querySelector('.section-liens');
      if (liens) liens.hidden = ouvert;
      return;
    }

    var d = e.target.closest('[data-disposition]');
    if (d) { choisir('nav', d.getAttribute('data-disposition')); if (app) app.classList.remove('menu-ouvert'); return; }
    var ec = e.target.closest('[data-ecouter]');
    if (ec) { son(ec.getAttribute('data-ecouter')); return; }
    var rg = e.target.closest('[data-reglage]');
    if (rg) { choisir(rg.getAttribute('data-reglage'), rg.getAttribute('data-valeur')); return; }
    if (e.target.closest('[data-reinitialiser]')) { REGLAGES.forEach(function (r) { choisir(r.cle, r.defaut); }); return; }
    var t = document.getElementById('personnaliser');
    if (e.target.closest('[data-action="personnaliser"]') && t) { fermerMenus(); t.hidden = false; t.querySelector('.tiroir [data-fermer-tiroir]').focus(); return; }
    if (e.target.closest('[data-fermer-tiroir]') && t) { t.hidden = true; return; }
    var a = e.target.closest('[data-marque]');
    if (a) { e.preventDefault(); choisir('app', a.getAttribute('data-marque')); fermerMenus(); return; }
    if (e.target.closest('[data-action="menu"]') && app) app.classList.toggle('menu-ouvert');
    if (e.target.closest('.voile') && app) app.classList.remove('menu-ouvert');

    var v = e.target.closest('[data-voir]');
    if (v) {
      var c = document.getElementById(v.getAttribute('data-voir'));
      var cache = c.type === 'password';
      c.type = cache ? 'text' : 'password';
      v.setAttribute('aria-pressed', String(cache));
      v.setAttribute('aria-label', cache ? 'Masquer le mot de passe' : 'Afficher le mot de passe');
      v.querySelector('use').setAttribute('href', cache ? '#i-oeilBarre' : '#i-oeil');
    }
  });

  document.addEventListener('keydown', function (e) {
    var decl = e.target.closest ? e.target.closest('[data-sous-menu]') : null;
    if (decl && e.key === 'ArrowDown') {
      var id = decl.getAttribute('data-sous-menu');
      e.preventDefault();
      if (decl.getAttribute('aria-expanded') !== 'true') ouvrirSousMenu(decl, true);
      else { var premiers = liensSousMenu(id); if (premiers.length) premiers[0].focus(); }
      return;
    }
    var panneau = e.target.closest ? e.target.closest('.sous-menu') : null;
    if (panneau) {
      var liens = Array.prototype.slice.call(panneau.querySelectorAll('a[href]'));
      var i = liens.indexOf(e.target);
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        if (!liens.length) return;
        e.preventDefault();
        var pas = e.key === 'ArrowDown' ? 1 : -1;
        liens[(i + pas + liens.length) % liens.length].focus();
        return;
      }
      if (e.key === 'Home' || e.key === 'End') {
        if (!liens.length) return;
        e.preventDefault();
        liens[e.key === 'Home' ? 0 : liens.length - 1].focus();
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        fermerSousMenus(null, true);
        return;
      }
    }
    if (e.key === 'Escape') {
      fermerSousMenus(null, true);
      fermerMenus(); if (app) app.classList.remove('menu-ouvert');
      var t = document.getElementById('personnaliser'); if (t) t.hidden = true;
    }
  });

  document.addEventListener('focusin', function (e) {
    if (e.target.closest('.sous-menu') || e.target.closest('[data-sous-menu]')) return;
    fermerSousMenus();
  });

  /* ---------- Onglets ---------- */
  document.querySelectorAll('[role="tablist"]').forEach(function (liste) {
    liste.addEventListener('click', function (e) {
      var t = e.target.closest('[role="tab"]');
      if (!t) return;
      liste.querySelectorAll('[role="tab"]').forEach(function (x) {
        var sel = x === t;
        x.setAttribute('aria-selected', String(sel));
        var p = document.getElementById(x.getAttribute('aria-controls'));
        if (p) p.hidden = !sel;
      });
    });
  });

  /* =======================================================================
     Sons (Web Audio, aucun fichier) — même principe qu'OKANDAH
     validation : trois notes montantes · notification : ding à deux tons
     erreur : note descendante · clic : tic très court
     Le navigateur n'autorise le son qu'après une première interaction :
     un son demandé avant est rejoué au premier clic ou à la première touche.
     ======================================================================= */
  var audio = null, enAttente = null;
  function contexte() {
    if (!audio) { var A = window.AudioContext || window.webkitAudioContext; if (!A) return null; audio = new A(); }
    if (audio.state === 'suspended' && audio.resume) audio.resume();
    return audio;
  }
  function note(ctx, freq, debut, duree, volume, forme, glisse) {
    var o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime + debut;
    o.type = forme || 'sine'; o.frequency.setValueAtTime(freq, t);
    if (glisse) o.frequency.exponentialRampToValueAtTime(glisse, t + duree);
    o.connect(g); g.connect(ctx.destination);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(volume, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t + duree);
    o.start(t); o.stop(t + duree + 0.02);
  }
  var SONS = {
    validation: function (c) { note(c, 659.25, 0, .12, .22); note(c, 880, .1, .12, .22); note(c, 1174.66, .2, .3, .24); },
    notification: function (c) { note(c, 880, 0, .16, .2); note(c, 1174.7, .12, .24, .2); },
    erreur: function (c) { note(c, 340, 0, .32, .18, 'triangle', 150); },
    clic: function (c) { note(c, 1400, 0, .04, .06, 'square'); }
  };
  function son(nom) {
    if (root.getAttribute('data-sons') === 'muets' || !SONS[nom]) return;
    var c = contexte();
    if (!c) return;
    if (c.state !== 'running') { enAttente = nom; return; }
    try { SONS[nom](c); } catch (e) { /* audio indisponible */ }
  }
  ['pointerdown', 'keydown'].forEach(function (ev) {
    document.addEventListener(ev, function () {
      var c = contexte();
      if (c && enAttente) { var n = enAttente; enAttente = null; setTimeout(function () { son(n); }, 30); }
    }, { passive: true });
  });

  /* =======================================================================
     Notifications éphémères (toasts), annoncées aux lecteurs d'écran
     DGB.toast({ titre, texte, ton: 'succes'|'info'|'attente'|'erreur', son, duree })
     ======================================================================= */
  var ICONES_TON = { succes: 'traiter', info: 'info', attente: 'horloge', erreur: 'alerte' };
  function zoneToasts() {
    var z = document.getElementById('toasts');
    if (!z) { z = document.createElement('div'); z.id = 'toasts'; z.className = 'toasts'; z.setAttribute('aria-live', 'polite'); document.body.appendChild(z); }
    return z;
  }
  function toast(o) {
    o = o || {};
    var ton = o.ton || 'info';
    var t = document.createElement('div');
    t.className = 'toast toast-' + ton;
    t.setAttribute('role', ton === 'erreur' ? 'alert' : 'status');
    t.innerHTML = '<svg class="ico"><use href="#i-' + ICONES_TON[ton] + '"/></svg><div class="toast-texte"><b></b><span></span></div>' +
      '<button type="button" class="toast-fermer" aria-label="Fermer la notification"><svg class="ico ico-4"><use href="#i-croix"/></svg></button><i class="toast-duree"></i>';
    t.querySelector('b').textContent = o.titre || '';
    t.querySelector('span').textContent = o.texte || '';
    var duree = o.duree || 5000;
    t.querySelector('.toast-duree').style.animationDuration = duree + 'ms';
    zoneToasts().appendChild(t);
    var fin = setTimeout(fermer, duree);
    function fermer() { clearTimeout(fin); t.classList.add('sortie'); setTimeout(function () { t.remove(); }, 220); }
    t.querySelector('.toast-fermer').addEventListener('click', fermer);
    if (o.son !== false) son(o.son || ({ succes: 'validation', erreur: 'erreur', attente: 'notification', info: 'notification' })[ton]);
    return fermer;
  }

  /* =======================================================================
     Palette de commandes (Ctrl+K) : aller à une page ou changer un réglage
     Les entrées viennent des liens de navigation [data-vue-lien] et des
     éléments [data-commande] ; les réglages du panneau s'y ajoutent.
     ======================================================================= */
  var palette = null;
  function entreesPalette() {
    var vues = [], vus = {};
    document.querySelectorAll('[data-vue-lien]').forEach(function (a) {
      var v = a.getAttribute('data-vue-lien'), t = (a.querySelector('.texte, b') || a).textContent.trim();
      if (!v || vus[v] || !t) return;
      vus[v] = 1;
      var section = a.closest('[data-section]') || a.closest('.section-nav');
      var groupe = section ? (section.getAttribute('data-section') || (section.querySelector('.section-tete span') || {}).textContent || 'Pages') : 'Pages';
      vues.push({ groupe: groupe, titre: t, icone: (a.querySelector('use') || { getAttribute: function () { return '#i-fleche'; } }).getAttribute('href').slice(1), action: function () { location.hash = v; } });
    });
    var reglages = [];
    REGLAGES.forEach(function (r) {
      if (['mode', 'nav', 'densite', 'sons', 'conteneur'].indexOf(r.cle) < 0) return;
      r.options.forEach(function (o) {
        reglages.push({ groupe: 'Réglages', titre: r.titre + ' : ' + o[1], icone: r.cle === 'mode' ? o[2] : 'reglages', action: function () { choisir(r.cle, o[0]); toast({ ton: 'info', titre: r.titre, texte: o[1], son: 'clic', duree: 2200 }); } });
      });
    });
    reglages.push({ groupe: 'Réglages', titre: 'Ouvrir le panneau Personnaliser', icone: 'palette', action: function () { var t = document.getElementById('personnaliser'); if (t) t.hidden = false; } });
    return vues.concat(reglages);
  }
  function ouvrirPalette() {
    if (!palette) {
      palette = document.createElement('div');
      palette.id = 'palette-commandes'; palette.className = 'palette-voile'; palette.hidden = true;
      palette.innerHTML = '<div class="palette" role="dialog" aria-modal="true" aria-label="Palette de commandes">' +
        '<div class="palette-recherche"><svg class="ico"><use href="#i-recherche"/></svg><input type="text" id="palette-champ" placeholder="Aller à une page, changer un réglage…" autocomplete="off" role="combobox" aria-expanded="true" aria-controls="palette-liste"><kbd>Échap</kbd></div>' +
        '<ul class="palette-liste" id="palette-liste" role="listbox"></ul>' +
        '<div class="palette-pied"><span><kbd>↑</kbd><kbd>↓</kbd> naviguer</span><span><kbd>Entrée</kbd> ouvrir</span><span><kbd>Ctrl</kbd><kbd>K</kbd> palette</span></div></div>';
      document.body.appendChild(palette);
      var champ = palette.querySelector('input'), liste = palette.querySelector('ul'), entrees = [], choix = 0;
      function dessiner() {
        var q = champ.value.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
        entrees = entreesPalette().filter(function (e) { return !q || (e.titre + ' ' + e.groupe).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').indexOf(q) >= 0; });
        choix = Math.min(choix, Math.max(0, entrees.length - 1));
        var h = '', groupe = null;
        entrees.forEach(function (e, i) {
          if (e.groupe !== groupe) { groupe = e.groupe; h += '<li class="palette-groupe" role="presentation">' + groupe + '</li>'; }
          h += '<li role="option" id="pc-' + i + '" data-i="' + i + '" aria-selected="' + (i === choix) + '"><svg class="ico"><use href="#i-' + e.icone + '"/></svg><span>' + e.titre + '</span><svg class="ico ico-4 palette-entree"><use href="#i-entree"/></svg></li>';
        });
        liste.innerHTML = h || '<li class="palette-vide">Aucun résultat pour « ' + champ.value.replace(/[<>&]/g, '') + ' ».</li>';
        champ.setAttribute('aria-activedescendant', entrees.length ? 'pc-' + choix : '');
        var sel = liste.querySelector('[aria-selected="true"]'); if (sel) sel.scrollIntoView({ block: 'nearest' });
      }
      function executer(i) { var e = entrees[i]; if (!e) return; fermerPalette(); e.action(); }
      champ.addEventListener('input', function () { choix = 0; dessiner(); });
      champ.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); choix = (choix + (e.key === 'ArrowDown' ? 1 : -1) + entrees.length) % Math.max(1, entrees.length); dessiner(); }
        if (e.key === 'Enter') { e.preventDefault(); executer(choix); }
      });
      liste.addEventListener('click', function (e) { var li = e.target.closest('[data-i]'); if (li) executer(Number(li.getAttribute('data-i'))); });
      palette.addEventListener('click', function (e) { if (e.target === palette) fermerPalette(); });
      palette.dessiner = dessiner;
    }
    palette.hidden = false;
    var c = palette.querySelector('input'); c.value = ''; palette.dessiner(); c.focus();
  }
  function fermerPalette() { if (palette) palette.hidden = true; }
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k' && document.querySelector('.app')) { e.preventDefault(); if (palette && !palette.hidden) fermerPalette(); else ouvrirPalette(); }
    if (e.key === 'Escape') fermerPalette();
  });
  document.addEventListener('click', function (e) { if (e.target.closest('[data-action="palette"]')) ouvrirPalette(); });

  /* Barre latérale : elle défile seule ; une ombre signale le contenu caché en haut ou en bas */
  (function () {
    var lat = document.querySelector('.laterale'), nav = lat && lat.querySelector('nav');
    if (!nav) return;
    function maj() {
      lat.classList.toggle('defile-haut', nav.scrollTop > 2);
      lat.classList.toggle('defile-bas', nav.scrollTop + nav.clientHeight < nav.scrollHeight - 2);
    }
    nav.addEventListener('scroll', maj, { passive: true });
    window.addEventListener('resize', maj);
    if (window.ResizeObserver) new ResizeObserver(maj).observe(nav);
    document.addEventListener('click', function (e) { if (e.target.closest('[data-section-bouton]')) setTimeout(maj, 20); });
    maj();
  })();

  window.DGB = { lire: lire, ecrire: ecrire, choisir: choisir, reglages: REGLAGES, son: son, toast: toast, palette: ouvrirPalette };
})();
