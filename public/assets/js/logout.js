document.addEventListener('click', function(event) {
	// Check if the clicked item is the logout button
	if (event.target && event.target.closest('#logout-button')) {
		handleDisconnection();
	}
});

function handleDisconnection() {
	// Delete token from local storage
	deleteAccessToken();

	// Redirect to homepage
	window.location.href = '/';

	// Create the button element
	const loginButton = document.createElement('button');
	loginButton.setAttribute('hx-get', '/login-component');
	loginButton.setAttribute('hx-swap', 'outerHTML');
	loginButton.setAttribute('id', 'login-button');
	loginButton.setAttribute('type', 'submit');
	loginButton.setAttribute('aria-label', 'Bouton vers le formulaire de connexion');

	// Create the span element for the label
	const spanLabel = document.createElement('span');
	spanLabel.textContent = 'Connexion';

	// Append the span to the button
	loginButton.appendChild(spanLabel);

	// Select logout button
	const logoutButton = document.getElementById('logout-button');

	// Replace disconnection button by login one
	loginButton.parentNode.replaceChild(loginButton, logoutButton);
}

