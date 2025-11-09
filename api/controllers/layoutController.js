/*=============================================*/
/*============ layoutController.js ============*/
/*=============================================*/


/*============ IMPORT USED MODULES ============*/
const ArticleRepository = require('../repositories/articleRepository');
const UserRepository = require('../repositories/userRepository');


async function getAuthorNickname(authorId) {
  try {
    const user = await UserRepository.getUserById(authorId);
    return user ? user.nickname : 'Auteur inconnu';
  }
  catch (error) {
    console.error("Erreur lors de la récupération du pseudo:", error);
    return 'Auteur inconnu';
  }
}


class LayoutController {
  static index(req, res) {
    if (req.headers['hx-request']) {
      // HTMX request => return only the component
      res.render('components/home/home-component');
    }
    else {
      // Normal request => resend full page
      res.render('pages/home-wrapper');
    }
  }

  static async articlesPage(req, res, next) {
    try {
      // Get data for HTML
      let articles = await ArticleRepository.getAllArticles();

      // Format date in French
      const formatDate = (date) => date ? new Date(date).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) : 'Date inconnue';

      // Enrich articles with author information and dates
      const processedArticles = await Promise.all(articles.map(
        async (article) => {
          const authorNickname = await getAuthorNickname(article.author);
          const articleObject = article.toObject ? article.toObject() : article;

          // Add formated dates
          const createdAtFormatted = formatDate(articleObject.createdAt);
          const updatedAtFormatted = formatDate(articleObject.updatedAt);

          return {
            ...articleObject,
            authorNickname: authorNickname,
            createdAtFormatted: createdAtFormatted,
            updatedAtFormatted: updatedAtFormatted,
            authorId: article.author,
          };
        }
      ));

      const viewData = { articles: processedArticles };

      // Submit the correct template
      if (req.headers['hx-request']) {
        // HTMX request => return only the partial component
        res.render('components/articles/articles-component', viewData);
      }
      else {
        // RNormal request => resend full page
        res.render('pages/articles-wrapper', viewData);
      }
    }
    catch (err) {
      next(err);
    }
  }
}

module.exports = LayoutController;