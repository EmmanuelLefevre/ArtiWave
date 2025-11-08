/* ========== BUTTON ==========*/

class Button {
  constructor(label, id, ariaLabel) {
    this.button = document.createElement('button');
    this.button.setAttribute('id', id);
    this.button.setAttribute('aria-label', ariaLabel);

    // Create label text
    const spanLabel = document.createElement('span');
    spanLabel.textContent = label;

    // Add span to button
    this.button.appendChild(spanLabel);
  }

  // Create button
  createButton(parentElement) {
    parentElement.appendChild(this.button);
  }

  // Replace button
  replaceButton(newButton) {
    const parentElement = this.button.parentNode;
    parentElement.replaceChild(newButton.button, this.button);
  }

}


class LoginButton extends Button {
  constructor() {
    super('Connexion', 'login-button', 'Bouton vers le formulaire de connexion');
    this.button.setAttribute('href', '#login');
    this.button.setAttribute('hx-get', '/api/login-component');
    this.button.setAttribute('hx-swap', 'outerHTML');
    this.button.setAttribute('type', 'submit');
  }
}


class LogoutButton extends Button {
  constructor() {
    super('Déconnexion', 'logout-button', 'Bouton de déconnexion');
    this.button.setAttribute('type', 'button');
  }

  // Render logout button in DOM
  render() {
    return this.button;
  }
}
