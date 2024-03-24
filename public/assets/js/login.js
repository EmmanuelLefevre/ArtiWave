document.getElementById('login-form').addEventListener('htmx:afterSwap', function(event) {
    // Check if request was successfull
    if (event.detail.xhr.status === 200) {
        // Get JSON response
        const response = JSON.parse(event.detail.xhr.responseText);

        // Get token from response
        const token = response.access_token;
        // Save token to local storage
        setAccessToken(token);

        // Close the form
        const loginForm = document.getElementById('login-form');
        loginForm.parentNode.removeChild(loginForm);

        // Create the button element
        const disconnectionButton = document.createElement('button');
        disconnectionButton.setAttribute('id', 'disconnection-button');
        disconnectionButton.setAttribute('type', 'submit');
        disconnectionButton.setAttribute('aria-label', 'Bouton de déconnexion');

        // Create the span element for the label
        const spanLabel = document.createElement('span');
        spanLabel.textContent = 'Déconnexion';

        // Append the span to the button
        disconnectionButton.appendChild(spanLabel);

        // Add disconnect button to navigation bar
        const navRightSection = document.querySelector('.nav-right-section');
        navRightSection.appendChild(disconnectionButton);

    }
    else if (event.detail.xhr.status === 401) {
        // Do something for bad credentials
    }
    else { //LoginLimiterError || InternalServerError || ResponseValidationError || UserNotFoundError || Unprocessable Entity
        // Do something
    }
});