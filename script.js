const OMDb_KEY = 'acb551e7'; // Teri active key
const main = document.getElementById('movie-grid');
const searchInput = document.getElementById('search');

// Page load hote hi 'Avengers' dikhao taaki page khali na lage
window.onload = () => loadMovies('Avengers');

async function loadMovies(query) {
    main.innerHTML = '<h2 style="color:white; padding:20px;">Loading movies...</h2>';
    try {
        const res = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=${OMDb_KEY}`);
        const data = await res.json();
        if(data.Response === "True") {
            displayMovies(data.Search);
        } else {
            main.innerHTML = `<h2 style="color:white; padding:20px;">Movie nahi mili!</h2>`;
        }
    } catch (error) {
        main.innerHTML = `<h2 style="color:white; padding:20px;">Network Error!</h2>`;
    }
}

function displayMovies(movies) {
    main.innerHTML = '';
    movies.forEach(m => {
        const div = document.createElement('div');
        div.className = 'movie-card';
        const poster = m.Poster !== "N/A" ? m.Poster : "https://via.placeholder.com/300x450?text=No+Poster";
        div.innerHTML = `
            <img src="${poster}" alt="${m.Title}">
            <div class="movie-info"><h3>${m.Title}</h3></div>
        `;
        div.onclick = () => playMovie(m.imdbID);
        main.appendChild(div);
    });
}

function playMovie(imdbId) {
    const modal = document.getElementById('player-modal');
    const player = document.getElementById('video-player');
    
    // User se pucho agar TeraBox link hai toh
    let teraLink = prompt("TeraBox Premium link hai toh paste karein (Ad-free), nahi toh OK dabayein:");
    
    if(teraLink && teraLink.includes("http")) {
        player.src = teraLink;
    } else {
        // Backup server jo DNS ke bina chalne ki koshish karega
        player.src = `https://vidsrc.xyz/embed/movie?imdb=${imdbId}`;
    }
    modal.style.display = 'block';
}

searchInput.addEventListener('keypress', (e) => {
    if(e.key === 'Enter' && searchInput.value) loadMovies(searchInput.value);
});

document.querySelector('.close').onclick = () => {
    document.getElementById('player-modal').style.display = 'none';
    document.getElementById('video-player').src = '';
};
