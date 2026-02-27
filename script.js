const OMDb_KEY = 'acb551e7'; 
let currentID = '';

// 1. Section Switching Logic (No Khichdi)
function showSection(id) {
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.getElementById(id + '-section').classList.add('active');
    
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
}

// 2. Multi-API Loading
async function loadData(query, type, gridId) {
    const grid = document.getElementById(gridId);
    let url = (type === 'anime') ? `https://api.jikan.moe/v4/anime?q=${query}&limit=12` 
                                : `https://www.omdbapi.com/?s=${query}&type=${type}&apikey=${OMDb_KEY}`;

    const res = await fetch(url);
    const data = await res.json();
    const items = data.Search || data.data || [];
    
    grid.innerHTML = '';
    items.forEach(m => {
        const div = document.createElement('div');
        div.className = 'movie-card';
        const poster = m.Poster || m.images?.jpg?.image_url;
        div.innerHTML = `<img src="${poster}">`;
        div.onclick = () => openPlayer(m.imdbID || m.mal_id, type);
        grid.appendChild(div);
    });
}

function openPlayer(id, type) {
    currentID = id;
    const player = document.getElementById('video-player');
    if(type === 'movie') {
        player.src = `https://vidsrc.to/embed/movie/${id}`;
        document.getElementById('ep-panel').style.display = 'none';
    } else {
        player.src = `https://vidsrc.to/embed/tv/${id}/1/1`;
        document.getElementById('ep-panel').style.display = 'block';
        // Auto-generate episode buttons based on type
        setupEpisodes(id);
    }
    document.getElementById('player-modal').style.display = 'block';
}

function setupEpisodes(id) {
    const list = document.getElementById('ep-list');
    list.innerHTML = '';
    for(let i=1; i<=15; i++) {
        const btn = document.createElement('button');
        btn.innerText = i;
        btn.onclick = () => document.getElementById('video-player').src = `https://vidsrc.to/embed/tv/${id}/1/${i}`;
        list.appendChild(btn);
    }
}

function closePlayer() {
    document.getElementById('player-modal').style.display = 'none';
    document.getElementById('video-player').src = '';
}

window.onload = () => {
    loadData('Avengers', 'movie', 'movies-grid');
    loadData('Viking', 'series', 'series-grid');
    loadData('Naruto', 'anime', 'anime-grid');
};
