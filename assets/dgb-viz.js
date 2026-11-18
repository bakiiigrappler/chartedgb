/* Suite DSI · DGB — rendu des graphes et du calendrier.
   ---------------------------------------------------------------------------
   Chaque conteneur porte son type : <div data-graphe="barres" data-jeu="arrivees">.
   Les jeux de données sont locaux et peuvent être remplacés par data-valeurs /
   data-libelles. Le rendu utilise exclusivement des aplats et les jetons de la
   palette : il suit donc la couleur de marque et le thème sombre.
   API : window.DGB_VIZ = { jeux, rendre, rendreTout, calendrier }. */
(function () {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';

  function el(nom, attrs, texte) {
    var e = document.createElementNS(NS, nom);
    if (attrs) Object.keys(attrs).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    if (texte != null) e.textContent = texte;
    return e;
  }
  function txt(parent, x, y, valeur, classe, ancre) {
    var t = el('text', { x: x, y: y, 'text-anchor': ancre || 'middle', 'class': classe || 'viz-axe' }, valeur);
    parent.appendChild(t);
    return t;
  }
  function titre(parent, valeur) {
    var t = el('title', null, valeur);
    parent.appendChild(t);
  }
  function fmt(n) { return Number(n).toLocaleString('fr-FR'); }
  function maxDe(tableau) { return Math.max.apply(null, tableau); }

  var jeux = {
    arrivees: {
      libelles: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov'],
      valeurs: [38, 42, 51, 47, 55, 61, 44, 39, 58, 66, 52],
      max: 80, unite: 'équipements'
    },
    services: {
      libelles: ['Service de la solde', 'DAF', 'Direction du budget', 'DSI', 'Cabinet du DG', 'Autres services'],
      valeurs: [312, 268, 214, 186, 142, 162], unite: 'équipements'
    },
    dossiers: {
      libelles: ['Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov'],
      series: [
        { n: 'Reçus', v: [52, 61, 58, 70, 66, 74], c: 'viz-trait' },
        { n: 'Traités', v: [48, 57, 55, 66, 63, 71], c: 'viz-trait-2' }
      ], max: 80
    },
    etats: {
      segments: [
        { n: 'En service', v: 1097, c: 'var(--m-600)' },
        { n: 'En stock', v: 121, c: 'var(--m-200)' },
        { n: 'En maintenance', v: 46, c: 'var(--attente-600)' },
        { n: 'À réformer', v: 20, c: 'var(--blocage-600)' }
      ], centre: '1 284', sous: 'équipements'
    },
    maintenance: {
      libelles: ['Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov'],
      series: [
        { n: 'Préventive', v: [14, 18, 12, 21, 16, 19], c: 'viz-v1' },
        { n: 'Curative', v: [9, 11, 7, 12, 10, 8], c: 'viz-v2' },
        { n: 'Hors garantie', v: [3, 5, 2, 6, 4, 3], c: 'viz-attente' }
      ], max: 40
    },
    delais: {
      libelles: ['Saisie', 'Prévalid.', 'Signature', 'Contrôle', 'Remise'],
      series: [
        { n: '2025', v: [2.1, 1.8, 3.4, 2.6, 1.9], c: 'viz-v4' },
        { n: '2026', v: [1.6, 1.2, 2.1, 1.7, 1.3], c: 'viz-v1' }
      ], max: 4, unite: 'jours'
    },
    radar: {
      axes: ['Délai', 'Qualité', 'Traçabilité', 'Couverture', 'Satisfaction', 'Budget'],
      series: [
        { n: '2025', v: [62, 70, 58, 65, 55, 60], c: 'var(--p-400)' },
        { n: '2026', v: [78, 82, 74, 86, 71, 76], c: 'var(--m-600)' }
      ], max: 100
    },
    dispersion: {
      points: [[2, 42], [3, 55], [4, 38], [5, 72], [6, 64], [7, 88], [1, 26], [3, 31], [8, 96], [4, 49], [5, 58], [2, 22], [6, 67], [7, 74]],
      x: 'Âge (années)', y: 'Coût maintenance (k FCFA)', maxX: 9, maxY: 100
    },
    entonnoir: {
      etapes: [
        { n: 'Saisis', v: 320 }, { n: 'Prévalidés', v: 284 }, { n: 'Signés', v: 241 },
        { n: 'Contrôlés', v: 228 }, { n: 'Validés', v: 219 }
      ]
    },
    chaleur: {
      lignes: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
      colonnes: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
      valeurs: [
        1, 2, 1, 3, 2, 2, 0, 1, 2, 3, 3, 1,
        2, 3, 2, 4, 3, 3, 1, 2, 3, 4, 4, 2,
        3, 3, 4, 4, 4, 3, 1, 2, 4, 4, 4, 2,
        2, 2, 3, 4, 3, 2, 1, 1, 3, 4, 3, 2,
        1, 2, 2, 3, 2, 1, 0, 1, 2, 3, 2, 1,
        0, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
      ]
    },
    objectifs: {
      lignes: [
        { n: 'Inventaire annuel', v: 92, c: 'succes' },
        { n: 'Étiquetage des équipements', v: 85, c: '' },
        { n: 'Maintenance préventive', v: 64, c: 'attente' },
        { n: 'Réforme des matériels obsolètes', v: 38, c: 'attente' }
      ]
    },
    spark1: { valeurs: [12, 18, 14, 22, 19, 26, 24], n: 'Dossiers traités', v: '+18 %' },
    spark2: { valeurs: [8, 9, 7, 12, 10, 13, 11], n: 'Affectations', v: '+9 %' },
    spark3: { valeurs: [4, 6, 5, 9, 7, 8, 10], n: 'Tickets clos', v: '+12 %' }
  };

  function donnees(hote) {
    var jeu = hote.getAttribute('data-jeu');
    var d = jeu && jeux[jeu] ? JSON.parse(JSON.stringify(jeux[jeu])) : {};
    var valeurs = hote.getAttribute('data-valeurs');
    var libelles = hote.getAttribute('data-libelles');
    if (valeurs) d.valeurs = valeurs.split(',').map(Number);
    if (libelles) d.libelles = libelles.split(',');
    d.titre = hote.getAttribute('data-titre') || '';
    return d;
  }

  function nouveauSvg(largeur, hauteur, label) {
    return el('svg', { viewBox: '0 0 ' + largeur + ' ' + hauteur, role: 'img', 'aria-label': label || 'Graphe' });
  }

  function legendeHTML(series) {
    var d = document.createElement('div');
    d.className = 'viz-legende';
    series.forEach(function (s) {
      var sp = document.createElement('span');
      var i = document.createElement('i');
      i.style.background = s.couleur;
      sp.appendChild(i);
      sp.appendChild(document.createTextNode(s.n));
      d.appendChild(sp);
    });
    return d;
  }

  var rendus = {};

  /* ---------------- Barres verticales ---------------- */
  rendus.barres = function (d) {
    var W = 460, H = 206, L = 32, R = W - 8, T = 14, B = H - 24;
    var max = d.max || maxDe(d.valeurs) * 1.15;
    var s = nouveauSvg(W, H, d.titre || 'Histogramme');
    var pas = (R - L) / d.valeurs.length, bw = Math.min(26, pas * 0.56);
    var y = function (v) { return B - v / max * (B - T); };
    [0, 0.25, 0.5, 0.75, 1].forEach(function (p) {
      var v = Math.round(max * p), yy = y(v);
      s.appendChild(el('line', { x1: L, x2: R, y1: yy, y2: yy, 'class': 'viz-ligne-grille' + (p === 0 ? '' : ' pointille') }));
      txt(s, L - 6, yy + 3, v, 'viz-axe', 'end');
    });
    var fort = maxDe(d.valeurs);
    d.valeurs.forEach(function (v, i) {
      var x = L + i * pas + (pas - bw) / 2;
      var r = el('rect', { x: x, y: y(v), width: bw, height: B - y(v), rx: 2, 'class': 'viz-barre ' + (v === fort || i === d.valeurs.length - 1 ? 'viz-v1' : 'viz-v3') });
      titre(r, d.libelles[i] + ' : ' + fmt(v) + (d.unite ? ' ' + d.unite : ''));
      s.appendChild(r);
      txt(s, x + bw / 2, B + 15, d.libelles[i], 'viz-axe');
      if (v === fort) txt(s, x + bw / 2, y(v) - 5, fmt(v), 'viz-axe viz-axe-fort');
    });
    return s;
  };

  /* ---------------- Barres horizontales ---------------- */
  rendus['barres-h'] = function (d) {
    var n = d.valeurs.length, W = 460, H = n * 29 + 12, L = 118, R = W - 42;
    var max = d.max || maxDe(d.valeurs);
    var s = nouveauSvg(W, H, d.titre || 'Barres horizontales');
    var bh = 13;
    d.valeurs.forEach(function (v, i) {
      var y = 8 + i * 29, longueur = Math.max(3, v / max * (R - L));
      txt(s, L - 7, y + bh - 2, d.libelles[i], 'viz-axe', 'end');
      var r = el('rect', { x: L, y: y, width: longueur, height: bh, rx: 2, 'class': 'viz-barre ' + (i === 0 ? 'viz-v1' : 'viz-v2') });
      titre(r, d.libelles[i] + ' : ' + fmt(v) + (d.unite ? ' ' + d.unite : ''));
      s.appendChild(r);
      txt(s, L + longueur + 5, y + bh - 2, fmt(v), 'viz-axe viz-axe-fort', 'start');
    });
    return s;
  };

  /* ---------------- Ligne et aire ---------------- */
  rendus.ligne = function (d) {
    var W = 460, H = 200, L = 32, R = W - 12, T = 14, B = H - 24;
    var tous = [];
    d.series.forEach(function (s) { tous = tous.concat(s.v); });
    var max = d.max || maxDe(tous) * 1.1;
    var s = nouveauSvg(W, H, d.titre || 'Courbe');
    var pasX = (R - L) / Math.max(1, d.libelles.length - 1);
    var y = function (v) { return B - v / max * (B - T); };
    [0, 0.5, 1].forEach(function (p) {
      var yy = y(max * p);
      s.appendChild(el('line', { x1: L, x2: R, y1: yy, y2: yy, 'class': 'viz-ligne-grille' + (p === 0 ? '' : ' pointille') }));
      txt(s, L - 6, yy + 3, Math.round(max * p), 'viz-axe', 'end');
    });
    d.libelles.forEach(function (lib, i) { txt(s, L + i * pasX, B + 15, lib, 'viz-axe'); });
    d.series.forEach(function (serie, j) {
      var points = serie.v.map(function (v, i) { return [L + i * pasX, y(v)]; });
      if (j === 0) {
        var aire = 'M' + points[0][0] + ' ' + B + ' ' + points.map(function (p) { return 'L' + p[0] + ' ' + p[1]; }).join(' ') + ' L' + points[points.length - 1][0] + ' ' + B + ' Z';
        s.appendChild(el('path', { d: aire, 'class': 'viz-aire' }));
      }
      s.appendChild(el('polyline', { points: points.map(function (p) { return p[0] + ',' + p[1]; }).join(' '), 'class': serie.c || 'viz-trait' }));
      points.forEach(function (p, i) {
        var c = el('circle', { cx: p[0], cy: p[1], r: 3.4, 'class': j === 0 ? 'viz-point' : 'viz-point-2' });
        titre(c, d.libelles[i] + ' · ' + serie.n + ' : ' + fmt(serie.v[i]));
        s.appendChild(c);
      });
    });
    var wrap = document.createElement('div');
    wrap.appendChild(s);
    wrap.appendChild(legendeHTML(d.series.map(function (serie) {
      return { n: serie.n, couleur: serie.c && serie.c.indexOf('viz-trait') === 0 ? (serie.c === 'viz-trait-2' ? 'var(--p-400)' : 'var(--m-600)') : 'var(--m-600)' };
    })));
    return wrap;
  };

  /* ---------------- Anneau ---------------- */
  rendus.donut = function (d) {
    var total = d.segments.reduce(function (a, b) { return a + b.v; }, 0);
    var W = 200, H = 200, cx = 100, cy = 100, r = 70, C = 2 * Math.PI * r;
    var s = nouveauSvg(W, H, d.titre || 'Répartition');
    s.appendChild(el('circle', { cx: cx, cy: cy, r: r, fill: 'none', stroke: 'var(--p-100)', 'stroke-width': 26 }));
    var offset = 0;
    d.segments.forEach(function (seg) {
      var part = seg.v / total, len = Math.max(0, part * C - 3);
      var c = el('circle', {
        cx: cx, cy: cy, r: r, fill: 'none', stroke: seg.c, 'stroke-width': 26,
        'stroke-dasharray': len + ' ' + (C - len), 'stroke-dashoffset': -offset,
        transform: 'rotate(-90 ' + cx + ' ' + cy + ')'
      });
      titre(c, seg.n + ' : ' + fmt(seg.v) + ' (' + Math.round(part * 100) + ' %)');
      s.appendChild(c);
      offset += part * C;
    });
    var wrap = document.createElement('div');
    wrap.className = 'viz-donut';
    wrap.appendChild(s);
    var centre = document.createElement('div');
    centre.className = 'viz-centre';
    var b = document.createElement('b'); b.textContent = d.centre || fmt(total);
    var small = document.createElement('small'); small.textContent = d.sous || '';
    centre.appendChild(b); centre.appendChild(small);
    wrap.appendChild(centre);
    wrap.appendChild(legendeHTML(d.segments.map(function (seg) {
      return { n: seg.n + ' · ' + Math.round(seg.v / total * 100) + ' %', couleur: seg.c };
    })));
    return wrap;
  };

  /* ---------------- Barres empilées ---------------- */
  rendus.empilees = function (d) {
    var W = 460, H = 206, L = 32, R = W - 8, T = 14, B = H - 24;
    var totaux = d.libelles.map(function (_, i) { return d.series.reduce(function (a, s) { return a + s.v[i]; }, 0); });
    var max = d.max || maxDe(totaux) * 1.1;
    var s = nouveauSvg(W, H, d.titre || 'Barres empilées');
    var pas = (R - L) / d.libelles.length, bw = Math.min(28, pas * 0.54);
    var y = function (v) { return B - v / max * (B - T); };
    [0, 0.5, 1].forEach(function (p) {
      s.appendChild(el('line', { x1: L, x2: R, y1: y(max * p), y2: y(max * p), 'class': 'viz-ligne-grille' + (p === 0 ? '' : ' pointille') }));
      txt(s, L - 6, y(max * p) + 3, Math.round(max * p), 'viz-axe', 'end');
    });
    d.libelles.forEach(function (lib, i) {
      var x = L + i * pas + (pas - bw) / 2, base = B;
      d.series.forEach(function (serie) {
        var h = serie.v[i] / max * (B - T);
        var r = el('rect', { x: x, y: base - h, width: bw, height: h, 'class': 'viz-barre ' + serie.c });
        titre(r, lib + ' · ' + serie.n + ' : ' + fmt(serie.v[i]));
        s.appendChild(r);
        base -= h;
      });
      txt(s, x + bw / 2, B + 15, lib, 'viz-axe');
    });
    var wrap = document.createElement('div');
    wrap.appendChild(s);
    wrap.appendChild(legendeHTML(d.series.map(function (serie) {
      return { n: serie.n, couleur: serie.c === 'viz-v1' ? 'var(--m-600)' : serie.c === 'viz-v2' ? 'var(--m-300)' : 'var(--attente-600)' };
    })));
    return wrap;
  };

  /* ---------------- Barres groupées ---------------- */
  rendus.groupees = function (d) {
    var W = 460, H = 206, L = 32, R = W - 8, T = 14, B = H - 24;
    var tous = [];
    d.series.forEach(function (s) { tous = tous.concat(s.v); });
    var max = d.max || maxDe(tous) * 1.15;
    var s = nouveauSvg(W, H, d.titre || 'Barres groupées');
    var pas = (R - L) / d.libelles.length, bw = Math.min(14, pas * 0.3);
    var y = function (v) { return B - v / max * (B - T); };
    [0, 0.5, 1].forEach(function (p) {
      s.appendChild(el('line', { x1: L, x2: R, y1: y(max * p), y2: y(max * p), 'class': 'viz-ligne-grille' + (p === 0 ? '' : ' pointille') }));
      txt(s, L - 6, y(max * p) + 3, Math.round(max * p * 10) / 10, 'viz-axe', 'end');
    });
    d.libelles.forEach(function (lib, i) {
      var centre = L + i * pas + pas / 2, depart = centre - (d.series.length * bw + (d.series.length - 1) * 3) / 2;
      d.series.forEach(function (serie, j) {
        var x = depart + j * (bw + 3);
        var r = el('rect', { x: x, y: y(serie.v[i]), width: bw, height: B - y(serie.v[i]), rx: 2, 'class': 'viz-barre ' + (j === 0 ? 'viz-v4' : 'viz-v1') });
        titre(r, lib + ' · ' + serie.n + ' : ' + fmt(serie.v[i]) + ' j');
        s.appendChild(r);
      });
      txt(s, centre, B + 15, lib, 'viz-axe');
    });
    var wrap = document.createElement('div');
    wrap.appendChild(s);
    wrap.appendChild(legendeHTML(d.series.map(function (serie, i) {
      return { n: serie.n + ' (jours)', couleur: i === 0 ? 'var(--p-400)' : 'var(--m-600)' };
    })));
    return wrap;
  };

  /* ---------------- Jauge ---------------- */
  rendus.jauge = function (d) {
    var pct = Math.max(0, Math.min(100, d.valeur || 0)), W = 240, H = 148, r = 78, cx = 120, cy = 118;
    var L = Math.PI * r;
    var s = nouveauSvg(W, H, d.titre || 'Jauge');
    s.appendChild(el('path', { d: 'M ' + (cx - r) + ' ' + cy + ' A ' + r + ' ' + r + ' 0 0 1 ' + (cx + r) + ' ' + cy, fill: 'none', stroke: 'var(--p-200)', 'stroke-width': 17 }));
    s.appendChild(el('path', {
      d: 'M ' + (cx - r) + ' ' + cy + ' A ' + r + ' ' + r + ' 0 0 1 ' + (cx + r) + ' ' + cy,
      fill: 'none', stroke: 'var(--m-600)', 'stroke-width': 17,
      'stroke-dasharray': (pct / 100 * L) + ' ' + L
    }));
    txt(s, cx - r - 2, cy + 16, '0', 'viz-axe', 'middle');
    txt(s, cx + r + 2, cy + 16, '100', 'viz-axe', 'middle');
    var wrap = document.createElement('div');
    wrap.className = 'viz-jauge';
    wrap.appendChild(s);
    var v = document.createElement('div');
    v.className = 'viz-valeur';
    var b = document.createElement('b'); b.textContent = pct + ' %';
    var small = document.createElement('small'); small.textContent = d.sous || 'disponibilité';
    v.appendChild(b); v.appendChild(small);
    wrap.appendChild(v);
    return wrap;
  };

  /* ---------------- Radar ---------------- */
  rendus.radar = function (d) {
    var W = 250, H = 238, cx = 125, cy = 120, r = 76, n = d.axes.length, max = d.max || 100;
    var s = nouveauSvg(W, H, d.titre || 'Radar');
    var angle = function (i) { return -Math.PI / 2 + i * 2 * Math.PI / n; };
    for (var ring = 4; ring >= 1; ring--) {
      var pts = [];
      for (var i = 0; i < n; i++) {
        var rr = r * ring / 4;
        pts.push((cx + Math.cos(angle(i)) * rr) + ',' + (cy + Math.sin(angle(i)) * rr));
      }
      s.appendChild(el('polygon', { points: pts.join(' '), fill: ring === 4 ? 'var(--p-50)' : 'none', stroke: 'var(--p-200)', 'stroke-width': 1 }));
    }
    d.axes.forEach(function (axe, i) {
      var a = angle(i);
      s.appendChild(el('line', { x1: cx, y1: cy, x2: cx + Math.cos(a) * r, y2: cy + Math.sin(a) * r, stroke: 'var(--p-200)' }));
      txt(s, cx + Math.cos(a) * (r + 20), cy + Math.sin(a) * (r + 17) + 3, axe, 'viz-axe', Math.abs(Math.cos(a)) < 0.2 ? 'middle' : Math.cos(a) > 0 ? 'start' : 'end');
    });
    d.series.forEach(function (serie) {
      var pts = serie.v.map(function (v, i) {
        var rr = v / max * r, a = angle(i);
        return (cx + Math.cos(a) * rr) + ',' + (cy + Math.sin(a) * rr);
      });
      s.appendChild(el('polygon', {
        points: pts.join(' '), fill: serie.c, 'fill-opacity': .16, stroke: serie.c, 'stroke-width': 2
      }));
      pts.forEach(function (p, i) {
        var xy = p.split(',');
        var c = el('circle', { cx: xy[0], cy: xy[1], r: 2.8, fill: serie.c });
        titre(c, d.axes[i] + ' · ' + serie.n + ' : ' + serie.v[i] + ' / 100');
        s.appendChild(c);
      });
    });
    var wrap = document.createElement('div');
    wrap.className = 'viz-radar';
    wrap.appendChild(s);
    wrap.appendChild(legendeHTML(d.series.map(function (serie) {
      return { n: serie.n, couleur: serie.c };
    })));
    return wrap;
  };

  /* ---------------- Nuage de points ---------------- */
  rendus.nuage = function (d) {
    var W = 460, H = 210, L = 38, R = W - 12, T = 12, B = H - 30;
    var s = nouveauSvg(W, H, d.titre || 'Nuage de points');
    [0, 0.5, 1].forEach(function (p) {
      var yy = B - p * (B - T);
      s.appendChild(el('line', { x1: L, x2: R, y1: yy, y2: yy, 'class': 'viz-ligne-grille' + (p === 0 ? '' : ' pointille') }));
      txt(s, L - 6, yy + 3, Math.round(d.maxY * p), 'viz-axe', 'end');
    });
    [1, 3, 5, 7, 9].forEach(function (v) {
      txt(s, L + (R - L) * (v / d.maxX), B + 15, v + ' ans', 'viz-axe');
    });
    d.points.forEach(function (p) {
      var x = L + (R - L) * (p[0] / d.maxX);
      var y = B - (B - T) * (p[1] / d.maxY);
      var c = el('circle', { cx: x, cy: y, r: 4.2, 'class': 'viz-point', 'fill-opacity': .9 });
      titre(c, p[0] + ' ans · ' + p[1] + ' k FCFA');
      s.appendChild(c);
    });
    txt(s, W - 12, H - 2, d.x, 'viz-axe', 'end');
    txt(s, 4, 10, d.y, 'viz-axe', 'start');
    return s;
  };

  /* ---------------- Entonnoir ---------------- */
  rendus.entonnoir = function (d) {
    var W = 460, H = d.etapes.length * 38 + 10, cx = W / 2;
    var s = nouveauSvg(W, H, d.titre || 'Entonnoir');
    var largeurMax = 330, largeurMin = 170;
    var classes = ['viz-v1', 'viz-v1', 'viz-v2', 'viz-v3', 'viz-v4'];
    d.etapes.forEach(function (etape, i) {
      var w1 = largeurMax - (largeurMax - largeurMin) * i / d.etapes.length;
      var w2 = largeurMax - (largeurMax - largeurMin) * (i + 1) / d.etapes.length;
      var y = 5 + i * 38, h = 29;
      var p = el('path', {
        d: 'M' + (cx - w1 / 2) + ' ' + y + ' L' + (cx + w1 / 2) + ' ' + y + ' L' + (cx + w2 / 2) + ' ' + (y + h) + ' L' + (cx - w2 / 2) + ' ' + (y + h) + ' Z',
        'class': classes[i] || 'viz-v4'
      });
      titre(p, etape.n + ' : ' + fmt(etape.v));
      s.appendChild(p);
      txt(s, cx - 16, y + 19, etape.n, i < 3 ? 'viz-axe viz-axe-fort' : 'viz-axe', 'middle');
      var t = el('text', { x: cx + 60, y: y + 19, 'text-anchor': 'middle', 'class': 'viz-axe viz-axe-fort' }, fmt(etape.v));
      if (i < 3) t.setAttribute('style', 'fill:#fff');
      s.appendChild(t);
    });
    return s;
  };

  /* ---------------- Carte de chaleur ---------------- */
  rendus.chaleur = function (d) {
    var wrap = document.createElement('div');
    wrap.className = 'viz-chaleur';
    var entete = document.createElement('div');
    entete.className = 'viz-ch-ligne';
    var vide = document.createElement('span');
    entete.appendChild(vide);
    d.colonnes.forEach(function (mois) {
      var m = document.createElement('span'); m.className = 'viz-ch-mois'; m.textContent = mois.charAt(0); entete.appendChild(m);
    });
    wrap.appendChild(entete);
    d.lignes.forEach(function (jour, li) {
      var ligne = document.createElement('div');
      ligne.className = 'viz-ch-ligne';
      var lib = document.createElement('span'); lib.className = 'viz-ch-jour'; lib.textContent = jour; ligne.appendChild(lib);
      d.colonnes.forEach(function (col, ci) {
        var v = d.valeurs[li * d.colonnes.length + ci] || 0;
        var cell = document.createElement('span');
        cell.className = 'viz-ch-cell' + (v ? ' n' + v : '');
        cell.title = jour + ' ' + col + ' : ' + v + ' mouvement' + (v > 1 ? 's' : '');
        ligne.appendChild(cell);
      });
      wrap.appendChild(ligne);
    });
    var echelle = document.createElement('div');
    echelle.className = 'viz-echelle';
    echelle.appendChild(document.createTextNode('moins'));
    ['0', '1', '2', '3', '4'].forEach(function (n) {
      var i = document.createElement('i');
      i.className = 'viz-ch-cell' + (n !== '0' ? ' n' + n : '');
      echelle.appendChild(i);
    });
    echelle.appendChild(document.createTextNode('plus'));
    wrap.appendChild(echelle);
    return wrap;
  };

  /* ---------------- Progression ---------------- */
  rendus.progression = function (d) {
    var wrap = document.createElement('div');
    wrap.className = 'viz-progression';
    d.lignes.forEach(function (l) {
      var ligne = document.createElement('div');
      ligne.className = 'viz-prog';
      var haut = document.createElement('div');
      haut.className = 'viz-prog-haut';
      var nom = document.createElement('span'); nom.textContent = l.n;
      var val = document.createElement('b'); val.textContent = l.v + ' %';
      haut.appendChild(nom); haut.appendChild(val);
      var piste = document.createElement('div');
      piste.className = 'viz-piste';
      var barre = document.createElement('span');
      if (l.c) barre.className = l.c;
      barre.style.width = Math.max(2, l.v) + '%';
      piste.appendChild(barre);
      ligne.appendChild(haut); ligne.appendChild(piste);
      wrap.appendChild(ligne);
    });
    return wrap;
  };

  /* ---------------- Sparkline ---------------- */
  rendus.sparkline = function (d) {
    var W = 120, H = 30, max = maxDe(d.valeurs), min = Math.min.apply(null, d.valeurs);
    var s = nouveauSvg(W, H, d.n || 'Tendance');
    var pas = W / (d.valeurs.length - 1);
    var y = function (v) { return H - 3 - (v - min) / Math.max(1, max - min) * (H - 8); };
    var points = d.valeurs.map(function (v, i) { return [i * pas, y(v)]; });
    var aire = 'M0 ' + H + ' ' + points.map(function (p) { return 'L' + p[0] + ' ' + p[1]; }).join(' ') + ' L' + W + ' ' + H + ' Z';
    s.appendChild(el('path', { d: aire, 'class': 'viz-aire' }));
    s.appendChild(el('polyline', { points: points.map(function (p) { return p[0] + ',' + p[1]; }).join(' '), 'class': 'viz-trait' }));
    var dernier = points[points.length - 1];
    s.appendChild(el('circle', { cx: dernier[0] - 1, cy: dernier[1], r: 2.4, 'class': 'viz-v1' }));
    var wrap = document.createElement('div');
    wrap.className = 'viz-spark';
    wrap.appendChild(s);
    var info = document.createElement('div');
    var b = document.createElement('b'); b.textContent = d.v || '';
    var small = document.createElement('small'); small.textContent = d.n || '';
    info.appendChild(b); info.appendChild(small);
    wrap.appendChild(info);
    return wrap;
  };

  function rendre(hote) {
    var type = hote.getAttribute('data-graphe');
    if (!type || !rendus[type]) return;
    var d = donnees(hote);
    if (type === 'jauge') d.valeur = Number(hote.getAttribute('data-valeur') || 0);
    hote.innerHTML = '';
    hote.setAttribute('role', 'group');
    if (d.titre) hote.setAttribute('aria-label', d.titre);
    hote.appendChild(rendus[type](d));
  }

  function rendreTout(racine) {
    (racine || document).querySelectorAll('[data-graphe]').forEach(rendre);
  }

  /* =======================================================================
     Calendrier
     ======================================================================= */
  var EVENEMENTS = {
    '2026-11-16': [{ h: '15:30', t: 'Initialisation du dossier AFF-2026-0412', type: '' }],
    '2026-11-18': [{ h: '09:30', t: 'Signature AFF-2026-0412', type: 'attente' }, { h: '14:00', t: 'Contrôle MNT-2026-0087', type: '' }],
    '2026-11-19': [{ h: '10:00', t: "Commission d'affectation", type: 'marque' }],
    '2026-11-20': [{ h: '17:00', t: "Clôture de l'inventaire DAF", type: 'attente' }],
    '2026-11-23': [{ h: '08:00', t: 'Maintenance préventive — Solde', type: '' }],
    '2026-11-25': [{ h: '11:00', t: 'Comité du parc', type: 'marque' }],
    '2026-11-27': [{ h: '09:00', t: 'Remise du procès-verbal', type: 'succes' }],
    '2026-11-30': [{ h: '—', t: 'Fin de garantie — 14 postes', type: 'blocage' }],
    '2026-12-02': [{ h: '10:00', t: 'Revue des marchés', type: '' }],
    '2026-12-08': [{ h: '09:30', t: 'Assemblée des chefs de service', type: 'marque' }]
  };

  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function cle(y, m, d) { return y + '-' + pad(m + 1) + '-' + pad(d); }
  function indice(y, m) { return y * 12 + m; }
  function depuisIndice(i) { return { y: Math.floor(i / 12), m: i % 12 }; }

  function calendrier(hote) {
    var base = hote.getAttribute('data-mois') || '2026-11';
    var morceaux = base.split('-');
    var etat = {
      y: Number(morceaux[0]) || 2026,
      m: (Number(morceaux[1]) || 11) - 1,
      choisi: hote.getAttribute('data-aujourdhui') || '2026-11-18',
      aujourdhui: hote.getAttribute('data-aujourdhui') || '2026-11-18',
      agenda: hote.getAttribute('data-agenda') !== 'non'
    };

    function dessiner() {
      hote.innerHTML = '';
      var racine = document.createElement('div');
      racine.className = 'cal';
      if (!etat.agenda) racine.setAttribute('data-agenda', 'non');

      var premier = new Date(etat.y, etat.m, 1);
      var decalage = (premier.getDay() + 6) % 7;
      var debut = new Date(etat.y, etat.m, 1 - decalage);
      var nbEvenements = 0;
      Object.keys(EVENEMENTS).forEach(function (k) {
        if (k.indexOf(etat.y + '-' + pad(etat.m + 1)) === 0) nbEvenements += EVENEMENTS[k].length;
      });

      var tete = document.createElement('div');
      tete.className = 'cal-tete';
      var mois = document.createElement('div');
      mois.className = 'cal-mois';
      var b = document.createElement('b');
      b.textContent = premier.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
      var small = document.createElement('small');
      small.textContent = nbEvenements + ' échéance' + (nbEvenements > 1 ? 's' : '') + ' ce mois';
      mois.appendChild(b); mois.appendChild(small);
      tete.appendChild(mois);

      var nav = document.createElement('div');
      nav.className = 'cal-nav';
      var prec = document.createElement('button');
      prec.type = 'button'; prec.setAttribute('aria-label', 'Mois précédent'); prec.innerHTML = '‹';
      var suiv = document.createElement('button');
      suiv.type = 'button'; suiv.setAttribute('aria-label', 'Mois suivant'); suiv.innerHTML = '›';
      var auj = document.createElement('button');
      auj.type = 'button'; auj.className = 'cal-aujourdhui'; auj.textContent = "Aujourd'hui";
      nav.appendChild(prec); nav.appendChild(suiv); nav.appendChild(auj);
      tete.appendChild(nav);
      racine.appendChild(tete);

      var corps = document.createElement('div');
      corps.className = 'cal-corps';
      var semaines = document.createElement('div');
      semaines.className = 'cal-semaines';
      ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].forEach(function (j) {
        var s = document.createElement('span'); s.textContent = j; semaines.appendChild(s);
      });
      corps.appendChild(semaines);
      var grille = document.createElement('div');
      grille.className = 'cal-grille';
      grille.setAttribute('role', 'group');
      grille.setAttribute('aria-label', b.textContent);

      for (var i = 0; i < 42; i++) {
        var date = new Date(debut.getFullYear(), debut.getMonth(), debut.getDate() + i);
        var k = cle(date.getFullYear(), date.getMonth(), date.getDate());
        var jour = document.createElement('button');
        jour.type = 'button';
        jour.className = 'cal-jour';
        jour.dataset.date = k;
        jour.textContent = date.getDate();
        if (date.getMonth() !== etat.m) jour.classList.add('hors-mois');
        if (k === etat.aujourdhui) jour.classList.add('aujourdhui');
        if (k === etat.choisi) {
          jour.classList.add('choisi');
          jour.setAttribute('aria-pressed', 'true');
        }
        var evs = EVENEMENTS[k] || [];
        jour.setAttribute('aria-label', date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) + (evs.length ? ' · ' + evs.length + ' échéance' + (evs.length > 1 ? 's' : '') : ''));
        if (evs.length) {
          var points = document.createElement('span');
          points.className = 'cal-points';
          evs.slice(0, 3).forEach(function (ev) {
            var p = document.createElement('i');
            if (ev.type) p.className = ev.type;
            points.appendChild(p);
          });
          jour.appendChild(points);
        }
        jour.addEventListener('click', function () {
          etat.choisi = this.dataset.date;
          dessiner();
        });
        grille.appendChild(jour);
      }
      corps.appendChild(grille);
      racine.appendChild(corps);

      if (etat.agenda) {
        var cote = document.createElement('div');
        cote.className = 'cal-agenda';
        var at = document.createElement('div');
        at.className = 'cal-agenda-titre';
        var dateChoisie = new Date(etat.choisi + 'T12:00:00');
        var titreDate = document.createElement('b');
        titreDate.textContent = dateChoisie.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
        var compte = document.createElement('small');
        var evsJour = EVENEMENTS[etat.choisi] || [];
        compte.textContent = evsJour.length ? evsJour.length + ' élément' + (evsJour.length > 1 ? 's' : '') : 'libre';
        at.appendChild(titreDate); at.appendChild(compte);
        cote.appendChild(at);

        var liste = document.createElement('div');
        liste.className = 'cal-liste';
        liste.setAttribute('aria-live', 'polite');
        if (!evsJour.length) {
          var vide = document.createElement('div');
          vide.className = 'cal-vide';
          vide.textContent = 'Aucune échéance ce jour.';
          liste.appendChild(vide);
        } else {
          evsJour.forEach(function (ev) {
            var item = document.createElement('div');
            item.className = 'cal-event' + (ev.type ? ' ' + ev.type : '');
            var t = document.createElement('time'); t.textContent = ev.h;
            var s = document.createElement('span'); s.textContent = ev.t;
            item.appendChild(t); item.appendChild(s);
            liste.appendChild(item);
          });
        }
        cote.appendChild(liste);

        var suite = [];
        Object.keys(EVENEMENTS).forEach(function (k) {
          if (k <= etat.choisi) return;
          EVENEMENTS[k].forEach(function (ev) { suite.push({ k: k, ev: ev }); });
        });
        suite.sort(function (a, b) { return a.k < b.k ? -1 : 1; });
        if (suite.length) {
          var prochain = document.createElement('div');
          prochain.className = 'cal-prochain';
          var et = document.createElement('span');
          et.className = 'etiquette';
          et.textContent = 'À venir';
          prochain.appendChild(et);
          suite.slice(0, 3).forEach(function (o) {
            var a = document.createElement('a');
            a.href = '#';
            var b2 = document.createElement('b');
            b2.textContent = o.ev.t;
            var sm = document.createElement('small');
            sm.textContent = new Date(o.k + 'T12:00:00').toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
            a.appendChild(b2); a.appendChild(sm);
            a.addEventListener('click', function (e) {
              e.preventDefault();
              var p2 = o.k.split('-');
              etat.y = Number(p2[0]); etat.m = Number(p2[1]) - 1; etat.choisi = o.k;
              dessiner();
            });
            prochain.appendChild(a);
          });
          cote.appendChild(prochain);
        }
        racine.appendChild(cote);
      }

      prec.addEventListener('click', function () {
        var x = depuisIndice(indice(etat.y, etat.m) - 1); etat.y = x.y; etat.m = x.m; dessiner();
      });
      suiv.addEventListener('click', function () {
        var x = depuisIndice(indice(etat.y, etat.m) + 1); etat.y = x.y; etat.m = x.m; dessiner();
      });
      auj.addEventListener('click', function () {
        var p = etat.aujourdhui.split('-');
        etat.y = Number(p[0]); etat.m = Number(p[1]) - 1; etat.choisi = etat.aujourdhui; dessiner();
      });

      hote.appendChild(racine);
    }

    dessiner();
  }

  function initCalendriers(racine) {
    (racine || document).querySelectorAll('[data-calendrier]').forEach(function (h) {
      if (!h.dataset.pret) {
        h.dataset.pret = '1';
        calendrier(h);
      }
    });
  }

  function init(racine) {
    rendreTout(racine);
    initCalendriers(racine);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { init(); });
  } else {
    init();
  }

  window.DGB_VIZ = { jeux: jeux, rendre: rendre, rendreTout: rendreTout, calendrier: calendrier, evenements: EVENEMENTS };
})();
