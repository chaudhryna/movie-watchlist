let movieContainer = document.getElementById('movie-container');

// Retrieve moviesArr from localStorage and display on page
// If user clicks the Remove btn it should remove the record from localStorage
let watchlistArr = JSON.parse(localStorage.getItem("myWatchlist"))

function displayWatchlist () {
    movieContainer.innerHTML = '';
    watchlistArr.forEach((movie) => {
        movieContainer.innerHTML += `
         <div class="card">
           <img src="${movie.poster}" alt="movie poster" />
           <div class="card-body">
             <h4 class="title">${movie.title}</h4>
             <p class="rating">⭐️ ${movie.imdbRating}</p>
             <div class="details">
               <p class="runtime">${movie.runtime}</p>
               <p class="genre">${movie.genre}</p>
               <button class='removeWatchlistBtn' id="${movie.id}">
                   <i class="fa-solid fa-circle-minus" id="icon"></i> Remove
               </button> 
             </div>
             <p class="plot">${movie.plot}</p>
           </div> 
         </div>
           `;
    })
}

movieContainer.addEventListener('click', function (e) {
    let id = e.target.id;
    let btn = e.target;

    // Remove from the watchlist
    if (btn.classList.contains('removeWatchlistBtn')) {
        btn.classList.add('watchlistBtn');
        btn.classList.remove('removeWatchlistBtn');
        btn.innerHTML = `<i class="fa-solid fa-circle-plus"></i> Watchlist`;
        // Remove from the watchlist array
        let movieToRemove = watchlistArr.findIndex((movie) => movie.id === id);
        if (movieToRemove !== -1) {
            watchlistArr.splice(movieToRemove, 1);
        }
        // Update localStorage
        localStorage.setItem('myWatchlist', JSON.stringify(watchlistArr));
        displayWatchlist ();
    }
});

displayWatchlist ();
