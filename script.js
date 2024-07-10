document.getElementById('email-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const formObject = { email: email };

    console.log(formObject);

    fetch('https://script.google.com/macros/s/AKfycbwhSojlnTGm-3fvSa3g1O9WYlFYF5ko_63a5JZCds8XHPvr-v_8f1aJJfFWmIQYTtYDtg/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(formObject).toString()
    }).then(response => {
        document.getElementById('email-form').innerHTML = `<p style="margin: 0;">Thank you! We will let you know when the Internet Phone Book is ready.</p>`;
    }).catch(error => {
        console.error('Error submitting form', error);
    });
});