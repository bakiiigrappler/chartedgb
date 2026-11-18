{{--
    Gabarit commun de la Suite DSI · DGB — deux dispositions :
      sidebar : barre latérale sombre + barre d'application claire (modèle OKANDAH)
      topnav  : entête sombre + sous-navigation (modèle ABAT)

    Usage :
        @extends('layouts.suite')
        @section('titre', 'Tableau de bord')
        @section('sous_titre', '3 dossiers attendent une action de votre part')
        @section('actions') <a class="bouton-primaire" href="...">Nouvel équipement</a> @endsection
        @section('contenu') ... @endsection
--}}
@php
    $actif = fn (?string $route) => $route && request()->routeIs($route . '*');
    $visible = fn (array $l) => empty($l['permission']) || auth()->user()?->can($l['permission']);
    $compteurs = $compteurs ?? [];

    // Rubriques visibles (une rubrique sans lien autorisé disparaît)
    $sections = collect(config('suite.menu'))
        ->map(fn ($s) => $s + ['visibles' => array_values(array_filter($s['liens'], $visible))])
        ->filter(fn ($s) => count($s['visibles']))
        ->map(fn ($s) => $s + ['actif' => collect($s['visibles'])->contains(fn ($l) => $actif($l['route'] ?? null))])
        ->values();
    $sectionActive = $sections->firstWhere('actif', true) ?? $sections->first();
    $url = fn (array $l) => Route::has($l['route'] ?? '') ? route($l['route']) : '#';
@endphp
<!doctype html>
<html lang="fr" data-app="{{ config('suite.marque') }}" data-nav="{{ config('suite.disposition') }}" data-mode="{{ config('suite.theme') }}" data-densite="{{ config('suite.densite') }}" data-conteneur="{{ config('suite.conteneur') }}" @if (config('suite.personnalisable')) data-personnalisable @endif>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('titre') · {{ config('suite.nom') }}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700;800&family=Public+Sans:wght@400;500;600;700&display=swap">
    <link rel="stylesheet" href="{{ asset('vendor/dgb-suite/dgb-suite.css') }}">
    @stack('styles')
</head>
<body>
<div class="app">

    {{-- ===== Sidebar (OKANDAH) ===== --}}
    <aside class="laterale" aria-label="Navigation principale">
        <a class="laterale-logo logo-dgb compact" href="{{ route('tableau-de-bord') }}">
            <span class="monogramme"><b>DGB</b><i></i></span>
            <span class="nom"><b>{{ config('suite.nom') }}</b><small>DGB · Suite DSI</small></span>
        </a>
        <nav>
            @foreach ($sections as $section)
                <div class="section-nav">
                    <p>{{ $section['rubrique'] }}</p>
                    <div>
                        @foreach ($section['visibles'] as $lien)
                            @php $n = $compteurs[$lien['compteur'] ?? ''] ?? 0; @endphp
                            @if (!empty($lien['desactive']))
                                <span class="lien-nav inactif" aria-disabled="true" title="Désactivé temporairement">
                                    <svg class="ico"><use href="#i-{{ $lien['icone'] }}"/></svg>
                                    <span class="texte">{{ $lien['libelle'] }}</span><span class="mention">Désactivé</span>
                                </span>
                            @else
                                <a class="lien-nav {{ $actif($lien['route']) ? 'actif' : '' }}" href="{{ $url($lien) }}" @if ($actif($lien['route'])) aria-current="page" @endif>
                                    <svg class="ico"><use href="#i-{{ $lien['icone'] }}"/></svg>
                                    <span class="texte">{{ $lien['libelle'] }}</span>
                                    @if ($n)<span class="compteur">{{ $n }}</span>@endif
                                </a>
                            @endif
                        @endforeach
                    </div>
                </div>
            @endforeach
            <div class="section-nav">
                <p>Compte</p>
                <div>
                    <a class="lien-nav {{ $actif('profil') ? 'actif' : '' }}" href="{{ Route::has('profil') ? route('profil') : '#' }}"><svg class="ico"><use href="#i-profil"/></svg><span class="texte">Mon profil</span></a>
                    <form method="post" action="{{ route('logout') }}">@csrf
                        <button class="lien-nav sortie" type="submit"><svg class="ico"><use href="#i-sortie"/></svg><span class="texte">Déconnexion</span></button>
                    </form>
                </div>
            </div>
        </nav>
    </aside>
    <div class="voile"></div>

    <div class="colonne">
        {{-- ===== Top Nav (ABAT) ===== --}}
        <header class="entete sombre">
            <div class="filet"><i></i><i></i><i></i></div>
            <div class="entete-ligne">
                <a class="logo-dgb compact" href="{{ route('tableau-de-bord') }}">
                    <span class="monogramme"><b>DGB</b><i></i></span>
                    <span class="nom masque-mobile"><b>{{ config('suite.nom') }}</b><small>Direction générale du Budget</small></span>
                </a>
                <nav class="modules" aria-label="Modules">
                    @foreach ($sections as $section)
                        <a class="module {{ $section['actif'] ? 'actif' : '' }}" href="{{ $url($section['visibles'][0]) }}">{{ $section['rubrique'] }}</a>
                    @endforeach
                </nav>
                <div class="actions-barre">@include('partials.suite.barre-actions', ['suffixe' => 'h'])</div>
            </div>
        </header>
        @if ($sectionActive)
            <div class="sous-nav">
                <nav aria-label="{{ $sectionActive['rubrique'] }}">
                    @foreach ($sectionActive['visibles'] as $lien)
                        @continue(!empty($lien['desactive']))
                        <a class="{{ $actif($lien['route']) ? 'actif' : '' }}" href="{{ $url($lien) }}">{{ $lien['libelle'] }}</a>
                    @endforeach
                </nav>
            </div>
        @endif

        {{-- Barre d'application claire (Sidebar) --}}
        <header class="barre-app">
            <button class="bouton-barre bouton-menu" type="button" data-action="menu" aria-label="Ouvrir la navigation"><svg class="ico"><use href="#i-menu"/></svg></button>
            <div class="titres">
                <h1>@yield('titre', 'Tableau de bord')</h1>
                @hasSection('sous_titre')<p>@yield('sous_titre')</p>@endif
            </div>
            @hasSection('actions')
                <div class="actions-page masque-mobile">@yield('actions')</div>
                <span class="separateur masque-mobile"></span>
            @endif
            <div class="actions-barre">@include('partials.suite.barre-actions', ['suffixe' => 's'])</div>
        </header>

        <main class="contenu">
            <div class="contenu-pile">
                @hasSection('fil')<nav class="fil" aria-label="Fil d'Ariane">@yield('fil')</nav>@endif

                {{-- Entête de page dans le flux (Top Nav) ; en Sidebar, elle passe dans la barre d'application --}}
                <div class="entete-page">
                    <div class="titres">
                        <h1>@yield('titre', 'Tableau de bord')</h1>
                        @hasSection('sous_titre')<p>@yield('sous_titre')</p>@endif
                    </div>
                    @hasSection('actions')<div class="actions">@yield('actions')</div>@endif
                </div>

                @if (session('succes'))
                    <div class="bandeau bandeau-info" role="status"><svg class="ico"><use href="#i-traiter"/></svg><span>{{ session('succes') }}</span></div>
                @endif
                @if ($errors->any())
                    <div class="bandeau bandeau-erreur" role="alert"><svg class="ico"><use href="#i-alerte"/></svg><span>{{ $errors->first() }}</span></div>
                @endif

                @yield('contenu')
            </div>
        </main>

        <footer class="pied"><p>{{ config('suite.nom') }} © {{ date('Y') }} — Direction générale du Budget · DSI · Service des études et du développement</p></footer>
    </div>
</div>

<script src="{{ asset('vendor/dgb-suite/dgb-suite.js') }}"></script>
@stack('scripts')
</body>
</html>
