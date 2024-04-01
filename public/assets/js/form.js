class FormValidator {
  constructor(form, fields) {
    this.form = form;
    this.fields = fields;
  }

  initialize() {
    this.validateOnEntry();
    this.validateOnSubmit();
  }

  validateOnSubmit() {
    let self = this;
    this.form.addEventListener('submit', e => {
      e.preventDefault();
      self.fields.forEach(field => {
        const input = document.querySelector(`#${field}`);
        // Check if fields are empty first
        if (input.value.trim() === "") {
          const labelvalue = input.nextElementSibling.nextElementSibling.innerText;
          self.setStatus(input, `${labelvalue} cannot be blank!`, "error");
        }
        else {
          // If not empty, then proceed with other validations
          self.validateFields(input);
        }
      });
    });
  }

  validateOnEntry() {
    let self = this;
    this.fields.forEach(field => {
      const input = document.querySelector(`#${field}`);

      input.addEventListener('input', _event => {
        self.validateFields(input);
      });
    });
  }

  validateFields(field) {
    // Check for valid email
    if (field.type === "email") {
      const regex = /\S+@\S+\.\S+/;
      if (regex.test(field.value)) {
        this.setStatus(field, null, "success");
      }
      else {
        this.setStatus(field, "Invalid email!", "error");
      }
    }

    // Check for valid password
    if (field.id === "password") {
      const password = field.value;
      let error = null;

      switch (true) {
        case !/[A-Z]/.test(password):
          error = "One uppercase!";
          break;
        case !/[a-z]/.test(password):
          error = "One lowercase!";
          break;
        case !/[0-9]/.test(password):
          error = "One number!";
          break;
        case !/[:;.~µ!?§@#$%^&*]/.test(password):
          error = "One special character!";
          break;
        case password.length < 8:
          error = "Password too short!";
          break;
        case password.length > 24:
          error = "Password too long!";
          break;
        default:
          break;
      }

      // Set status based on errors
      if (error !== null) {
        this.setStatus(field, error, "error");
      }
      else {
        this.setStatus(field, null, "success");
      }
    }
  }

  setStatus(field, message, status) {
    const successIcon = field.parentElement.querySelector('.icon-success');
    const errorIcon = field.parentElement.querySelector('.icon-error');
    const errorMessage = document.querySelector(`#error-${field.id}`);

    if (status === 'success') {
      if (errorIcon) {
        errorIcon.classList.add('hidden');
      }
      if (errorMessage) {
        errorMessage.innerText = '';
        field.classList.remove('headshake');
        field.classList.remove('invalid');
        field.classList.add('valid');
      }
      successIcon.classList.remove('hidden');
    }

    if (status === 'error') {
      if (successIcon) {
        successIcon.classList.add('hidden');
      }
      if (message) {
        errorMessage.innerText = message;
        field.classList.add('headshake');
        field.classList.add('invalid');
        field.classList.remove('valid');
      }
      errorIcon.classList.remove('hidden');
    }
  }
}

const form = document.querySelector('.form');
const fields = ["email", "password"];

const validator = new FormValidator(form, fields);
validator.initialize();
