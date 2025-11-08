import { navigateToHome } from './router.js';

document.addEventListener('click', function(event) {
	const logoutBtnEl = event.target.closest('#logout-button');
	if (!logoutBtnEl) return;

	const logoutBtn = new LogoutButton();
  logoutBtn.button = logoutBtnEl;

	handleDisconnection(logoutBtn);
});

function handleDisconnection(logoutBtn) {
	// Get token
	const token = getAccessToken();

	// Decode token
	const decodedToken = parseToken(token);

	// Get nickname
	const nickname = getNicknameFromToken(decodedToken);

	// Snackbar
	const infoSnackbar = new SnackbarInfo(`Au revoir ${nickname}.`);
	infoSnackbar.createSnackbar();

	// Delete token from local storage
	deleteAccessToken();

	// New connexion button
	const loginBtn = new LoginButton();
	logoutBtn.replaceButton(loginBtn);

	// Force HTMX to process the new button
	if (window.htmx) {
		htmx.process(loginBtn.button);
	}

	// Redirect to homepage if not on /home
	if (window.location.pathname !== '/home') {
		setTimeout(() => {
			navigateToHome();
		}, 500);
	}
}
