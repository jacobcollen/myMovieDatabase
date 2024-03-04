// search.mjs
"use strict";

async function fetchMovies(searchQuery) {
  const apiKey = "ceffad2a";
  const url = `http://www.omdbapi.com/?apikey=${apiKey}&s=${searchQuery}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

function updateSearchResults(movies) {
  const searchResults = document.querySelector("#searchDropdown");
  searchResults.innerHTML = "";

  if (movies.Search) {
    for (const movie of movies.Search) {
      const newLi = document.createElement("li");
      newLi.tabIndex = 0;
      newLi.classList.add("search__result"); 
      const img = document.createElement("img");
      img.src = movie.Poster;
      img.alt = `${movie.Poster} Poster`;
      newLi.appendChild(img);
      const info = document.createElement("span");
      info.textContent = `${movie.Title} (${movie.Year})`;
      newLi.appendChild(info);
      newLi.dataset.imdbID = encodeURI(movie.imdbID);
      searchResults.appendChild(newLi);
    }
  } else {
    const newLi = document.createElement("li");
    newLi.textContent = "No movies found.";
    searchResults.appendChild(newLi);
  }
}

const searchInput = document.querySelector("#searchInput");
const searchDropdown = document.querySelector("#searchDropdown");

function showDropdown() {
  console.log("Showing dropdown...");
  searchDropdown.style.display = "block";
}

function navigateSearchResults(direction) {
  console.log("Navigating search results...");
  const results = document.querySelectorAll("#searchDropdown .search__result");
  let currentFocusedIndex = -1;

  for (let i = 0; i < results.length; i++) {
    if (results[i].classList.contains("focused")) {
      currentFocusedIndex = i;
      break;
    }
  }

  if (direction === "up" && currentFocusedIndex > 0) {
    results[currentFocusedIndex].classList.remove("focused");
    results[currentFocusedIndex - 1].classList.add("focused");
  } else if (direction === "down" && currentFocusedIndex < results.length - 1) {
    if (currentFocusedIndex !== -1) {
      results[currentFocusedIndex].classList.remove("focused");
    }
    results[currentFocusedIndex + 1].classList.add("focused");
  }
}

searchInput.addEventListener("focus", showDropdown);

document.addEventListener("keydown", (event) => {
  if (document.querySelector("#searchDropdown").style.display === "block") {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      navigateSearchResults("down");
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      navigateSearchResults("up");
    } else if (event.key === "Tab" && event.shiftKey) {
      searchInput.focus();
    }
  }
});

searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Tab" && !event.shiftKey) {
    const results = document.querySelectorAll(
      "#searchDropdown .search__result"
    );
    if (results.length > 0) {
      event.preventDefault();
      results[0].focus();
    }
  }
});

export {
  fetchMovies,
  updateSearchResults,
  showDropdown,
  navigateSearchResults,
};
