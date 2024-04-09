/*============================================*/
/*============ indexController.js ============*/
/*============================================*/


/*============ SERVE INDEX FILE ============*/

class IndexController {
	static index(_req, res) {
		res.render('index');
	}
}

/*============ EXPORT MODULE ============*/
module.exports = IndexController;
