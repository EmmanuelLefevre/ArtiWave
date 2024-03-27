/* ========== SNACKBAR ==========*/

class Snackbar {
  constructor(message, id, ariaLabel) {
    this.snackbar = document.createElement('div');
    this.snackbar.textContent = message;
    this.snackbar.setAttribute('id', id);
    this.snackbar.setAttribute('aria-label', ariaLabel);
  }

  // Create snackbar in DOM
  createSnackbar() {
    document.body.appendChild(this.snackbar);
  }
}


class SnackbarInfo extends Snackbar {
  constructor(message) {
    super(message, 'snackbar-info', 'Notification d\'information');
  }
}


class SnackbarWarning extends Snackbar {
  constructor(message) {
    super(message, 'snackbar-warning', 'Notification d\'avertissement');
  }
}


class SnackbarAlert extends Snackbar {
  constructor(message) {
    super(message, 'snackbar-alert', 'Notification d\'alerte');
  }
}
