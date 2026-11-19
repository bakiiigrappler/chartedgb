{{--
    Page de connexion commune de la Suite DSI · DGB
    Identité : volet bleu (logo DGB, accroche, scène métier de l'application) + carte blanche.
    $etape : 'identifiants' (défaut) | 'code' | 'fonction'
    Routes attendues : login (POST), connexion.code (POST), fonction.choisir (POST), password.request
--}}
@php
    $etape = $etape ?? 'identifiants';
    $c = config('suite.connexion');
@endphp
<!doctype html>
<html lang="fr" data-app="{{ config('suite.marque') }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Connexion · {{ config('suite.nom') }}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700;800&family=Public+Sans:wght@400;500;600;700&display=swap">
    <link rel="stylesheet" href="{{ asset('vendor/dgb-suite/dgb-suite.css') }}">
    <link rel="stylesheet" href="{{ asset('vendor/dgb-suite/dgb-connexion.css') }}">
</head>
<body>
<main class="cnx">
    <section class="cnx-volet" aria-label="Présentation">
        <span class="logo-dgb">
            <span class="monogramme"><b>DGB</b><i></i></span>
            <span class="nom"><b>Direction générale du Budget</b><small>République gabonaise</small></span>
        </span>
        <div class="cnx-accroche">
            <span class="surtitre">{{ $c['surtitre'] }}</span>
            <h1>{!! $c['titre'] !!}</h1>
            <p>{{ $c['texte'] }}</p>
        </div>
        <div class="cnx-scene" id="scene-{{ $c['scene'] }}"></div>
        <div class="cnx-volet-pied">
            <span><svg class="ico ico-4"><use href="#i-bouclier"/></svg>Accès réservé aux agents habilités · connexions journalisées</span>
            <span>Suite DSI · SED</span>
        </div>
    </section>

    <section class="cnx-cote">
        <div class="cnx-carte">
            <span class="cnx-ecusson"><svg class="ico"><use href="#i-bouclier"/></svg></span>

            @if ($etape === 'identifiants')
                <div class="cnx-titres"><h2>{{ $c['titre_carte'] }}</h2><p>{{ $c['invite'] }}</p></div>
                <form class="cnx-etape" method="post" action="{{ route('login') }}">
                    @csrf
                    @if ($errors->any())
                        <div class="cnx-erreur" role="alert"><svg class="ico ico-4"><use href="#i-alerte"/></svg><span>{{ $errors->first() }}</span></div>
                    @endif
                    @if (session('info'))
                        <div class="bandeau bandeau-info">{{ session('info') }}</div>
                    @endif
                    <div class="cnx-champ">
                        <label for="email">Adresse e-mail professionnelle</label>
                        <input class="champ" id="email" name="email" type="email" autocomplete="username" value="{{ old('email') }}" placeholder="prenom.nom@budget.gouv.ga" required autofocus>
                    </div>
                    <div class="cnx-champ">
                        <label for="mot-de-passe">Mot de passe</label>
                        <div class="cnx-mdp">
                            <input class="champ" id="mot-de-passe" name="password" type="password" autocomplete="current-password" required>
                            <button type="button" data-afficher="mot-de-passe" aria-pressed="false">Afficher</button>
                        </div>
                    </div>
                    <div class="cnx-ligne">
                        <label><input type="checkbox" name="remember" @checked(old('remember'))>Rester connecté</label>
                        @if (Route::has('password.request'))<a href="{{ route('password.request') }}">Mot de passe oublié ?</a>@endif
                    </div>
                    <button class="cnx-bouton" type="submit">Se connecter<svg class="ico"><use href="#i-fleche"/></svg></button>
                </form>

            @elseif ($etape === 'code')
                <div class="cnx-titres"><h2>Vérification en deux étapes</h2><p>Saisissez le code à 6 chiffres envoyé à {{ $emailMasque ?? 'votre adresse professionnelle' }}.</p></div>
                <form class="cnx-etape" method="post" action="{{ route('connexion.code') }}">
                    @csrf
                    @if ($errors->any())
                        <div class="cnx-erreur" role="alert"><svg class="ico ico-4"><use href="#i-alerte"/></svg><span>{{ $errors->first() }}</span></div>
                    @endif
                    <div class="cnx-champ">
                        <label for="code">Code reçu par e-mail</label>
                        <input class="champ chiffre" id="code" name="code" inputmode="numeric" pattern="[0-9]{6}" maxlength="6" autocomplete="one-time-code" required autofocus style="font:700 22px var(--font-titre);letter-spacing:.4em;text-align:center">
                    </div>
                    <button class="cnx-bouton" type="submit">Vérifier le code<svg class="ico"><use href="#i-fleche"/></svg></button>
                </form>

            @else
                <div class="cnx-titres"><h2>Choisissez votre fonction</h2><p>Plusieurs fonctions sont rattachées à votre compte. Vous pourrez en changer depuis votre menu.</p></div>
                <form class="cnx-etape" method="post" action="{{ route('fonction.choisir') }}">
                    @csrf
                    <div class="fonctions" role="radiogroup" aria-label="Fonctions">
                        @foreach (auth()->user()->fonctions as $f)
                            <label class="fonction">
                                <input type="radio" name="fonction" value="{{ $f->code }}" @checked($loop->first)>
                                <span><b>{{ $f->libelle }}</b><small>{{ $f->structure }}</small></span>
                                <span class="code">{{ $f->code }}</span>
                            </label>
                        @endforeach
                    </div>
                    <button class="cnx-bouton" type="submit">Accéder à l'application<svg class="ico"><use href="#i-fleche"/></svg></button>
                </form>
            @endif
        </div>
        <div class="cnx-bas">
            @if (config('suite.environnement'))<span class="env">{{ config('suite.environnement') }}</span>@endif
            <span>{{ config('suite.nom') }} · v{{ config('suite.version') }} · © {{ date('Y') }} DGB</span>
        </div>
    </section>
</main>
<script src="{{ asset('vendor/dgb-suite/dgb-suite.js') }}"></script>
<script src="{{ asset('vendor/dgb-suite/dgb-scenes.js') }}"></script>
<script>
  /* Scène du métier de l'application : parc, courrier, projet, budget, rh, archives, marches, audit */
  DGB_SCENES[@js($c['scene'])](document.getElementById(@js('scene-' . $c['scene'])));
</script>
<script>
document.querySelectorAll('[data-afficher]').forEach(function (b) {
    b.addEventListener('click', function () {
        var c = document.getElementById(b.dataset.afficher), cache = c.type === 'password';
        c.type = cache ? 'text' : 'password';
        b.textContent = cache ? 'Masquer' : 'Afficher';
        b.setAttribute('aria-pressed', String(cache));
    });
});
</script>
</body>
</html>
