/*============================================*/
/*============ homeController.js ============*/
/*============================================*/


/*============ SERVE INDEX FILE ============*/

class HomeController {
	static index(_req, res) {
		res.render('index');
	}
}

/*============ EXPORT MODULE ============*/
module.exports = HomeController;
