/* ========== BUTTON CLASS ==========*/

class Button {
  constructor(text, id, ariaLabel) {
    this.button = document.createElement('button');
    this.button.setAttribute('id', id);
    this.button.setAttribute('type', 'submit');
    this.button.setAttribute('aria-label', ariaLabel);

    // Create span text
    const spanLabel = document.createElement('span');
    spanLabel.textContent = text;

    // Add span to button
    this.button.appendChild(spanLabel);
  }

  // Create button method
  addButtonTo(parentElement) {
    parentElement.appendChild(this.button);
  }

  // Replace button method
  replaceButton(newButton) {
    const parentElement = this.button.parentNode;
    parentElement.replaceChild(newButton.button, this.button);
  }

}


class LoginButton extends Button {
  constructor() {
    super('Connexion', 'login-button', 'Bouton vers le formulaire de connexion');
    this.button.setAttribute('hx-get', '/login-component');
    this.button.setAttribute('hx-swap', 'outerHTML');
  }
}


class LogoutButton extends Button {
  constructor() {
    super('Déconnexion', 'logout-button', 'Bouton de déconnexion');
  }

  // Render logout button in DOM
  render() {
    return this.button;
  }
}