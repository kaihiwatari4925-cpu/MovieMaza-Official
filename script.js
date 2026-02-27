const OMDb_KEY = 'acb551e7'; 
const grid = document.getElementById('movie-grid');
const banner = document.getElementById('hero-banner');

async function setCategory(cat) {
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    
    let query = cat === 'movie' ? 'Action' : cat === 'series' ? 'Game of Thrones' : 'One Piece';
    fetchMovies(query, cat);
}

async function fetchMovies(query, type) {
    const res = await fetch(`https://www.omdbapi.com/?s=${query}&type=${type === 'anime' ? 'series' : type}&apikey=${OMDb_KEY}`);
    const data = await res.json();
    if (data.Search) {
        // Set Hero Banner using the first result like Screenshot 1000311390
        banner.style.backgroundImage = `url(${data.Search[0].Poster})`;
        banner.innerHTML = `<div style="z-index:2"><h1>${data.Search[0].Title}</h1><button class="cat-btn active">Watch Now</button></div>`;
        display(data.Search);
    }
}

function display(movies) {
    grid.innerHTML = '';
    movies.forEach(m => {
        const div = document.createElement('div');
        div.className = 'movie-card';
        div.innerHTML = `<img src="${m.Poster}" alt="${m.Title}">`;
        div.onclick = () => openPlayer(m.imdbID, m.Title);
        grid.appendChild(div);
    });
}

function openPlayer(id, title) {
    const modal = document.getElementById('player-modal');
    const player = document.getElementById('video-player');
    const epList = document.getElementById('episode-list');
    
    // Automatic Movie Link
    player.src = `https://vidsrc.to/embed/movie/${id}`;
    
    // Episode Selector logic for Series/Anime like Screenshot 1000311396
    epList.innerHTML = '';
    for(let i=1; i<=10; i++) {
        const ep = document.createElement('div');
        ep.className = 'ep-box';
        ep.innerText = `EP ${i}`;
        ep.onclick = () => {
            let link = prompt(`Episode ${i} ka TeraBox link dalo (Nahi toh automatic chalega):`);
            player.src = link ? link : `https://vidsrc.to/embed/tv/${id}/${i}/1`;
        };
        epList.appendChild(ep);
    }
    modal.style.display = 'block';
}

document.querySelector('.close').onclick = () => {
    document.getElementById('player-modal').style.display = 'none';
    document.getElementById('video-player').src = '';
};

window.onload = () => setCategory('movie');
