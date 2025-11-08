window.onload = function() {
    const navRightSection = document.querySelector('.nav-right-section');
    if (!navRightSection) return;

    navRightSection.innerHTML = '';
    if (getConnectionStatus()) {
        const logoutBtn = new LogoutButton();
        logoutBtn.createButton(navRightSection);
    }
    else {
        const loginBtn = new LoginButton();
        loginBtn.createButton(navRightSection);
    }
    if (window.htmx) {
        htmx.process(navRightSection);
    }
};
