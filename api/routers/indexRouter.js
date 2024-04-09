/*========================================*/
/*============ indexRouter.js ============*/
/*========================================*/


/*============ IMPORT USED MODULES ============*/
var express = require('express');

// Middleware
const AllowedCurrentMethodCheck = require('../middleware/allowedCurrentMethodCheck');


/*============ EXPRESS ROUTE FOR INDEX ============*/

class IndexRouter {
	static init() {
		// Express router
		const indexRouter = express.Router();

		indexRouter.route('/')
			.all(AllowedCurrentMethodCheck(['GET']))
				.get((_req, res) => {
					res.redirect('/home');
				});

		return indexRouter;
	}

}


/*============ EXPORT MODULE ============*/
module.exports = IndexRouter.init();
