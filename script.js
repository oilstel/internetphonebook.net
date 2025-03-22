document.addEventListener('DOMContentLoaded', () => {
    const video = document.querySelector('video');
    const muteButton = document.getElementById('mute-button');

    muteButton.addEventListener('click', () => {
        if (video.muted) {
            video.muted = false;
            muteButton.textContent = 'sound off';
        } else {
            video.muted = true;
            muteButton.textContent = 'sound';
        }
    });
}); 