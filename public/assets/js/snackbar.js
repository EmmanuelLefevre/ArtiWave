/* ========== SNACKBAR ==========*/

class Snackbar {
  constructor(message, snackbarInfoClass, ariaLabel, animationClass = null, duration = null) {
    this.snackbar = document.createElement('div');
    this.snackbar.textContent = message;

    this.snackbar.classList.add('snackbar');
    this.snackbar.classList.add(snackbarInfoClass);
    this.snackbar.setAttribute('aria-label', ariaLabel);

    if (animationClass) {
      this.snackbar.classList.add(animationClass);
    }
    this.duration = duration;
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
    super(message, 'snackbar-info', 'Notification d\'information', 'slide-left', 3000);
  }
}


class SnackbarSuccess extends Snackbar {
  constructor(message) {
    super(message, 'snackbar-success', 'Notification de validation', 'slide-bottom', 3000);
  }
}


class SnackbarWarning extends Snackbar {
  constructor(message) {
    super(message, 'snackbar-warning', 'Notification d\'avertissement', null, 3000);
  }
}


class SnackbarAlert extends Snackbar {
  constructor(message) {
    super(message, 'snackbar-alert', 'Notification d\'alerte', null, 3000);
  }
}
