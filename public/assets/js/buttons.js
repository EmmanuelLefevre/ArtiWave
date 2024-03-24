function createLoginButton() {
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

  return loginButton;
}

function createLogoutButton() {
  // Create the button element
  const logoutButton = document.createElement('button');
  logoutButton.setAttribute('id', 'logout-button');
  logoutButton.setAttribute('type', 'submit');
  logoutButton.setAttribute('aria-label', 'Bouton de déconnexion');

  // Create the span element for the label
  const spanLabel = document.createElement('span');
  spanLabel.textContent = 'Déconnexion';

  // Append the span to the button
  logoutButton.appendChild(spanLabel);

  return logoutButton;
}
