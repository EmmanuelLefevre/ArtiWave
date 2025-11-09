// window.onload = function() {
//   const isConnected = getConnectionStatus();

//   const navRightSection = document.querySelector('.nav-right-section');
//   if (!navRightSection) return;

//   const articlesLink = document.getElementById('articles-link');

//   navRightSection.innerHTML = '';
//   if (isConnected) {
//     const logoutBtn = new LogoutButton();
//     logoutBtn.createButton(navRightSection);
//   }
//   else {
//     const loginBtn = new LoginButton();
//     loginBtn.createButton(navRightSection);
//   }

//   if (articlesLink) {
//     articlesLink.style.display = isConnected ? '' : 'none';
//     if (!isConnected) { articlesLink.remove(); }
//   }

//   if (window.htmx) {
//     htmx.process(navRightSection);
//   }
//   if (window.htmx) {
//     htmx.process(articlesLink);
//   }
// };

function updateNavigationDisplay() {
  const isConnected = getConnectionStatus();

  const navRightSection = document.querySelector('.nav-right-section');
  const articlesLink = document.getElementById('articles-link');

  if (navRightSection) {
    navRightSection.innerHTML = '';
    if (isConnected) {
      const logoutBtn = new LogoutButton();
      logoutBtn.createButton(navRightSection);
    }
    else {
      const loginBtn = new LoginButton();
      loginBtn.createButton(navRightSection);
    }
  }

  if (articlesLink) {
    articlesLink.style.display = isConnected ? '' : 'none';
  }

  if (window.htmx) {
    if (navRightSection) {
      htmx.process(navRightSection);
    }
  }

  if (typeof updateActiveLink === 'function') {
    updateActiveLink();
  }
}


window.onload = updateNavigationDisplay;
if (window.htmx) {
  document.body.addEventListener('authStatusChanged', () => {
    console.log("Mise à jour suite au Login/Logout.");
    updateNavigationDisplay();
  });
  // document.body.addEventListener('htmx:afterRequest', (evt) => {
  //   if (evt.detail.successful) {
  //     updateNavigationDisplay();
  //   }
  // });
  // document.body.addEventListener('htmx:afterOnLoad', (evt) => {
  //   if (evt.target.id === 'login-form' || evt.target.id === 'logout-button') {
  //     updateNavigationDisplay();
  //   }
  // });
}
