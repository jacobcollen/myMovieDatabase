"use strict";

window.addEventListener("load", () => {
  console.log("load");
  setupCarousel();
});

// Trailer function
function createMovieElement(movie) {
  const slide = document.createElement("li");
  slide.classList.add("carousel__slide");

  const iframe = document.createElement("iframe");
  iframe.src = movie.trailer_link;
  slide.appendChild(iframe);

  return slide;
}

// Carousel function
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

// Top 20 movie grid
// Top 20 movie grid
const moviesList = document.getElementById('moviesList');

fetch('https://santosnr6.github.io/Data/movies.json')
  .then(response => response.json())
  .then(movies => {
    const top20Movies = movies.slice(0, 20); // Select the top 20 movies

    top20Movies.forEach(movie => {
      const movieItem = document.createElement('li');
      movieItem.classList.add('movie-grid__card');

      const movieImage = document.createElement('img');
      movieImage.src = movie.poster;
      movieItem.appendChild(movieImage);

      const movieTitle = document.createElement('h3');
      movieTitle.textContent = movie.title;
      movieItem.appendChild(movieTitle);

      moviesList.appendChild(movieItem);
    });
  })
  .catch(error => console.error('Error fetching movies:', error));