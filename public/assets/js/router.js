export function navigateToHome() {
  const mainContent = document.querySelector('main');
  if (!mainContent) return;

  // Charger le contenu de la home via htmx
  htmx.ajax('GET', '/', { target: 'main', swap: 'innerHTML' });

  // Mettre à jour le lien actif
  const links = document.querySelectorAll('.nav-link');
  links.forEach(link => link.classList.remove('active'));
  const homeLink = document.getElementById('home-link');
  if (homeLink) homeLink.classList.add('active');
}

// export function navigateToArticles() {
//   const mainContent = document.querySelector('main');
//   if (!mainContent) return;

//   htmx.ajax('GET', '/api/articles', { target: 'main', swap: 'innerHTML' });

//   const links = document.querySelectorAll('.nav-link');
//   links.forEach(link => link.classList.remove('active'));
//   const articlesLink = document.getElementById('articles-list-link');
//   if (articlesLink) articlesLink.classList.add('active');
// }
