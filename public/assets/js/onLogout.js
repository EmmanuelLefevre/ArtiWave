import { navigateToHome } from './router.js';

document.addEventListener('click', function(event) {
	// Check if the clicked item is the logout button
	const logoutBtn = event.target.closest('#logout-button');
	if (!logoutBtn) return;

	handleDisconnection();
});

function handleDisconnection() {
	// Get token
	const token = getAccessToken();

	// Decode token
  const decodedToken = parseToken(token);

	// Get nickname from decoded token
	const nickname = getNicknameFromToken(decodedToken);

	// Snackbar
	const infoSnackbar = new SnackbarInfo(`Au revoir ${nickname}.`);
  infoSnackbar.createSnackbar();

	// Delete token from local storage
	deleteAccessToken();

	// Redirect to homepage
	setTimeout(() => {
    navigateToHome();
  }, 500);
}
