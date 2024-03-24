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