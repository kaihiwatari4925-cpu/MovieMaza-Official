const OMDb_KEY = 'acb551e7'; 
const hero = document.getElementById('hero');
const trendingGrid = document.getElementById('movie-grid');
const newGrid = document.getElementById('new-grid');

// 1. Content Type Logic (Fix for Anime/TV not working)
async function setCategory(type, query) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    loadShelf(query, trendingGrid);
    loadShelf(query + ' 2', newGrid);
}

async function loadShelf(query, gridElement) {
    const res = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=${OMDb_KEY}`);
    const data = await res.json();
    if(data.Search) {
        gridElement.innerHTML = '';
        data.Search.forEach(item => {
            const div = document.createElement('div');
            div.className = 'card';
            div.innerHTML = `<img src="${item.Poster}" alt="${item.Title}">`;
            div.onclick = () => openMedia(item.imdbID, item.Title, item.Type);
            gridElement.appendChild(div);
        });
        // Update Hero Banner with the first item
        hero.style.backgroundImage = `url(${data.Search[0].Poster})`;
        hero.innerHTML = `<h1 style="z-index:1; font-size:30px;">${data.Search[0].Title}</h1>`;
    }
}

// 2. Real Episode Fetching Logic
async function openMedia(id, title, type) {
    const player = document.getElementById('video-player');
    const epList = document.getElementById('ep-list');
    
    // Default Player (Movie)
    player.src = `https://vidsrc.to/embed/movie/${id}`;
    epList.innerHTML = '';

    if(type === 'series') {
        // Fetch Season 1 to get real episode count
        const res = await fetch(`https://www.omdbapi.com/?i=${id}&Season=1&apikey=${OMDb_KEY}`);
        const data = await res.json();
        
        if(data.Episodes) {
            data.Episodes.forEach(ep => {
                const btn = document.createElement('button');
                btn.className = 'ep-btn';
                btn.innerText = ep.Episode;
                btn.onclick = () => {
                    player.src = `https://vidsrc.to/embed/tv/${id}/1/${ep.Episode}`;
                    document.querySelectorAll('.ep-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                };
                epList.appendChild(btn);
            });
        }
    }
    document.getElementById('player-modal').style.display = 'block';
}

// Close Modal logic
document.querySelector('.close').onclick = () => {
    document.getElementById('player-modal').style.display = 'none';
    document.getElementById('video-player').src = '';
};

// Initial Load
window.onload = () => {
    loadShelf('Marvel', trendingGrid);
    loadShelf('Batman', newGrid);
};
