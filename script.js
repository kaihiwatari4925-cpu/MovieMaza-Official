const OMDb_KEY = 'acb551e7'; // Teri key
const grid = document.getElementById('movie-grid');
let currentMode = 'movie';

async function setMode(mode) {
    currentMode = mode;
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    
    let query = mode === 'movie' ? 'Action' : mode === 'series' ? 'Drama' : 'One Piece';
    loadContent(query);
}

async function loadContent(query) {
    const res = await fetch(`https://www.omdbapi.com/?s=${query}&type=${currentMode === 'anime' ? 'series' : currentMode}&apikey=${OMDb_KEY}`);
    const data = await res.json();
    if(data.Search) display(data.Search);
}

function display(data) {
    grid.innerHTML = '';
    data.forEach(m => {
        const div = document.createElement('div');
        div.className = 'movie-card';
        div.innerHTML = `<img src="${m.Poster}" alt="${m.Title}"><h3>${m.Title}</h3>`;
        div.onclick = () => openPlayer(m.imdbID, m.Title);
        grid.appendChild(div);
    });
}

function openPlayer(id, title) {
    const modal = document.getElementById('player-modal');
    const player = document.getElementById('video-player');
    
    if(currentMode === 'movie') {
        player.src = `https://vidsrc.to/embed/movie/${id}`;
        document.getElementById('episode-panel').style.display = 'none';
    } else {
        // Episode Logic like Screenshot 1000311396
        player.src = `https://vidsrc.to/embed/tv/${id}/1/1`;
        setupEpisodes(id);
        document.getElementById('episode-panel').style.display = 'block';
    }
    modal.style.display = 'block';
}

function setupEpisodes(id) {
    const list = document.getElementById('episode-list');
    list.innerHTML = '';
    // Manual Episode box generation
    for(let i=1; i<=12; i++) {
        const ep = document.createElement('div');
        ep.className = 'ep-num';
        ep.innerText = i;
        ep.onclick = () => {
            let link = prompt(`Episode ${i} ka TeraBox link dalo (Nahi toh OK dabayein):`);
            document.getElementById('video-player').src = link ? link : `https://vidsrc.to/embed/tv/${id}/1/${i}`;
        };
        list.appendChild(ep);
    }
}

document.querySelector('.close').onclick = () => {
    document.getElementById('player-modal').style.display = 'none';
    document.getElementById('video-player').src = '';
};

window.onload = () => setMode('movie');
