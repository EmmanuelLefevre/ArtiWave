/*=============================================*/
/*============ layoutController.js ============*/
/*=============================================*/


/*============ SERVE INDEX FILE ============*/

class LayoutController {
	static index(_req, res) {
    res.render('main-content');
  }

	static homeComponent(_req, res) {
    res.render('components/home/home-component', { layout: false });
  }

	static articlesComponent(_req, res) {
    res.render('components/articles/articles-component', { layout: false });
  }
}

/*============ EXPORT MODULE ============*/
module.exports = LayoutController;
