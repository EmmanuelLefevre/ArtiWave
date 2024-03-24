// Select disconnection button
const disconnectionButton = document.getElementById('disconnection-button');

document.getElementById('disconnection-button').addEventListener('clic', function() {
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

  // Replace disconnection button by login one
  disconnectionButton.parentNode.replaceChild(loginButton, disconnectionButton);
});