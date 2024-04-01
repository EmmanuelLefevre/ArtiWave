document.addEventListener('DOMContentLoaded', function() {
	const currentPath = window.location.pathname;
	const homePath = "/";
	const articlesPath = "/articles";

	/* Active Link */
	// Function to add active class to the corresponding link
	function setActiveLink(linkId) {
		// Remove active class from all links
		const links = document.querySelectorAll('.nav-link');
		links.forEach(function(link) {
			link.classList.remove('active');
		});
		// Add active class to the specified link
		const activeLink = document.getElementById(linkId);
		if (activeLink) {
			activeLink.classList.add('active');
		}
	}

	// Check current path and call the setActiveLink function consequently
	if (currentPath === homePath) {
		setActiveLink('home-link');
	}
	else if (currentPath === articlesPath) {
		setActiveLink('articles-list-link');
	}

});
