/*global Vue, todoStorage */

(function (exports) {

	'use strict';

	var filters = {
		all: function (zadania) {
			return zadania;
		},
		active: function (zadania) {
			return zadania.filter(function (zadanie) {
				return !zadanie.completed;
			});
		},
		completed: function (zadania) {
			return zadania.filter(function (zadanie) {
				return zadanie.completed;
			});
		}
	};

	exports.app = new Vue({

		// the root element that will be compiled
		el: '.listazadan',

		// app initial state
		data: {
			zadania: todoStorage.fetch(),
			noweZadanie: '',
			poEdycjiZadanie: null,
			widocznosc: 'all'
		},

		// watch todos change for localStorage persistence
		watch: {
			zadania: {
				deep: true,
				handler: todoStorage.save
			}
		},

		// computed properties
		// http://vuejs.org/guide/computed.html
		computed: {
			filteredTodos: function () {
				return filters[this.widocznosc](this.zadania);
			},
			pozostalo: function () {
				return filters.active(this.zadania).length;
			},
			allDone: {
				get: function () {
					return this.pozostalo === 0;
				},
				set: function (value) {
					this.zadania.forEach(function (zadanie) {
						zadanie.completed = value;
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

			addTodo: function () {
				var value = this.noweZadanie && this.noweZadanie.trim();
				if (!value) {
					return;
				}
				this.zadania.push({ id: this.zadania.length + 1, title: value, completed: false });
				this.noweZadanie = '';
			},

			removeTodo: function (zadanie) {
				var index = this.zadania.indexOf(zadanie);
				this.zadania.splice(index, 1);
			},

			edycjaZadanie: function (zadanie) {
				this.beforeEditCache = zadanie.title;
				this.poEdycjiZadanie = zadanie;
			},

			doneEdit: function (zadanie) {
				if (!this.poEdycjiZadanie) {
					return;
				}
				this.poEdycjiZadanie = null;
				zadanie.title = zadanie.title.trim();
				if (!zadanie.title) {
					this.removeTodo(zadanie);
				}
			},

			cancelEdit: function (zadanie) {
				this.poEdycjiZadanie = null;
				zadanie.title = this.beforeEditCache;
			},

			removeCompleted: function () {
				this.zadania = filters.active(this.zadania);
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
