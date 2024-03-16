document.getElementById('loginForm').addEventListener('htmx:afterSwap', function(event) {
    // Check if request was successfull
    if (event.detail.xhr.status === 200) {
        // Get JSON response
        const response = JSON.parse(event.detail.xhr.responseText);

        // Get JWT from response
        const jwt = response.access_token;
        // Save JWT to local storage
        localStorage.setItem('jwt', jwt);

        // Get user nickname from response
        const nickname = response.nickname;
        // Save nickname to local storage
        localStorage.setItem('nickname', nickname);
    }
    // else {

    // }
});