/* ========== BUTTON ==========*/

class Button {
  constructor(label, id, ariaLabel, buttonType) {
    this.button = document.createElement('button');
    this.button.setAttribute('id', id);
    this.button.setAttribute('aria-label', ariaLabel);
    this.button.setAttribute('type', buttonType);

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
    if (parentElement) {
      parentElement.replaceChild(newButton.button, this.button);
    }
  }
}


class LoginButton extends Button {
  constructor() {
    super('Connexion', 'login-button', 'Bouton vers le formulaire de connexion', 'submit');
    this.button.setAttribute('href', '#login');
    this.button.setAttribute('hx-get', '/login-component');
    this.button.setAttribute('hx-swap', 'outerHTML');
  }
}


class LogoutButton extends Button {
  constructor() {
    super('Déconnexion', 'logout-button', 'Bouton de déconnexion', 'button');
  }
}


class SubmitLoginFormButton extends Button {
  constructor() {
    super('Se connecter', 'submit-login-form-button', 'Bouton pour soumettre le formulaire de connexion', 'submit');
  }
}
