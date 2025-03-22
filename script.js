document.addEventListener('DOMContentLoaded', () => {
    const video = document.querySelector('video');
    const muteButton = document.getElementById('mute-button');
    const pauseButton = document.getElementById('pause-button');

    // Initialize button state for autoplay
    pauseButton.textContent = 'pause';

    // Mute button functionality
    muteButton.addEventListener('click', () => {
        if (video.muted) {
            video.muted = false;
            muteButton.textContent = 'sound off';
        } else {
            video.muted = true;
            muteButton.textContent = 'sound';
        }
    });

    // Pause button functionality
    pauseButton.addEventListener('click', () => {
        if (video.paused) {
            video.play();
            pauseButton.textContent = 'pause';
        } else {
            video.pause();
            pauseButton.textContent = 'play';
        }
    });
}); 