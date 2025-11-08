/*=============================================*/
/*============ layoutController.js ============*/
/*=============================================*/


/*============ SERVE INDEX FILE ============*/

class LayoutController {
	static index(_req, res) {
		res.render('index');
	}
}

/*============ EXPORT MODULE ============*/
module.exports = LayoutController;
