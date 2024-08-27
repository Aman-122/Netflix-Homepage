document.addEventListener('DOMContentLoaded', () => {
    const apiKey = '9ec6ffa96c9161f29ea6937b176111ac'; // Replace with your API key

    // API URLs
    const apiUrlPopular = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`;
    const apiUrlTrending = `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`;
    const apiUrlHighRated = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=en-US&page=1`;

    // Elements
    const heroCarousel = document.getElementById('hero-carousel');
    const popularMovies = document.getElementById('popular-movies');
    const trendingMovies = document.getElementById('trending-movies');
    const highRatedMovies = document.getElementById('high-rated-movies');

    // Fetch and display movies in the hero section
    function fetchHeroMovies() {
        fetch(apiUrlPopular)
            .then(response => response.json())
            .then(data => {
                const movies = data.results;
                if (movies.length > 0) {
                    movies.forEach((movie, index) => {
                        const heroSlide = document.createElement('div');
                        heroSlide.className = 'hero-slide';
                        heroSlide.style.backgroundImage = `url('https://image.tmdb.org/t/p/original${movie.backdrop_path}')`;
                        heroSlide.innerHTML = `
                            <div class="hero-info">
                                <h2>${movie.title}</h2>
                                <p>${movie.overview}</p>
                            </div>
                        `;
                        heroCarousel.appendChild(heroSlide);

                        if (index === 0) {
                            heroSlide.classList.add('active');
                        }
                    });

                    // Automatically change the hero section every 5 seconds
                    let currentIndex = 0;
                    setInterval(() => {
                        const slides = document.querySelectorAll('.hero-slide');
                        slides[currentIndex].classList.remove('active');
                        currentIndex = (currentIndex + 1) % slides.length;
                        slides[currentIndex].classList.add('active');
                    }, 5000);
                }
            })
            .catch(error => {
                console.error('Error fetching hero movies:', error);
            });
    }

    // Function to fetch and display movies in a section
    function fetchAndDisplayMovies(apiUrl, movieRow) {
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const movies = data.results;
                movies.forEach(movie => {
                    const movieDiv = document.createElement('div');
                    movieDiv.className = 'movie';
                    movieDiv.style.backgroundImage = `url('https://image.tmdb.org/t/p/w500${movie.poster_path}')`;
                    movieDiv.setAttribute('data-title', movie.title);
                    movieDiv.setAttribute('data-description', movie.overview);
                    movieDiv.innerHTML = `<div class="movie-info">${movie.title}</div>`;
                    movieRow.appendChild(movieDiv);

                    // Add event listener for opening modal
                    movieDiv.addEventListener('click', () => {
                        const modal = document.getElementById('movie-modal');
                        const modalTitle = document.getElementById('modal-title');
                        const modalDescription = document.getElementById('modal-description');

                        modal.style.display = 'flex';
                        modalTitle.textContent = movie.title;
                        modalDescription.textContent = movie.overview;

                        // Setup download button
                        document.getElementById('download-button').onclick = () => downloadMovie(movie.id);
                    });
                });
            })
            .catch(error => {
                console.error('Error fetching movies:', error);
            });
    }

    // Fetch and display movies for each section
    fetchHeroMovies();
    fetchAndDisplayMovies(apiUrlPopular, popularMovies);
    fetchAndDisplayMovies(apiUrlTrending, trendingMovies);
    fetchAndDisplayMovies(apiUrlHighRated, highRatedMovies);

    // Movie Modal close button
    const closeModal = document.getElementById('close-modal');
    closeModal.onclick = () => {
        document.getElementById('movie-modal').style.display = 'none';
    };

    // Node.js download function
    function downloadMovie(movieId) {
        fetch(`/download/${movieId}`)
            .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(new Blob([blob]));
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = 'movie.mp4';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            })
            .catch(() => alert('Download failed.'));
    }
});
