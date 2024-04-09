/*=======================================*/
/*============ homeRouter.js ============*/
/*=======================================*/


/*============ IMPORT USED MODULES ============*/
var express = require('express');

// Controller
const HomeController = require('../controllers/homeController');

// Middleware
const AllowedCurrentMethodCheck = require('../middleware/allowedCurrentMethodCheck');


/*============ EXPRESS REDIRECT TO HOME============*/

class HomeRouter {
	static init() {
		// Express router
		const homeRouter = express.Router();

		homeRouter.route('/')
			.all(AllowedCurrentMethodCheck(['GET']))
			.get(HomeController.index);

		return homeRouter;
	}

}


/*============ EXPORT MODULE ============*/
module.exports = HomeRouter.init();
