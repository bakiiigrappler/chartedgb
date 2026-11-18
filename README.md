# Charte Suite DSI · DGB

Prototype de la charte graphique de la Suite DSI du SED (Direction générale du Budget) :
palettes de marque, typographies, marges, navigation et composants partagés, plus deux
gabarits d'application (connexion et gestion du parc).

## Pages

| Fichier | Contenu |
|---|---|
| `index.html` | La charte : couleurs, typographies, marges et densité, navigation, composants, graphiques, calendrier, formulaires |
| `application.html` | Gabarit d'application « Gestion du parc » (sidebar et top nav, tableaux de bord, dossiers) |
| `connexion.html` | Page de connexion en trois étapes (identité, mot de passe, code à usage unique) |

## Aperçu local

```bash
python -m http.server 4173 --bind 127.0.0.1
```

Puis <http://127.0.0.1:4173/index.html>.

Quelques entrées directes :

- `application.html?nav=topnav` — gabarit en barre de modules, sous-menus ouverts au clic ;
- `application.html?nav=topnav&app=lagon` — même gabarit avec une autre palette ;
- `connexion.html?style=abat` — variante ABAT de la page de connexion.

## Structure

```
assets/
  dgb-suite.css        jetons (couleurs, polices, espacements), composants, dispositions
  dgb-suite.js         sprite d'icônes, disposition, menus, tiroir « Personnaliser »
  dgb-viz.css|js       graphiques et calendrier partagés (window.DGB_VIZ)
  dgb-connexion.css    page de connexion
  dgb-formulaires.css  formulaire de type ABAT
laravel/               extrait d'intégration : gabarit Blade, config, assets publiés
```

## Règles de la charte

- aplats uniquement : aucun dégradé, aucune ombre sur les cartes ;
- ambre et grenat strictement sémantiques (attente, blocage), jamais décoratifs ;
- angles de 4 à 6 px, registre de dossier administratif ;
- une seule échelle de marque (`--m-*`, 12 palettes) et une échelle neutre (`--p-*`) ;
- présentation modulaire par attributs sur `<html>` : `data-app`, `data-police`,
  `data-espace`, `data-sidebar`, `data-densite`, `data-nav`, `data-mode`.
