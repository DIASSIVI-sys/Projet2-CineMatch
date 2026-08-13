"use strict";

const API_KEY = "be28d37ea8ca3c82f7ab383b5ea8e64f";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const moviesGrid = document.getElementById("movies-grid");

// Récupérer les films populaires
async function fetchPopularMovies() {
    try {"use strict";

const API_KEY = "be28d37ea8ca3c82f7ab383b5ea8e64f";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const moviesGrid = document.getElementById("movies-grid");
const searchInput = document.getElementById("search-input");

// 1. Récupérer les films populaires (Niveau 1)
async function fetchPopularMovies() {
    try {
        moviesGrid.innerHTML = "<p class='loading'>Chargement des films en cours...</p>";

        const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=fr-FR`);

        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }

        const data = await response.json();
        displayMovies(data.results, moviesGrid);

    } catch (error) {
        console.error("Erreur lors du chargement des films :", error);
        moviesGrid.innerHTML = `<p class="error">Impossible de charger les films. Veuillez réessayer plus tard.</p>`;
    }
}

// 2. Rechercher des films via l'API (Niveau 2)
async function searchMovies(query) {
    try {
        moviesGrid.innerHTML = "<p class='loading'>Recherche en cours...</p>";

        const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&language=fr-FR&query=${encodeURIComponent(query)}`);

        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }

        const data = await response.json();
        displayMovies(data.results, moviesGrid);

    } catch (error) {
        console.error("Erreur lors de la recherche :", error);
        moviesGrid.innerHTML = `<p class="error">Erreur lors de la recherche. Veuillez réessayer.</p>`;
    }
}

// 3. Afficher les films dans le DOM
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

        // Code couleur des notes
        let ratingClass = "rating-red";
        if (movie.vote_average >= 7) {
            ratingClass = "rating-green";
        } else if (movie.vote_average >= 5) {
            ratingClass = "rating-orange";
        }

        const movieCard = document.createElement("div");
        movieCard.classList.add("movie-card");

        movieCard.innerHTML = `
            <div class="movie-poster-container">
                <img src="${posterPath}" alt="${movie.title}" class="movie-poster">
                <span class="movie-rating ${ratingClass}">${voteAverage}</span>
            </div>
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
                <p class="movie-date">${movie.release_date ? movie.release_date.split('-')[0] : 'Inconnue'}</p>
            </div>
        `;

        container.appendChild(movieCard);
    });
}

// 4. Écouteur d'événements sur la barre de recherche
searchInput.addEventListener("input", (e) => {
    const query = e.target.value.trim();

    if (query.length > 2) {
        searchMovies(query);
    } else if (query.length === 0) {
        fetchPopularMovies(); // Remet les films populaires si l'input est vide
    }
});

// Lancer au chargement initial
fetchPopularMovies();
        moviesGrid.innerHTML = "<p class='loading'>Chargement des films en cours...</p>";

        const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=fr-FR`);

        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }

        const data = await response.json();
        displayMovies(data.results, moviesGrid);

    } catch (error) {
        console.error("Erreur lors du chargement des films :", error);
        moviesGrid.innerHTML = `<p class="error">Impossible de charger les films. Veuillez réessayer plus tard.</p>`;
    }
}

// Afficher les films dans le DOM
function displayMovies(movies, container) {
    container.innerHTML = "";

    if (movies.length === 0) {
        container.innerHTML = "<p>Aucun film trouvé.</p>";
        return;
    }

    movies.forEach(movie => {
        const posterPath = movie.poster_path 
            ? `${IMAGE_BASE_URL}${movie.poster_path}` 
            : "https://via.placeholder.com/500x750?text=Pas+d'affiche";

        const voteAverage = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";

        // Code couleur des notes (Niveau 2)
        let ratingClass = "rating-red";
        if (movie.vote_average >= 7) {
            ratingClass = "rating-green";
        } else if (movie.vote_average >= 5) {
            ratingClass = "rating-orange";
        }

        const movieCard = document.createElement("div");
        movieCard.classList.add("movie-card");

        movieCard.innerHTML = `
            <div class="movie-poster-container">
                <img src="${posterPath}" alt="${movie.title}" class="movie-poster">
                <span class="movie-rating ${ratingClass}">${voteAverage}</span>
            </div>
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
                <p class="movie-date">${movie.release_date ? movie.release_date.split('-')[0] : 'Inconnue'}</p>
            </div>
        `;

        container.appendChild(movieCard);
    });
}

// Lancer au chargement
fetchPopularMovies();