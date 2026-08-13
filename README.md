# Projet2-CineMatch

> CinéMatch est un catalogue de films interactif développé en HTML, CSS et JavaScript, utilisant l'API publique TMDB (The Movie Database).

---

##  Fonctionnalités

* **Niveau 1 : Les Fondamentaux**
  * Connexion à l'API TMDB pour récupérer dynamiquement les films les plus populaires.
  * Affichage en grille responsive (CSS Grid) comprenant l'affiche, le titre, la date et la note moyenne.
  * Gestion des états (chargement et messages d'erreur).

* **Niveau 2 : L'Interactivité**
  * Barre de recherche en temps réel interrogeant l'endpoint de recherche de l'API.
  * Code couleur dynamique des notes (vert si $\ge 7$, orange entre $5$ et $7$, rouge $< 5$, et gris si non noté).

* **Niveau 3 : UX Avancée (Bonus)**
  * **Modale de détails :** Affichage du synopsis complet et des genres au clic sur un film, sans recharger la page.
  * **Gestion des favoris :** Système de likes persistants grâce au `localStorage` du navigateur et section dédiée avec bouton de retour.

---

## Technologies utilisées

* **HTML5** & **CSS3** (Flexbox, CSS Grid, Responsive Design)
* **JavaScript (ES6+)** (Async/Await, Fetch API, Manipulation du DOM)
* **API TMDB** (The Movie Database)
* **FontAwesome** (pour les icônes)

---

## Installation et Utilisation

1. Clonez ce dépôt ou téléchargez les fichiers sources.
2. Obtenez une clé API gratuite sur [TMDB](https://www.themoviedb.org/).
3. Remplacez la valeur de la constante `API_KEY` dans votre fichier `script.js` par votre propre clé :
   ```javascript
   