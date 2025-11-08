export function navigateToHome() {
  const mainContent = document.querySelector('main');
  if (!mainContent) return;

  // Load home content via HTMX
  htmx.ajax('GET', '/home-fragment', { target: '#page-content', swap: 'innerHTML' });

  // Update active link
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
