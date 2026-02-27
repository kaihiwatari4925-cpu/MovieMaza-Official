const TMDB_KEY = '438efd42c0d3c8fcd74eac49eaca8c51'; // Teri working TMDB key
const OMDb_KEY = 'acb551e7'; // Backup key
const grid = document.getElementById('movie-grid');

// 1. Multi-Website Search Logic
async function searchAll(query, type) {
    grid.innerHTML = '<p>Searching across libraries...</p>';
    
    // TMDB se data fetch karo (Primary)
    let url = `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_KEY}&query=${query}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.results && data.results.length > 0) {
        display(data.results);
    } else {
        // Agar TMDB par nahi mila, toh OMDb try karo (Backup)
        const res2 = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=${OMDb_KEY}`);
        const data2 = await res2.json();
        if(data2.Search) displayOMDb(data2.Search);
    }
}

// 2. Display with Professional Player
function display(results) {
    grid.innerHTML = '';
    results.forEach(m => {
        if(!m.poster_path && !m.Poster) return; // Bina poster wali hata do
        const div = document.createElement('div');
        div.className = 'movie-card';
        const img = m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : m.Poster;
        div.innerHTML = `<img src="${img}"><h3>${m.title || m.name}</h3>`;
        
        div.onclick = () => {
            const id = m.id || m.imdbID;
            const isTV = m.media_type === 'tv' || m.Type === 'series';
            openPlayer(id, isTV);
        };
        grid.appendChild(div);
    });
}

function openPlayer(id, isTV) {
    const player = document.getElementById('video-player');
    // Multiple Server Logic for Movies/Series/Anime
    if(isTV) {
        player.src = `https://vidsrc.to/embed/tv/${id}/1/1`;
    } else {
        player.src = `https://vidsrc.to/embed/movie/${id}`;
    }
    document.getElementById('player-modal').style.display = 'block';
}
