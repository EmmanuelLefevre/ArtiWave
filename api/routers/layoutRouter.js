/*=========================================*/
/*============ layoutRouter.js ============*/
/*=========================================*/


/*============ IMPORT USED MODULES ============*/
var express = require('express');

// Controller
const LayoutController = require('../controllers/layoutController');

// Middleware
const AllowedCurrentMethodCheck = require('../middleware/allowedCurrentMethodCheck');


/*============ EXPRESS REDIRECT TO LAYOUT ============*/

class LayoutRouter {
	static init() {
		// Express router
		const layoutRouter = express.Router();

		layoutRouter.route('/')
			.all(AllowedCurrentMethodCheck(['GET']))
			.get(LayoutController.index);

		return layoutRouter;
	}
}


/*============ EXPORT MODULE ============*/
module.exports = LayoutRouter.init();
