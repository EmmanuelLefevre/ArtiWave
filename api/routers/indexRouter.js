/*========================================*/
/*============ indexRouter.js ============*/
/*========================================*/


/*============ IMPORT USED MODULES ============*/
var express = require('express');

// Controller
const IndexController = require('../controllers/indexController');

// Middleware
const AllowedCurrentMethodCheck = require('../middleware/allowedCurrentMethodCheck');


/*============ EXPRESS ROUTE FOR INDEX ============*/

class IndexRouter {
	static init() {
		// Express router
		const indexRouter = express.Router();

		indexRouter.route('/')
			.all(AllowedCurrentMethodCheck(['GET']))
			.get(IndexController.index);

		return indexRouter;
	}

}


/*============ EXPORT MODULE ============*/
module.exports = IndexRouter.init();
