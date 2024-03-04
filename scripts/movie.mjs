"use strict";

async function fetchMovieDetails(imdbID) {
  const apiKey = "ceffad2a";
  const url = `http://www.omdbapi.com/?apikey=${apiKey}&plot=full&i=${encodeURIComponent(
    imdbID
  )}`;
  const response = await fetch(url);
  const data = await response.json();

  console.log("movie data:", data);

  return data;
}

function loadMovieDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const imdbID = urlParams.get("imdbID");

  fetchMovieDetails(imdbID)
    .then((data) => {
      const movieDetailsSection = document.querySelector("#movieDetails");
      movieDetailsSection.innerHTML = "";

      const container = document.createElement("div");
      container.classList.add("movie__container");
      movieDetailsSection.appendChild(container);

      const poster = document.createElement("img");
      poster.classList.add("movie__poster", "root__section");
      poster.src = data.Poster;
      poster.alt = `${data.Title} Poster`;
      container.appendChild(poster);

      const infoContainer = document.createElement("div");
      infoContainer.classList.add("movie__info");
      container.appendChild(infoContainer);

      const titleElement = document.createElement("h2");
      titleElement.textContent = `${data.Title} (${data.Year})`;
      infoContainer.appendChild(titleElement);

      const imdbRating = document.createElement("h5");
      imdbRating.textContent = `IMDb Rating: ${data.imdbRating}`;
      infoContainer.appendChild(imdbRating);

      const plotElement = document.createElement("p");
      plotElement.textContent = data.Plot;
      infoContainer.appendChild(plotElement);
    })
    .catch((error) => {
      console.error("Error fetching movie details:", error);
    });
}

export { fetchMovieDetails, loadMovieDetails };
