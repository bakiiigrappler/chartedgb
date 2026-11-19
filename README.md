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
  dgb-suite.css        jetons (18 palettes, neutres, polices, espacements), composants, dispositions,
                       notifications éphémères, palette de commandes
  dgb-suite.js         sprite d'icônes, tiroir « Personnaliser », menus, sons (DGB.son),
                       notifications (DGB.toast), palette de commandes Ctrl K (DGB.palette)
  dgb-viz.css|js       graphiques animés et calendrier partagés (window.DGB_VIZ)
  dgb-connexion.css|js page de connexion : compositions OKANDAH et ABAT, parcours en trois étapes
  dgb-scenes.js        huit scènes de connexion : parc, courrier, projet, budget, rh,
                       archives, marches, audit (window.DGB_SCENES)
  dgb-application.js   gabarit Parc : routage par ancre, moteur de listes, signature, notifications
  dgb-demo-parc.js     données de démonstration du gabarit (fictives)
  dgb-formulaires.css  formulaire de type ABAT
laravel/               extrait d'intégration : gabarit Blade, config, assets publiés
```

## Entrées directes utiles

- `connexion.html?style=abat&scene=projet` : composition ABAT avec la scène Projets ;
- `connexion.html?scene=courrier` : composition OKANDAH avec la scène Courrier ;
- `application.html#signer`, `#inventaire-portables`, `#parametres` : pages du gabarit ;
- `application.html?nav=topnav&app=marine&neutre=chaud` : disposition et mélange imposés.

Démonstration : toute adresse `@budget.gouv.ga` avec un mot de passe de 8 caractères ou
plus est acceptée, le code à usage unique est `315120`.

## Règles de la charte

- aplats uniquement : aucun dégradé, aucune ombre sur les cartes ;
- ambre et grenat strictement sémantiques (attente, blocage), jamais décoratifs ;
- angles de 4 à 6 px, registre de dossier administratif ;
- une seule échelle de marque (`--m-*`, 12 palettes) et une échelle neutre (`--p-*`) ;
- présentation modulaire par attributs sur `<html>` : `data-app`, `data-police`,
  `data-espace`, `data-sidebar`, `data-densite`, `data-nav`, `data-mode`.
