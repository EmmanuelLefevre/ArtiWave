/*=========================================*/
/*============ layoutRouter.js ============*/
/*=========================================*/


/*============ IMPORT USED MODULES ============*/
const express = require('express');

// Controller
const LayoutController = require('../controllers/layoutController');
const ArticlesController = require('../controllers/articlesController');

// Middleware
const AllowedCurrentMethodCheck = require('../middleware/allowedCurrentMethodCheck');


/*============ EXPRESS REDIRECT TO LAYOUT ============*/

class LayoutRouter {
	static init() {
		const router = express.Router();

		router.route('/')
			.all(AllowedCurrentMethodCheck(['GET']))
			.get(LayoutController.index);

		// Fragments
		router.route('/home-fragment')
      .all(AllowedCurrentMethodCheck(['GET']))
      .get(LayoutController.homeComponent);

    router.route('/articles-fragment')
      .all(AllowedCurrentMethodCheck(['GET']))
      .get(ArticlesController.articlesComponent);

		return router;
	}
}


/*============ EXPORT MODULE ============*/
module.exports = LayoutRouter.init();
