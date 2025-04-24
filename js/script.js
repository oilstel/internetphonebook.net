document.addEventListener('DOMContentLoaded', () => {
    const video = document.querySelector('video');
    const muteButton = document.getElementById('mute-button');
    const pauseButton = document.getElementById('pause-button');

    // Only initialize video controls if elements exist
    if (video && muteButton && pauseButton) {
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
    }
    
    // Slideshow functionality
    initializeSlideshow();
}); 

// Initialize slideshow functionality
function initializeSlideshow() {
    const slideshow = document.getElementById('slideshow');
    const currentImageContainer = document.getElementById('current-image');
    const featuredImage = currentImageContainer ? currentImageContainer.querySelector('img') : null;
    const thumbnails = document.querySelectorAll('#slideshow #thumbs img');
    let currentIndex = 0;
    let slideshowInterval;

    // Exit if slideshow elements don't exist
    if (!slideshow || !featuredImage || thumbnails.length === 0) return;
    
    // Function to change the featured image (direct swap, no transition)
    function changeFeaturedImage(index) {
        // Simply update the image source
        featuredImage.src = thumbnails[index].src;
        featuredImage.alt = thumbnails[index].alt;
        
        // Update current index
        currentIndex = index;
        
        // Add active class to current thumbnail
        thumbnails.forEach((thumb, i) => {
            if (i === index) {
                thumb.classList.add('active');
            } else {
                thumb.classList.remove('active');
            }
        });
    }

    // Function to advance to the next slide
    function nextSlide() {
        let nextIndex = currentIndex + 1;
        if (nextIndex >= thumbnails.length) {
            nextIndex = 0; // Loop back to the first image
        }
        changeFeaturedImage(nextIndex);
    }

    // Start the slideshow
    function startSlideshow() {
        // Clear any existing interval
        if (slideshowInterval) {
            clearInterval(slideshowInterval);
        }
        
        // Start a new interval
        slideshowInterval = setInterval(nextSlide, 5000);
    }

    // Find initial thumbnail index matching the featured image source
    const initialSrc = featuredImage.src;
    let initialIndex = 0;
    thumbnails.forEach((thumb, i) => {
        if (thumb.src === initialSrc) {
            initialIndex = i;
            thumb.classList.add('active');
        }
    });
    
    // Store initial index
    currentIndex = initialIndex;

    // Start the slideshow without changing the initial image
    startSlideshow();

    // Add click event listeners to thumbnails
    thumbnails.forEach((thumb, index) => {
        thumb.addEventListener('click', () => {
            changeFeaturedImage(index);
            
            // Restart the slideshow from this point
            startSlideshow();
        });
    });
}