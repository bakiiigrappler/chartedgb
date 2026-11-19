/* =========================================================================
   Page de connexion · Suite DSI · DGB
   Scènes par métier (défilement automatique, ?scene=), style OKANDAH ou
   ABAT (?style=), parcours en trois étapes avec retours visuels et sonores.
   Démonstration : toute adresse @budget.gouv.ga avec un mot de passe de
   8 caractères ou plus est acceptée ; le code à usage unique est 315120.
   ========================================================================= */
(function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s); }, $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  function lire(c) { try { return localStorage.getItem('dgb.' + c); } catch (e) { return null; } }
  function ecrire(c, v) { try { if (v == null) localStorage.removeItem('dgb.' + c); else localStorage.setItem('dgb.' + c, v); } catch (e) { /* poste verrouillé */ } }
  var params; try { params = new URLSearchParams(location.search); } catch (e) { params = { get: function () { return null; } }; }
  var calme = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Scènes ---------- */
  var ORDRE = ['parc', 'courrier', 'projet', 'budget', 'rh', 'archives', 'marches', 'audit'];
  var APPS = {
    parc: ['Gestion du parc · DGB', 'Connectez-vous pour accéder à la gestion du parc informatique.', 'Gestion du parc'],
    courrier: ['OKANDAH · Courrier', 'Connectez-vous pour enregistrer, imputer et suivre le courrier.', 'OKANDAH'],
    projet: ['ABAT · Investissements publics', 'Connectez-vous pour suivre la programmation et l’exécution des projets.', 'ABAT'],
    budget: ['Exécution budgétaire · DGB', 'Connectez-vous pour suivre les engagements et les crédits.', 'l’exécution budgétaire'],
    rh: ['Ressources humaines · DGB', 'Connectez-vous pour gérer les agents, les postes et les carrières.', 'les ressources humaines'],
    archives: ['Archives et GED · DGB', 'Connectez-vous pour numériser, classer et retrouver les documents.', 'les archives'],
    marches: ['Marchés publics · DGB', 'Connectez-vous pour suivre les appels d’offres et les contrats.', 'les marchés publics'],
    audit: ['Contrôle budgétaire · DGB', 'Connectez-vous pour contrôler et viser les engagements.', 'le contrôle budgétaire']
  };
  var onglets = $('#scenes-onglets'), cible = $('#scene-suite'), legende = $('#scene-legende');
  onglets.innerHTML = ORDRE.map(function (n) { return '<button class="cnx-scene-onglet" type="button" data-scene="' + n + '" aria-pressed="false">' + DGB_SCENES_INFOS[n].titre + '</button>'; }).join('');
  var courante = null;
  function afficherScene(nom, memoriser) {
    if (!DGB_SCENES[nom]) nom = 'parc';
    courante = nom;
    DGB_SCENES[nom](cible);
    var inf = DGB_SCENES_INFOS[nom];
    legende.innerHTML = '<svg class="ico"><use href="#i-' + inf.icone + '"/></svg><span>' + inf.legende + '</span>';
    $('#accroche-surtitre').textContent = inf.titre;
    $('#nom-app').textContent = APPS[nom][0];
    $('#invite').textContent = APPS[nom][1];
    $$('[data-scene]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-scene') === nom)); });
    var actif = $('[data-scene="' + nom + '"]'); if (actif && actif.scrollIntoView) actif.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    if (memoriser) ecrire('scene', nom);
  }
  /* Défilement automatique : s'arrête dès que l'agent choisit un métier */
  var minuterieScene = null, defile = $('#defile');
  function majDefile(actif) {
    defile.setAttribute('aria-pressed', String(actif));
    defile.setAttribute('aria-label', actif ? 'Arrêter le défilement des illustrations' : 'Reprendre le défilement des illustrations');
    defile.querySelector('svg').innerHTML = actif ? '<path d="M9 6v12M15 6v12"/>' : '<path d="M8 5.5v13l10-6.5z"/>';
  }
  function lancerDefile() {
    clearInterval(minuterieScene);
    minuterieScene = setInterval(function () { afficherScene(ORDRE[(ORDRE.indexOf(courante) + 1) % ORDRE.length]); }, 9000);
    majDefile(true);
  }
  function arreterDefile() { clearInterval(minuterieScene); minuterieScene = null; majDefile(false); }
  onglets.addEventListener('click', function (e) { var b = e.target.closest('[data-scene]'); if (!b) return; arreterDefile(); afficherScene(b.getAttribute('data-scene'), true); });
  defile.addEventListener('click', function () { if (minuterieScene) arreterDefile(); else lancerDefile(); });
  var demandee = params.get('scene');
  afficherScene(demandee || lire('scene') || 'parc');
  if (demandee || lire('scene') || calme) arreterDefile(); else lancerDefile();

  /* ---------- Style de la page : OKANDAH ou ABAT ---------- */
  var cnx = $('.cnx');
  function appliquerStyle(nom) {
    if (nom !== 'abat') nom = 'okandah';
    cnx.setAttribute('data-style', nom);
    document.body.setAttribute('data-style-cnx', nom);
    $$('.cnx-style [data-style]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-style') === nom)); });
    ecrire('cnx-style', nom);
  }
  $$('.cnx-style [data-style]').forEach(function (b) { b.addEventListener('click', function () { appliquerStyle(b.getAttribute('data-style')); }); });
  appliquerStyle(params.get('style') || lire('cnx-style') || 'okandah');

  /* ---------- Étapes ---------- */
  var carte = $('#carte');
  function aller(n) {
    ['1', '2', '3', 'ok'].forEach(function (i) { $('#etape-' + i).hidden = String(n) !== i; });
    $$('[data-etape-ind]').forEach(function (li, i) {
      var k = n === 'ok' ? 4 : n;
      li.classList.toggle('actif', i + 1 === k); li.classList.toggle('fait', i + 1 < k);
      if (i + 1 === k) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
      li.querySelector('span').innerHTML = i + 1 < k ? '<svg class="ico" style="width:12px;height:12px"><use href="#i-coche"/></svg>' : String(i + 1);
    });
    if (n === 2) { lancerMinuteur(); setTimeout(function () { $('#otp-1').focus(); }, 40); }
    if (n === 3) setTimeout(function () { $('input[name="fonction"]:checked').focus(); }, 40);
  }
  function secouer() { carte.classList.remove('secoue'); void carte.offsetWidth; carte.classList.add('secoue'); }
  function charger(bouton, actif, texte) {
    bouton.classList.toggle('charge', actif); bouton.disabled = actif;
    if (texte) bouton.querySelector('.libelle').textContent = texte;
  }

  /* Étape 1 : identifiants */
  var email = $('#email'), mdp = $('#mot-de-passe'), champEmail = $('#champ-email'), indice = $('#email-indice'), essais = 0;
  var VALIDE = /^[^@\s]+@budget\.gouv\.ga$/i;
  function verifierEmail(final) {
    var v = email.value.trim(), ok = VALIDE.test(v);
    champEmail.classList.toggle('valide', ok);
    champEmail.classList.toggle('invalide', final && !!v && !ok);
    indice.classList.toggle('erreur', final && !!v && !ok);
    indice.innerHTML = !v || ok ? (ok ? '<svg class="ico ico-4"><use href="#i-coche"/></svg>Adresse professionnelle reconnue.' : 'Votre adresse se termine par <b>@budget.gouv.ga</b>.')
      : (v.indexOf('@') < 0 ? 'Il manque le « @ » et le domaine <b>@budget.gouv.ga</b>.' : 'Utilisez votre adresse professionnelle <b>@budget.gouv.ga</b>.');
    return ok;
  }
  email.addEventListener('input', function () { verifierEmail(false); });
  email.addEventListener('blur', function () { verifierEmail(true); });
  var maj = $('#maj-alerte');
  ['keydown', 'keyup'].forEach(function (ev) { mdp.addEventListener(ev, function (e) { if (e.getModifierState) maj.hidden = !e.getModifierState('CapsLock'); }); });
  mdp.addEventListener('blur', function () { maj.hidden = true; });
  var memo = lire('email-memo');
  if (memo) { email.value = memo; $('#rester').checked = true; verifierEmail(false); }

  $$('[data-demo]').forEach(function (b) {
    b.addEventListener('click', function () {
      email.value = b.getAttribute('data-demo'); mdp.value = 'Demo-2026!'; verifierEmail(false);
      $$('[data-demo]').forEach(function (x) { x.classList.toggle('choisi', x === b); });
      $('#bouton-1').focus();
    });
  });
  $('#oubli').addEventListener('click', function (e) {
    e.preventDefault();
    DGB.toast({ ton: 'info', titre: 'Réinitialisation du mot de passe', texte: VALIDE.test(email.value.trim()) ? 'Un lien vient d’être envoyé à ' + email.value.trim() + '.' : 'Saisissez d’abord votre adresse professionnelle.', son: 'clic' });
  });

  $('#form-1').addEventListener('submit', function (e) {
    e.preventDefault();
    var erreur = $('#erreur-1'), texte = $('#erreur-1-texte'), bouton = $('#bouton-1');
    var okEmail = verifierEmail(true), okMdp = mdp.value.length >= 8;
    if (!okEmail || !okMdp) {
      essais++;
      texte.textContent = !email.value.trim() || !mdp.value ? 'Saisissez votre adresse et votre mot de passe.'
        : (!okEmail ? 'Adresse non reconnue : utilisez votre adresse @budget.gouv.ga.' : 'Adresse ou mot de passe incorrect.') +
          (essais >= 2 ? ' Il vous reste ' + Math.max(0, 5 - essais) + ' essai' + (5 - essais > 1 ? 's' : '') + ' avant le verrouillage du compte pendant 15 minutes.' : '');
      erreur.hidden = false; secouer(); DGB.son('erreur');
      (okEmail ? mdp : email).focus();
      return;
    }
    erreur.hidden = true;
    ecrire('email-memo', $('#rester').checked ? email.value.trim() : null);
    charger(bouton, true, 'Vérification…');
    setTimeout(function () {
      charger(bouton, false, 'Se connecter');
      var v = email.value.trim(), at = v.indexOf('@');
      $('#email-masque').textContent = v.slice(0, 3) + '•••' + v.slice(at);
      DGB.son('clic');
      aller(2);
    }, 900);
  });

  /* Étape 2 : code à usage unique */
  var champs = $$('.code-otp input');
  function codeSaisi() { return champs.map(function (c) { return c.value; }).join(''); }
  champs.forEach(function (c, i) {
    c.addEventListener('input', function () {
      c.value = c.value.replace(/\D/g, '').slice(0, 1);
      if (c.value && champs[i + 1]) champs[i + 1].focus();
      if (codeSaisi().length === 6) $('#form-2').requestSubmit ? $('#form-2').requestSubmit() : $('#bouton-2').click();
    });
    c.addEventListener('keydown', function (e) {
      if (e.key === 'Backspace' && !c.value && champs[i - 1]) champs[i - 1].focus();
      if (e.key === 'ArrowLeft' && champs[i - 1]) champs[i - 1].focus();
      if (e.key === 'ArrowRight' && champs[i + 1]) champs[i + 1].focus();
    });
    c.addEventListener('paste', function (e) {
      var t = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, 6);
      if (!t) return; e.preventDefault();
      t.split('').forEach(function (ch, j) { if (champs[j]) champs[j].value = ch; });
      (champs[t.length] || champs[5]).focus();
      if (t.length === 6) $('#bouton-2').click();
    });
  });
  $('#form-2').addEventListener('submit', function (e) {
    e.preventDefault();
    var bouton = $('#bouton-2');
    if (codeSaisi().length < 6) { $('#erreur-2').hidden = false; $('#erreur-2 span').textContent = 'Saisissez les six chiffres du code.'; secouer(); DGB.son('erreur'); return; }
    charger(bouton, true, 'Vérification…');
    setTimeout(function () {
      charger(bouton, false, 'Vérifier le code');
      if (codeSaisi() !== '315120') {
        $('#erreur-2').hidden = false; $('#erreur-2 span').textContent = 'Code incorrect. Vérifiez les six chiffres reçus par e-mail.';
        champs.forEach(function (c) { c.value = ''; c.classList.add('faux'); });
        setTimeout(function () { champs.forEach(function (c) { c.classList.remove('faux'); }); }, 600);
        secouer(); DGB.son('erreur'); champs[0].focus();
        return;
      }
      $('#erreur-2').hidden = true;
      champs.forEach(function (c) { c.classList.add('bon'); });
      DGB.son('clic');
      setTimeout(function () { champs.forEach(function (c) { c.classList.remove('bon'); }); aller(3); }, 450);
    }, 700);
  });
  var reste = 299, minuteur = $('#minuteur'), intervalle = null;
  function lancerMinuteur() {
    reste = 299; clearInterval(intervalle); minuteur.textContent = '04:59'; minuteur.classList.remove('expire');
    intervalle = setInterval(function () {
      if (reste > 0) reste--;
      minuteur.textContent = String(Math.floor(reste / 60)).padStart(2, '0') + ':' + String(reste % 60).padStart(2, '0');
      minuteur.classList.toggle('expire', reste < 60);
      if (reste === 0) clearInterval(intervalle);
    }, 1000);
  }
  $('#renvoyer').addEventListener('click', function (e) {
    e.preventDefault(); lancerMinuteur(); champs.forEach(function (c) { c.value = ''; }); champs[0].focus();
    DGB.toast({ ton: 'info', titre: 'Nouveau code envoyé', texte: 'Consultez votre messagerie professionnelle.', son: 'clic', duree: 3000 });
  });

  /* Étape 3 : fonction, puis succès */
  $('#form-3').addEventListener('submit', function (e) {
    e.preventDefault();
    var bouton = $('#bouton-3'), fct = $('input[name="fonction"]:checked').closest('.fonction').querySelector('b').textContent;
    charger(bouton, true, 'Ouverture…');
    setTimeout(function () {
      $('#succes-texte').textContent = 'Ouverture de ' + APPS[courante][2] + ' en tant que ' + fct.toLowerCase() + '…';
      aller('ok'); DGB.son('validation');
      setTimeout(function () { location.href = 'application.html'; }, calme ? 900 : 2200);
    }, 600);
  });
  $$('[data-retour]').forEach(function (b) { b.addEventListener('click', function () { $('#erreur-2').hidden = true; aller(1); }); });

  /* Voir le mot de passe */
  var voir = $('#voir');
  voir.addEventListener('click', function () {
    var cache = mdp.type === 'password';
    mdp.type = cache ? 'text' : 'password';
    voir.setAttribute('aria-pressed', String(cache));
    voir.setAttribute('aria-label', cache ? 'Masquer le mot de passe' : 'Afficher le mot de passe');
    voir.querySelector('use').setAttribute('href', cache ? '#i-oeilBarre' : '#i-oeil');
    mdp.focus();
  });
})();
