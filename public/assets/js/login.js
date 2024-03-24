document.getElementById('login-form').addEventListener('htmx:afterSwap', function(event) {
    let logoutButton;

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

        // Get logout button
        logoutButton = createLogoutButton();

        // Add disconnect button to navigation bar
        const button = document.querySelector('.nav-right-section');
        button.appendChild(logoutButton);

    }
    else if (event.detail.xhr.status === 401) {
        // Do something for bad credentials
    }
    else { //LoginLimiterError || InternalServerError || ResponseValidationError || UserNotFoundError || Unprocessable Entity
        // Do something
    }
});