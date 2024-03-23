document.addEventListener('DOMContentLoaded', function() {
    const closeIcon = document.getElementById('close-form-link');
    closeIcon.addEventListener('click', function() {
        // Perform an AJAX request to retrieve the initial content of the page
        fetch('/index.html')
            .then(response => response.text())
            .then(data => {
            // Replace current page content with initial content
            document.documentElement.innerHTML = data;
        })
        .catch(error => {
            console.error('Error retrieving initial page content :', error);
            // const errorMessage = document.createElement('div');
            // errorMessage.textContent = "Error retrieving initial page content!";
            // document.body.appendChild(errorMessage);
        });
    });
});