const OMDb_KEY = 'acb551e7'; 
const grid = document.getElementById('movie-grid');
const newGrid = document.getElementById('new-grid');
const banner = document.getElementById('hero-banner');

async function loadContent(query, targetGrid) {
    const res = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=${OMDb_KEY}`);
    const data = await res.json();
    if(data.Search) {
        displayContent(data.Search, targetGrid);
        // Set first movie as banner
        banner.style.backgroundImage = `url(${data.Search[0].Poster})`;
        banner.innerHTML = `<h1 style="z-index:1">${data.Search[0].Title}</h1>`;
    }
}

function displayContent(items, targetGrid) {
    targetGrid.innerHTML = '';
    items.forEach(m => {
        const div = document.createElement('div');
        div.className = 'movie-card';
        div.innerHTML = `<img src="${m.Poster}" alt="${m.Title}">`;
        div.onclick = () => openPlayer(m.imdbID, m.Title);
        targetGrid.appendChild(div);
    });
}

function openPlayer(id, title) {
    const player = document.getElementById('video-player');
    const epList = document.getElementById('ep-list');
    
    // Check if it's a series for episodes
    player.src = `https://vidsrc.to/embed/movie/${id}`;
    
    epList.innerHTML = '';
    for(let i=1; i<=10; i++) {
        const btn = document.createElement('button');
        btn.className = 'ep-btn';
        btn.innerText = i;
        btn.onclick = () => {
            player.src = `https://vidsrc.to/embed/tv/${id}/1/${i}`;
        };
        epList.appendChild(btn);
    }
    document.getElementById('player-modal').style.display = 'block';
}

// Search with Enter
document.getElementById('search').addEventListener('keypress', (e) => {
    if(e.key === 'Enter') loadContent(e.target.value, grid);
});

window.onload = () => {
    loadContent('Batman', grid);
    loadContent('Naruto', newGrid);
};
