/*jshint unused:false */

(function (exports) {

	'use strict';

	var STORAGE_KEY = 'todos-vuejs';

	exports.skladZadan = {
		fetch: function () {
			return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
		},
		save: function (zadania) {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(zadania));
		}
	};

})(window);
