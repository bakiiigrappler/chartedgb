/* =========================================================================
   Scènes de la page de connexion · Suite DSI
   -------------------------------------------------------------------------
   « courrier » : le courrier entrant, la vérification d'identité et le
                  circuit de transmission, sous le sceau de la DGB.
   « projet »   : le planning, les jalons et les colonnes de suivi d'un
                  projet, sur le même socle isométrique que la scène Parc.

   Chaque scène est une fonction (cible, options) rangée dans DGB_SCENES.
   Usage : <div class="cnx-scene" id="scene-suite"></div> puis ce script.
   ========================================================================= */
(function () {
  'use strict';

  var K = 24, CX = 300, CY = 150;
  function P(x, y, z) { return [CX + (x - y) * K * 0.866, CY + (x + y) * K * 0.5 - (z || 0) * K]; }
  function pts(l) { return l.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' '); }
  function poly(l, f, extra) { return '<polygon points="' + pts(l) + '" fill="' + f + '"' + (extra || '') + '/>'; }

  /* Pavé isométrique : dessus, face +x (droite), face +y (gauche) */
  function pave(x, y, z, w, d, h, c) {
    return poly([P(x + w, y, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x + w, y, z + h)], c[1]) +
           poly([P(x, y + d, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x, y + d, z + h)], c[2]) +
           poly([P(x, y, z + h), P(x + w, y, z + h), P(x + w, y + d, z + h), P(x, y + d, z + h)], c[0]);
  }
  function faceX(x, y, z, d, h, f) { return poly([P(x, y, z), P(x, y + d, z), P(x, y + d, z + h), P(x, y, z + h)], f); }
  function faceY(x, y, z, w, h, f) { return poly([P(x, y, z), P(x + w, y, z), P(x + w, y, z + h), P(x, y, z + h)], f); }

  function socle(trame) {
    var s = pave(0, 0, 0, 10, 10, 0.5, ['#1f4c8f', '#173d75', '#10305e']);
    for (var i = 1; i < 10; i++) {
      s += '<line x1="' + P(i, 0, .5)[0] + '" y1="' + P(i, 0, .5)[1] + '" x2="' + P(i, 10, .5)[0] + '" y2="' + P(i, 10, .5)[1] + '" stroke="#ffffff" stroke-opacity=".06"/>';
      s += '<line x1="' + P(0, i, .5)[0] + '" y1="' + P(0, i, .5)[1] + '" x2="' + P(10, i, .5)[0] + '" y2="' + P(10, i, .5)[1] + '" stroke="#ffffff" stroke-opacity=".06"/>';
    }
    if (trame) {
      s += '<ellipse cx="' + P(5, 5, .5)[0] + '" cy="' + P(5, 5, .5)[1] + '" rx="210" ry="96" fill="#ffffff" fill-opacity=".028"/>';
    }
    return s;
  }

  function liaison(a, b) {
    return '<polyline class="scene-lien" points="' + pts([P(a[0], a[1], .55), P(b[0], a[1], .55), P(b[0], b[1], .55)]) +
      '" fill="none" stroke="#e2b93b" stroke-width="1.6" stroke-dasharray="5 7" stroke-linecap="round"/>';
  }

  function fiche(cls, x, y, w, icone, titre, detail, accent) {
    return '<g class="scene-carte ' + cls + '"><rect x="' + x + '" y="' + y + '" width="' + w + '" height="56" rx="10" fill="#ffffff"/>' +
      '<rect x="' + (x + 12) + '" y="' + (y + 12) + '" width="32" height="32" rx="8" fill="' + (accent ? '#fbf2d6' : '#e7eef9') + '"/>' + icone(x + 28, y + 28) +
      '<text x="' + (x + 54) + '" y="' + (y + 25) + '" font-family="Archivo, \'Public Sans\', sans-serif" font-weight="700" font-size="13" fill="#0f2445">' + titre + '</text>' +
      '<text x="' + (x + 54) + '" y="' + (y + 42) + '" font-family="\'Public Sans\', sans-serif" font-size="11" fill="#5d6b82">' + detail + '</text></g>';
  }
  function trait(a, b) {
    return '<path d="M' + a[0] + ' ' + a[1] + ' L' + b[0].toFixed(1) + ' ' + b[1].toFixed(1) +
      '" stroke="#ffffff" stroke-opacity=".35" stroke-width="1.2" stroke-dasharray="3 4"/><circle cx="' + b[0].toFixed(1) + '" cy="' + b[1].toFixed(1) + '" r="3" fill="#e2b93b"/>';
  }

  /* ---------- Icônes des fiches ---------- */
  function icoCourrier(cx, cy) {
    return '<rect x="' + (cx - 9) + '" y="' + (cy - 6) + '" width="18" height="12" rx="2" fill="none" stroke="#1d4f9a" stroke-width="1.7"/>' +
      '<path d="M' + (cx - 9) + ' ' + (cy - 4) + 'l9 6 9-6" fill="none" stroke="#1d4f9a" stroke-width="1.7" stroke-linejoin="round"/>';
  }
  function icoBadge(cx, cy) {
    return '<circle cx="' + (cx - 2) + '" cy="' + (cy - 4) + '" r="3.2" fill="#1d4f9a"/>' +
      '<path d="M' + (cx - 7) + ' ' + (cy + 6) + 'a5 5 0 0 1 10 0" fill="none" stroke="#1d4f9a" stroke-width="1.7" stroke-linecap="round"/>' +
      '<path d="M' + (cx + 5) + ' ' + (cy - 5) + 'h4M' + (cx + 5) + ' ' + (cy - 1) + 'h4M' + (cx + 5) + ' ' + (cy + 3) + 'h4" stroke="#1d4f9a" stroke-width="1.5" stroke-linecap="round"/>';
  }
  function icoJalon(cx, cy) {
    return '<path d="M' + cx + ' ' + (cy - 9) + 'l4.5 4.5-4.5 4.5-4.5-4.5z" fill="#e2b93b" stroke="#12305f" stroke-width="1.2"/>' +
      '<path d="M' + (cx - 7) + ' ' + (cy + 7) + 'h14" stroke="#1d4f9a" stroke-width="1.7" stroke-linecap="round"/>';
  }

  /* =======================================================================
     Scène « courrier » — courrier, identité, transmission
     ======================================================================= */
  function sceneCourrier(cible) {
    var s = socle(true);

    /* Circuit de distribution */
    s += liaison([4.6, 5.2], [7.1, 3.4]);
    s += liaison([5.4, 6.1], [8.1, 7.2]);
    s += liaison([2.9, 5.2], [1.6, 8.2]);

    /* Pile d'enveloppes : trois plis, un cachet de cire */
    function enveloppe(x, y, z, w, d) {
      var h = 0.16, e = '';
      e += pave(x, y, z, w, d, h, ['#f6f1e4', '#d9d0bb', '#c7bca4']);
      var c = P(x + w / 2, y + d / 2, z + h);
      e += '<path d="M' + pts([P(x, y, z + h)]) + ' L' + c[0].toFixed(1) + ',' + c[1].toFixed(1) +
        ' L' + pts([P(x, y + d, z + h)]) + '" fill="none" stroke="#b9ad94" stroke-width="1.1"/>';
      e += '<path d="M' + pts([P(x + w, y, z + h)]) + ' L' + c[0].toFixed(1) + ',' + c[1].toFixed(1) +
        ' L' + pts([P(x + w, y + d, z + h)]) + '" fill="none" stroke="#cfc5ae" stroke-width="1"/>';
      e += '<rect x="' + (c[0] - 5).toFixed(1) + '" y="' + (c[1] - 5).toFixed(1) + '" width="10" height="10" rx="5" fill="#c9971f" stroke="#a87b15" stroke-width=".8"/>';
      return e;
    }
    s += enveloppe(2.2, 4.4, .5, 3.7, 2.5);
    s += enveloppe(2.5, 4.7, .66, 3.7, 2.5);
    s += enveloppe(2.8, 5.0, .82, 3.7, 2.5);

    /* Timbre sur le pli du dessus */
    var t0 = P(3.1, 5.25, 1.0);
    s += '<g transform="matrix(0.866,0.5,-0.866,0.5,' + t0[0].toFixed(1) + ',' + t0[1].toFixed(1) + ')">' +
      '<rect x="0" y="0" width="26" height="20" fill="#2b5da7"/><rect x="3" y="3" width="20" height="14" fill="none" stroke="#a9c6ee" stroke-dasharray="2 2"/>' +
      '<text x="13" y="13.5" text-anchor="middle" font-family="Georgia,serif" font-size="7" fill="#ffffff">DGB</text></g>';

    /* Cachet postal, dans le plan de l'écran */
    var pc = P(5.9, 5.9, 1.9);
    s += '<g transform="translate(' + pc[0].toFixed(1) + ',' + pc[1].toFixed(1) + ') rotate(-12)">' +
      '<circle r="25" fill="none" stroke="#e2b93b" stroke-width="1.6" stroke-opacity=".9"/>' +
      '<circle r="20" fill="none" stroke="#e2b93b" stroke-width=".8" stroke-opacity=".55"/>' +
      '<text y="-2" text-anchor="middle" font-family="Archivo,sans-serif" font-size="8" font-weight="700" letter-spacing="1" fill="#f7df9a">DGB</text>' +
      '<text y="7" text-anchor="middle" font-family="\'Public Sans\',sans-serif" font-size="5.5" fill="#f7df9a">18.11.26</text></g>';

    /* Bac courrier (droite) */
    s += pave(6.7, 1.9, .5, 2.6, 2.0, .22, ['#2c5189', '#183b6c', '#12305a']);
    for (var l = 0; l < 4; l++) {
      s += pave(6.85, 2.05 + l * 0.34, .72, 2.3, 1.5, .07, ['#eef3fa', '#cdd9ea', '#b7c7de']);
      s += faceY(6.85, 3.55 + l * 0.34, .72, 2.3, .09, '#9fb4d2');
    }
    s += faceX(9.3, 1.9, .5, 2.0, .55, '#24508c');
    s += faceY(6.7, 3.9, .5, 2.6, 1.05, '#1c4379');
    s += '<text x="' + P(8.15, 3.9, 1.45)[0].toFixed(1) + '" y="' + P(8.15, 3.9, 1.45)[1].toFixed(1) + '" text-anchor="middle" font-family="Archivo,sans-serif" font-size="9" font-weight="700" letter-spacing="1.6" fill="#a9c6ee">ARRIVÉE</text>';

    /* Corbeille / bac départ (avant gauche) */
    s += pave(1.0, 7.7, .5, 1.7, 1.4, .5, ['#e2eaf6', '#b9cbe3', '#a2b8d7']);
    s += faceY(1.0, 9.1, .5, 1.7, .5, '#93aac9');
    s += '<text x="' + P(1.85, 9.1, 1.12)[0].toFixed(1) + '" y="' + P(1.85, 9.1, 1.12)[1].toFixed(1) + '" text-anchor="middle" font-family="Archivo,sans-serif" font-size="8" font-weight="700" letter-spacing="1.2" fill="#12305f">DÉPART</text>';

    /* Badge d'identité flottant */
    s += '<g transform="translate(404,86) rotate(4)">' +
      '<rect x="0" y="0" width="128" height="156" rx="10" fill="#ffffff"/>' +
      '<rect x="0" y="0" width="128" height="34" rx="10" fill="#12305f"/><rect x="0" y="24" width="128" height="10" fill="#12305f"/>' +
      '<text x="12" y="23" font-family="Georgia,serif" font-size="15" fill="#ffffff">DGB</text>' +
      '<text x="116" y="21" text-anchor="end" font-family="\'Public Sans\',sans-serif" font-size="6" letter-spacing="1" fill="#a9c6ee">AGENT</text>' +
      '<rect x="12" y="46" width="44" height="52" rx="5" fill="#e7eef9"/>' +
      '<circle cx="34" cy="63" r="8" fill="#9fb4d2"/><path d="M20 94a14 14 0 0 1 28 0" fill="#9fb4d2"/>' +
      '<rect x="64" y="50" width="50" height="6" rx="2" fill="#1b2a44"/><rect x="64" y="62" width="40" height="5" rx="2" fill="#b7c4d6"/>' +
      '<rect x="64" y="73" width="46" height="5" rx="2" fill="#b7c4d6"/><rect x="64" y="84" width="30" height="5" rx="2" fill="#b7c4d6"/>' +
      '<rect x="12" y="108" width="104" height="1" fill="#e2e8f0"/>' +
      '<text x="12" y="124" font-family="\'Public Sans\',sans-serif" font-size="6" fill="#7b889c">MATRICULE</text>' +
      '<text x="12" y="136" font-family="Archivo,sans-serif" font-size="11" font-weight="700" fill="#0f2445">02817</text>' +
      '<g transform="translate(92,126)" fill="none" stroke="#1d4f9a" stroke-width="1.1" stroke-linecap="round">' +
      '<path d="M-9 0a9 9 0 0 1 18 0M-5 0a5 5 0 0 1 10 0M-1 0a1 1 0 0 1 2 0"/></g>' +
      '<rect x="12" y="146" width="34.7" height="4" fill="#12805f"/><rect x="46.7" y="146" width="34.7" height="4" fill="#f7c21e"/><rect x="81.4" y="146" width="34.6" height="4" fill="#4f8fd6"/>' +
      '</g>';

    /* Plan de papier (liaison aérienne) */
    s += '<g transform="translate(330,296) rotate(-14)"><polygon points="0,0 34,8 12,16 9,28 4,17" fill="#e9f0fa" opacity=".85"/><line x1="14" y1="15" x2="32" y2="8" stroke="#12305f" stroke-width="1"/></g>';

    /* Fiches */
    s += trait([166, 92], P(4.6, 5.4, 1.4));
    s += trait([388, 236], P(9.1, 2.4, 1.7));
    s += fiche('c1', 356, 16, 210, icoCourrier, 'Courrier arrivé', 'OKANDAH · 09:42', true);
    s += fiche('c2', 6, 52, 200, icoBadge, 'Identité vérifiée', 'Agent · Service de la solde');
    s += fiche('c3', 6, 320, 206, icoJalon, 'Dossier transmis', 'Circuit · DAF');

    cible.innerHTML = '<svg viewBox="0 0 600 420" role="img" aria-label="Le courrier de la DGB, son cachet, le badge de l’agent et le circuit de transmission">' + s + '</svg>';
  }

  /* =======================================================================
     Scène « projet » — planning, jalons, suivi
     ======================================================================= */
  function sceneProjet(cible) {
    var s = socle(true);

    /* planning flottant (plan de l'écran) */
    var bx = 196, by = 22, bw = 356, bh = 172;
    s += '<g class="scene-carte c1"><rect x="' + bx + '" y="' + by + '" width="' + bw + '" height="' + bh + '" rx="12" fill="#ffffff"/>' +
      '<rect x="' + bx + '" y="' + by + '" width="' + bw + '" height="34" rx="12" fill="#12305f"/><rect x="' + bx + '" y="' + (by + 24) + '" width="' + bw + '" height="10" fill="#12305f"/>' +
      '<text x="' + (bx + 14) + '" y="' + (by + 22) + '" font-family="Archivo,sans-serif" font-size="11" font-weight="700" letter-spacing=".4" fill="#ffffff">Projet ABAT · planning 2026</text>' +
      '<rect x="' + (bx + bw - 66) + '" y="' + (by + 10) + '" width="52" height="14" rx="7" fill="#e2b93b"/>' +
      '<text x="' + (bx + bw - 40) + '" y="' + (by + 20) + '" text-anchor="middle" font-family="\'Public Sans\',sans-serif" font-size="7.5" font-weight="700" fill="#12305f">68 %</text>';
    var lignes = [
      ['Cadrage', 0, 92, '#b4d7f1'],
      ['Étude', 38, 118, '#83bde7'],
      ['Déploiement', 96, 128, '#3c71bf'],
      ['Recette', 186, 96, '#2253a3'],
      ['Mise en service', 248, 66, '#e2b93b']
    ];
    for (var l = 0; l < lignes.length; l++) {
      var yy = by + 48 + l * 24;
      s += '<text x="' + (bx + 14) + '" y="' + (yy + 11) + '" font-family="\'Public Sans\',sans-serif" font-size="8.5" fill="#5d6b82">' + lignes[l][0] + '</text>';
      s += '<rect x="' + (bx + 86) + '" y="' + yy + '" width="' + (bw - 104) + '" height="1" fill="#eef2f7"/>';
      s += '<rect x="' + (bx + 86 + lignes[l][1] * .52) + '" y="' + (yy + 2) + '" width="' + (lignes[l][2] * .52) + '" height="12" rx="4" fill="' + lignes[l][3] + '"/>';
    }
    /* repère « aujourd'hui » */
    s += '<line x1="' + (bx + 86 + 172 * .52) + '" y1="' + (by + 44) + '" x2="' + (bx + 86 + 172 * .52) + '" y2="' + (by + bh - 12) + '" stroke="#a32638" stroke-width="1.2" stroke-dasharray="3 3"/>' +
      '<text x="' + (bx + 86 + 172 * .52 + 4) + '" y="' + (by + 42) + '" font-family="\'Public Sans\',sans-serif" font-size="7" fill="#a32638">aujourd’hui</text></g>';

    /* colonnes de suivi (isométrique) */
    var cols = [
      { x: 1.5, y: 6.4, w: 2.1, d: 2.0, h: .9, c: ['#e2eaf6', '#b9cbe3', '#a2b8d7'], cartes: 2 },
      { x: 4.0, y: 6.1, w: 2.1, d: 2.0, h: 1.5, c: ['#dbe9fb', '#9cc3f0', '#7fa9da'], cartes: 3 },
      { x: 6.5, y: 5.8, w: 2.1, d: 2.0, h: 2.1, c: ['#cfe0f6', '#4f8fd6', '#3c71bf'], cartes: 2 }
    ];
    cols.forEach(function (c, i) {
      s += pave(c.x, c.y, .5, c.w, c.d, c.h, c.c);
      for (var k = 0; k < c.cartes; k++) {
        s += pave(c.x + .18, c.y + .18 + k * .42, .5 + c.h + .02, c.w - .36, .34, .05, ['#ffffff', '#e6edf7', '#d5dfee']);
      }
      s += '<text x="' + P(c.x + c.w / 2, c.y + c.d + .9, .62)[0].toFixed(1) + '" y="' + P(c.x + c.w / 2, c.y + c.d + .9, .62)[1].toFixed(1) + '" text-anchor="middle" font-family="Archivo,sans-serif" font-size="8" font-weight="700" letter-spacing="1" fill="#a9c6ee">' + ['À FAIRE', 'EN COURS', 'TERMINÉ'][i] + '</text>';
    });

    /* chemin de jalons au sol */
    s += '<polyline class="scene-lien" points="' + pts([P(2.6, 9.4, .56), P(4.6, 9.0, .56), P(7.0, 8.9, .56), P(9.2, 8.2, .56)]) + '" fill="none" stroke="#e2b93b" stroke-width="1.8" stroke-dasharray="5 6" stroke-linecap="round"/>';
    [[2.6, 9.4], [4.6, 9.0], [7.0, 8.9], [9.2, 8.2]].forEach(function (m, i) {
      var p = P(m[0], m[1], .56);
      s += '<path d="M' + (p[0] - 5).toFixed(1) + ' ' + p[1].toFixed(1) + 'l5-5 5 5-5 5z" fill="' + (i === 3 ? '#e2b93b' : '#ffffff') + '" stroke="#e2b93b" stroke-width="1.2"/>';
    });

    /* Fiches */
    s += trait([180, 300], P(4.6, 6.6, 2.4));
    s += fiche('c2', 6, 46, 186, icoJalon, 'Jalon atteint', 'Déploiement · 18/11', true);
    s += fiche('c3', 6, 120, 186, icoCourrier, 'Livrable déposé', 'Recette · DAF');
    s += fiche('c1', 396, 306, 198, icoBadge, '3 tâches cette semaine', 'Équipe SED');

    cible.innerHTML = '<svg viewBox="0 0 600 420" role="img" aria-label="Le planning d’un projet, ses jalons et les colonnes de suivi des tâches">' + s + '</svg>';
  }

  window.DGB_SCENES = window.DGB_SCENES || {};
  window.DGB_SCENES.courrier = sceneCourrier;
  window.DGB_SCENES.projet = sceneProjet;
})();
