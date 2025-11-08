// document.addEventListener("DOMContentLoaded", () => {
//   const links = document.querySelectorAll(".nav-link");
//   const contentContainer = document.getElementById("page-content");

//   // Fonction pour charger une page
//   async function loadPage(url) {
//     try {
//       const res = await fetch(url);
//       const html = await res.text();
//       contentContainer.innerHTML = html;
//       // Met à jour la classe active
//       links.forEach(link => link.classList.remove("active"));
//       const activeLink = Array.from(links).find(link => link.getAttribute("href") === url);
//       if (activeLink) activeLink.classList.add("active");
//     }
// 		catch (err) {
//       contentContainer.innerHTML = "<p>Erreur lors du chargement de la page.</p>";
//       console.error(err);
//     }
//   }

//   // Par défaut, charger home.pug
//   loadPage("/home");

//   // Interception des clics sur les liens
//   links.forEach(link => {
//     link.addEventListener("click", e => {
//       e.preventDefault();
//       const url = link.getAttribute("href");
//       loadPage(url);
//     });
//   });
// });

document.addEventListener('DOMContentLoaded', function() {
	const currentPath = window.location.pathname;
	const homePath = "/";
	const articlesPath = "/articles";

	// Function to add active class to the corresponding link
	function setActiveLink(linkId) {
		// Remove active class from all links
		const links = document.querySelectorAll('.nav-link');
		links.forEach(function(link) {
			link.classList.remove('active');
		});
		// Add active class to the specified link
		const activeLink = document.getElementById(linkId);
		if (activeLink) {
			activeLink.classList.add('active');
		}
	}

	// Check current path and call the setActiveLink function consequently
	if (currentPath === homePath) {
		setActiveLink('home-link');
	}
	else if (currentPath === articlesPath) {
		setActiveLink('articles-list-link');
	}

});

// document.addEventListener("htmx:afterSwap", (event) => {
//   const links = document.querySelectorAll(".nav-link");
//   links.forEach(link => link.classList.remove("active"));

//   if (event.detail.target.id === "page-content") {
//     const url = event.detail.xhr.responseURL;
//     const activeLink = Array.from(links).find(link => link.href === url);
//     if (activeLink) activeLink.classList.add("active");
//   }
// });
