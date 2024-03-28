/* ========== SNACKBAR ==========*/

class Snackbar {
  constructor(message, id, snackbarClass, ariaLabel, animationClass = null, duration = null) {
    this.snackbar = document.createElement('div');
    this.snackbar.textContent = message;
    this.snackbar.setAttribute('id', id);
    this.snackbar.classList.add(snackbarClass);
    this.snackbar.setAttribute('aria-label', ariaLabel);
    if (duration) {
      this.duration = duration;
    }
    if (animationClass) {
      this.snackbar.classList.add(animationClass);
    }
  }

  // Create snackbar in DOM
  createSnackbar() {
    document.body.appendChild(this.snackbar);
    setTimeout(() => {
      this.snackbar.remove();
    },
    this.duration);
  }
}


class SnackbarInfo extends Snackbar {
  constructor(message) {
    super(message, 'snackbar', 'snackbar-info', 'Notification d\'information', 'slide-up', '3000');
  }
}


class SnackbarSuccess extends Snackbar {
  constructor(message) {
    super(message, 'snackbar', 'snackbar-success', 'Notification de validation');
  }
}


class SnackbarWarning extends Snackbar {
  constructor(message) {
    super(message, 'snackbar', 'snackbar-warning', 'Notification d\'avertissement');
  }
}


class SnackbarAlert extends Snackbar {
  constructor(message) {
    super(message, 'snackbar', 'snackbar-alert', 'Notification d\'alerte');
  }
}
