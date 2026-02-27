const OMDb_KEY = 'acb551e7'; // Library 1
const TMDB_KEY = '438efd42c0d3c8fcd74eac49eaca8c51'; // Library 2
const grid = document.getElementById('movie-grid');
let activeID = '';

async function switchMode(mode) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    let q = mode === 'movie' ? 'Marvel' : mode === 'tv' ? 'Series' : 'One Piece';
    loadUniversal(q);
}

async function loadUniversal(query) {
    grid.innerHTML = '<p>Fetching from 5+ sources...</p>';
    // Primary Search from TMDB for better library
    const res = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${TMDB_KEY}&query=${query}`);
    const data = await res.json();
    
    if(data.results && data.results.length > 0) {
        display(data.results);
        document.getElementById('hero-banner').style.backgroundImage = `url(https://image.tmdb.org/t/p/w500${data.results[0].poster_path})`;
    } else {
        // Backup from OMDb if TMDB fails
        const res2 = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=${OMDb_KEY}`);
        const data2 = await res2.json();
        if(data2.Search) displayOMDb(data2.Search);
    }
}

function display(results) {
    grid.innerHTML = '';
    results.forEach(m => {
        if(!m.poster_path && !m.Poster) return;
        const div = document.createElement('div');
        div.className = 'movie-card';
        const img = m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : m.Poster;
        div.innerHTML = `<img src="${img}"><h3>${m.title || m.name || m.Title}</h3>`;
        div.onclick = () => openPlayer(m.id || m.imdbID, m.media_type === 'tv' || m.Type === 'series');
        grid.appendChild(div);
    });
}

async function openPlayer(id, isTV) {
    activeID = id;
    const player = document.getElementById('video-player');
    const panel = document.getElementById('ep-panel');
    
    if(isTV) {
        player.src = `https://vidsrc.to/embed/tv/${id}/1/1`;
        panel.style.display = 'block';
        setupSeasons(id);
    } else {
        player.src = `https://vidsrc.to/embed/movie/${id}`;
        panel.style.display = 'none';
    }
    document.getElementById('player-modal').style.display = 'block';
}

function setupSeasons(id) {
    const sel = document.getElementById('season-selector');
    sel.innerHTML = '<option value="1">Season 1</option><option value="2">Season 2</option>';
    loadEpisodes();
}

function loadEpisodes() {
    const grid = document.getElementById('episodes-grid');
    grid.innerHTML = '';
    for(let i=1; i<=20; i++) {
        const d = document.createElement('div');
        d.className = 'ep-box';
        d.innerText = i;
        d.onclick = () => document.getElementById('video-player').src = `https://vidsrc.to/embed/tv/${activeID}/1/${i}`;
        grid.appendChild(d);
    }
}

function closePlayer() {
    document.getElementById('player-modal').style.display = 'none';
    document.getElementById('video-player').src = '';
}

document.getElementById('search').onkeypress = (e) => { if(e.key === 'Enter') loadUniversal(e.target.value); };
window.onload = () => loadUniversal('Avengers');
