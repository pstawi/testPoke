## PokéExplorer

Application React (Vite) consommant la [PokéAPI](https://pokeapi.co) pour afficher une liste de Pokémon sous forme de cartes, avec une page de détail (statistiques, informations principales et chaîne d’évolution). Google Analytics 4 est intégré via le script `gtag.js`.

---

### Prérequis

- **Node.js** (version 18+ recommandée)
- **npm** (fourni avec Node)

Vérifier dans un terminal :

```bash
node -v
npm -v
```

---

### Installation du projet

Dans un terminal, place‑toi dans le dossier du projet :

```bash
cd C:\Users\pierr\Desktop\MASTERE\SEO-SEA\appliTest
```

Installe les dépendances :

```bash
npm install
```

---

### Lancer l’application en local (développement)

```bash
npm run dev
```

Puis ouvre l’URL affichée dans le terminal, généralement :

```text
http://localhost:5173/
```

Ce mode est idéal pour développer (rechargement à chaud, erreurs détaillées, etc.).

---

### Build de production & prévisualisation locale

Pour générer un build de production :

```bash
npm run build
```

Pour le prévisualiser en local (serveur statique) :

```bash
npm run preview
```

Le terminal affichera une URL de type :

```text
http://localhost:4173/
```

---

### Structure principale du code

- `index.html` : page HTML racine, contient le point d’entrée de l’app (`<div id="app">`) et le script Google Analytics 4.
- `src/main.jsx` : point d’entrée React, montage de l’app dans le DOM et configuration du `BrowserRouter`.
- `src/App.jsx` : layout principal (header, routes, footer).
- `src/pages/PokemonList.jsx` : liste des Pokémon (1ère génération), affichage en cartes + champ de recherche.
- `src/pages/PokemonDetail.jsx` : page de détail d’un Pokémon (statistiques, infos, évolutions).
- `src/components/PokemonCard.jsx` : composant carte pour un Pokémon.
- `src/style.css` : styles globaux (UI claire, cartes, responsive, etc.).

---

### Intégration Google Analytics 4

L’intégration se fait dans le fichier `index.html`, dans la balise `<head>` via le script `gtag.js`.

#### 1. Créer une propriété GA4

1. Va sur **Google Analytics** et crée une **propriété GA4**.
2. Crée un **flux de données Web** pour ton site.
3. Récupère ton **ID de mesure** au format `G-XXXXXXXXXX`.

#### 2. Ajouter/mettre à jour le script GA4

Dans `index.html`, tu dois avoir un bloc similaire dans le `<head>` :

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

- **Remplace `G-XXXXXXXXXX`** (les deux occurrences) par ton ID de mesure réel.
- Sauvegarde le fichier.

#### 3. Tester le suivi en local

1. Lance l’app :

   ```bash
   npm run dev
   # ou
   npm run preview
   ```

2. Ouvre l’URL `http://localhost:5173/` (ou celle affichée par Vite) dans ton navigateur.
3. Dans Google Analytics, va dans **Administrateur → Flux de données → ton flux Web → DebugView** (ou « Vue en temps réel » selon l’interface).
4. Navigue dans ton app (liste, clic sur une carte, page de détail).  
   Tu devrais voir les événements **page_view** apparaître.

> Remarque : GA4 accepte les hits envoyés depuis `localhost`, il n’est donc pas nécessaire d’héberger immédiatement ton site sur un domaine public pour tester.

---

### Commandes disponibles (récapitulatif)

- **Installer les dépendances** : `npm install`
- **Lancer le serveur de dev** : `npm run dev`
- **Construire le build de production** : `npm run build`
- **Prévisualiser le build en local** : `npm run preview`

