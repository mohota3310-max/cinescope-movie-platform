const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const movies = document.getElementById("movies");
const mouseLight = document.querySelector(".mouse-light");

let mouseX = 0;
let mouseY = 0;
let lightX = 0;
let lightY = 0;

document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateLight() {
    lightX += (mouseX - lightX) * 0.08;
    lightY += (mouseY - lightY) * 0.08;

    mouseLight.style.left = `${lightX}px`;
    mouseLight.style.top = `${lightY}px`;

    requestAnimationFrame(animateLight);
}

animateLight();

searchBtn.addEventListener("click", async () => {
    const movieName = searchInput.value;

    if (movieName === "") {
        return;
    }
    
    movies.innerHTML = "<p>Loading...</p>";
    const apiKey = "b954524c";
    const url = `https://www.omdbapi.com/?apikey=${apiKey}&s=${movieName}`;

    const response = await fetch(url);
    const data = await response.json();
    if (data.Response === "False") {
    movies.innerHTML = `<p>${data.Error}</p>`;
    return;
}

    movies.innerHTML = "";

    for (const movie of data.Search) {
        const detailsUrl = `https://www.omdbapi.com/?apikey=${apiKey}&i=${movie.imdbID}`;

        const response = await fetch(detailsUrl);
        const details = await response.json();

       const movieCard = document.createElement("div");
       movieCard.classList.add("movie-card");

       movieCard.innerHTML = `
    <img src="${details.Poster && details.Poster !== "N/A" ? details.Poster : "placeholder.jpg"}" onerror="this.src='placeholder.jpg'" alt="${details.Title}">
    
    <div class="movie-info">
    <h2>${details.Title}</h2>
    <div class="movie-meta">
    <p>${details.Year}</p>
    <p>⭐ ${details.imdbRating}</p>
    <button class="details-btn">Details</button>
</div>

<p>${details.Genre}</p>
</div>
`;

        movies.appendChild(movieCard);
    }
});
searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        searchBtn.click();
    }
});