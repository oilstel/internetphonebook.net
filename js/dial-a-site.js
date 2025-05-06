// Fetch the database
async function fetchDatabase() {
    const response = await fetch('../data/ipb-db.json');
    return await response.json();
}

// Initialize the page
async function init() {
    const db = await fetchDatabase();
    const form = document.getElementById('dial-form');
    const input = document.getElementById('site-number');
    const dialPad = document.getElementById('dial-pad');
    const result = document.getElementById('result');
    let currentSite = null;

    // Create audio element for keypad sound
    const keypadSound = new Audio('data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAAzIyMzUAVFNTRQAAAA8AAANMYXZmNTcuODMuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV');
    
    // Play keypad sound
    const playKeypadSound = () => {
        keypadSound.currentTime = 0;
        keypadSound.play().catch(e => console.log('Audio play failed:', e));
    };

    // Clear function
    const clearAll = () => {
        input.value = '';
        result.innerHTML = `
            <p>Welcome to <i>dial-a-site</i></p>
            <p>Enter the site's number in the dial pad below</p>
        `;
        currentSite = null;
    };

    // Lookup and display site
    const lookupSite = (number) => {
        if (number < 1 || number > db.length) {
            result.innerHTML = `<div class="site-title">Invalid number</div>
                              <div class="site-url">Please enter a number between 1 and ${db.length}</div>`;
            currentSite = null;
            return false;
        }

        currentSite = db[number - 1];
        result.innerHTML = `<div class="site-title">${currentSite.title}</div>
                          <div class="site-url"><a href="${currentSite.url}" target="_blank">${currentSite.url}</a></div>
                          <div class="visit-button"><a href="${currentSite.url}" target="_blank">Visit</a></div>`;
        return true;
    };

    // Handle dial pad clicks
    dialPad.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            if (e.target.classList.contains('clear')) {
                clearAll();
            } else if (e.target.type === 'button') {
                input.value += e.target.textContent;
                result.innerHTML = `<p class="number-entered">${input.value}</p>`;
                playKeypadSound();
            }
        }
    });

    // Handle keyboard input
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            clearAll();
            return;
        }

        if (e.key === 'Enter') {
            form.requestSubmit();
            return;
        }

        if (document.activeElement === input) {
            return;
        }

        if (e.key >= '0' && e.key <= '9') {
            input.value += e.key;
            result.innerHTML = `<p class="number-entered">${input.value}</p>`;
            playKeypadSound();
        }
    });

    // Handle form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const number = parseInt(input.value);
        input.value = '';

        if (lookupSite(number)) {
            // Don't open the site automatically, just show it
            // The user will need to click the Visit button to open it
        }
    });

    // Handle visit button clicks
    result.addEventListener('click', (e) => {
        if (e.target.classList.contains('visit-button') || e.target.closest('.visit-button')) {
            if (currentSite) {
                window.open(currentSite.url, '_blank');
            }
        }
    });
}

// Start the app
init();
