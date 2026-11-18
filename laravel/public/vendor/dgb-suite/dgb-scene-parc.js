/* =========================================================================
   Scène de la page de connexion · Gestion du parc
   Le siège de la DGB en isométrique, logo peint sur le toit et filet tricolore
   en corniche, relié aux équipements qu'il recense (baie serveur, portable,
   imprimante). Trois fiches flottantes disent ce que fait l'application.
   Usage : <div class="cnx-scene" id="scene-parc"></div> puis ce script.
   Chaque application de la suite fournit sa propre scène sur ce modèle.
   ========================================================================= */
(function () {
  var cible = document.getElementById('scene-parc');
  if (!cible) return;

  var K = 24, CX = 300, CY = 150;
  function P(x, y, z) { return [CX + (x - y) * K * 0.866, CY + (x + y) * K * 0.5 - (z || 0) * K]; }
  function pts(l) { return l.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' '); }
  function poly(l, f, extra) { return '<polygon points="' + pts(l) + '" fill="' + f + '"' + (extra || '') + '/>'; }

  // Pavé : dessus, face +x (droite) et face +y (gauche)
  function pave(x, y, z, w, d, h, c) {
    return poly([P(x + w, y, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x + w, y, z + h)], c[1]) +
           poly([P(x, y + d, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x, y + d, z + h)], c[2]) +
           poly([P(x, y, z + h), P(x + w, y, z + h), P(x + w, y + d, z + h), P(x, y + d, z + h)], c[0]);
  }
  function faceX(x, y, z, d, h, f) { return poly([P(x, y, z), P(x, y + d, z), P(x, y + d, z + h), P(x, y, z + h)], f); }
  function faceY(x, y, z, w, h, f) { return poly([P(x, y, z), P(x + w, y, z), P(x + w, y, z + h), P(x, y, z + h)], f); }

  var s = '';

  /* Socle */
  s += pave(0, 0, 0, 10, 10, 0.5, ['#1f4c8f', '#173d75', '#10305e']);
  for (var i = 1; i < 10; i++) {
    s += '<line x1="' + P(i, 0, .5)[0] + '" y1="' + P(i, 0, .5)[1] + '" x2="' + P(i, 10, .5)[0] + '" y2="' + P(i, 10, .5)[1] + '" stroke="#ffffff" stroke-opacity=".06"/>';
    s += '<line x1="' + P(0, i, .5)[0] + '" y1="' + P(0, i, .5)[1] + '" x2="' + P(10, i, .5)[0] + '" y2="' + P(10, i, .5)[1] + '" stroke="#ffffff" stroke-opacity=".06"/>';
  }

  /* Liaisons au sol : chaque équipement est rattaché au siège */
  function liaison(a, b) { return '<polyline class="scene-lien" points="' + pts([P(a[0], a[1], .5), P(b[0], a[1], .5), P(b[0], b[1], .5)]) + '" fill="none" stroke="#e2b93b" stroke-width="1.6" stroke-dasharray="5 7" stroke-linecap="round"/>'; }
  s += liaison([8.3, 6.45], [7.5, 5.6]);
  s += liaison([8.45, 2.1], [6.4, 3]);
  s += liaison([1.75, 8.2], [3, 6.2]);

  /* Ordinateur portable (arrière droit) */
  s += pave(7.7, 1.1, 0.5, 1.5, 1.1, 0.12, ['#e4ecf8', '#b7c9e2', '#9fb6d6']);
  s += faceY(7.75, 1.1, 0.62, 1.4, 1.05, '#0f2a52');
  s += faceY(7.86, 1.1, 0.72, 1.18, 0.85, '#4f8fd6');
  s += faceY(7.98, 1.1, 1.2, 0.6, 0.12, '#cfe0f6');
  s += faceY(7.98, 1.1, 0.98, 0.9, 0.08, '#9cc3f0');

  /* Siège de la DGB */
  var BX = 3, BY = 3, BW = 4.5, BH = 3.4, Z0 = 0.5, ZT = Z0 + BH;
  s += pave(BX, BY, Z0, BW, BW, BH, ['#e9f0fa', '#3c71bf', '#2b5da7']);
  // fenêtres : quelques bureaux allumés
  var allumees = { '1-2': 1, '2-0': 1, '0-3': 1 };
  for (var ligne = 0; ligne < 3; ligne++) {
    for (var col = 0; col < 4; col++) {
      var z = 1.15 + ligne * 0.85;
      s += faceX(BX + BW, BY + 0.45 + col * 1.0, z, 0.55, 0.5, allumees[ligne + '-' + col] ? '#f2c94c' : '#8fb7ea');
      if (!(ligne === 0 && (col === 1 || col === 2))) s += faceY(BX + 0.45 + col * 1.0, BY + BW, z, 0.55, 0.5, allumees[(ligne + 1) % 3 + '-' + col] ? '#f2c94c' : '#7aa6e0');
    }
  }
  // entrée
  s += faceY(BX + 1.55, BY + BW, Z0, 1.4, 1.05, '#16386b');
  s += faceY(BX + 1.4, BY + BW, Z0 + 1.05, 1.7, 0.12, '#e9f0fa');
  // corniche tricolore
  var tri = ['#12805f', '#f7c21e', '#4f8fd6'];
  for (var t = 0; t < 3; t++) {
    s += faceX(BX + BW, BY + t * 1.5, ZT - 0.32, 1.5, 0.2, tri[t]);
    s += faceY(BX + t * 1.5, BY + BW, ZT - 0.32, 1.5, 0.2, tri[t]);
  }
  // toit : logo DGB peint, dans le plan du toit
  s += poly([P(BX + .25, BY + .25, ZT), P(BX + BW - .25, BY + .25, ZT), P(BX + BW - .25, BY + BW - .25, ZT), P(BX + .25, BY + BW - .25, ZT)], '#dbe6f5');
  var o = P(BX, BY, ZT);
  s += '<g transform="matrix(0.866,0.5,-0.866,0.5,' + o[0].toFixed(1) + ',' + o[1].toFixed(1) + ')">' +
       '<text x="54" y="66" text-anchor="middle" font-family="\'Times New Roman\', Georgia, serif" font-size="44" letter-spacing="-2" fill="#12305f">DGB</text>' +
       '<rect x="22" y="74" width="21.3" height="5" fill="#12805f"/><rect x="43.3" y="74" width="21.3" height="5" fill="#f7c21e"/><rect x="64.6" y="74" width="21.4" height="5" fill="#4f8fd6"/>' +
       '</g>';

  /* Baie serveur (devant la façade droite) */
  s += pave(8.3, 5.9, 0.5, 1.1, 1.1, 2.2, ['#2c5189', '#183b6c', '#12305a']);
  for (var r = 0; r < 5; r++) {
    s += faceX(9.4, 6.1, 0.75 + r * 0.38, 0.7, 0.14, '#0c2446');
    s += '<circle cx="' + P(9.4, 6.85, 0.82 + r * 0.38)[0].toFixed(1) + '" cy="' + P(9.4, 6.85, 0.82 + r * 0.38)[1].toFixed(1) + '" r="1.8" fill="' + (r === 1 ? '#e2b93b' : '#3fd29b') + '"/>';
  }

  /* Imprimante (avant gauche) */
  s += pave(1.0, 7.6, 0.5, 1.5, 1.2, 0.8, ['#e2eaf6', '#b9cbe3', '#a2b8d7']);
  s += poly([P(1.25, 7.85, 1.3), P(2.25, 7.85, 1.3), P(2.25, 8.25, 1.3), P(1.25, 8.25, 1.3)], '#8aa3c6');
  s += pave(1.35, 7.75, 1.3, 0.8, 0.5, 0.05, ['#ffffff', '#dfe7f2', '#d2dcea']);
  s += faceY(1.2, 8.8, 0.75, 1.1, 0.12, '#0f2a52');

  /* Fiches flottantes (plan de l'écran) */
  function fiche(cls, x, y, w, icone, titre, detail, accent) {
    return '<g class="scene-carte ' + cls + '"><rect x="' + x + '" y="' + y + '" width="' + w + '" height="56" rx="8" fill="#ffffff"/>' +
      '<rect x="' + (x + 12) + '" y="' + (y + 12) + '" width="32" height="32" rx="7" fill="' + (accent ? '#fbf2d6' : '#e7eef9') + '"/>' + icone(x + 28, y + 28) +
      '<text x="' + (x + 54) + '" y="' + (y + 25) + '" font-family="Archivo, \'Public Sans\', sans-serif" font-weight="700" font-size="13" fill="#0f2445">' + titre + '</text>' +
      '<text x="' + (x + 54) + '" y="' + (y + 42) + '" font-family="\'Public Sans\', sans-serif" font-size="11" fill="#5d6b82">' + detail + '</text></g>';
  }
  function icoPortable(cx, cy) { return '<rect x="' + (cx - 8) + '" y="' + (cy - 6) + '" width="16" height="10" rx="1.5" fill="none" stroke="#1d4f9a" stroke-width="1.8"/><path d="M' + (cx - 10) + ' ' + (cy + 7) + 'h20" stroke="#1d4f9a" stroke-width="1.8" stroke-linecap="round"/>'; }
  function icoCoche(cx, cy) { return '<circle cx="' + cx + '" cy="' + cy + '" r="9" fill="#e2b93b"/><path d="M' + (cx - 4) + ' ' + cy + 'l3 3 5-6" fill="none" stroke="#12305f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'; }
  function icoListe(cx, cy) { return '<path d="M' + (cx - 7) + ' ' + (cy - 5) + 'h14M' + (cx - 7) + ' ' + cy + 'h14M' + (cx - 7) + ' ' + (cy + 5) + 'h9" stroke="#1d4f9a" stroke-width="1.8" stroke-linecap="round"/>'; }
  function trait(a, b) { return '<path d="M' + a[0] + ' ' + a[1] + ' L' + b[0].toFixed(1) + ' ' + b[1].toFixed(1) + '" stroke="#ffffff" stroke-opacity=".35" stroke-width="1.2" stroke-dasharray="3 4"/><circle cx="' + b[0].toFixed(1) + '" cy="' + b[1].toFixed(1) + '" r="3" fill="#e2b93b"/>'; }

  s += trait([120, 92], P(8.45, 1.6, 1.7));
  s += trait([470, 84], P(BX + BW, BY + 1.2, ZT));
  s += trait([118, 330], P(1.75, 8.2, 1.35));
  s += fiche('c1', 400, 28, 182, icoCoche, 'Affectation validée', 'AFF-2026-0412 · DAF', true);
  s += fiche('c2', 6, 64, 212, icoPortable, 'DGB-PC-02817', 'Affecté · Service de la solde');
  s += fiche('c3', 6, 302, 178, icoListe, '1 284 équipements', 'recensés dans le parc');

  cible.innerHTML = '<svg viewBox="0 0 600 420" role="img" aria-label="Le siège de la DGB, relié aux équipements informatiques qu’il recense">' + s + '</svg>';
})();
