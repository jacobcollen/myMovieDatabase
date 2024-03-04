"use strict";

// LYSSNARE PAGE LOAD
window.addEventListener('load', function() {
  console.log("load");
  
  const searchInput = document.querySelector("#searchInput");
  searchInput.value = "";
  
  setupCarousel();
  loadMovieDetails();
});

// IMPORT
import {
  fetchMovies,
  updateSearchResults,
  showDropdown,
  navigateSearchResults,
} from "./search.mjs";

import { fetchMovieDetails, loadMovieDetails } from "./movie.mjs";

// FUNCTION CAROUSEL
function createMovieElement(movie) {
  const slide = document.createElement("li");
  slide.classList.add("carousel__slide");

  const iframe = document.createElement("iframe");
  iframe.src = movie.trailer_link;
  slide.appendChild(iframe);

  return slide;
}

// FUNCTION SETUP CAROUSEL
function setupCarousel() {
  console.log("carousel");
  const buttons = document.querySelectorAll("[data-carousel-btn]");
  const slides = document.querySelector("ul[data-slides]");

  fetch("https://santosnr6.github.io/Data/movies.json")
    .then((response) => response.json())
    .then((movies) => {
      console.log("Movies data:", movies);

      movies.sort(() => Math.random() - 0.5);

      const limitedMovies = movies.slice(0, 5);

      limitedMovies.forEach((movie) => {
        const slide = createMovieElement(movie);
        slides.appendChild(slide);
      });

      const firstSlide = slides.querySelector(".carousel__slide");
      firstSlide.dataset.active = true;
    })
    .catch((error) => console.error("Error fetching or parsing JSON:", error));

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const offset = btn.dataset.carouselBtn === "next" ? 1 : -1;
      const activeSlide = slides.querySelector("[data-active]");
      let newIndex = [...slides.children].indexOf(activeSlide) + offset;

      if (newIndex < 0) {
        newIndex = slides.children.length - 1;
      } else if (newIndex >= slides.children.length) {
        newIndex = 0;
      }

      slides.children[newIndex].dataset.active = true;
      delete activeSlide.dataset.active;
    });
  });
}

// FUNCTION TOP 20 MOVIES
const moviesList = document.querySelector("#movieList");

fetch("https://santosnr6.github.io/Data/movies.json")
  .then((response) => response.json())
  .then((movies) => {
    const top20Movies = movies.slice(0, 20);

    top20Movies.forEach((movie) => {
      const movieItem = document.createElement("li");
      movieItem.classList.add("movie-grid__card", "root__section");

      const movieImage = document.createElement("img");
      movieImage.src = movie.poster;
      movieImage.alt = `${movie.title} Poster`;
      movieItem.appendChild(movieImage);

      const movieTitle = document.createElement("h3");
      movieTitle.textContent = movie.title;
      movieItem.appendChild(movieTitle);

      moviesList.appendChild(movieItem);
    });
  })
  .catch((error) => console.error("Error fetching movies:", error));


// LYSSNARE SEARCH
const searchInput = document.querySelector("#searchInput");
const searchDropdown = document.querySelector("#searchDropdown");

searchInput.addEventListener("keyup", async (event) => {
  const searchQuery = searchInput.value.trim();

  if (!searchQuery.length) {
    searchDropdown.textContent = "";
    return;
  }

  try {
    const movies = await fetchMovies(searchQuery);
    updateSearchResults(movies);
    searchDropdown.style.display = "block";
    showDropdown();
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
});

searchInput.addEventListener("keydown", (event) => {
  const results = document.querySelectorAll("#searchDropdown .search__result");

  if (event.key === "ArrowDown") {
    event.preventDefault();
    if (results.length > 0) {
      results[0].focus();
    }
  } else if (event.key === "Tab") {
    if (!event.shiftKey && results.length > 0) {
      event.preventDefault();
      results[0].focus();
    } else if (event.shiftKey && document.activeElement === searchDropdown.firstChild) {
      event.preventDefault();
      searchInput.focus();
    }
  }
});

searchInput.addEventListener("focus", () => {
  searchInput.classList.add("search__input--focused");
});

searchInput.addEventListener("blur", () => {
  searchInput.classList.remove("search__input--focused");
});

document.body.addEventListener("click", (event) => {
  const clickedElement = event.target;
  const isSearchInput = searchInput.contains(clickedElement);
  const isSearchDropdown = searchDropdown.contains(clickedElement);

  if (!isSearchInput && !isSearchDropdown) {
    searchInput.value = "";
    searchInput.blur();
    searchDropdown.style.display = "none";
  }
});

searchDropdown.addEventListener("click", async (event) => {
  const listItem = event.target.closest("li");
  if (listItem) {
    const selectedMovieImdbID = listItem.dataset.imdbID;
    window.location.href = `./movie.html?imdbID=${encodeURI(selectedMovieImdbID)}`;
  
    try {
      const data = await fetchMovieDetails(selectedMovieImdbID);
      localStorage.setItem("movieData", JSON.stringify(data));
    } catch (error) {
      console.error("Error fetching movie details:", error);
    }
  }
});
