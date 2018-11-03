/*global Vue, todoStorage */

(function (exports) {

	'use strict';

	var filters = {
		all: function (zadania) {
			return zadania;
		},
		active: function (zadania) {
			return zadania.filter(function (todo) {
				return !todo.completed;
			});
		},
		completed: function (zadania) {
			return zadania.filter(function (todo) {
				return todo.completed;
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
			visibility: 'all'
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
				return filters[this.visibility](this.zadania);
			},
			remaining: function () {
				return filters.active(this.zadania).length;
			},
			allDone: {
				get: function () {
					return this.remaining === 0;
				},
				set: function (value) {
					this.zadania.forEach(function (todo) {
						todo.completed = value;
					});
				}
			}
		},

		// methods that implement data logic.
		// note there's no DOM manipulation here at all.
		methods: {

			pluralize: function (word, count) {
				return word + (count === 1 ? '' : 's');
			},

			addTodo: function () {
				var value = this.noweZadanie && this.noweZadanie.trim();
				if (!value) {
					return;
				}
				this.zadania.push({ id: this.zadania.length + 1, title: value, completed: false });
				this.noweZadanie = '';
			},

			removeTodo: function (todo) {
				var index = this.zadania.indexOf(todo);
				this.zadania.splice(index, 1);
			},

			edycjaZadanie	: function (todo) {
				this.beforeEditCache = todo.title;
				this.poEdycjiZadanie = todo;
			},

			doneEdit: function (todo) {
				if (!this.poEdycjiZadanie) {
					return;
				}
				this.poEdycjiZadanie = null;
				todo.title = todo.title.trim();
				if (!todo.title) {
					this.removeTodo(todo);
				}
			},

			cancelEdit: function (todo) {
				this.poEdycjiZadanie = null;
				todo.title = this.beforeEditCache;
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
