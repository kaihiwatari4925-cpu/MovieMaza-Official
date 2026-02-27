const OMDb_KEY = 'acb551e7'; // Teri key
const grid = document.getElementById('trending-grid');
const banner = document.getElementById('hero-banner');
let activeID = '';

async function setCategory(type, query) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    loadContent(query, type);
}

async function loadContent(query, type = 'movie') {
    const res = await fetch(`https://www.omdbapi.com/?s=${query}&type=${type}&apikey=${OMDb_KEY}`);
    const data = await res.json();
    if(data.Search) {
        display(data.Search);
        banner.style.backgroundImage = `url(${data.Search[0].Poster})`;
        banner.innerHTML = `<h1 style="z-index:1">${data.Search[0].Title}</h1>`;
    }
}

function display(data) {
    grid.innerHTML = '';
    data.forEach(m => {
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `<img src="${m.Poster}" alt="${m.Title}">`;
        div.onclick = () => openPlayer(m.imdbID, m.Title, m.Type);
        grid.appendChild(div);
    });
}

async function openPlayer(id, title, type) {
    activeID = id;
    const modal = document.getElementById('player-modal');
    const player = document.getElementById('video-player');
    const select = document.getElementById('season-select');
    
    document.getElementById('media-title').innerText = title;
    
    if(type === 'series') {
        const res = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=${OMDb_KEY}`);
        const info = await res.json();
        
        select.innerHTML = '';
        for(let i=1; i<=parseInt(info.totalSeasons); i++) {
            select.innerHTML += `<option value="${i}">Season ${i}</option>`;
        }
        select.style.display = 'block';
        loadEpisodes();
    } else {
        player.src = `https://vidsrc.to/embed/movie/${id}`;
        select.style.display = 'none';
        document.getElementById('ep-grid').innerHTML = '';
    }
    modal.style.display = 'block';
}

async function loadEpisodes() {
    const season = document.getElementById('season-select').value;
    const res = await fetch(`https://www.omdbapi.com/?i=${activeID}&Season=${season}&apikey=${OMDb_KEY}`);
    const data = await res.json();
    const epGrid = document.getElementById('ep-grid');
    epGrid.innerHTML = '';
    
    if(data.Episodes) {
        data.Episodes.forEach(ep => {
            const div = document.createElement('div');
            div.className = 'ep-box';
            div.innerText = ep.Episode;
            div.onclick = () => {
                document.getElementById('video-player').src = `https://vidsrc.to/embed/tv/${activeID}/${season}/${ep.Episode}`;
            };
            epGrid.appendChild(div);
        });
    }
}

function closePlayer() {
    document.getElementById('player-modal').style.display = 'none';
    document.getElementById('video-player').src = '';
}

document.getElementById('search').onkeypress = (e) => {
    if(e.key === 'Enter') loadContent(e.target.value);
};

window.onload = () => loadContent('Marvel');
