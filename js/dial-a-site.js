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
    let audioContext = null;

    // DTMF frequencies
    const rowFreqs = [697, 770, 852, 941];  // Row frequencies
    const colFreqs = [1209, 1336, 1477, 1633];  // Column frequencies
    
    // Initialize audio context
    const initAudio = () => {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    };

    // Play DTMF tone
    const playDTMF = (digit) => {
        initAudio(); // Initialize audio on any button press
        if (!audioContext) return; // Don't play if audio not initialized
        
        if (!digit || digit === '*') digit = '10';
        if (digit === '#') digit = '11';
        if (digit === '0') digit = '12';
        
        const num = parseInt(digit) - 1;
        const row = Math.floor(num / 3);
        const col = num % 3;
        
        const oscillator1 = audioContext.createOscillator();
        const oscillator2 = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator1.type = 'sine';
        oscillator2.type = 'sine';
        
        oscillator1.frequency.value = rowFreqs[row];
        oscillator2.frequency.value = colFreqs[col];
        
        oscillator1.connect(gainNode);
        oscillator2.connect(gainNode);
        gainNode.connect(audioContext.destination);
        gainNode.gain.value = 0.1;
        
        oscillator1.start();
        oscillator2.start();
        
        setTimeout(() => {
            oscillator1.stop();
            oscillator2.stop();
        }, 100);
    };

    // Create audio element for keypad sound
    const keypadSound = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU');
    keypadSound.src = '../sounds/dtmf.mp3';  // You'll need to add this sound file

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
            <p>Enter the site's number in the dial pad below.</p>
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
                playDTMF(e.target.textContent);
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
            playDTMF(e.key);
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
