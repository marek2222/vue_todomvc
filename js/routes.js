/*global app, Router */

(function (app, Router) {

	'use strict';

	var router = new Router();

	['all', 'active', 'completed'].forEach(function (widocznosc) {
		router.on(widocznosc, function () {
			app.widocznosc = widocznosc;
		});
	});

	router.configure({
		notfound: function () {
			window.location.hash = '';
			app.widocznosc = 'all';
		}
	});

	router.init();

})(app, Router);
