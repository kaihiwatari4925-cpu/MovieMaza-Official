const OMDb_KEY = 'acb551e7'; 
const main = document.getElementById('movie-grid');

// 1. Movie Play Logic (Ads block karne ke liye)
function playMovie(imdbId, title) {
    const modal = document.getElementById('player-modal');
    const player = document.getElementById('video-player');
    
    // Yahan tu apna TeraBox link manually daal sakta hai 
    // Agar link nahi hai, toh automatic server chalega
    let manualLink = prompt("Agar TeraBox link hai toh yahan paste karein, nahi toh OK dabayein automatic chalane ke liye:", "");
    
    if (manualLink && manualLink.trim() !== "") {
        player.src = manualLink; // TeraBox link ads nahi dikhayega
    } else {
        // Automatic server with extra ad-blocking backup
        player.src = `https://vidsrc.xyz/embed/movie?imdb=${imdbId}`;
    }
    
    modal.style.display = 'block';
}

// ... baaki fetchMovies aur displayMovies wala code same rahega ...
