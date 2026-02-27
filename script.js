const OMDb_KEY = 'acb551e7'; 
let currentId = '';

async function openMedia(id, type) {
    currentId = id;
    const modal = document.getElementById('player-modal');
    const seasonSelect = document.getElementById('season-select');
    
    if(type === 'series') {
        // Fetch series info to get total seasons
        const res = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=${OMDb_KEY}`);
        const data = await res.json();
        
        seasonSelect.innerHTML = '';
        // Dynamic Seasons based on series info
        for(let i=1; i<=parseInt(data.totalSeasons); i++) {
            seasonSelect.innerHTML += `<option value="${i}">Season ${i}</option>`;
        }
        document.getElementById('media-controls').style.display = 'block';
        loadEpisodes(); // Load first season episodes
    } else {
        document.getElementById('video-player').src = `https://vidsrc.to/embed/movie/${id}`;
        document.getElementById('media-controls').style.display = 'none';
    }
    modal.style.display = 'block';
}

async function loadEpisodes() {
    const season = document.getElementById('season-select').value;
    const res = await fetch(`https://www.omdbapi.com/?i=${currentId}&Season=${season}&apikey=${OMDb_KEY}`);
    const data = await res.json();
    
    const list = document.getElementById('ep-list');
    list.innerHTML = '';
    if(data.Episodes) {
        data.Episodes.forEach(ep => {
            const btn = document.createElement('button');
            btn.className = 'ep-btn';
            btn.innerText = `EP ${ep.Episode}`;
            btn.onclick = () => {
                // Video player with Audio Support
                document.getElementById('video-player').src = `https://vidsrc.to/embed/tv/${currentId}/${season}/${ep.Episode}`;
            };
            list.appendChild(btn);
        });
    }
}
