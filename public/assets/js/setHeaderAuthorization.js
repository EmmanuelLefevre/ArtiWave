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

// document.addEventListener('DOMContentLoaded', function() {
//     // Attacher l'événement de clic à un élément parent existant
//     document.addEventListener('click', function(event) {
//         // Vérifier si l'élément cliqué est le bouton "articles-list"
//         if (event.target && event.target.id === 'articles-list') {
//             // Add access token to request as header
//             htmx.on("htmx:configRequest", function(event) {
//                 // Get token
//                 const token = getAccessToken();

//                 // Check if token exists
//                 if (token) {
//                     // Build Authorization value
//                     let authorizationValue = `Bearer ${token}`;

//                     // Set authorization header in request
//                     event.detail.headers["Authorization"] = authorizationValue;
//                 }
//                 else {
//                     console.error("Access token is missing!");
//                 }
//             });
//         }
//     });
// });

