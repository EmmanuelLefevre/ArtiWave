document.getElementById('loginForm').addEventListener('htmx:afterSwap', function(event) {
    // Check if request was successfull
    if (event.detail.xhr.status === 200) {
        // Get JSON response
        const response = JSON.parse(event.detail.xhr.responseText);

        // Get token from response
        const token = response.access_token;
        // Save token to local storage
        localStorage.setItem('access_token', token);

        // Get user nickname from response
        const userNickname = response.nickname;
        // Save user nickname to local storage
        localStorage.setItem('user_nickname', userNickname);
    }
    else if (event.detail.xhr.status === 401) {
        // Do something for bad credentials
    }
    else { //LoginLimiterError || InternalServerError || ResponseValidationError || UserNotFoundError || Unprocessable Entity
        // Do something
    }
});