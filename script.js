"use strict";

const API_KEY = "be28d37ea8ca3c82f7ab383b5ea8e64f";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const moviesGrid = document.getElementById("movies-grid");
const searchInput = document.getElementById("search-input");
const favoritesSection = document.getElementById("favorites-section");
const favoritesGrid = document.getElementById("favorites-grid");
const favoritesBtn = document.getElementById("favorites-btn");
const favCount = document.getElementById("fav-count");

const movieModal = document.getElementById("movie-modal");
const modalBody = document.getElementById("modal-body");
const closeModal = document.getElementById("close-modal");
const backToPopularBtn = document.getElementById("back-to-popular");

// Au clic sur le bouton retour, on revient aux films populaires
backToPopularBtn.addEventListener("click", () => {
    fetchPopularMovies();
});

let currentView = "popular"; // Permet de savoir si on affiche les populaires/recherche ou les favoris

// Gestion des favoris stockés dans le localStorage
let favorites = JSON.parse(localStorage.getItem("cinematch_favorites")) || [];
updateFavCount();

// 1. Récupérer les films populaires
async function fetchPopularMovies() {
    currentView = "popular";
    favoritesSection.style.display = "none";
    try {
        moviesGrid.innerHTML = "<p class='loading'>Chargement des films en cours...</p>";
        const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=fr-FR`);
        if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
        const data = await response.json();
        displayMovies(data.results, moviesGrid);
    } catch (error) {
        console.error(error);
        moviesGrid.innerHTML = `<p class="error">Impossible de charger les films.</p>`;
    }
}

// 2. Rechercher des films
async function searchMovies(query) {
    currentView = "search";
    favoritesSection.style.display = "none";
    try {
        moviesGrid.innerHTML = "<p class='loading'>Recherche en cours...</p>";
        const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&language=fr-FR&query=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
        const data = await response.json();
        displayMovies(data.results, moviesGrid);
    } catch (error) {
        console.error(error);
        moviesGrid.innerHTML = `<p class="error">Erreur lors de la recherche.</p>`;
    }
}

// 3. Afficher les films dans une grille
function displayMovies(movies, container) {
    container.innerHTML = "";

    if (!movies || movies.length === 0) {
        container.innerHTML = "<p class='loading'>Aucun film trouvé.</p>";
        return;
    }

    movies.forEach(movie => {
        const posterPath = movie.poster_path 
            ? `${IMAGE_BASE_URL}${movie.poster_path}` 
            : "https://via.placeholder.com/500x750?text=Pas+d'affiche";

        const voteAverage = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";

        let ratingClass = "rating-red";
        if (movie.vote_average >= 7) ratingClass = "rating-green";
        else if (movie.vote_average >= 5) ratingClass = "rating-orange";
        else if (!movie.vote_average || movie.vote_average === 0) ratingClass = "rating-na";

        const isFav = favorites.some(fav => fav.id === movie.id);

        const movieCard = document.createElement("div");
        movieCard.classList.add("movie-card");

        movieCard.innerHTML = `
            <div class="movie-poster-container">
                <button class="favorite-btn ${isFav ? 'active' : ''}" data-id="${movie.id}" title="Favori">
                    <i class="fa-${isFav ? 'solid' : 'regular'} fa-heart"></i>
                </button>
                <img src="${posterPath}" alt="${movie.title}" class="movie-poster">
                <span class="movie-rating ${ratingClass}">${voteAverage}</span>
            </div>
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
                <p class="movie-date">${movie.release_date ? movie.release_date.split('-')[0] : 'Inconnue'}</p>
            </div>
        `;

        // Écouteur pour ouvrir la modale au clic sur la carte (sauf si on clique sur le cœur)
        movieCard.addEventListener("click", (e) => {
            if (e.target.closest(".favorite-btn")) return;
            fetchMovieDetails(movie.id);
        });

        // Écouteur pour le bouton favori
        const favBtn = movieCard.querySelector(".favorite-btn");
        favBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleFavorite(movie);
        });

        container.appendChild(movieCard);
    });
}

// 4. Récupérer les détails complets d'un film pour la modale
async function fetchMovieDetails(movieId) {
    try {
        const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=fr-FR`);
        if (!response.ok) throw new Error("Erreur lors de la récupération des détails");
        const movie = await response.json();
        showMovieModal(movie);
    } catch (error) {
        console.error(error);
    }
}

// 5. Afficher la modale
function showMovieModal(movie) {
    const posterPath = movie.poster_path 
        ? `${IMAGE_BASE_URL}${movie.poster_path}` 
        : "https://via.placeholder.com/500x750?text=Pas+d'affiche";

    const genresHtml = movie.genres.map(g => `<span class="genre-tag">${g.name}</span>`).join("");
    const voteAverage = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";

    modalBody.innerHTML = `
        <div class="modal-details">
            <img src="${posterPath}" alt="${movie.title}">
            <div class="modal-info">
                <h2>${movie.title}</h2>
                <p><strong>Date de sortie :</strong> ${movie.release_date || 'Inconnue'}</p>
                <p><strong>Note moyenne :</strong> ${voteAverage} / 10</p>
                <div class="modal-genres">${genresHtml}</div>
                <p><strong>Synopsis :</strong> ${movie.overview || "Aucun synopsis disponible en français."}</p>
            </div>
        </div>
    `;

    movieModal.classList.add("active");
}

// Fermeture de la modale
closeModal.addEventListener("click", () => movieModal.classList.remove("active"));
movieModal.addEventListener("click", (e) => {
    if (e.target === movieModal) movieModal.classList.remove("active");
});

// 6. Gestion des Favoris
function toggleFavorite(movie) {
    const index = favorites.findIndex(fav => fav.id === movie.id);
    if (index > -1) {
        favorites.splice(index, 1); // Retirer des favoris
    } else {
        favorites.push(movie); // Ajouter aux favoris
    }

    localStorage.setItem("cinematch_favorites", JSON.stringify(favorites));
    updateFavCount();

    // Actualiser l'affichage selon la vue actuelle
    if (currentView === "favorites") {
        displayFavorites();
    } else {
        if (searchInput.value.trim().length > 2) {
            searchMovies(searchInput.value.trim());
        } else {
            fetchPopularMovies();
        }
    }
}

function updateFavCount() {
    favCount.textContent = favorites.length;
}

function displayFavorites() {
    currentView = "favorites";
    favoritesSection.style.display = "block";
    moviesGrid.innerHTML = ""; // Vider la grille principale pour se concentrer sur les favoris
    displayMovies(favorites, favoritesGrid);
}

// Bouton Favoris dans la navbar
favoritesBtn.addEventListener("click", () => {
    displayFavorites();
});

// Barre de recherche
searchInput.addEventListener("input", (e) => {
    const query = e.target.value.trim();
    if (query.length > 2) {
        searchMovies(query);
    } else if (query.length === 0) {
        fetchPopularMovies();
    }
});

// Lancer au chargement initial
fetchPopularMovies();