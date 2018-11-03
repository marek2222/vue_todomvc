/*global app, Router */

(function (app, Router) {

	'use strict';

	var router = new Router();

	['wszystkie', 'aktywne', 'completed'].forEach(function (widocznosc) {
		router.on(widocznosc, function () {
			app.widocznosc = widocznosc;
		});
	});

	router.configure({
		notfound: function () {
			window.location.hash = '';
			app.widocznosc = 'wszystkie';
		}
	});

	router.init();

})(app, Router);
