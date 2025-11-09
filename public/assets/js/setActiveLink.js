function updateActiveLink() {
	// Get current path from address bar
	const currentPath = window.location.pathname;

	// Navigation link identifiers
	const linkMap = {
		'': 'home-link',
		'/articles': 'articles-link',
		// Other paths here...
	};

	// Remove 'active' class everywhere
	document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));

	// Adds 'active' class on the concerning link's path
	const linkIdToActivate = linkMap[currentPath];
	const activeLink = document.getElementById(linkIdToActivate);
	if (activeLink) {
		activeLink.classList.add('active');
	}
}

document.addEventListener('DOMContentLoaded', updateActiveLink);
if (window.htmx) {
	// Event is triggered after a successful request
	document.body.addEventListener('htmx:afterRequest', (evt) => {
		// Check if target is indeed the main content
		if (evt.detail.target.id === 'main-content') {
			updateActiveLink();
		}
	});
}
