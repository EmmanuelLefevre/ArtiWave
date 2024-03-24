document.addEventListener('click', function(event) {
	// Check if the clicked item is the logout button
	if (event.target && event.target.closest('#logout-button')) {
		handleDisconnection();
	}
});

function handleDisconnection() {
	let loginButton;

	// Delete token from local storage
	deleteAccessToken();

	// Redirect to homepage
	window.location.href = '/';

	// Get login button
	loginButton = createLoginButton();

	// Select logout button
	const logoutButton = document.getElementById('logout-button');

	// Replace disconnection button by login one
	loginButton.parentNode.replaceChild(loginButton, logoutButton);
}

