const audio = new Audio();
let currentTrackIndex = 0;
let isPlaying = false;

// Generamos la lista de 13 pistas automáticamente
const playlist = Array.from({ length: 13 }, (_, i) => ({
    src: `./Audio/Pista_${i + 1}.mp3`,
    title: `Parte ${i + 1}`
}));

// Elementos del DOM
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const progressBar = document.getElementById('progress-bar');
const currentTimeEl = document.getElementById('current-time');
const durationTimeEl = document.getElementById('duration-time');
const trackTitle = document.getElementById('track-title');

function loadTrack(index) {
    const track = playlist[index];
    audio.src = track.src;
    trackTitle.textContent = track.title;
    
    if (isPlaying) {
        audio.play().catch(e => console.log("Esperando interacción del usuario..."));
    }
}

function togglePlay() {
    if (isPlaying) {
        audio.pause();
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
    } else {
        audio.play();
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    }
    isPlaying = !isPlaying;
}

function nextTrack() {
    if (currentTrackIndex < playlist.length - 1) {
        currentTrackIndex++;
        loadTrack(currentTrackIndex);
    } else {
        // Al terminar la última, vuelve a la primera y para
        currentTrackIndex = 0;
        isPlaying = false;
        loadTrack(currentTrackIndex);
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
}

function prevTrack() {
    if (audio.currentTime > 4) {
        audio.currentTime = 0;
    } else if (currentTrackIndex > 0) {
        currentTrackIndex--;
        loadTrack(currentTrackIndex);
    }
}

function updateProgress() {
    const { duration, currentTime } = audio;
    if (duration) {
        const progressPercent = (currentTime / duration) * 100;
        progressBar.value = progressPercent;
        currentTimeEl.textContent = formatTime(currentTime);
        durationTimeEl.textContent = formatTime(duration);
    }
}

function setProgress() {
    const duration = audio.duration;
    audio.currentTime = (progressBar.value / 100) * duration;
}

function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Event Listeners
playBtn.addEventListener('click', togglePlay);
nextBtn.addEventListener('click', nextTrack);
prevBtn.addEventListener('click', prevTrack);
audio.addEventListener('timeupdate', updateProgress);
progressBar.addEventListener('input', setProgress);
audio.addEventListener('ended', nextTrack);

// Carga inicial
loadTrack(currentTrackIndex);