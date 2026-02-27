const OMDb_KEY = 'acb551e7'; // Teri nayi active key
const search_term = 'Marvel'; // Shuruat mein Marvel movies dikhane ke liye

const main = document.getElementById('movie-grid');

async function loadMovies() {
    // OMDb API ka use kar rahe hain jo India mein block nahi hai
    const res = await fetch(`https://www.omdbapi.com/?s=${search_term}&apikey=${OMDb_KEY}`);
    const data = await res.json();
    
    if(data.Search) {
        displayMovies(data.Search);
    }
}

function displayMovies(movies) {
    main.innerHTML = '';
    movies.forEach(m => {
        const div = document.createElement('div');
        div.className = 'movie-card';
        // OMDb mein 'Poster' capital P se hota hai
        div.innerHTML = `<img src="${m.Poster}" alt="${m.Title}">`;
        
        // Movie play karne ka logic
        div.onclick = () => {
            const modal = document.getElementById('player-modal');
            const player = document.getElementById('video-player');
            // OMDb mein imdbID use hota hai streaming ke liye
            player.src = `https://vidsrc.me/embed/movie?imdb=${m.imdbID}`;
            modal.style.display = 'block';
        };
        main.appendChild(div);
    });
}

// Modal close logic
document.querySelector('.close').onclick = () => {
    document.getElementById('player-modal').style.display = 'none';
    document.getElementById('video-player').src = '';
};

loadMovies();
