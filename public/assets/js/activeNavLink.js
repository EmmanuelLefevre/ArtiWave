document.addEventListener('DOMContentLoaded', function() {
    var currentPath = window.location.pathname;
    var homePath = "/";
    var articlesPath = "/articles";

    // Function to add active class to the corresponding link
    function setActiveLink(linkId) {
        // Remove active class from all links
        var links = document.querySelectorAll('.nav-link');
        links.forEach(function(link) {
            link.classList.remove('active');
        });
        // Add active class to the specified link
        var activeLink = document.getElementById(linkId);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    // Check current path and call the setActiveLink function consequently
    if (currentPath === homePath) {
        setActiveLink('home-link');
    } else if (currentPath === articlesPath) {
        setActiveLink('articles-link');
    }

});
