export let moviesArr = [];
const form = document.querySelector('#searchForm');
let searchInput = document.querySelector("input[type='search']");
let movieContainer = document.getElementById('movie-container');
let watchlistBtns = document.querySelectorAll('.watchlistBtn');
let searchArr = [];
let watchlistArr = [];
let duplicate;

function addItemToStorage(movie) {
    const watchlistArr = getItemsFromStorage();
    watchlistArr.push(movie);

    // Convert to JSON string and set to localstorage
    localStorage.setItem('myWatchlist', JSON.stringify(watchlistArr));
}

function checkForDuplicates(id) {
    duplicate = watchlistArr.some((movie) => movie.id === id);
    if (duplicate) {
        console.log(`Movie ${id} already exists`);
        return duplicate;
    }
}

function getItemsFromStorage() {
    if (localStorage.getItem('myWatchlist') === null) {
        watchlistArr = [];
    } else {
        watchlistArr = JSON.parse(localStorage.getItem('myWatchlist'));
    }
    return watchlistArr;
}

async function getMovies(findMovie) {
    try {
    const res = await fetch(
        `http://www.omdbapi.com/?i=tt3896198&apikey=fa2349eb&s=${findMovie}`,
    );
    const data = await res.json();
    moviesArr = data.Search.filter((movie) => movie.Type === 'movie').map(
        (movie) => {
            return movie.Title;
        })
    } catch (error) {
        console.error('Failed to fetch data', error.message);
        throw new Error(
            movieContainer.innerHTML = 
                `<p class="error">
                    Unable to find what you’re looking for. Please try another
                    search.
                </p>
                `
            );
    }

    moviesArr.forEach(async (movie) => {
        const res = await fetch(
            `http://www.omdbapi.com/?i=tt3896198&apikey=fa2349eb&t=${movie}`,
        );
        const data = await res.json();
        let title = data.Title;
        let runtime = data.Runtime;
        let genre = data.Genre;
        let plot = data.Plot;
        let poster = data.Poster;
        let imdbRating = data.imdbRating;
        let id = title.replace(/\s+/g, '-').toLowerCase();
        // Add all this to the moviesArr
        let movieDetails = {
            title,
            runtime,
            genre,
            plot,
            poster,
            imdbRating,
            id: title.replace(/\s+/g, '-').toLowerCase()
        }
        searchArr.push(movieDetails);
        displayMovieData(title, runtime, genre, plot, poster, imdbRating, id);
    });
}

function displayMovieData(title, runtime, genre, plot, poster, imdbRating, id) {
    duplicate = checkForDuplicates(id);
    let btnClass = 'watchlistBtn';
    let btnIcon = 'plus';
    let btnText = 'Watchlist';
    if (duplicate) {
        btnClass = 'removeWatchlistBtn';
        btnIcon = 'minus';
        btnText = 'Remove';
    } 
    movieContainer.innerHTML += `
  <div class="card">
    <img src="${poster}" alt="movie poster" />
    <div class="card-body">
      <h4 class="title">${title}</h4>
      <p class="rating">⭐️ ${imdbRating}</p>
      <div class="details">
        <p class="runtime">${runtime}</p>
        <p class="genre">${genre}</p>
        <button class='${btnClass}' id='${id}'>
            <i class='fa-solid fa-circle-${btnIcon}' id='icon'></i> ${btnText}
        </button>
      </div>
      <p class="plot">${plot}</p>
    </div> 
  </div>
    `;
}

function searchMovies(e) {
    e.preventDefault();
    let searchTerm = searchInput.value.trim();
    let findMovie = searchTerm.split(' ').join('+');
    searchInput.value = '';
    movieContainer.innerHTML = '';
    getMovies(findMovie);
}

form.addEventListener('submit', searchMovies);

movieContainer.addEventListener('click', function (e) {
        let id = e.target.id;
        let btn = e.target;
        let result = searchArr.find((movie) => movie.id === id);

        // Add the record to a watchlistArr
        if (btn.classList.contains('watchlistBtn')) {
            btn.classList.remove('watchlistBtn');
            btn.classList.add('removeWatchlistBtn');
            btn.innerHTML = `<i class="fa-solid fa-circle-minus"></i> Remove`;
            // Save to localStorage if not in watchlistArr
            checkForDuplicates(result);
            if (!duplicate) {
                addItemToStorage(result);
            }
        } else if (btn.classList.contains('removeWatchlistBtn')) {
            btn.classList.add('watchlistBtn');
            btn.classList.remove('removeWatchlistBtn');
            btn.innerHTML = `<i class="fa-solid fa-circle-plus"></i> Watchlist`;
            // Remove from array
            let movieToRemove = watchlistArr.findIndex(
                (movie) => movie.id === id,
            );
            if (movieToRemove !== -1) {
                watchlistArr.splice(movieToRemove, 1);
            }
            // Update localStorage
            localStorage.setItem('myWatchlist', JSON.stringify(watchlistArr));
        }
});
