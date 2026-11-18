{{--
    Contrôles de barre, partagés par les deux dispositions (comme barre-actions d'OKANDAH) :
    environnement, applications de la suite, notifications, menu utilisateur.
    $suffixe distingue les deux exemplaires (identifiants de menus uniques).
--}}
@php
    $u = auth()->user();
    $initiales = collect(explode(' ', $u->name ?? ''))->map(fn ($m) => mb_strtoupper(mb_substr($m, 0, 1)))->take(2)->implode('');
    $fonction = session('fonction'); // ['code' => ..., 'libelle' => ...]
    $fonctions = $u?->fonctions ?? collect();
    $notifs = $u?->unreadNotifications ?? collect();
@endphp

@if (config('suite.environnement'))
    <span class="env masque-mobile">{{ config('suite.environnement') }}</span>
@endif

<div class="ancre">
    <button class="bouton-barre" type="button" data-menu="applis-{{ $suffixe }}" aria-expanded="false" aria-label="Applications de la suite" title="Applications de la suite"><svg class="ico"><use href="#i-applis"/></svg></button>
    <div class="menu" id="applis-{{ $suffixe }}" hidden>
        <div class="menu-titre"><span class="etiquette">Applications de la suite DSI</span></div>
        @foreach (config('suite.applications') as $app)
            <a class="menu-item" href="{{ $app['url'] }}"><span class="carre-app" style="background:{{ $app['couleur'] }}"></span><span>{{ $app['nom'] }}<small>{{ $app['description'] }}</small></span></a>
        @endforeach
    </div>
</div>

@if (config('suite.personnalisable'))
    <button class="bouton-barre" type="button" data-action="personnaliser" aria-label="Personnaliser l'affichage" title="Personnaliser"><svg class="ico"><use href="#i-palette"/></svg></button>
@endif

<div class="ancre">
    <button class="bouton-barre" type="button" data-menu="notif-{{ $suffixe }}" aria-expanded="false" aria-label="Notifications{{ $notifs->count() ? ', '.$notifs->count().' non lues' : '' }}" title="Notifications">
        <svg class="ico"><use href="#i-cloche"/></svg>
        @if ($notifs->count())<span class="compteur">{{ $notifs->count() }}</span>@endif
    </button>
    <div class="menu" id="notif-{{ $suffixe }}" hidden style="width:320px">
        <div class="menu-tete"><b>Notifications</b></div>
        @forelse ($notifs->take(6) as $n)
            <a class="menu-item" href="{{ $n->data['url'] ?? '#' }}"><span><b style="font-weight:600;color:var(--encre)">{{ $n->data['titre'] ?? '' }}</b><small>{{ $n->created_at->diffForHumans() }}</small></span></a>
        @empty
            <p class="menu-item" style="cursor:default;justify-content:center;color:var(--p-400)">Aucune notification</p>
        @endforelse
    </div>
</div>

<div class="ancre">
    <button class="utilisateur" type="button" data-menu="compte-{{ $suffixe }}" aria-expanded="false">
        <span class="avatar">{{ $initiales }}</span><span class="nom">{{ $u->name ?? '' }}</span><svg class="ico"><use href="#i-chevronBas"/></svg>
    </button>
    <div class="menu" id="compte-{{ $suffixe }}" hidden>
        <div class="menu-tete">
            <b>{{ $u->name ?? '' }}</b><small>{{ $u->email ?? '' }}</small>
            @if ($fonction)<br><span class="puce puce-info sans-point" style="margin-top:4px">{{ $fonction['libelle'] }}</span>@endif
        </div>

        @if ($fonctions->count() > 1)
            <div class="menu-titre"><span class="etiquette">Changer de fonction</span></div>
            @foreach ($fonctions as $f)
                <form method="post" action="{{ route('fonction.choisir') }}">@csrf
                    <input type="hidden" name="fonction" value="{{ $f->code }}">
                    <button class="menu-item" type="submit">
                        <svg class="ico ico-4" style="color:var(--m-600);{{ ($fonction['code'] ?? null) === $f->code ? '' : 'opacity:0' }}"><use href="#i-coche"/></svg>{{ $f->libelle }}
                    </button>
                </form>
            @endforeach
            <div class="menu-sep"></div>
        @endif

        @if (config('suite.personnalisable'))
            <div class="menu-titre"><span class="etiquette">Disposition</span></div>
            <div class="dispositions">
                <button class="disposition" type="button" data-disposition="sidebar" aria-pressed="false"><svg class="ico"><use href="#i-barreLaterale"/></svg>Sidebar</button>
                <button class="disposition" type="button" data-disposition="topnav" aria-pressed="false"><svg class="ico"><use href="#i-barreHaut"/></svg>Top Nav</button>
            </div>
            <div class="menu-sep"></div>
        @endif

        <a class="menu-item" href="{{ Route::has('profil') ? route('profil') : '#' }}"><svg class="ico"><use href="#i-profil"/></svg>Mon profil</a>
        <form method="post" action="{{ route('logout') }}">@csrf
            <button class="menu-item danger" type="submit"><svg class="ico"><use href="#i-sortie"/></svg>Se déconnecter</button>
        </form>
    </div>
</div>
