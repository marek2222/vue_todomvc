/*global Vue, todoStorage */

(function (exports) {

	'use strict';

	var filtry = {
		wszystkie: function (zadania) {
			return zadania;
		},
		aktywne: function (zadania) {
			return zadania.filter(function (zadanie) {
				return !zadanie.ukonczone;
			});
		},
		completed: function (zadania) {
			return zadania.filter(function (zadanie) {
				return zadanie.ukonczone;
			});
		}
	};

	exports.app = new Vue({

		// the root element that will be compiled
		el: '.listazadan',

		// app initial state
		data: {
			zadania: skladZadan.fetch(),
			noweZadanie: '',
			poEdycjiZadanie: null,
			widocznosc: 'wszystkie'
		},

		// watch todos change for localStorage persistence
		watch: {
			zadania: {
				deep: true,
				handler: skladZadan.save
			}
		},

		// computed properties
		// http://vuejs.org/guide/computed.html
		computed: {
			filtrowaneZadania: function () {
				return filtry[this.widocznosc](this.zadania);
			},
			pozostalo: function () {
				return filtry.aktywne(this.zadania).length;
			},
			wszUkoncz: {
				get: function () {
					return this.pozostalo === 0;
				},
				set: function (value) {
					this.zadania.forEach(function (zadanie) {
						zadanie.ukonczone = value;
					});
				}
			}
		},

		// methods that implement data logic.
		// note there's no DOM manipulation here at all.
		methods: {

			liczbaMnoga: function (word, count) {
				return word + (count === 1 ? '' : '');
			},

			dodajZadanie: function () {
				var value = this.noweZadanie && this.noweZadanie.trim();
				if (!value) {
					return;
				}
				this.zadania.push({ id: this.zadania.length + 1, tytul: value, completed: false });
				this.noweZadanie = '';
			},

			usunZadanie: function (zadanie) {
				var index = this.zadania.indexOf(zadanie);
				this.zadania.splice(index, 1);
			},

			edycjaZadanie: function (zadanie) {
				this.przedEdycjaZadanie = zadanie.tytul;
				this.poEdycjiZadanie = zadanie;
			},

			poEdycji: function (zadanie) {
				if (!this.poEdycjiZadanie) {
					return;
				}
				this.poEdycjiZadanie = null;
				zadanie.tytul = zadanie.tytul.trim();
				if (!zadanie.tytul) {
					this.usunZadanie(zadanie);
				}
			},

			wycofajEdycje: function (zadanie) {
				this.poEdycjiZadanie = null;
				zadanie.tytul = this.przedEdycjaZadanie;
			},

			usunUkonczone: function () {
				this.zadania = filtry.aktywne(this.zadania);
			}
		},

		// a custom directive to wait for the DOM to be updated
		// before focusing on the input field.
		// http://vuejs.org/guide/custom-directive.html
		directives: {
			'todo-focus': function (el, binding) {
				if (binding.value) {
					el.focus();
				}
			}
		}
	});

})(window);
