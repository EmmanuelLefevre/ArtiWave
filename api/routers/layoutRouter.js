/*=========================================*/
/*============ layoutRouter.js ============*/
/*=========================================*/


/*============ IMPORT USED MODULES ============*/
const express = require('express');

// Controller
const LayoutController = require('../controllers/layoutController');

// Middleware
const AllowedCurrentMethodCheck = require('../middleware/allowedCurrentMethodCheck');
const JwtCheck = require('../middleware/jwtCheck');


/*============ EXPRESS REDIRECT TO LAYOUT ============*/

class LayoutRouter {
	static init() {
		const router = express.Router();

		router.route('/')
      .all(AllowedCurrentMethodCheck(['GET']))
      .get(LayoutController.index);

    router.route('/home')
      .all(AllowedCurrentMethodCheck(['GET']))
      .get(LayoutController.index);

    router.route('/articles')
      .all(AllowedCurrentMethodCheck(['GET']))
      .get(JwtCheck, LayoutController.articlesPage);

		return router;
	}
}


/*============ EXPORT MODULE ============*/
module.exports = LayoutRouter.init();
