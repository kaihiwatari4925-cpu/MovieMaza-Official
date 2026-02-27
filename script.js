const KEY = '438efd42c0d3c8fcd74eac49eaca8c51'; // Teri working API Key
const IMG = 'https://image.tmdb.org/t/p/w500';

async function loadMovies() {
    const res = await fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${KEY}`);
    const data = await res.json();
    const grid = document.getElementById('movie-grid');
    grid.innerHTML = '';
    
    data.results.forEach(m => {
        const div = document.createElement('div');
        div.className = 'movie-card';
        div.innerHTML = `<img src="${IMG + m.poster_path}" alt="${m.title}">`;
        div.onclick = () => {
            // Streaming Player logic
            document.getElementById('video-player').src = `https://vidsrc.me/embed/movie?tmdb=${m.id}`;
            document.getElementById('player-modal').style.display = 'block';
        };
        grid.appendChild(div);
    });
}

document.querySelector('.close').onclick = () => {
    document.getElementById('player-modal').style.display = 'none';
    document.getElementById('video-player').src = '';
};

loadMovies();
