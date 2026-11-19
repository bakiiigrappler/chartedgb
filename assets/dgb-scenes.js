/* =========================================================================
   Scènes de la page de connexion · Suite DSI · DGB
   -------------------------------------------------------------------------
   Une scène par métier administratif, toutes sur le même socle isométrique
   bleu, avec le logo DGB intégré au dessin et trois fiches flottantes qui
   disent ce que fait l'application.

     parc      Gestion du parc informatique (le siège et ses équipements)
     courrier  Courrier (OKANDAH) : arrivée, casier d'imputation, départ
     projet    Projets d'investissement (ABAT) : chantier, grue, jalons
     rh        Ressources humaines : postes de travail, organigramme
     budget    Exécution budgétaire : engagements, crédits, pièces
     archives  Archives et GED : rayonnages, numérisation, recherche
     marches   Marchés publics : offres, balance d'évaluation, contrat
     audit     Contrôle et audit : pièces, loupe, visa

   Usage : DGB_SCENES.courrier(document.getElementById('scene'));
   Aplats uniquement. Les animations (fiches qui flottent, liaisons qui
   défilent) sont décrites dans dgb-connexion.css et respectent
   prefers-reduced-motion.
   ========================================================================= */
(function () {
  'use strict';

  /* ---------------- Projection et primitives ---------------- */
  var K = 24, CX = 300, CY = 150;
  function P(x, y, z) { return [CX + (x - y) * K * 0.866, CY + (x + y) * K * 0.5 - (z || 0) * K]; }
  function f1(n) { return n.toFixed(1); }
  function pts(l) { return l.map(function (p) { return f1(p[0]) + ',' + f1(p[1]); }).join(' '); }
  function poly(l, f, extra) { return '<polygon points="' + pts(l) + '" fill="' + f + '"' + (extra || '') + '/>'; }
  function pave(x, y, z, w, d, h, c) {
    return poly([P(x + w, y, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x + w, y, z + h)], c[1]) +
           poly([P(x, y + d, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x, y + d, z + h)], c[2]) +
           poly([P(x, y, z + h), P(x + w, y, z + h), P(x + w, y + d, z + h), P(x, y + d, z + h)], c[0]);
  }
  function faceX(x, y, z, d, h, f) { return poly([P(x, y, z), P(x, y + d, z), P(x, y + d, z + h), P(x, y, z + h)], f); }
  function faceY(x, y, z, w, h, f) { return poly([P(x, y, z), P(x + w, y, z), P(x + w, y, z + h), P(x, y, z + h)], f); }
  function dessus(x, y, z, w, d, f) { return poly([P(x, y, z), P(x + w, y, z), P(x + w, y + d, z), P(x, y + d, z)], f); }
  /* Groupe dessiné dans un plan : 'dessus' (sol), 'x' (face droite) ou 'y' (face gauche) */
  function plan(type, x, y, z, contenu) {
    var o = P(x, y, z), m;
    if (type === 'dessus') m = '0.866,0.5,-0.866,0.5';
    else if (type === 'y') m = '0.866,0.5,0,1';
    else m = '0.866,-0.5,0,1';
    return '<g transform="matrix(' + m + ',' + f1(o[0]) + ',' + f1(o[1]) + ')">' + contenu + '</g>';
  }

  var C = {
    socle: ['#1f4c8f', '#173d75', '#10305e'],
    blanc: ['#e9f0fa', '#bfd0e8', '#a7bddb'],
    bleu: ['#e9f0fa', '#3c71bf', '#2b5da7'],
    sombre: ['#2c5189', '#183b6c', '#12305a'],
    papier: ['#f7f3e8', '#ddd4bf', '#cbc0a7'],
    or: '#e2b93b', orFonce: '#b8922e', marine: '#12305f', encre: '#0f2445', gris: '#5d6b82',
    tri: ['#12805f', '#f7c21e', '#4f8fd6']
  };

  function socle() {
    var s = pave(0, 0, 0, 10, 10, 0.5, C.socle);
    for (var i = 1; i < 10; i++) {
      s += '<line x1="' + f1(P(i, 0, .5)[0]) + '" y1="' + f1(P(i, 0, .5)[1]) + '" x2="' + f1(P(i, 10, .5)[0]) + '" y2="' + f1(P(i, 10, .5)[1]) + '" stroke="#fff" stroke-opacity=".06"/>';
      s += '<line x1="' + f1(P(0, i, .5)[0]) + '" y1="' + f1(P(0, i, .5)[1]) + '" x2="' + f1(P(10, i, .5)[0]) + '" y2="' + f1(P(10, i, .5)[1]) + '" stroke="#fff" stroke-opacity=".06"/>';
    }
    /* filet tricolore sur la tranche avant du socle */
    for (var t = 0; t < 3; t++) s += faceY(t * 10 / 3, 10, 0.06, 10 / 3, 0.12, C.tri[t]);
    return s;
  }
  /* Chemin doré au sol, en angles droits */
  var calme = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var nbChemins = 0;
  function chemin(points, z) {
    z = z || .52;
    var pp = points.map(function (p) { return P(p[0], p[1], z); });
    var out = '<polyline class="scene-lien" points="' + pts(pp) +
      '" fill="none" stroke="' + C.or + '" stroke-width="1.7" stroke-dasharray="5 7" stroke-linecap="round" stroke-linejoin="round"/>';
    if (!calme) {
      var d = 'M' + pp.map(function (q) { return f1(q[0]) + ' ' + f1(q[1]); }).join(' L');
      var duree = (2.6 + (nbChemins % 3) * .7).toFixed(1), retard = (nbChemins++ * .55 % 2.4).toFixed(2);
      out += '<circle r="3.4" fill="#fff3c4" stroke="' + C.or + '" stroke-width="1.2" opacity="0"><animateMotion dur="' + duree + 's" begin="' + retard + 's" repeatCount="indefinite" path="' + d + '"/>' +
        '<animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.12;.85;1" dur="' + duree + 's" begin="' + retard + 's" repeatCount="indefinite"/></circle>';
    }
    return out;
  }
  /* Fiche flottante */
  function fiche(cls, x, y, w, icone, titre, detail, accent) {
    return '<g class="scene-carte ' + cls + '"><rect x="' + x + '" y="' + y + '" width="' + w + '" height="56" rx="10" fill="#fff"/>' +
      '<rect x="' + (x + 12) + '" y="' + (y + 12) + '" width="32" height="32" rx="8" fill="' + (accent ? '#fbf2d6' : '#e7eef9') + '"/>' + icone(x + 28, y + 28) +
      '<text x="' + (x + 54) + '" y="' + (y + 25) + '" font-family="Archivo, \'Public Sans\', sans-serif" font-weight="700" font-size="13" fill="' + C.encre + '">' + titre + '</text>' +
      '<text x="' + (x + 54) + '" y="' + (y + 42) + '" font-family="\'Public Sans\', sans-serif" font-size="11" fill="' + C.gris + '">' + detail + '</text></g>';
  }
  function trait(a, b) {
    return '<path d="M' + a[0] + ' ' + a[1] + ' L' + f1(b[0]) + ' ' + f1(b[1]) + '" stroke="#fff" stroke-opacity=".35" stroke-width="1.2" stroke-dasharray="3 4"/>' +
      '<circle cx="' + f1(b[0]) + '" cy="' + f1(b[1]) + '" r="3" fill="' + C.or + '"/>';
  }
  function texteSol(x, y, z, t, couleur, taille) {
    var p = P(x, y, z);
    return '<text x="' + f1(p[0]) + '" y="' + f1(p[1]) + '" text-anchor="middle" font-family="Archivo,sans-serif" font-size="' + (taille || 8) + '" font-weight="700" letter-spacing="1.4" fill="' + (couleur || '#a9c6ee') + '">' + t + '</text>';
  }
  function sceau(cx, cy, r, texte) {
    return '<g transform="translate(' + cx + ',' + cy + ') rotate(-14)"><circle r="' + r + '" fill="none" stroke="' + C.or + '" stroke-width="1.6"/>' +
      '<circle r="' + (r - 5) + '" fill="none" stroke="' + C.or + '" stroke-width=".8" stroke-opacity=".6"/>' +
      '<text y="-1" text-anchor="middle" font-family="\'Times New Roman\',Georgia,serif" font-size="' + (r * .42) + '" fill="#f7df9a">DGB</text>' +
      '<text y="' + (r * .42) + '" text-anchor="middle" font-family="Archivo,sans-serif" font-size="' + (r * .2) + '" font-weight="700" letter-spacing=".8" fill="#f7df9a">' + texte + '</text></g>';
  }
  /* Logo DGB peint dans un plan (dessus d'un volume) */
  function logoPeint(type, x, y, z, largeur, couleur) {
    var l = largeur, fs = l * .42;
    return plan(type, x, y, z,
      '<text x="' + (l / 2) + '" y="' + (l * .5) + '" text-anchor="middle" font-family="\'Times New Roman\', Georgia, serif" font-size="' + fs + '" letter-spacing="-1.5" fill="' + (couleur || C.marine) + '">DGB</text>' +
      '<rect x="' + (l * .2) + '" y="' + (l * .58) + '" width="' + (l * .2) + '" height="' + (l * .045) + '" fill="' + C.tri[0] + '"/>' +
      '<rect x="' + (l * .4) + '" y="' + (l * .58) + '" width="' + (l * .2) + '" height="' + (l * .045) + '" fill="' + C.tri[1] + '"/>' +
      '<rect x="' + (l * .6) + '" y="' + (l * .58) + '" width="' + (l * .2) + '" height="' + (l * .045) + '" fill="' + C.tri[2] + '"/>');
  }

  /* ---------------- Icônes des fiches ---------------- */
  var B = '#1d4f9a';
  var ico = {
    courrier: function (x, y) { return '<rect x="' + (x - 9) + '" y="' + (y - 6) + '" width="18" height="12" rx="2" fill="none" stroke="' + B + '" stroke-width="1.7"/><path d="M' + (x - 9) + ' ' + (y - 4) + 'l9 6 9-6" fill="none" stroke="' + B + '" stroke-width="1.7" stroke-linejoin="round"/>'; },
    coche: function (x, y) { return '<circle cx="' + x + '" cy="' + y + '" r="9" fill="' + C.or + '"/><path d="M' + (x - 4) + ' ' + y + 'l3 3 5-6" fill="none" stroke="' + C.marine + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'; },
    liste: function (x, y) { return '<path d="M' + (x - 7) + ' ' + (y - 5) + 'h14M' + (x - 7) + ' ' + y + 'h14M' + (x - 7) + ' ' + (y + 5) + 'h9" stroke="' + B + '" stroke-width="1.8" stroke-linecap="round"/>'; },
    portable: function (x, y) { return '<rect x="' + (x - 8) + '" y="' + (y - 6) + '" width="16" height="10" rx="1.5" fill="none" stroke="' + B + '" stroke-width="1.8"/><path d="M' + (x - 10) + ' ' + (y + 7) + 'h20" stroke="' + B + '" stroke-width="1.8" stroke-linecap="round"/>'; },
    horloge: function (x, y) { return '<circle cx="' + x + '" cy="' + y + '" r="8" fill="none" stroke="' + B + '" stroke-width="1.7"/><path d="M' + x + ' ' + (y - 4) + 'v4l3 2" fill="none" stroke="' + B + '" stroke-width="1.7" stroke-linecap="round"/>'; },
    fleche: function (x, y) { return '<path d="M' + (x - 8) + ' ' + y + 'h14m-5-5 5 5-5 5" fill="none" stroke="' + B + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>'; },
    jalon: function (x, y) { return '<path d="M' + x + ' ' + (y - 9) + 'l4.5 4.5-4.5 4.5-4.5-4.5z" fill="' + C.or + '" stroke="' + C.marine + '" stroke-width="1.2"/><path d="M' + (x - 7) + ' ' + (y + 7) + 'h14" stroke="' + B + '" stroke-width="1.7" stroke-linecap="round"/>'; },
    agent: function (x, y) { return '<circle cx="' + x + '" cy="' + (y - 3) + '" r="3.6" fill="' + B + '"/><path d="M' + (x - 7) + ' ' + (y + 8) + 'a7 6 0 0 1 14 0" fill="none" stroke="' + B + '" stroke-width="1.8" stroke-linecap="round"/>'; },
    equipe: function (x, y) { return '<circle cx="' + (x - 4) + '" cy="' + (y - 3) + '" r="3" fill="' + B + '"/><circle cx="' + (x + 5) + '" cy="' + (y - 2) + '" r="2.5" fill="' + B + '" fill-opacity=".6"/><path d="M' + (x - 10) + ' ' + (y + 8) + 'a6 5 0 0 1 12 0M' + (x + 1) + ' ' + (y + 8) + 'a5 4 0 0 1 9 0" fill="none" stroke="' + B + '" stroke-width="1.6" stroke-linecap="round"/>'; },
    monnaie: function (x, y) { return '<ellipse cx="' + x + '" cy="' + (y + 3) + '" rx="8" ry="3.5" fill="' + C.or + '"/><rect x="' + (x - 8) + '" y="' + (y - 4) + '" width="16" height="7" fill="' + C.or + '"/><ellipse cx="' + x + '" cy="' + (y - 4) + '" rx="8" ry="3.5" fill="#f2d377" stroke="' + C.orFonce + '" stroke-width=".8"/>'; },
    graphe: function (x, y) { return '<path d="M' + (x - 8) + ' ' + (y + 7) + 'V' + (y + 1) + 'M' + (x - 3) + ' ' + (y + 7) + 'V' + (y - 4) + 'M' + (x + 2) + ' ' + (y + 7) + 'V' + (y - 1) + 'M' + (x + 7) + ' ' + (y + 7) + 'V' + (y - 7) + '" stroke="' + B + '" stroke-width="2.6" stroke-linecap="round"/>'; },
    boite: function (x, y) { return '<rect x="' + (x - 8) + '" y="' + (y - 5) + '" width="16" height="12" rx="1.5" fill="none" stroke="' + B + '" stroke-width="1.7"/><path d="M' + (x - 9) + ' ' + (y - 5) + 'h18M' + (x - 3) + ' ' + (y) + 'h6" stroke="' + B + '" stroke-width="1.7" stroke-linecap="round"/>'; },
    loupe: function (x, y) { return '<circle cx="' + (x - 2) + '" cy="' + (y - 2) + '" r="6" fill="none" stroke="' + B + '" stroke-width="1.8"/><path d="M' + (x + 2.5) + ' ' + (y + 2.5) + 'l5 5" stroke="' + B + '" stroke-width="2" stroke-linecap="round"/>'; },
    alerte: function (x, y) { return '<path d="M' + x + ' ' + (y - 8) + 'l8.5 15h-17z" fill="#fbe7c1" stroke="#a26722" stroke-width="1.5" stroke-linejoin="round"/><path d="M' + x + ' ' + (y - 3) + 'v5" stroke="#a26722" stroke-width="1.8" stroke-linecap="round"/>'; },
    marteau: function (x, y) { return '<rect x="' + (x - 7) + '" y="' + (y - 8) + '" width="10" height="6" rx="1" transform="rotate(-35 ' + x + ' ' + y + ')" fill="' + B + '"/><path d="M' + (x - 1) + ' ' + (y - 1) + 'l7 8" stroke="' + B + '" stroke-width="2.2" stroke-linecap="round"/><path d="M' + (x - 9) + ' ' + (y + 8) + 'h9" stroke="' + B + '" stroke-width="1.8" stroke-linecap="round"/>'; },
    sceau: function (x, y) { return '<circle cx="' + x + '" cy="' + (y - 1) + '" r="7" fill="none" stroke="' + B + '" stroke-width="1.7"/><path d="M' + (x - 4) + ' ' + (y + 5) + 'l-2 5 6-2 6 2-2-5" fill="' + B + '"/>'; }
  };

  function svg(cible, contenu, label) {
    cible.innerHTML = '<svg viewBox="0 0 600 420" role="img" aria-label="' + label + '">' + contenu + '</svg>';
  }

  /* Petite personne isométrique (assise ou debout) */
  function personne(x, y, z, teinte) {
    var s = pave(x, y, z, .5, .45, .62, [teinte || '#4f8fd6', teinte ? shade(teinte, -.18) : '#3c71bf', teinte ? shade(teinte, -.32) : '#2b5da7']);
    var t = P(x + .25, y + .22, z + .92);
    return s + '<circle cx="' + f1(t[0]) + '" cy="' + f1(t[1]) + '" r="6.2" fill="#c98f62"/><path d="M' + f1(t[0] - 6.2) + ' ' + f1(t[1] - 1) + 'a6.2 6.2 0 0 1 12.4 0z" fill="#2a1d14"/>';
  }
  function shade(hex, k) {
    var n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    function c(v) { return Math.max(0, Math.min(255, Math.round(v * (1 + k)))); }
    return '#' + ((1 << 24) + (c(r) << 16) + (c(g) << 8) + c(b)).toString(16).slice(1);
  }
  /* Poste de travail : bureau + écran */
  function bureau(x, y, ecran) {
    var s = pave(x, y, .5, 1.6, 1.0, .55, C.blanc);
    s += pave(x + .55, y + .1, 1.05, .5, .3, .05, ['#9fb4d2', '#8aa3c6', '#7f98bc']);
    s += faceY(x + .25, y + .25, 1.1, 1.1, .65, '#0f2a52') + faceY(x + .32, y + .25, 1.17, .96, .51, ecran || '#4f8fd6');
    return s;
  }
  /* Enveloppe à plat */
  function enveloppe(x, y, z, w, d, cachet) {
    var s = pave(x, y, z, w, d, .07, C.papier), c = P(x + w / 2, y + d / 2, z + .07);
    s += '<path d="M' + pts([P(x, y, z + .07)]) + ' L' + f1(c[0]) + ',' + f1(c[1]) + ' L' + pts([P(x + w, y, z + .07)]) + '" fill="none" stroke="#c4b796" stroke-width="1"/>';
    if (cachet) s += '<circle cx="' + f1(c[0]) + '" cy="' + f1(c[1]) + '" r="3.6" fill="' + C.or + '" stroke="' + C.orFonce + '" stroke-width=".7"/>';
    return s;
  }

  /* =======================================================================
     PARC — le siège de la DGB relié à ses équipements
     ======================================================================= */
  function sceneParc(cible) {
    var s = socle();
    s += chemin([[8.45, 2.1], [6.4, 2.1], [6.4, 3]]);
    s += chemin([[1.75, 8.2], [3, 8.2], [3, 6.2]]);
    s += chemin([[8.3, 6.45], [7.5, 6.45]]);
    /* portable (arrière droit) */
    s += pave(7.7, 1.1, .5, 1.5, 1.1, .12, C.blanc);
    s += faceY(7.75, 1.1, .62, 1.4, 1.05, '#0f2a52') + faceY(7.86, 1.1, .72, 1.18, .85, '#4f8fd6');
    s += faceY(7.98, 1.1, 1.2, .6, .12, '#cfe0f6') + faceY(7.98, 1.1, .98, .9, .08, '#9cc3f0');
    /* siège */
    var BX = 3, BY = 3, BW = 4.5, Z0 = .5, ZT = 3.9;
    s += pave(BX, BY, Z0, BW, BW, 3.4, C.bleu);
    var allumees = { '1-2': 1, '2-0': 1, '0-3': 1 };
    for (var l = 0; l < 3; l++) for (var c = 0; c < 4; c++) {
      var z = 1.15 + l * .85;
      s += faceX(BX + BW, BY + .45 + c, z, .55, .5, allumees[l + '-' + c] ? '#f2c94c' : '#8fb7ea');
      if (!(l === 0 && (c === 1 || c === 2))) s += faceY(BX + .45 + c, BY + BW, z, .55, .5, allumees[(l + 1) % 3 + '-' + c] ? '#f2c94c' : '#7aa6e0');
    }
    s += faceY(BX + 1.55, BY + BW, Z0, 1.4, 1.05, '#16386b') + faceY(BX + 1.4, BY + BW, Z0 + 1.05, 1.7, .12, '#e9f0fa');
    for (var t = 0; t < 3; t++) { s += faceX(BX + BW, BY + t * 1.5, ZT - .32, 1.5, .2, C.tri[t]); s += faceY(BX + t * 1.5, BY + BW, ZT - .32, 1.5, .2, C.tri[t]); }
    s += dessus(BX + .25, BY + .25, ZT, BW - .5, BW - .5, '#dbe6f5');
    s += logoPeint('dessus', BX, BY, ZT, 108);
    /* baie serveur */
    s += pave(8.3, 5.9, .5, 1.1, 1.1, 2.2, C.sombre);
    for (var r = 0; r < 5; r++) {
      s += faceX(9.4, 6.1, .75 + r * .38, .7, .14, '#0c2446');
      var d = P(9.4, 6.85, .82 + r * .38);
      s += '<circle cx="' + f1(d[0]) + '" cy="' + f1(d[1]) + '" r="1.8" class="scene-led" style="animation-delay:' + (r * .3) + 's" fill="' + (r === 1 ? C.or : '#3fd29b') + '"/>';
    }
    /* imprimante */
    s += pave(1, 7.6, .5, 1.5, 1.2, .8, ['#e2eaf6', '#b9cbe3', '#a2b8d7']);
    s += dessus(1.25, 7.85, 1.3, 1, .4, '#8aa3c6') + pave(1.35, 7.75, 1.3, .8, .5, .05, ['#fff', '#dfe7f2', '#d2dcea']);
    s += trait([120, 92], P(8.45, 1.6, 1.7));
    s += trait([470, 84], P(BX + BW, BY + 1.2, ZT));
    s += trait([118, 330], P(1.75, 8.2, 1.35));
    s += fiche('c1', 400, 28, 182, ico.coche, 'Affectation validée', 'AFF-2026-0412 · DAF', true);
    s += fiche('c2', 6, 64, 212, ico.portable, 'DGB-PC-02817', 'Affecté · Service de la solde');
    s += fiche('c3', 6, 302, 178, ico.liste, '1 284 équipements', 'recensés dans le parc');
    svg(cible, s, 'Le siège de la DGB relié aux équipements informatiques qu’il recense');
  }

  /* =======================================================================
     COURRIER — arrivée, casier d'imputation, départ (OKANDAH)
     ======================================================================= */
  function sceneCourrier(cible) {
    var s = socle();
    /* circuit : arrivée → casier → départ */
    s += chemin([[1.7, 6.0], [1.7, 7.0], [5.0, 7.0], [5.0, 5.9]]);
    s += chemin([[6.6, 5.0], [8.45, 5.0], [8.45, 6.6]]);
    s += chemin([[3.8, 7.0], [3.8, 8.6], [3.4, 8.6]]);
    /* plis en transit sur le circuit */
    s += enveloppe(2.4, 6.75, .52, .7, .5, true);
    s += enveloppe(7.3, 4.75, .52, .7, .5, false);

    /* bac ARRIVÉE (arrière gauche) avec sa pile */
    s += pave(.5, 4.2, .5, 2.4, 1.8, .3, C.sombre);
    for (var i = 0; i < 6; i++) s += enveloppe(.65 + (i % 2) * .08, 4.32 + (i % 3) * .05, .8 + i * .09, 2.05, 1.45, i === 5);
    s += texteSol(1.7, 6.55, .4, 'ARRIVÉE', '#a9c6ee', 7.5);

    /* casier d'imputation : façade à alvéoles, un pli dans certaines cases */
    var X = 3.4, Y = 3.6, W = 3.2, D = 2.3, H = 2.9;
    s += pave(X, Y, .5, W, D, H, C.bleu);
    var services = ['DB', 'DAF', 'DSI', 'SOL', 'CAB', 'DGA', 'CTR', 'ARC', 'RH'];
    for (var r = 0; r < 3; r++) for (var c = 0; c < 3; c++) {
      var x = X + .18 + c * 1.0, z = .7 + r * .9;
      s += faceY(x, Y + D, z, .82, .66, '#14376b');
      if ((r + c) % 2 === 0) s += faceY(x + .08, Y + D, z + .06, .66, .22, '#f7f3e8');
      var e = P(x + .41, Y + D, z + .5);
      s += '<text x="' + f1(e[0]) + '" y="' + f1(e[1]) + '" text-anchor="middle" font-family="Archivo,sans-serif" font-size="6" font-weight="700" fill="#a9c6ee" transform="skewY(30) translate(0,' + f1(-e[0] * Math.tan(Math.PI / 6)) + ')">' + services[r * 3 + c] + '</text>';
    }
    /* façade droite : plaque OKANDAH */
    s += faceX(X + W, Y + .35, 1.5, 1.6, .9, '#2b5da7');
    s += plan('x', X + W, Y + 1.95, 2.4, '<text x="5" y="14" font-family="Archivo,sans-serif" font-size="8.5" font-weight="700" letter-spacing="1.2" fill="#dbe6f5">COURRIER</text>');
    s += dessus(X + .2, Y + .2, .5 + H, W - .4, D - .4, '#dbe6f5');
    s += logoPeint('dessus', X + .25, Y + .1, .5 + H, 66);

    /* bac DÉPART (avant) */
    s += pave(1.6, 8, .5, 1.8, 1.4, .3, ['#e2eaf6', '#b9cbe3', '#a2b8d7']);
    s += enveloppe(1.75, 8.1, .8, 1.5, 1.1, true) + enveloppe(1.8, 8.15, .89, 1.5, 1.1, false);
    s += texteSol(2.5, 9.75, .3, 'DÉPART', '#a9c6ee', 7.5);

    /* bac à droite : courrier à signer */
    s += pave(7.6, 6.6, .5, 1.7, 1.4, .3, C.sombre);
    s += enveloppe(7.75, 6.7, .8, 1.4, 1.1, false);
    s += texteSol(8.45, 8.35, .3, 'À SIGNER', '#f2d377', 7);

    /* lettre officielle flottante (plan écran) */
    s += '<g class="scene-carte c2" transform="translate(408,74) rotate(5)">' +
      '<rect width="150" height="184" rx="6" fill="#fff"/>' +
      '<text x="14" y="28" font-family="\'Times New Roman\',Georgia,serif" font-size="20" letter-spacing="-1" fill="' + C.marine + '">DGB</text>' +
      '<rect x="14" y="33" width="15" height="2.5" fill="' + C.tri[0] + '"/><rect x="29" y="33" width="15" height="2.5" fill="' + C.tri[1] + '"/><rect x="44" y="33" width="15" height="2.5" fill="' + C.tri[2] + '"/>' +
      '<text x="136" y="24" text-anchor="end" font-family="\'Public Sans\',sans-serif" font-size="6.5" fill="' + C.gris + '">Libreville, le 18/11/2026</text>' +
      '<text x="14" y="58" font-family="Archivo,sans-serif" font-size="8" font-weight="700" fill="' + C.encre + '">N° 0412/MEF/DGB/DSI</text>' +
      '<text x="14" y="72" font-family="\'Public Sans\',sans-serif" font-size="7" fill="' + C.gris + '">Objet : affectation de matériel</text>' +
      '<rect x="14" y="84" width="118" height="3" rx="1.5" fill="#dfe6f0"/><rect x="14" y="93" width="108" height="3" rx="1.5" fill="#dfe6f0"/>' +
      '<rect x="14" y="102" width="114" height="3" rx="1.5" fill="#dfe6f0"/><rect x="14" y="111" width="80" height="3" rx="1.5" fill="#dfe6f0"/>' +
      '<path d="M84 150c6-10 12 4 18-4s10 2 16-3" fill="none" stroke="' + C.marine + '" stroke-width="1.4" stroke-linecap="round"/>' +
      '<text x="84" y="164" font-family="\'Public Sans\',sans-serif" font-size="6" fill="' + C.gris + '">Le Directeur général</text>' +
      '<g transform="translate(42,146) rotate(-16)"><rect x="-30" y="-11" width="60" height="22" rx="3" fill="none" stroke="#1d4f9a" stroke-width="1.6"/>' +
      '<text y="-1" text-anchor="middle" font-family="Archivo,sans-serif" font-size="7" font-weight="800" letter-spacing="1" fill="#1d4f9a">ENREGISTRÉ</text>' +
      '<text y="7.5" text-anchor="middle" font-family="Archivo,sans-serif" font-size="5.5" font-weight="700" fill="#1d4f9a">18 NOV 2026</text></g></g>';

    s += trait([174, 92], P(1.7, 5.0, 1.4));
    s += trait([176, 330], P(2.5, 8.6, 1));
    s += fiche('c1', 6, 64, 210, ico.courrier, 'Courrier arrivé', 'N° 2026-04812 · 09:42', true);
    s += fiche('c3', 6, 302, 212, ico.fleche, 'Imputé à la DSI', 'Réponse attendue sous 5 jours');
    svg(cible, s, 'Le circuit du courrier de la DGB : arrivée, casier d’imputation par service, signature et départ');
  }

  /* =======================================================================
     PROJET — chantier d'investissement public (ABAT)
     ======================================================================= */
  function sceneProjet(cible) {
    var s = socle();
    /* route en façade, avec ses jalons */
    s += pave(0, 7.4, .5, 10, 1.6, .04, ['#2a3f5f', '#22344f', '#1b2a40']);
    for (var i = 0; i < 6; i++) s += dessus(.5 + i * 1.6, 8.12, .55, .8, .14, '#e9f0fa');
    [[1.2, 7.25, 1], [4.4, 7.25, 1], [7.6, 7.25, 0]].forEach(function (j) {
      var b = P(j[0], j[1], .55), h = P(j[0], j[1], 1.6);
      s += '<line x1="' + f1(b[0]) + '" y1="' + f1(b[1]) + '" x2="' + f1(h[0]) + '" y2="' + f1(h[1]) + '" stroke="#dbe6f5" stroke-width="1.6"/>';
      s += '<path class="scene-drapeau" d="M' + f1(h[0]) + ' ' + f1(h[1]) + 'l14 5-14 5z" fill="' + (j[2] ? C.or : '#83bde7') + '"/>';
    });
    /* école livrée (gauche) */
    s += pave(.6, 2.2, .5, 2.4, 3.2, 1.5, ['#e9f0fa', '#cfdcee', '#b7c9e2']);
    for (var w = 0; w < 3; w++) s += faceX(3.0, 2.5 + w * 1.0, 1.0, .6, .5, '#7aa6e0');
    s += faceY(1.0, 5.4, .5, .7, .9, '#1c4379') + faceY(1.9, 5.4, 1.05, .8, .45, '#7aa6e0');
    s += poly([P(.6, 2.2, 2), P(3, 2.2, 2), P(3, 3.8, 2.6), P(.6, 3.8, 2.6)], '#a63d3d') + poly([P(.6, 3.8, 2.6), P(3, 3.8, 2.6), P(3, 5.4, 2), P(.6, 5.4, 2)], '#c45656');
    s += texteSol(2.0, 6.7, .55, 'ÉCOLE · LIVRÉE', '#a9c6ee', 6.5);

    /* bâtiment en construction : dalles et poteaux */
    var X = 4.2, Y = 2.4, W = 3.4, D = 3.4;
    s += pave(X, Y, .5, W, D, .25, C.blanc);
    for (var n = 0; n < 2; n++) {
      var z0 = .75 + n * 1.25;
      [[0, 0], [W - .25, 0], [0, D - .25], [W - .25, D - .25], [W / 2 - .12, D - .25], [W - .25, D / 2 - .12]].forEach(function (p) {
        s += pave(X + p[0], Y + p[1], z0, .25, .25, 1.0, ['#dfe8f5', '#b9cbe3', '#a2b8d7']);
      });
      s += pave(X, Y, z0 + 1.0, W, D, .25, n === 1 ? ['#f2d377', '#c9a23a', '#b38f2f'] : C.blanc);
    }
    /* échafaudage côté droit */
    for (var e = 0; e < 4; e++) s += faceX(X + W + .3, Y + .2 + e * .8, .5, .06, 3.1, '#e2b93b');
    for (var h2 = 0; h2 < 3; h2++) s += faceX(X + W + .3, Y + .2, 1.2 + h2 * .9, 2.5, .06, '#e2b93b');
    s += logoPeint('dessus', X + .3, Y + .3, 3.0, 76, '#12305f');

    /* grue */
    var gx = 8.6, gy = 1.6;
    s += pave(gx - .3, gy - .3, .5, .9, .9, .2, C.sombre);
    for (var m = 0; m < 9; m++) s += pave(gx, gy, .7 + m * .55, .3, .3, .5, ['#f7c21e', '#d9a514', '#c49412']);
    var sommet = P(gx + .15, gy + .15, 5.6), bout = P(gx - 4.8, gy + .15, 5.6), contre = P(gx + 1.6, gy + .15, 5.6);
    s += '<line x1="' + f1(contre[0]) + '" y1="' + f1(contre[1]) + '" x2="' + f1(bout[0]) + '" y2="' + f1(bout[1]) + '" stroke="#f7c21e" stroke-width="4" stroke-linecap="round"/>';
    s += '<line x1="' + f1(sommet[0]) + '" y1="' + f1(sommet[1] - 18) + '" x2="' + f1(bout[0]) + '" y2="' + f1(bout[1]) + '" stroke="#f7c21e" stroke-width="1.2"/>';
    s += '<rect x="' + f1(contre[0] - 6) + '" y="' + f1(contre[1] - 2) + '" width="12" height="10" fill="#183b6c"/>';
    var crochet = P(gx - 3.4, gy + .15, 5.6), charge = P(gx - 3.4, gy + .15, 3.9);
    s += '<line x1="' + f1(crochet[0]) + '" y1="' + f1(crochet[1]) + '" x2="' + f1(charge[0]) + '" y2="' + f1(charge[1]) + '" stroke="#dbe6f5" stroke-width="1"/>';
    s += '<g class="scene-charge">' + pave(gx - 3.75, gy - .05, 3.3, .7, .4, .4, ['#f2d377', '#c9a23a', '#b38f2f']) + '</g>';

    /* planning flottant */
    var bx = 214, by = 8, bw = 250, bh = 118;
    s += '<g class="scene-carte c2"><rect x="' + bx + '" y="' + by + '" width="' + bw + '" height="' + bh + '" rx="10" fill="#fff"/>' +
      '<text x="' + (bx + 12) + '" y="' + (by + 18) + '" font-family="Archivo,sans-serif" font-size="10" font-weight="700" fill="' + C.encre + '">PIP-2026-014 · Lycée de Ntoum</text>' +
      '<rect x="' + (bx + bw - 50) + '" y="' + (by + 8) + '" width="40" height="14" rx="7" fill="' + C.or + '"/><text x="' + (bx + bw - 30) + '" y="' + (by + 18) + '" text-anchor="middle" font-family="\'Public Sans\',sans-serif" font-size="7.5" font-weight="700" fill="' + C.marine + '">68 %</text>';
    [['Études', 0, 40, '#b4d7f1'], ['Marché', 28, 46, '#83bde7'], ['Gros œuvre', 64, 70, '#3c71bf'], ['Finitions', 120, 46, '#2253a3'], ['Réception', 156, 24, C.or]].forEach(function (l, i) {
      var yy = by + 30 + i * 16;
      s += '<text x="' + (bx + 12) + '" y="' + (yy + 9) + '" font-family="\'Public Sans\',sans-serif" font-size="7.5" fill="' + C.gris + '">' + l[0] + '</text>';
      s += '<rect x="' + (bx + 64 + l[1]) + '" y="' + (yy + 1) + '" width="' + l[2] + '" height="9" rx="3" fill="' + l[3] + '"/>';
    });
    s += '<line x1="' + (bx + 64 + 112) + '" y1="' + (by + 28) + '" x2="' + (bx + 64 + 112) + '" y2="' + (by + bh - 6) + '" stroke="#a32638" stroke-width="1.1" stroke-dasharray="3 3"/></g>';

    s += trait([170, 312], P(1.2, 7.25, 1.5));
    s += fiche('c1', 6, 142, 200, ico.jalon, 'Jalon atteint', 'Gros œuvre · 18/11/2026', true);
    s += fiche('c3', 6, 312, 196, ico.graphe, 'Exécution : 1,2 Md', 'sur 1,8 Md FCFA engagés');
    svg(cible, s, 'Un projet d’investissement public : école livrée, bâtiment en chantier, grue, route et jalons');
  }

  /* =======================================================================
     RH — postes de travail et organigramme
     ======================================================================= */
  function sceneRh(cible) {
    var s = socle();
    /* allées */
    s += chemin([[2.4, 3.2], [5, 3.2], [5, 6.8], [7.6, 6.8]]);
    /* quatre postes occupés */
    s += bureau(1.4, 1.6, '#4f8fd6') + personne(2.0, 2.75, .5, '#e2b93b');
    s += bureau(5.6, 1.6, '#83bde7') + personne(6.2, 2.75, .5, '#4f8fd6');
    s += bureau(1.4, 5.4, '#83bde7') + personne(2.0, 6.55, .5, '#12805f');
    s += bureau(5.6, 5.4, '#4f8fd6') + personne(6.2, 6.55, .5, '#a13a8b');
    /* armoire des dossiers du personnel */
    s += pave(8.4, 1.2, .5, 1.0, 1.6, 2.4, C.bleu);
    for (var t = 0; t < 4; t++) { s += faceX(9.4, 1.35, .7 + t * .55, 1.3, .42, '#2b5da7'); var p = P(9.4, 2.0, .9 + t * .55); s += '<rect x="' + f1(p[0] - 4) + '" y="' + f1(p[1] - 2) + '" width="8" height="3" rx="1" fill="#dbe6f5"/>'; }
    s += texteSol(8.9, 3.05, .58, 'DOSSIERS', '#a9c6ee', 6.5);
    /* tapis d'accueil avec le logo */
    s += dessus(4.4, 8.1, .52, 3.2, 1.4, '#183b6c');
    s += logoPeint('dessus', 4.95, 7.85, .54, 62, '#dbe6f5');

    /* organigramme flottant */
    var ox = 364, oy = 8;
    s += '<g class="scene-carte c2"><rect x="' + ox + '" y="' + oy + '" width="222" height="132" rx="10" fill="#fff"/>' +
      '<text x="' + (ox + 12) + '" y="' + (oy + 18) + '" font-family="Archivo,sans-serif" font-size="9.5" font-weight="700" fill="' + C.encre + '">Organigramme · DSI</text>';
    function boite(x, y, t, fort) {
      return '<rect x="' + x + '" y="' + y + '" width="58" height="22" rx="4" fill="' + (fort ? C.marine : '#e7eef9') + '"/>' +
        '<text x="' + (x + 29) + '" y="' + (y + 14) + '" text-anchor="middle" font-family="\'Public Sans\',sans-serif" font-size="7" font-weight="600" fill="' + (fort ? '#fff' : C.encre) + '">' + t + '</text>';
    }
    s += '<path d="M' + (ox + 111) + ' ' + (oy + 52) + 'v10M' + (ox + 41) + ' ' + (oy + 62) + 'h140M' + (ox + 41) + ' ' + (oy + 62) + 'v8M' + (ox + 111) + ' ' + (oy + 62) + 'v8M' + (ox + 181) + ' ' + (oy + 62) + 'v8M' + (ox + 111) + ' ' + (oy + 92) + 'v10" stroke="#b7c4d6" stroke-width="1.2" fill="none"/>';
    s += boite(ox + 82, oy + 30, 'Directeur', true);
    s += boite(ox + 12, oy + 70, 'Études', false) + boite(ox + 82, oy + 70, 'Réseaux', false) + boite(ox + 152, oy + 70, 'Support', false);
    s += '<rect x="' + (ox + 82) + '" y="' + (oy + 102) + '" width="58" height="22" rx="4" fill="#fbf2d6" stroke="' + C.or + '"/><text x="' + (ox + 111) + '" y="' + (oy + 116) + '" text-anchor="middle" font-family="\'Public Sans\',sans-serif" font-size="7" font-weight="700" fill="' + C.encre + '">Nouveau poste</text></g>';

    s += trait([176, 92], P(2.25, 3.0, 1.6));
    s += trait([180, 330], P(7.6, 6.8, .6));
    s += fiche('c1', 6, 64, 210, ico.agent, 'Agent recruté', 'Matricule 02817 · Solde', true);
    s += fiche('c3', 6, 302, 210, ico.equipe, '438 agents', '12 avancements à valider');
    svg(cible, s, 'Ressources humaines : postes de travail occupés, dossiers du personnel et organigramme');
  }

  /* =======================================================================
     BUDGET — crédits, engagements, piles de pièces
     ======================================================================= */
  function sceneBudget(cible) {
    var s = socle();
    /* histogramme isométrique : AE et CP par programme */
    var barres = [[1.1, 1.3, 2.6, '#83bde7'], [1.1, 2.5, 1.9, '#3c71bf'], [2.6, 1.3, 3.3, '#83bde7'], [2.6, 2.5, 2.7, '#3c71bf'], [4.1, 1.3, 2.2, '#83bde7'], [4.1, 2.5, 1.6, '#3c71bf']];
    barres.forEach(function (b) { s += pave(b[0], b[1], .5, .9, .9, b[2], [shade(b[3], .45), b[3], shade(b[3], -.15)]); });
    s += texteSol(3, 4.0, .58, 'AE · CP PAR PROGRAMME', '#a9c6ee', 6.5);
    /* coffre / registre au centre */
    s += pave(5.6, 4.2, .5, 2.6, 2.0, 1.4, C.sombre);
    s += faceY(5.8, 6.2, .7, 2.2, 1.0, '#1c4379');
    var serrure = P(6.9, 6.2, 1.2);
    s += '<circle cx="' + f1(serrure[0]) + '" cy="' + f1(serrure[1]) + '" r="9" fill="none" stroke="' + C.or + '" stroke-width="2"/><circle cx="' + f1(serrure[0]) + '" cy="' + f1(serrure[1]) + '" r="2.5" fill="' + C.or + '"/>';
    s += dessus(5.8, 4.4, 1.9, 2.2, 1.6, '#24508c');
    s += logoPeint('dessus', 6.0, 4.3, 1.92, 52, '#dbe6f5');
    /* piles de pièces */
    function pile(x, y, n) {
      var out = '';
      for (var i = 0; i < n; i++) {
        var c = P(x, y, .5 + i * .14);
        out += '<rect x="' + f1(c[0] - 14) + '" y="' + f1(c[1] - 3.4) + '" width="28" height="3.4" fill="' + C.orFonce + '"/>' +
          '<ellipse cx="' + f1(c[0]) + '" cy="' + f1(c[1]) + '" rx="14" ry="7" fill="' + C.orFonce + '"/>' +
          '<ellipse cx="' + f1(c[0]) + '" cy="' + f1(c[1] - 3.4) + '" rx="14" ry="7" fill="' + (i === n - 1 ? '#f2d377' : C.or) + '"/>';
      }
      return out;
    }
    s += pile(2.0, 6.8, 7) + pile(3.0, 7.6, 11) + pile(1.4, 8.2, 4);
    /* liasse de billets */
    s += pave(8.3, 7.4, .5, 1.2, .7, .3, ['#a8d5b9', '#7cb895', '#68a682']);
    s += dessus(8.55, 7.4, .81, .5, .7, '#e9f0fa');
    /* tableau flottant : taux d'exécution */
    var tx = 380, ty = 10;
    var r = 30, cx = tx + 48, cy = ty + 62, circ = 2 * Math.PI * r;
    s += '<g class="scene-carte c2"><rect x="' + tx + '" y="' + ty + '" width="206" height="118" rx="10" fill="#fff"/>' +
      '<text x="' + (tx + 12) + '" y="' + (ty + 18) + '" font-family="Archivo,sans-serif" font-size="9.5" font-weight="700" fill="' + C.encre + '">Exécution 2026 · Titre 3</text>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="#e7eef9" stroke-width="10"/>' +
      '<circle class="scene-anneau" cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="#2253a3" stroke-width="10" stroke-dasharray="' + f1(circ * .72) + ' ' + f1(circ) + '" transform="rotate(-90 ' + cx + ' ' + cy + ')"/>' +
      '<text x="' + cx + '" y="' + (cy + 4) + '" text-anchor="middle" font-family="Archivo,sans-serif" font-size="13" font-weight="700" fill="' + C.encre + '">72 %</text>' +
      '<text x="' + (tx + 94) + '" y="' + (ty + 46) + '" font-family="\'Public Sans\',sans-serif" font-size="7" fill="' + C.gris + '">CRÉDITS OUVERTS</text>' +
      '<text x="' + (tx + 94) + '" y="' + (ty + 59) + '" font-family="Archivo,sans-serif" font-size="10" font-weight="700" fill="' + C.encre + '">100 998 445</text>' +
      '<text x="' + (tx + 94) + '" y="' + (ty + 78) + '" font-family="\'Public Sans\',sans-serif" font-size="7" fill="' + C.gris + '">CONSOMMÉS</text>' +
      '<text x="' + (tx + 94) + '" y="' + (ty + 91) + '" font-family="Archivo,sans-serif" font-size="10" font-weight="700" fill="#2253a3">72 719 880</text></g>';
    s += trait([176, 330], P(3.0, 7.6, 2.0));
    s += trait([176, 92], P(5.6, 5.2, 1.9));
    s += fiche('c1', 6, 64, 238, ico.coche, 'Engagement visé', 'N° 26002547 · Contrôle budgétaire', true);
    s += fiche('c3', 6, 302, 200, ico.monnaie, 'Disponible : 14 M', 'sur la ligne 22-19.668.1-3');
    svg(cible, s, 'Exécution budgétaire : crédits par programme, registre de la DGB et piles de pièces');
  }

  /* =======================================================================
     ARCHIVES — rayonnages, numérisation, recherche
     ======================================================================= */
  function sceneArchives(cible) {
    var s = socle();
    /* deux rayonnages chargés de boîtes datées */
    function rayon(x, y) {
      var out = '', annees = ['2021', '2022', '2023', '2024', '2025', '2026'];
      for (var n = 0; n < 4; n++) out += pave(x, y, .5 + n * .9, .9, 3.2, .08, ['#cfdcee', '#9fb4d2', '#8aa3c6']);
      for (var e = 0; e < 3; e++) for (var b = 0; b < 3; b++) {
        var z = .58 + e * .9;
        out += pave(x + .08, y + .12 + b * 1.02, z, .74, .9, .7, ['#e8dcc3', '#cbb994', '#b9a57c']);
        var l = P(x + .82, y + .57 + b * 1.02, z + .42);
        out += '<rect x="' + f1(l[0] - 7) + '" y="' + f1(l[1] - 4) + '" width="14" height="7" fill="#fff" transform="skewY(-30) translate(0,' + f1(l[0] * Math.tan(Math.PI / 6)) + ')"/>';
        out += '<text x="' + f1(l[0]) + '" y="' + f1(l[1] + 1.5) + '" text-anchor="middle" font-family="Archivo,sans-serif" font-size="4.6" font-weight="700" fill="' + C.marine + '" transform="skewY(-30) translate(0,' + f1(l[0] * Math.tan(Math.PI / 6)) + ')">' + annees[(e * 3 + b) % 6] + '</text>';
      }
      for (var m = 0; m < 2; m++) out += pave(x + m * .82, y, .5, .08, .08, 3.0, ['#9fb4d2', '#7f98bc', '#6c87ae']) + pave(x + m * .82, y + 3.12, .5, .08, .08, 3.0, ['#9fb4d2', '#7f98bc', '#6c87ae']);
      return out;
    }
    s += rayon(1.0, 1.0) + rayon(2.6, 1.0);
    /* poste de numérisation */
    s += pave(6.0, 5.6, .5, 2.2, 1.6, .9, C.blanc);
    s += pave(6.2, 5.8, 1.4, 1.8, 1.2, .3, ['#dbe6f5', '#9fb4d2', '#8aa3c6']);
    s += dessus(6.35, 5.95, 1.71, 1.5, .9, '#4f8fd6');
    var faisceau = P(7.1, 6.4, 1.72);
    s += '<rect class="scene-balayage" x="' + f1(faisceau[0] - 22) + '" y="' + f1(faisceau[1] - 2) + '" width="44" height="3" rx="1.5" fill="#bfe3ff"/>';
    s += pave(6.5, 7.2, .5, 1.2, .9, .05, C.papier) + pave(6.55, 7.25, .55, 1.2, .9, .05, ['#fff', '#e6edf7', '#d5dfee']);
    /* serveur GED avec le logo */
    s += pave(7.6, 1.6, .5, 1.6, 1.6, 2.6, C.sombre);
    for (var r = 0; r < 5; r++) { s += faceY(7.75, 3.2, .8 + r * .42, 1.3, .2, '#0c2446'); var d = P(8.8, 3.2, .9 + r * .42); s += '<circle cx="' + f1(d[0]) + '" cy="' + f1(d[1]) + '" r="1.8" class="scene-led" style="animation-delay:' + (r * .25) + 's" fill="' + (r === 2 ? C.or : '#3fd29b') + '"/>'; }
    s += dessus(7.7, 1.7, 3.1, 1.4, 1.4, '#24508c') + logoPeint('dessus', 7.75, 1.6, 3.12, 34, '#dbe6f5');
    s += chemin([[7.1, 5.6], [7.1, 4.4], [8.4, 4.4], [8.4, 3.2]]);
    s += chemin([[4.2, 3.2], [5.6, 3.2], [5.6, 2.4], [7.6, 2.4]]);
    /* recherche flottante */
    var rx = 372, ry = 12;
    s += '<g class="scene-carte c2"><rect x="' + rx + '" y="' + ry + '" width="214" height="112" rx="10" fill="#fff"/>' +
      '<rect x="' + (rx + 12) + '" y="' + (ry + 12) + '" width="190" height="22" rx="5" fill="#f1f5f9"/>' +
      '<circle cx="' + (rx + 25) + '" cy="' + (ry + 22) + '" r="4.5" fill="none" stroke="' + C.gris + '" stroke-width="1.4"/><path d="M' + (rx + 28.5) + ' ' + (ry + 25.5) + 'l3 3" stroke="' + C.gris + '" stroke-width="1.4"/>' +
      '<text x="' + (rx + 38) + '" y="' + (ry + 26) + '" font-family="\'Public Sans\',sans-serif" font-size="8" fill="' + C.encre + '">procès-verbal 0412</text>';
    ['PV de remise · AFF-2026-0412', 'Note de service 2026/118', 'Bordereau de versement 2025-07'].forEach(function (t, i) {
      var yy = ry + 46 + i * 20;
      s += '<rect x="' + (rx + 12) + '" y="' + yy + '" width="10" height="13" rx="1.5" fill="' + (i === 0 ? '#fbf2d6' : '#e7eef9') + '" stroke="' + (i === 0 ? C.or : '#b7c4d6') + '"/>' +
        '<text x="' + (rx + 30) + '" y="' + (yy + 10) + '" font-family="\'Public Sans\',sans-serif" font-size="8" font-weight="' + (i === 0 ? 700 : 400) + '" fill="' + C.encre + '">' + t + '</text>';
    });
    s += '</g>';
    s += trait([176, 330], P(6.6, 7.4, .7));
    s += trait([176, 92], P(1.9, 1.0, 3.2));
    s += fiche('c1', 6, 64, 212, ico.boite, 'Versé aux archives', 'Boîte 2025-118 · Rayon B', true);
    s += fiche('c3', 6, 302, 212, ico.liste, 'Document numérisé', 'PV 0412 · indexé et signé');
    svg(cible, s, 'Archives et GED : rayonnages de boîtes datées, poste de numérisation et serveur documentaire');
  }

  /* =======================================================================
     MARCHÉS — offres, balance d'évaluation, contrat
     ======================================================================= */
  function sceneMarches(cible) {
    var s = socle();
    /* estrade de la commission */
    s += pave(3.2, 3.2, .5, 3.6, 3.6, .5, C.bleu);
    s += dessus(3.4, 3.4, 1.0, 3.2, 3.2, '#dbe6f5');
    s += logoPeint('dessus', 3.5, 3.6, 1.02, 60);
    /* balance sur l'estrade (plan écran) */
    var b = P(5.6, 5.6, 1.0), h = 96;
    s += '<g>' +
      '<rect x="' + f1(b[0] - 18) + '" y="' + f1(b[1] - 6) + '" width="36" height="8" rx="2" fill="#183b6c"/>' +
      '<rect x="' + f1(b[0] - 2.5) + '" y="' + f1(b[1] - h) + '" width="5" height="' + (h - 4) + '" fill="#f2d377"/>' +
      '<circle cx="' + f1(b[0]) + '" cy="' + f1(b[1] - h) + '" r="5" fill="' + C.or + '"/>' +
      '<g class="scene-fleau" style="transform-origin:' + f1(b[0]) + 'px ' + f1(b[1] - h) + 'px">' +
      '<line x1="' + f1(b[0] - 62) + '" y1="' + f1(b[1] - h + 6) + '" x2="' + f1(b[0] + 62) + '" y2="' + f1(b[1] - h - 6) + '" stroke="' + C.or + '" stroke-width="4" stroke-linecap="round"/>' +
      '<path d="M' + f1(b[0] - 62) + ' ' + f1(b[1] - h + 6) + 'l-14 34h28z" fill="none" stroke="#f2d377" stroke-width="1"/>' +
      '<path d="M' + f1(b[0] - 80) + ' ' + f1(b[1] - h + 40) + 'h36a18 7 0 0 1-36 0z" fill="#f2d377"/>' +
      '<path d="M' + f1(b[0] + 62) + ' ' + f1(b[1] - h - 6) + 'l-14 34h28z" fill="none" stroke="#f2d377" stroke-width="1"/>' +
      '<path d="M' + f1(b[0] + 44) + ' ' + f1(b[1] - h + 28) + 'h36a18 7 0 0 1-36 0z" fill="#f2d377"/>' +
      '<rect x="' + f1(b[0] - 74) + '" y="' + f1(b[1] - h + 28) + '" width="24" height="12" fill="#f7f3e8"/><rect x="' + f1(b[0] + 50) + '" y="' + f1(b[1] - h + 18) + '" width="24" height="10" fill="#f7f3e8"/>' +
      '</g></g>';
    /* les trois plis d'offres en file d'attente */
    [['A', 1.0], ['B', 2.4], ['C', 3.8]].forEach(function (o, i) {
      s += pave(o[1], 8.0, .5, 1.1, .8, .5 + i * .1, ['#f7f3e8', '#ddd4bf', '#cbc0a7']);
      var c = P(o[1] + .55, 8.4, 1.0 + i * .1);
      s += '<circle cx="' + f1(c[0]) + '" cy="' + f1(c[1]) + '" r="7" fill="' + C.or + '"/><text x="' + f1(c[0]) + '" y="' + f1(c[1] + 3) + '" text-anchor="middle" font-family="Archivo,sans-serif" font-size="8" font-weight="800" fill="' + C.marine + '">' + o[0] + '</text>';
    });
    s += texteSol(2.9, 9.4, .6, 'OFFRES REÇUES', '#a9c6ee', 6.5);
    s += chemin([[2.9, 7.8], [2.9, 6.2], [3.2, 6.2]]);
    /* armoire scellée des marchés */
    s += pave(8.0, 1.4, .5, 1.4, 1.4, 1.9, C.sombre);
    s += faceY(8.15, 2.8, .7, 1.1, 1.4, '#1c4379');
    var cad = P(8.7, 2.8, 1.4);
    s += '<rect x="' + f1(cad[0] - 5) + '" y="' + f1(cad[1] - 2) + '" width="10" height="8" rx="1.5" fill="' + C.or + '"/><path d="M' + f1(cad[0] - 3) + ' ' + f1(cad[1] - 2) + 'v-3a3 3 0 0 1 6 0v3" fill="none" stroke="' + C.or + '" stroke-width="1.5"/>';
    s += chemin([[6.8, 4.4], [8.6, 4.4], [8.6, 2.8]]);
    /* contrat flottant */
    s += '<g class="scene-carte c2" transform="translate(422,40) rotate(-4)"><rect width="154" height="150" rx="6" fill="#fff"/>' +
      '<text x="14" y="24" font-family="Archivo,sans-serif" font-size="9" font-weight="800" letter-spacing=".6" fill="' + C.encre + '">MARCHÉ N° 012/2026</text>' +
      '<text x="14" y="37" font-family="\'Public Sans\',sans-serif" font-size="7" fill="' + C.gris + '">Lot 2 · Équipements informatiques</text>' +
      '<rect x="14" y="48" width="126" height="3" rx="1.5" fill="#dfe6f0"/><rect x="14" y="57" width="112" height="3" rx="1.5" fill="#dfe6f0"/><rect x="14" y="66" width="120" height="3" rx="1.5" fill="#dfe6f0"/>' +
      '<text x="14" y="88" font-family="\'Public Sans\',sans-serif" font-size="7" fill="' + C.gris + '">Montant TTC</text>' +
      '<text x="14" y="101" font-family="Archivo,sans-serif" font-size="12" font-weight="700" fill="' + C.encre + '">48 650 000 FCFA</text>' +
      '<g transform="translate(118,124)"><circle r="17" fill="none" stroke="' + C.orFonce + '" stroke-width="1.5"/><circle r="12" fill="' + C.or + '"/><text y="3" text-anchor="middle" font-family="\'Times New Roman\',serif" font-size="8" fill="' + C.marine + '">DGB</text></g>' +
      '<path d="M16 128c6-8 10 3 16-3s9 1 14-2" fill="none" stroke="' + C.marine + '" stroke-width="1.3" stroke-linecap="round"/></g>';
    s += trait([176, 92], P(5.6, 3.6, 2.6));
    s += trait([176, 312], P(1.55, 8.4, 1.0));
    s += fiche('c1', 6, 64, 212, ico.marteau, 'Appel d’offres 012/2026', 'Ouverture des plis · 10:00', true);
    s += fiche('c3', 6, 312, 200, ico.coche, 'Attribué · offre B', 'Rapport d’évaluation signé');
    svg(cible, s, 'Marchés publics : offres sous pli, balance d’évaluation de la commission et contrat signé');
  }

  /* =======================================================================
     AUDIT — pièces examinées, loupe, visa du contrôleur
     ======================================================================= */
  function sceneAudit(cible) {
    var s = socle();
    /* table d'examen */
    s += pave(2.4, 2.6, .5, 5.2, 3.6, .7, C.blanc);
    s += dessus(2.55, 2.75, 1.21, 4.9, 3.3, '#f1f5fb');
    /* liasses de pièces sur la table */
    for (var i = 0; i < 4; i++) s += pave(2.9 + (i % 2) * .05, 3.0, 1.21 + i * .07, 1.6, 1.2, .06, i % 2 ? ['#fff', '#e6edf7', '#d5dfee'] : C.papier);
    for (var j = 0; j < 2; j++) s += pave(5.3, 3.1 + j * .04, 1.21 + j * .07, 1.6, 1.1, .06, ['#fff', '#e6edf7', '#d5dfee']);
    /* fiche de contrôle posée, cochée */
    s += pave(3.4, 4.6, 1.21, 2.6, 1.3, .03, ['#fff', '#e6edf7', '#d5dfee']);
    s += plan('dessus', 3.5, 4.7, 1.25,
      '<text x="4" y="10" font-family="Archivo,sans-serif" font-size="7" font-weight="700" fill="' + C.encre + '">GRILLE DE CONTRÔLE</text>' +
      [0, 1, 2].map(function (k) { return '<rect x="4" y="' + (16 + k * 6) + '" width="4" height="4" fill="none" stroke="#1d4f9a" stroke-width=".8"/><path d="M4.6 ' + (18 + k * 6) + 'l1.2 1.2 2-2.4" fill="none" stroke="#12805f" stroke-width=".9"/><rect x="11" y="' + (17 + k * 6) + '" width="' + (36 - k * 6) + '" height="2" fill="#cfd8e5"/>'; }).join(''));
    /* tampon VISA à côté */
    s += pave(6.4, 4.9, 1.21, .7, .7, .35, C.sombre) + pave(6.55, 5.05, 1.56, .4, .4, .45, ['#f2d377', '#c9a23a', '#b38f2f']);
    var v = P(6.9, 5.9, 1.22);
    s += '<ellipse cx="' + f1(v[0]) + '" cy="' + f1(v[1]) + '" rx="16" ry="8" fill="none" stroke="#1d4f9a" stroke-width="1.4"/><text x="' + f1(v[0]) + '" y="' + f1(v[1] + 2.5) + '" text-anchor="middle" font-family="Archivo,sans-serif" font-size="6.5" font-weight="800" fill="#1d4f9a">VISA</text>';
    /* bouclier DGB debout à l'avant */
    var sb = P(8.4, 7.6, .5);
    s += '<g transform="translate(' + f1(sb[0]) + ',' + f1(sb[1] - 70) + ')"><path d="M0 0l30 10v24c0 20-14 32-30 38C-16 66-30 54-30 34V10z" fill="#24508c" stroke="#83bde7" stroke-width="1.5"/>' +
      '<text y="34" text-anchor="middle" font-family="\'Times New Roman\',serif" font-size="15" fill="#fff" letter-spacing="-1">DGB</text>' +
      '<rect x="-14" y="40" width="9.3" height="2.4" fill="' + C.tri[0] + '"/><rect x="-4.7" y="40" width="9.3" height="2.4" fill="' + C.tri[1] + '"/><rect x="4.6" y="40" width="9.4" height="2.4" fill="' + C.tri[2] + '"/>' +
      '<path d="M-8 52l6 6 11-12" fill="none" stroke="' + C.or + '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></g>';
    /* loupe géante (plan écran) au-dessus des pièces */
    var l = P(3.7, 3.6, 2.6);
    s += '<g class="scene-loupe"><circle cx="' + f1(l[0]) + '" cy="' + f1(l[1]) + '" r="34" fill="#bfe3ff" fill-opacity=".28" stroke="#dbe6f5" stroke-width="6"/>' +
      '<circle cx="' + f1(l[0]) + '" cy="' + f1(l[1]) + '" r="34" fill="none" stroke="#83bde7" stroke-width="1.5"/>' +
      '<rect x="' + f1(l[0] + 22) + '" y="' + f1(l[1] + 22) + '" width="12" height="44" rx="5" transform="rotate(-45 ' + f1(l[0] + 28) + ' ' + f1(l[1] + 44) + ')" fill="#183b6c"/>' +
      '<rect x="' + f1(l[0] - 16) + '" y="' + f1(l[1] - 6) + '" width="32" height="4" rx="2" fill="#a32638" fill-opacity=".75"/></g>';
    /* rapport flottant */
    var rx = 380, ry = 18;
    s += '<g class="scene-carte c2"><rect x="' + rx + '" y="' + ry + '" width="206" height="112" rx="10" fill="#fff"/>' +
      '<text x="' + (rx + 12) + '" y="' + (ry + 18) + '" font-family="Archivo,sans-serif" font-size="9.5" font-weight="700" fill="' + C.encre + '">Rapport de contrôle · DAF</text>';
    [['Pièces justificatives', 'Conforme', '#12805f', '#eef7f3'], ['Imputation budgétaire', 'Conforme', '#12805f', '#eef7f3'], ['Montant engagé', 'Écart 2 %', '#845222', '#fdf8ef'], ['Signature ordonnateur', 'Conforme', '#12805f', '#eef7f3']].forEach(function (r, i) {
      var yy = ry + 30 + i * 19;
      s += '<text x="' + (rx + 12) + '" y="' + (yy + 10) + '" font-family="\'Public Sans\',sans-serif" font-size="7.5" fill="' + C.encre + '">' + r[0] + '</text>' +
        '<rect x="' + (rx + 134) + '" y="' + (yy + 1) + '" width="60" height="13" rx="3" fill="' + r[3] + '"/>' +
        '<text x="' + (rx + 164) + '" y="' + (yy + 10.5) + '" text-anchor="middle" font-family="\'Public Sans\',sans-serif" font-size="7" font-weight="700" fill="' + r[2] + '">' + r[1] + '</text>';
    });
    s += '</g>';
    s += trait([176, 330], P(6.9, 5.9, 1.3));
    s += fiche('c1', 6, 64, 210, ico.loupe, 'Contrôle en cours', '14 pièces examinées', false);
    s += fiche('c3', 6, 302, 238, ico.sceau, 'Visa du contrôleur', 'Engagement 26002547 · conforme', true);
    svg(cible, s, 'Contrôle et audit : pièces examinées à la loupe, grille de contrôle, visa et rapport');
  }

  window.DGB_SCENES = {
    parc: sceneParc, courrier: sceneCourrier, projet: sceneProjet, rh: sceneRh,
    budget: sceneBudget, archives: sceneArchives, marches: sceneMarches, audit: sceneAudit
  };
  window.DGB_SCENES_INFOS = {
    parc: { titre: 'Gestion du parc', legende: 'Le siège relie chaque équipement recensé à son affectataire.', icone: 'ordinateur' },
    courrier: { titre: 'Courrier', legende: 'Le courrier arrive, il est imputé au bon service, signé, puis expédié.', icone: 'courrier' },
    projet: { titre: 'Projets', legende: 'Du chantier à la réception : chaque jalon d’un investissement public est suivi.', icone: 'signer' },
    rh: { titre: 'Ressources humaines', legende: 'Chaque agent a son poste, son dossier et sa place dans l’organigramme.', icone: 'utilisateurs' },
    budget: { titre: 'Budget', legende: 'Les crédits sont ouverts, engagés, visés et consommés sous contrôle.', icone: 'rapport' },
    archives: { titre: 'Archives', legende: 'Chaque pièce est numérisée, indexée et versée dans la bonne boîte.', icone: 'dossier' },
    marches: { titre: 'Marchés publics', legende: 'Les offres sont reçues sous pli, évaluées par la commission, attribuées.', icone: 'etiquette' },
    audit: { titre: 'Contrôle', legende: 'Chaque pièce est vérifiée avant le visa du contrôleur.', icone: 'bouclier' }
  };
})();
