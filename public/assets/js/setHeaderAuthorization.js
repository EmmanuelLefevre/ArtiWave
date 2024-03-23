document.addEventListener('DOMContentLoaded', function() {
    // Add access token to request as header
    htmx.on("htmx:configRequest", function(event) {
        // Get token
        const token = getAccessToken();

        // Check if token exists
        if (token) {
            // Build Authorization value
            let authorizationValue = `Bearer ${token}`;

            // Set authorization header in request
            event.detail.headers["Authorization"] = authorizationValue;
        }
        else {
            console.error("Access token is missing!");
        }
    });
});
