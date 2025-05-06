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
    const callButton = form.querySelector('button[type="submit"]');
    let currentSite = null;

    // Clear function
    const clearAll = () => {
        input.value = '';
        result.innerHTML = `
                <p>Welcome to <i>dial-a-site</i></p>
                <p>Enter the site's number in the dial pad below</p>
        `;
        currentSite = null;
        callButton.classList.remove('pulse');
    };

    // Call function
    const makeCall = () => {
        if (currentSite) {
            window.open(currentSite.url, '_blank');
            clearAll();
            return true;
        }
        return false;
    };

    // Handle dial pad clicks
    dialPad.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            if (e.target.classList.contains('clear')) {
                clearAll();
            } else if (e.target.type === 'button') {
                input.value += e.target.textContent;
                result.innerHTML = `<p class="number-entered">${input.value}</p>`;
            }
        }
    });

    // Handle keyboard input
    document.addEventListener('keydown', (e) => {
        // If Escape is pressed, clear everything
        if (e.key === 'Escape') {
            clearAll();
            return;
        }

        // If Enter is pressed, either submit form or make call
        if (e.key === 'Enter') {
            if (!makeCall()) {
                form.requestSubmit();
            }
            return;
        }

        // If a number key is pressed and input is focused, let the default behavior happen
        if (document.activeElement === input) {
            return;
        }

        // If a number key is pressed (0-9), add it to input
        if (e.key >= '0' && e.key <= '9') {
            input.value += e.key;
            result.innerHTML = `<p class="number-entered">${input.value}</p>`;
        }
    });

    // Handle form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // If we have a current site, open its URL and reset
        if (makeCall()) return;

        const number = parseInt(input.value);
        input.value = ''; // Clear input after getting the number
        
        // Check if number is valid
        if (number < 1 || number > db.length) {
            result.innerHTML = `<div class="site-title">Invalid number</div>
                              <div class="site-url">Please enter a number between 1 and ${db.length}</div>`;
            currentSite = null;
            callButton.classList.remove('pulse');
            return;
        }

        // Get site info (subtract 1 from number since array is 0-based)
        currentSite = db[number - 1];
        
        // Display result and start pulsing
        result.innerHTML = `<div class="site-title">${currentSite.title}</div>
                          <div class="site-url"><a href="${currentSite.url}" target="_blank">${currentSite.url}</a></div>
                          <div class="visit-button"><a href="${currentSite.url}" target="_blank">Visit</a></div>`;
        callButton.classList.add('pulse');
    });
}

// Start the app
init();
