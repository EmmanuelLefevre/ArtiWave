window.onload = function() {
    // If no artiwave_acces_token in local storage
    if (getConnectionStatus()) {
        // Create button instance
        const logoutButton = new LogoutButton();
        // Select login button
        const loginButton = document.getElementById('login-button');
        loginButton.replaceWith(logoutButton.render());
    }
};
