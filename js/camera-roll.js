// Get query string
const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});

// Enter the Are.na channel slug here. It has to be an open or closed channel. Private channels are not supported.
let channel_title = 'photo-album-printing-the-internet-phone-book';

// Are.na's base API url
const api = 'https://api.are.na/v2/channels/';

// Get grid element from index.html
const thumbs_el = document.querySelector('#camera-roll #thumbs');

// Create loading indicator
const loadingEl = document.createElement('div');
loadingEl.id = 'loading';
loadingEl.innerHTML = '<p>...</p>';
document.body.appendChild(loadingEl);

let allImages = [];
let uniqueUrls = new Set();

// Function to create and append thumbnail elements
function createThumbnail(item) {
    if (item.class == 'Image' && !uniqueUrls.has(item.image.display.url)) {
        let thumb_el = document.createElement('div');
        thumb_el.classList.add('thumb');
        thumb_el.innerHTML = `<a href="https://are.na/block/${item.id}"><img src="${item.image.thumb.url}"></a>`;
        thumb_el.classList.add('image');
        
        // Add click listener immediately for each thumbnail
        thumb_el.addEventListener('click', e => {
            currentImageIndex = Array.from(thumbs_el.children).indexOf(thumb_el);
            showImage(currentImageIndex);
        });
        
        thumbs_el.appendChild(thumb_el);
        uniqueUrls.add(item.image.display.url);
        allImages.push(item);
    }
}

// Function to fetch a page of contents
async function fetchPage(page = 1, per = 100) {
    try {
        const response = await fetch(`${api}${channel_title}/contents?page=${page}&per=${per}&direction=desc`, {
            method: 'GET',
            headers: { 'Cache-Control': 'no-cache' }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching page:', error);
        return null;
    }
}

// Main function to fetch all contents
async function fetchAllContents() {
    let page = 1;
    let hasMore = true;
    
    while (hasMore) {
        const data = await fetchPage(page, 20);
        if (!data) break;
        
        data.contents.forEach(block => {
            createThumbnail(block);
        });

        // Set favicon using first image (only on first page)
        if (page === 1 && data.contents.length > 0) {
            const firstImage = data.contents[0];
            if (firstImage.class === 'Image') {
                const favicon = document.createElement('link');
                favicon.rel = 'icon';
                favicon.href = firstImage.image.thumb.url;
                document.head.appendChild(favicon);
            }
        }
        
        hasMore = data.contents.length === 20;
        page++;
    }
    
    // Hide loading element when done
    loadingEl.style.display = 'none';
    console.log(`Loaded ${allImages.length} unique images`);
}

// Start fetching contents
fetchAllContents();

// Add click listener for viewer to close it
const viewer = document.querySelector('#viewer');
const viewer_img = document.querySelector('#viewer img');

// Track current image index
let currentImageIndex = -1;

// Function to show image at specific index
function showImage(index) {
    const thumbs = Array.from(thumbs_el.children);
    if (index >= 0 && index < thumbs.length) {
        const img = thumbs[index].querySelector('img');
        viewer.style.display = 'flex';
        viewer_img.style.display = 'block';
        viewer_img.src = img.dataset.large;
        currentImageIndex = index;
    }
}

// Function to close viewer
function closeViewer() {
    viewer.style.display = 'none';
    viewer_img.src = '';
    currentImageIndex = -1;
}

// Add keyboard event listeners
document.addEventListener('keydown', (e) => {
    if (viewer.style.display === 'flex') {
        switch(e.key) {
            case 'Escape':
                closeViewer();
                break;
            case 'ArrowRight':
            case 'ArrowDown':
                showImage(currentImageIndex + 1);
                break;
            case 'ArrowLeft':
            case 'ArrowUp':
                showImage(currentImageIndex - 1);
                break;
        }
    }
});

// Update click handlers
viewer.addEventListener('click', closeViewer);