const OMDb_KEY = 'acb551e7'; // Teri active key
const main = document.getElementById('movie-grid');
const searchInput = document.getElementById('search');

// 1. Movies Load aur Search logic
async function loadMovies(query = 'Marvel') {
    const res = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=${OMDb_KEY}`);
    const data = await res.json();
    if(data.Response === "True") {
        displayMovies(data.Search);
    }
}

// 2. Posters Display
function displayMovies(movies) {
    main.innerHTML = '';
    movies.forEach(m => {
        const div = document.createElement('div');
        div.className = 'movie-card';
        div.innerHTML = `<img src="${m.Poster}" alt="${m.Title}"><div class="movie-info"><h3>${m.Title}</h3></div>`;
        div.onclick = () => playMovie(m.imdbID);
        main.appendChild(div);
    });
}

// 3. Player Fix (Server 1 automatic backup ke saath)
function playMovie(imdbId) {
    const modal = document.getElementById('player-modal');
    const player = document.getElementById('video-player');
    
    // Naya working server
    player.src = `https://vidsrc.to/embed/movie/${imdbId}`;
    modal.style.display = 'block';
}

// 4. Search and Close logic
searchInput.addEventListener('keypress', (e) => {
    if(e.key === 'Enter' && searchInput.value) loadMovies(searchInput.value);
});

document.querySelector('.close').onclick = () => {
    document.getElementById('player-modal').style.display = 'none';
    document.getElementById('video-player').src = '';
};

loadMovies();
