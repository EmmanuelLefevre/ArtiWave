// Select form fields
const formInputs = document.querySelectorAll('input, textarea');

// Disable submit button
// ....

function validateInput(input) {
  if (input.hasAttribute('required')) {
    if (input.value.trim() === '') {
      // Display error message
      input.classList.add('headshake');
      return false;
    }
    else {
      // Remove any previous error messages
      input.classList.remove('headshake');
      return true;
    }
  }
  // Add other validations
  // Email & password regex, min length, max length ....
}
// Listen for change events on form fields
formInputs.forEach(input => {
  input.addEventListener('change', () => {
    validateInput(input);
  });
});


function validateForm() {
  let isValid = false;
  formInputs.forEach(input => {
    if (!validateInput(input)) {
      isValid = false;
    }
  });
  return isValid;
}
// Listen form submit event
const form = document.querySelector('form');
form.addEventListener('submit', (event) => {
  if (!validateForm()) {
    event.preventDefault();
    // Afficher un message d'erreur global si nécessaire
    alert('Veuillez remplir tous les champs obligatoires.');
  }
});