const OMDb_KEY = 'acb551e7'; // Teri active key
const main = document.getElementById('movie-grid');
const searchInput = document.getElementById('search');

// 1. Movies Load aur Search ka Combo Function
async function loadMovies(query = 'Marvel') {
    const res = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=${OMDb_KEY}`);
    const data = await res.json();
    
    if(data.Response === "True") {
        displayMovies(data.Search);
    } else {
        main.innerHTML = `<h2 style="padding:20px; color:white;">Movie nahi mili, kuch aur search karein!</h2>`;
    }
}

// 2. Posters Dikhane ka Sahi Tarika
function displayMovies(movies) {
    main.innerHTML = '';
    movies.forEach(m => {
        const div = document.createElement('div');
        div.className = 'movie-card';
        // Agar poster N/A ho toh default image dikhayenge
        const posterUrl = m.Poster !== "N/A" ? m.Poster : "https://via.placeholder.com/300x450?text=No+Poster";
        
        div.innerHTML = `
            <img src="${posterUrl}" alt="${m.Title}">
            <div class="movie-info"><h3>${m.Title}</h3></div>
        `;
        
        // Play Movie on Click
        div.onclick = () => playMovie(m.imdbID);
        main.appendChild(div);
    });
}

// 3. Player Fix (Black Screen Hatane ke liye)
function playMovie(imdbId) {
    const modal = document.getElementById('player-modal');
    const player = document.getElementById('video-player');
    
    // Pro-Tip: OMDb ke imdbID se movie play hogi
    player.src = `https://vidsrc.me/embed/movie?imdb=${imdbId}`;
    modal.style.display = 'block';
}

// 4. Search Bar Logic (Enter dabate hi search hoga)
searchInput.addEventListener('keypress', (e) => {
    if(e.key === 'Enter') {
        const query = searchInput.value;
        if(query) loadMovies(query);
    }
});

// Modal Close
document.querySelector('.close').onclick = () => {
    document.getElementById('player-modal').style.display = 'none';
    document.getElementById('video-player').src = '';
};

// Start App
loadMovies();
