/**
 * sifter.js
 * Copyright (c) 2013 Brian Reavis & contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
 * file except in compliance with the License. You may obtain a copy of the License at:
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
 * ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 *
 * @author Brian Reavis <brian@thirdroute.com>
 */

(function(root, factory) {
	if (typeof define === 'function' && define.amd) {
		define(factory);
	} else if (typeof exports === 'object') {
		module.exports = factory();
	} else {
		root.Sifter = factory();
	}
}(this, function() {

	/**
	 * Textually searches arrays and hashes of objects
	 * by property (or multiple properties). Designed
	 * specifically for autocomplete.
	 *
	 * @constructor
	 * @param {array|object} items
	 * @param {object} items
	 */
	var Sifter = function(items, settings) {
		this.items = items;
		this.settings = settings || {diacritics: true};
	};

	/**
	 * Splits a search string into an array of individual
	 * regexps to be used to match results.
	 *
	 * @param {string} query
	 * @returns {array}
	 */
	Sifter.prototype.tokenize = function(query) {
		query = trim(String(query || '').toLowerCase());
		if (!query || !query.length) return [];

		var i, n, regex, letter;
		var tokens = [];
		var words = query.split(/ +/);

		for (i = 0, n = words.length; i < n; i++) {
			regex = escape_regex(words[i]);
			if (this.settings.diacritics) {
				for (letter in DIACRITICS) {
					if (DIACRITICS.hasOwnProperty(letter)) {
						regex = regex.replace(new RegExp(letter, 'g'), DIACRITICS[letter]);
					}
				}
			}
			tokens.push({
				string : words[i],
				regex  : new RegExp(regex, 'i')
			});
		}

		return tokens;
	};

	/**
	 * Iterates over arrays and hashes.
	 *
	 * ```
	 * this.iterator(this.items, function(item, id) {
	 *    // invoked for each item
	 * });
	 * ```
	 *
	 * @param {array|object} object
	 */
	Sifter.prototype.iterator = function(object, callback) {
		var iterator;
		if (is_array(object)) {
			iterator = Array.prototype.forEach || function(callback) {
				for (var i = 0, n = this.length; i < n; i++) {
					callback(this[i], i, this);
				}
			};
		} else {
			iterator = function(callback) {
				for (var key in this) {
					if (this.hasOwnProperty(key)) {
						callback(this[key], key, this);
					}
				}
			};
		}

		iterator.apply(object, [callback]);
	};

	/**
	 * Returns a function to be used to score individual results.
	 *
	 * Good matches will have a higher score than poor matches.
	 * If an item is not a match, 0 will be returned by the function.
	 *
	 * @param {object|string} search
	 * @param {object} options (optional)
	 * @returns {function}
	 */
	Sifter.prototype.getScoreFunction = function(search, options) {
		var self, fields, tokens, token_count;

		self        = this;
		search      = self.prepareSearch(search, options);
		tokens      = search.tokens;
		fields      = search.options.fields;
		token_count = tokens.length;

		/**
		 * Calculates how close of a match the
		 * given value is against a search token.
		 *
		 * @param {mixed} value
		 * @param {object} token
		 * @return {number}
		 */
		var scoreValue = function(value, token) {
			var score, pos;

			if (!value) return 0;
			value = String(value || '');
			pos = value.search(token.regex);
			if (pos === -1) return 0;
			score = token.string.length / value.length;
			if (pos === 0) score += 0.5;
			return score;
		};

		/**
		 * Calculates the score of an object
		 * against the search query.
		 *
		 * @param {object} token
		 * @param {object} data
		 * @return {number}
		 */
		var scoreObject = (function() {
			var field_count = fields.length;
			if (!field_count) {
				return function() { return 0; };
			}
			if (field_count === 1) {
				return function(token, data) {
					return scoreValue(data[fields[0]], token);
				};
			}
			return function(token, data) {
				for (var i = 0, sum = 0; i < field_count; i++) {
					sum += scoreValue(data[fields[i]], token);
				}
				return sum / field_count;
			};
		})();

		if (!token_count) {
			return function() { return 0; };
		}
		if (token_count === 1) {
			return function(data) {
				return scoreObject(tokens[0], data);
			};
		}
		return function(data) {
			for (var i = 0, sum = 0; i < token_count; i++) {
				sum += scoreObject(tokens[i], data);
			}
			return sum / token_count;
		};
	};

	/**
	 * Parses a search query and returns an object
	 * with tokens and fields ready to be populated
	 * with results.
	 *
	 * @param {string} query
	 * @param {object} options
	 * @returns {object}
	 */
	Sifter.prototype.prepareSearch = function(query, options) {
		if (typeof query === 'object') return query;
		return {
			options : extend({}, options),
			query   : String(query || '').toLowerCase(),
			tokens  : this.tokenize(query),
			total   : 0,
			items   : []
		};
	};

	/**
	 * Searches through all items and returns a sorted array of matches.
	 *
	 * The `options` parameter can contain:
	 *
	 *   - fields {string|array}
	 *   - sort {string}
	 *   - direction {string}
	 *   - score {function}
	 *   - limit {integer}
	 *
	 * Returns an object containing:
	 *
	 *   - options {object}
	 *   - query {string}
	 *   - tokens {array}
	 *   - total {int}
	 *   - items {array}
	 *
	 * @param {string} query
	 * @param {object} options
	 * @returns {object}
	 */
	Sifter.prototype.search = function(query, options) {
		var self = this, value, score, search, calculateScore;

		search  = this.prepareSearch(query, options);
		options = search.options;
		query   = search.query;

		// generate result scoring function
		if (!is_array(options.fields)) options.fields = [options.fields];
		calculateScore = options.score || self.getScoreFunction(search);

		// perform search and sort
		if (query.length) {
			self.iterator(self.items, function(item, id) {
				score = calculateScore(item);
				if (score > 0) {
					search.items.push({'score': score, 'id': id});
				}
			});
			search.items.sort(function(a, b) {
				return b.score - a.score;
			});
		} else {
			self.iterator(self.items, function(item, id) {
				search.items.push({'score': 1, 'id': id});
			});
			if (options.sort) {
				search.items.sort((function() {
					var field = options.sort;
					var multiplier = options.direction === 'desc' ? -1 : 1;
					return function(a, b) {
						return cmp(self.items[a.id][field], self.items[b.id][field]) * multiplier;
					};
				})());
			}
		}

		// apply limits
		search.total = search.items.length;
		if (typeof options.limit === 'number') {
			search.items = search.items.slice(0, options.limit);
		}

		return search;
	};

	// utilities
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	var cmp = function(a, b) {
		if (typeof a === 'number' && typeof b === 'number') {
			return a > b ? 1 : (a < b ? -1 : 0);
		}
		a = String(a || '').toLowerCase();
		b = String(b || '').toLowerCase();
		if (a > b) return 1;
		if (b > a) return -1;
		return 0;
	};

	var extend = function(a, b) {
		var i, n, k, object;
		for (i = 1, n = arguments.length; i < n; i++) {
			object = arguments[i];
			if (!object) continue;
			for (k in object) {
				if (object.hasOwnProperty(k)) {
					a[k] = object[k];
				}
			}
		}
		return a;
	};

	var trim = function(str) {
		return (str + '').replace(/^\s+|\s+$|/g, '');
	};

	var escape_regex = function(str) {
		return (str + '').replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
	};

	var is_array = Array.isArray || ($ && $.isArray) || function(object) {
		return Object.prototype.toString.call(object) === '[object Array]';
	};

	var DIACRITICS = {
		'a': '[aÀÁÂÃÄÅàáâãäå]',
		'c': '[cÇç]',
		'e': '[eÈÉÊËèéêë]',
		'i': '[iÌÍÎÏìíîï]',
		'n': '[nÑñ]',
		'o': '[oÒÓÔÕÕÖØòóôõöø]',
		's': '[sŠš]',
		'u': '[uÙÚÛÜùúûü]',
		'y': '[yŸÿý]',
		'z': '[zŽž]'
	};

	// export
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	return Sifter;

}));/**
 * microplugin.js
 * Copyright (c) 2013 Brian Reavis & contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
 * file except in compliance with the License. You may obtain a copy of the License at:
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
 * ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 *
 * @author Brian Reavis <brian@thirdroute.com>
 */

(function(root, factory) {
	if (typeof define === 'function' && define.amd) {
		define(factory);
	} else if (typeof exports === 'object') {
		module.exports = factory();
	} else {
		root.MicroPlugin = factory();
	}
}(this, function() {
	var MicroPlugin = {};

	MicroPlugin.mixin = function(Interface) {
		Interface.plugins = {};

		/**
		 * Initializes the listed plugins (with options).
		 * Acceptable formats:
		 *
		 * List (without options):
		 *   ['a', 'b', 'c']
		 *
		 * List (with options):
		 *   [{'name': 'a', options: {}}, {'name': 'b', options: {}}]
		 *
		 * Hash (with options):
		 *   {'a': { ... }, 'b': { ... }, 'c': { ... }}
		 *
		 * @param {mixed} plugins
		 */
		Interface.prototype.initializePlugins = function(plugins) {
			var i, n, key;
			var self  = this;
			var queue = [];

			self.plugins = {
				names     : [],
				settings  : {},
				requested : {},
				loaded    : {}
			};

			if (utils.isArray(plugins)) {
				for (i = 0, n = plugins.length; i < n; i++) {
					if (typeof plugins[i] === 'string') {
						queue.push(plugins[i]);
					} else {
						self.plugins.settings[plugins[i].name] = plugins[i].options;
						queue.push(plugins[i].name);
					}
				}
			} else if (plugins) {
				for (key in plugins) {
					if (plugins.hasOwnProperty(key)) {
						self.plugins.settings[key] = plugins[key];
						queue.push(key);
					}
				}
			}

			while (queue.length) {
				self.require(queue.shift());
			}
		};

		Interface.prototype.loadPlugin = function(name) {
			var self    = this;
			var plugins = self.plugins;
			var plugin  = Interface.plugins[name];

			if (!Interface.plugins.hasOwnProperty(name)) {
				throw new Error('Unable to find "' +  name + '" plugin');
			}

			plugins.requested[name] = true;
			plugins.loaded[name] = plugin.fn.apply(self, [self.plugins.settings[name] || {}]);
			plugins.names.push(name);
		};

		/**
		 * Initializes a plugin.
		 *
		 * @param {string} name
		 */
		Interface.prototype.require = function(name) {
			var self = this;
			var plugins = self.plugins;

			if (!self.plugins.loaded.hasOwnProperty(name)) {
				if (plugins.requested[name]) {
					throw new Error('Plugin has circular dependency ("' + name + '")');
				}
				self.loadPlugin(name);
			}

			return plugins.loaded[name];
		};

		/**
		 * Registers a plugin.
		 *
		 * @param {string} name
		 * @param {function} fn
		 */
		Interface.define = function(name, fn) {
			Interface.plugins[name] = {
				'name' : name,
				'fn'   : fn
			};
		};
	};

	var utils = {
		isArray: Array.isArray || function(vArg) {
			return Object.prototype.toString.call(vArg) === '[object Array]';
		}
	};

	return MicroPlugin;
}));/**
 * selectize.js (v0.7.7)
 * Copyright (c) 2013 Brian Reavis & contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
 * file except in compliance with the License. You may obtain a copy of the License at:
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
 * ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 *
 * @author Brian Reavis <brian@thirdroute.com>
 */

/*jshint curly:false */
/*jshint browser:true */

(function(root, factory) {
	if (typeof define === 'function' && define.amd) {
		define(['jquery','sifter','microplugin'], factory);
	} else {
		root.Selectize = factory(root.jQuery, root.Sifter, root.MicroPlugin);
	}
}(this, function($, Sifter, MicroPlugin) {
	'use strict';

	var highlight = function($element, pattern) {
		if (typeof pattern === 'string' && !pattern.length) return;
		var regex = (typeof pattern === 'string') ? new RegExp(pattern, 'i') : pattern;
	
		var highlight = function(node) {
			var skip = 0;
			if (node.nodeType === 3) {
				var pos = node.data.search(regex);
				if (pos >= 0 && node.data.length > 0) {
					var match = node.data.match(regex);
					var spannode = document.createElement('span');
					spannode.className = 'highlight';
					var middlebit = node.splitText(pos);
					var endbit = middlebit.splitText(match[0].length);
					var middleclone = middlebit.cloneNode(true);
					spannode.appendChild(middleclone);
					middlebit.parentNode.replaceChild(spannode, middlebit);
					skip = 1;
				}
			} else if (node.nodeType === 1 && node.childNodes && !/(script|style)/i.test(node.tagName)) {
				for (var i = 0; i < node.childNodes.length; ++i) {
					i += highlight(node.childNodes[i]);
				}
			}
			return skip;
		};
	
		return $element.each(function() {
			highlight(this);
		});
	};
	
	var MicroEvent = function() {};
	MicroEvent.prototype = {
		on: function(event, fct){
			this._events = this._events || {};
			this._events[event] = this._events[event] || [];
			this._events[event].push(fct);
		},
		off: function(event, fct){
			var n = arguments.length;
			if (n === 0) return delete this._events;
			if (n === 1) return delete this._events[event];
	
			this._events = this._events || {};
			if (event in this._events === false) return;
			this._events[event].splice(this._events[event].indexOf(fct), 1);
		},
		trigger: function(event /* , args... */){
			this._events = this._events || {};
			if (event in this._events === false) return;
			for (var i = 0; i < this._events[event].length; i++){
				this._events[event][i].apply(this, Array.prototype.slice.call(arguments, 1));
			}
		}
	};
	
	/**
	 * Mixin will delegate all MicroEvent.js function in the destination object.
	 *
	 * - MicroEvent.mixin(Foobar) will make Foobar able to use MicroEvent
	 *
	 * @param {object} the object which will support MicroEvent
	 */
	MicroEvent.mixin = function(destObject){
		var props = ['on', 'off', 'trigger'];
		for (var i = 0; i < props.length; i++){
			destObject.prototype[props[i]] = MicroEvent.prototype[props[i]];
		}
	};
	
	var IS_MAC        = /Mac/.test(navigator.userAgent);
	
	var KEY_A         = 65;
	var KEY_COMMA     = 188;
	var KEY_RETURN    = 13;
	var KEY_ESC       = 27;
	var KEY_LEFT      = 37;
	var KEY_UP        = 38;
	var KEY_RIGHT     = 39;
	var KEY_DOWN      = 40;
	var KEY_BACKSPACE = 8;
	var KEY_DELETE    = 46;
	var KEY_SHIFT     = 16;
	var KEY_CMD       = IS_MAC ? 91 : 17;
	var KEY_CTRL      = IS_MAC ? 18 : 17;
	var KEY_TAB       = 9;
	
	var TAG_SELECT    = 1;
	var TAG_INPUT     = 2;
	
	var isset = function(object) {
		return typeof object !== 'undefined';
	};
	
	/**
	 * Converts a scalar to its best string representation
	 * for hash keys and HTML attribute values.
	 *
	 * Transformations:
	 *   'str'     -> 'str'
	 *   null      -> ''
	 *   undefined -> ''
	 *   true      -> '1'
	 *   false     -> '0'
	 *   0         -> '0'
	 *   1         -> '1'
	 *
	 * @param {string} value
	 * @returns {string}
	 */
	var hash_key = function(value) {
		if (typeof value === 'undefined' || value === null) return '';
		if (typeof value === 'boolean') return value ? '1' : '0';
		return value + '';
	};
	
	/**
	 * Escapes a string for use within HTML.
	 *
	 * @param {string} str
	 * @returns {string}
	 */
	var escape_html = function(str) {
		return (str + '')
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;');
	};
	
	var hook = {};
	
	/**
	 * Wraps `method` on `self` so that `fn`
	 * is invoked before the original method.
	 *
	 * @param {object} self
	 * @param {string} method
	 * @param {function} fn
	 */
	hook.before = function(self, method, fn) {
		var original = self[method];
		self[method] = function() {
			fn.apply(self, arguments);
			return original.apply(self, arguments);
		};
	};
	
	/**
	 * Wraps `method` on `self` so that `fn`
	 * is invoked after the original method.
	 *
	 * @param {object} self
	 * @param {string} method
	 * @param {function} fn
	 */
	hook.after = function(self, method, fn) {
		var original = self[method];
		self[method] = function() {
			var result = original.apply(self, arguments);
			fn.apply(self, arguments);
			return result;
		};
	};
	
	/**
	 * Builds a hash table out of an array of
	 * objects, using the specified `key` within
	 * each object.
	 *
	 * @param {string} key
	 * @param {mixed} objects
	 */
	var build_hash_table = function(key, objects) {
		if (!$.isArray(objects)) return objects;
		var i, n, table = {};
		for (i = 0, n = objects.length; i < n; i++) {
			if (objects[i].hasOwnProperty(key)) {
				table[objects[i][key]] = objects[i];
			}
		}
		return table;
	};
	
	/**
	 * Wraps `fn` so that it can only be invoked once.
	 *
	 * @param {function} fn
	 * @returns {function}
	 */
	var once = function(fn) {
		var called = false;
		return function() {
			if (called) return;
			called = true;
			fn.apply(this, arguments);
		};
	};
	
	/**
	 * Wraps `fn` so that it can only be called once
	 * every `delay` milliseconds (invoked on the falling edge).
	 *
	 * @param {function} fn
	 * @param {int} delay
	 * @returns {function}
	 */
	var debounce = function(fn, delay) {
		var timeout;
		return function() {
			var self = this;
			var args = arguments;
			window.clearTimeout(timeout);
			timeout = window.setTimeout(function() {
				fn.apply(self, args);
			}, delay);
		};
	};
	
	/**
	 * Debounce all fired events types listed in `types`
	 * while executing the provided `fn`.
	 *
	 * @param {object} self
	 * @param {array} types
	 * @param {function} fn
	 */
	var debounce_events = function(self, types, fn) {
		var type;
		var trigger = self.trigger;
		var event_args = {};
	
		// override trigger method
		self.trigger = function() {
			var type = arguments[0];
			if (types.indexOf(type) !== -1) {
				event_args[type] = arguments;
			} else {
				return trigger.apply(self, arguments);
			}
		};
	
		// invoke provided function
		fn.apply(self, []);
		self.trigger = trigger;
	
		// trigger queued events
		for (type in event_args) {
			if (event_args.hasOwnProperty(type)) {
				trigger.apply(self, event_args[type]);
			}
		}
	};
	
	/**
	 * A workaround for http://bugs.jquery.com/ticket/6696
	 *
	 * @param {object} $parent - Parent element to listen on.
	 * @param {string} event - Event name.
	 * @param {string} selector - Descendant selector to filter by.
	 * @param {function} fn - Event handler.
	 */
	var watchChildEvent = function($parent, event, selector, fn) {
		$parent.on(event, selector, function(e) {
			var child = e.target;
			while (child && child.parentNode !== $parent[0]) {
				child = child.parentNode;
			}
			e.currentTarget = child;
			return fn.apply(this, [e]);
		});
	};
	
	/**
	 * Determines the current selection within a text input control.
	 * Returns an object containing:
	 *   - start
	 *   - length
	 *
	 * @param {object} input
	 * @returns {object}
	 */
	var getSelection = function(input) {
		var result = {};
		if ('selectionStart' in input) {
			result.start = input.selectionStart;
			result.length = input.selectionEnd - result.start;
		} else if (document.selection) {
			input.focus();
			var sel = document.selection.createRange();
			var selLen = document.selection.createRange().text.length;
			sel.moveStart('character', -input.value.length);
			result.start = sel.text.length - selLen;
			result.length = selLen;
		}
		return result;
	};
	
	/**
	 * Copies CSS properties from one element to another.
	 *
	 * @param {object} $from
	 * @param {object} $to
	 * @param {array} properties
	 */
	var transferStyles = function($from, $to, properties) {
		var i, n, styles = {};
		if (properties) {
			for (i = 0, n = properties.length; i < n; i++) {
				styles[properties[i]] = $from.css(properties[i]);
			}
		} else {
			styles = $from.css();
		}
		$to.css(styles);
	};
	
	/**
	 * Measures the width of a string within a
	 * parent element (in pixels).
	 *
	 * @param {string} str
	 * @param {object} $parent
	 * @returns {int}
	 */
	var measureString = function(str, $parent) {
		var $test = $('<test>').css({
			position: 'absolute',
			top: -99999,
			left: -99999,
			width: 'auto',
			padding: 0,
			whiteSpace: 'nowrap'
		}).text(str).appendTo('body');
	
		transferStyles($parent, $test, [
			'letterSpacing',
			'fontSize',
			'fontFamily',
			'fontWeight',
			'textTransform'
		]);
	
		var width = $test.width();
		$test.remove();
	
		return width;
	};
	
	/**
	 * Sets up an input to grow horizontally as the user
	 * types. If the value is changed manually, you can
	 * trigger the "update" handler to resize:
	 *
	 * $input.trigger('update');
	 *
	 * @param {object} $input
	 */
	var autoGrow = function($input) {
		var update = function(e) {
			var value, keyCode, printable, placeholder, width;
			var shift, character, selection;
			e = e || window.event || {};
	
			if (e.metaKey || e.altKey) return;
			if ($input.data('grow') === false) return;
	
			value = $input.val();
			if (e.type && e.type.toLowerCase() === 'keydown') {
				keyCode = e.keyCode;
				printable = (
					(keyCode >= 97 && keyCode <= 122) || // a-z
					(keyCode >= 65 && keyCode <= 90)  || // A-Z
					(keyCode >= 48 && keyCode <= 57)  || // 0-9
					keyCode === 32 // space
				);
	
				if (keyCode === KEY_DELETE || keyCode === KEY_BACKSPACE) {
					selection = getSelection($input[0]);
					if (selection.length) {
						value = value.substring(0, selection.start) + value.substring(selection.start + selection.length);
					} else if (keyCode === KEY_BACKSPACE && selection.start) {
						value = value.substring(0, selection.start - 1) + value.substring(selection.start + 1);
					} else if (keyCode === KEY_DELETE && typeof selection.start !== 'undefined') {
						value = value.substring(0, selection.start) + value.substring(selection.start + 1);
					}
				} else if (printable) {
					shift = e.shiftKey;
					character = String.fromCharCode(e.keyCode);
					if (shift) character = character.toUpperCase();
					else character = character.toLowerCase();
					value += character;
				}
			}
	
			placeholder = $input.attr('placeholder') || '';
			if (!value.length && placeholder.length) {
				value = placeholder;
			}
	
			width = measureString(value, $input) + 4;
			if (width !== $input.width()) {
				$input.width(width);
				$input.triggerHandler('resize');
			}
		};
	
		$input.on('keydown keyup update blur', update);
		update();
	};
	
	var Selectize = function($input, settings) {
		var key, i, n, self = this;
		$input[0].selectize = self;
	
		// setup default state
		$.extend(self, {
			settings         : settings,
			$input           : $input,
			tagType          : $input[0].tagName.toLowerCase() === 'select' ? TAG_SELECT : TAG_INPUT,
	
			eventNS          : '.selectize' + (++Selectize.count),
			highlightedValue : null,
			isOpen           : false,
			isDisabled       : false,
			isLocked         : false,
			isFocused        : false,
			isInputFocused   : false,
			isInputHidden    : false,
			isSetup          : false,
			isShiftDown      : false,
			isCmdDown        : false,
			isCtrlDown       : false,
			ignoreFocus      : false,
			ignoreHover      : false,
			hasOptions       : false,
			currentResults   : null,
			lastValue        : '',
			caretPos         : 0,
			loading          : 0,
			loadedSearches   : {},
	
			$activeOption    : null,
			$activeItems     : [],
	
			optgroups        : {},
			options          : {},
			userOptions      : {},
			items            : [],
			renderCache      : {},
			onSearchChange   : debounce(self.onSearchChange, settings.loadThrottle)
		});
	
		// search system
		self.sifter = new Sifter(this.options, {diacritics: settings.diacritics});
	
		// build options table
		$.extend(self.options, build_hash_table(settings.valueField, settings.options));
		delete self.settings.options;
	
		// build optgroup table
		$.extend(self.optgroups, build_hash_table(settings.optgroupValueField, settings.optgroups));
		delete self.settings.optgroups;
	
		// option-dependent defaults
		self.settings.mode = self.settings.mode || (self.settings.maxItems === 1 ? 'single' : 'multi');
		if (typeof self.settings.hideSelected !== 'boolean') {
			self.settings.hideSelected = self.settings.mode === 'multi';
		}
	
		self.initializePlugins(self.settings.plugins);
		self.setupCallbacks();
		self.setupTemplates();
		self.setup();
	};
	
	// mixins
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	
	MicroEvent.mixin(Selectize);
	MicroPlugin.mixin(Selectize);
	
	// methods
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	
	$.extend(Selectize.prototype, {
	
		/**
		 * Creates all elements and sets up event bindings.
		 */
		setup: function() {
			var self      = this;
			var settings  = self.settings;
			var eventNS   = self.eventNS;
			var $window   = $(window);
			var $document = $(document);
	
			var $wrapper;
			var $control;
			var $control_input;
			var $dropdown;
			var $dropdown_content;
			var $dropdown_parent;
			var inputMode;
			var timeout_blur;
			var timeout_focus;
			var tab_index;
			var classes;
			var classes_plugins;
	
			inputMode         = self.settings.mode;
			tab_index         = self.$input.attr('tabindex') || '';
			classes           = self.$input.attr('class') || '';
	
			$wrapper          = $('<div>').addClass(settings.wrapperClass).addClass(classes).addClass(inputMode);
			$control          = $('<div>').addClass(settings.inputClass).addClass('items').appendTo($wrapper);
			$control_input    = $('<input type="text">').appendTo($control).attr('tabindex', tab_index);
			$dropdown_parent  = $(settings.dropdownParent || $wrapper);
			$dropdown         = $('<div>').addClass(settings.dropdownClass).addClass(classes).addClass(inputMode).hide().appendTo($dropdown_parent);
			$dropdown_content = $('<div>').addClass(settings.dropdownContentClass).appendTo($dropdown);
	
			$wrapper.css({
				width: self.$input[0].style.width
			});
	
			if (self.plugins.names.length) {
				classes_plugins = 'plugin-' + self.plugins.names.join(' plugin-');
				$wrapper.addClass(classes_plugins);
				$dropdown.addClass(classes_plugins);
			}
	
			if ((settings.maxItems === null || settings.maxItems > 1) && self.tagType === TAG_SELECT) {
				self.$input.attr('multiple', 'multiple');
			}
	
			if (self.settings.placeholder) {
				$control_input.attr('placeholder', settings.placeholder);
			}
	
			self.$wrapper          = $wrapper;
			self.$control          = $control;
			self.$control_input    = $control_input;
			self.$dropdown         = $dropdown;
			self.$dropdown_content = $dropdown_content;
	
			$control.on('mousedown', function(e) {
				if (!e.isDefaultPrevented()) {
					window.setTimeout(function() {
						self.focus(true);
					}, 0);
				}
			});
	
			// necessary for mobile webkit devices (manual focus triggering
			// is ignored unless invoked within a click event)
			$control.on('click', function(e) {
				if (!self.isInputFocused) {
					self.focus(true);
				}
			});
	
			$dropdown.on('mouseenter', '[data-selectable]', function() { return self.onOptionHover.apply(self, arguments); });
			$dropdown.on('mousedown', '[data-selectable]', function() { return self.onOptionSelect.apply(self, arguments); });
			watchChildEvent($control, 'mousedown', '*:not(input)', function() { return self.onItemSelect.apply(self, arguments); });
			autoGrow($control_input);
	
			$control_input.on({
				mousedown : function(e) { e.stopPropagation(); },
				keydown   : function() { return self.onKeyDown.apply(self, arguments); },
				keyup     : function() { return self.onKeyUp.apply(self, arguments); },
				keypress  : function() { return self.onKeyPress.apply(self, arguments); },
				resize    : function() { self.positionDropdown.apply(self, []); },
				blur      : function() { return self.onBlur.apply(self, arguments); },
				focus     : function() { return self.onFocus.apply(self, arguments); }
			});
	
			$document.on('keydown' + eventNS, function(e) {
				self.isCmdDown = e[IS_MAC ? 'metaKey' : 'ctrlKey'];
				self.isCtrlDown = e[IS_MAC ? 'altKey' : 'ctrlKey'];
				self.isShiftDown = e.shiftKey;
			});
	
			$document.on('keyup' + eventNS, function(e) {
				if (e.keyCode === KEY_CTRL) self.isCtrlDown = false;
				if (e.keyCode === KEY_SHIFT) self.isShiftDown = false;
				if (e.keyCode === KEY_CMD) self.isCmdDown = false;
			});
	
			$document.on('mousedown' + eventNS, function(e) {
				if (self.isFocused) {
					// prevent events on the dropdown scrollbar from causing the control to blur
					if (e.target === self.$dropdown[0] || e.target.parentNode === self.$dropdown[0]) {
						var ignoreFocus = self.ignoreFocus;
						self.ignoreFocus = true;
						window.setTimeout(function() {
							self.ignoreFocus = ignoreFocus;
							self.focus(false);
						}, 0);
						return;
					}
					// blur on click outside
					if (!self.$control.has(e.target).length && e.target !== self.$control[0]) {
						self.blur();
					}
				}
			});
	
			$window.on(['scroll' + eventNS, 'resize' + eventNS].join(' '), function() {
				if (self.isOpen) {
					self.positionDropdown.apply(self, arguments);
				}
			});
			$window.on('mousemove' + eventNS, function() {
				self.ignoreHover = false;
			});
	
			self.$input.attr('tabindex',-1).hide().after(self.$wrapper);
	
			if ($.isArray(settings.items)) {
				self.setValue(settings.items);
				delete settings.items;
			}
	
			self.updateOriginalInput();
			self.refreshItems();
			self.refreshClasses();
			self.updatePlaceholder();
			self.isSetup = true;
	
			if (self.$input.is(':disabled')) {
				self.disable();
			}
	
			self.on('change', this.onChange);
			self.trigger('initialize');
	
			// preload options
			if (settings.preload) {
				self.onSearchChange('');
			}
		},
	
		/**
		 * Sets up default rendering functions.
		 */
		setupTemplates: function() {
			var self = this;
			var field_label = self.settings.labelField;
			var field_optgroup = self.settings.optgroupLabelField;
	
			var templates = {
				'optgroup': function(data) {
					return '<div class="optgroup">' + data.html + '</div>';
				},
				'optgroup_header': function(data, escape) {
					return '<div class="optgroup-header">' + escape(data[field_optgroup]) + '</div>';
				},
				'option': function(data, escape) {
					return '<div class="option">' + escape(data[field_label]) + '</div>';
				},
				'item': function(data, escape) {
					return '<div class="item">' + escape(data[field_label]) + '</div>';
				},
				'option_create': function(data, escape) {
					return '<div class="create">Add <strong>' + escape(data.input) + '</strong>&hellip;</div>';
				},
			};
	
			self.settings.render = $.extend({}, templates, self.settings.render);
		},
	
		/**
		 * Maps fired events to callbacks provided
		 * in the settings used when creating the control.
		 */
		setupCallbacks: function() {
			var key, fn, callbacks = {
				'initialize'     : 'onInitialize',
				'change'         : 'onChange',
				'item_add'       : 'onItemAdd',
				'item_remove'    : 'onItemRemove',
				'clear'          : 'onClear',
				'option_add'     : 'onOptionAdd',
				'option_remove'  : 'onOptionRemove',
				'option_clear'   : 'onOptionClear',
				'dropdown_open'  : 'onDropdownOpen',
				'dropdown_close' : 'onDropdownClose',
				'type'           : 'onType'
			};
	
			for (key in callbacks) {
				if (callbacks.hasOwnProperty(key)) {
					fn = this.settings[callbacks[key]];
					if (fn) this.on(key, fn);
				}
			}
		},
	
		/**
		 * Triggered when the value of the control has been changed.
		 * This should propagate the event to the original DOM
		 * input / select element.
		 */
		onChange: function() {
			this.$input.trigger('change');
		},
	
		/**
		 * Triggered on <input> keypress.
		 *
		 * @param {object} e
		 * @returns {boolean}
		 */
		onKeyPress: function(e) {
			if (this.isLocked) return e && e.preventDefault();
			var character = String.fromCharCode(e.keyCode || e.which);
			if (this.settings.create && character === this.settings.delimiter) {
				this.createItem();
				e.preventDefault();
				return false;
			}
		},
	
		/**
		 * Triggered on <input> keydown.
		 *
		 * @param {object} e
		 * @returns {boolean}
		 */
		onKeyDown: function(e) {
			var isInput = e.target === this.$control_input[0];
			var self = this;
	
			if (self.isLocked) {
				if (e.keyCode !== KEY_TAB) {
					e.preventDefault();
				}
				return;
			}
	
			switch (e.keyCode) {
				case KEY_A:
					if (self.isCmdDown) {
						self.selectAll();
						return;
					}
					break;
				case KEY_ESC:
					self.blur();
					return;
				case KEY_DOWN:
					if (!self.isOpen && self.hasOptions) {
						self.open();
					} else if (self.$activeOption) {
						self.ignoreHover = true;
						var $next = self.getAdjacentOption(self.$activeOption, 1);
						if ($next.length) self.setActiveOption($next, true, true);
					}
					e.preventDefault();
					return;
				case KEY_UP:
					if (self.$activeOption) {
						self.ignoreHover = true;
						var $prev = self.getAdjacentOption(self.$activeOption, -1);
						if ($prev.length) self.setActiveOption($prev, true, true);
					}
					e.preventDefault();
					return;
				case KEY_RETURN:
					if (self.$activeOption) {
						self.onOptionSelect({currentTarget: self.$activeOption});
					}
					e.preventDefault();
					return;
				case KEY_LEFT:
					self.advanceSelection(-1, e);
					return;
				case KEY_RIGHT:
					self.advanceSelection(1, e);
					return;
				case KEY_TAB:
					if (self.settings.create && $.trim(self.$control_input.val()).length) {
						self.createItem();
						e.preventDefault();
					}
					return;
				case KEY_BACKSPACE:
				case KEY_DELETE:
					self.deleteSelection(e);
					return;
			}
			if (self.isFull() || self.isInputHidden) {
				e.preventDefault();
				return;
			}
		},
	
		/**
		 * Triggered on <input> keyup.
		 *
		 * @param {object} e
		 * @returns {boolean}
		 */
		onKeyUp: function(e) {
			var self = this;
	
			if (self.isLocked) return e && e.preventDefault();
			var value = self.$control_input.val() || '';
			if (self.lastValue !== value) {
				self.lastValue = value;
				self.onSearchChange(value);
				self.refreshOptions();
				self.trigger('type', value);
			}
		},
	
		/**
		 * Invokes the user-provide option provider / loader.
		 *
		 * Note: this function is debounced in the Selectize
		 * constructor (by `settings.loadDelay` milliseconds)
		 *
		 * @param {string} value
		 */
		onSearchChange: function(value) {
			var self = this;
			var fn = self.settings.load;
			if (!fn) return;
			if (self.loadedSearches.hasOwnProperty(value)) return;
			self.loadedSearches[value] = true;
			self.load(function(callback) {
				fn.apply(self, [value, callback]);
			});
		},
	
		/**
		 * Triggered on <input> focus.
		 *
		 * @param {object} e (optional)
		 * @returns {boolean}
		 */
		onFocus: function(e) {
			var self = this;
	
			self.isInputFocused = true;
			self.isFocused = true;
			if (self.isDisabled) {
				self.blur();
				e.preventDefault();
				return false;
			}
	
			if (self.ignoreFocus) return;
			if (self.settings.preload === 'focus') self.onSearchChange('');
	
			self.showInput();
			self.setActiveItem(null);
			self.refreshOptions(!!self.settings.openOnFocus);
			self.refreshClasses();
		},
	
		/**
		 * Triggered on <input> blur.
		 *
		 * @param {object} e
		 * @returns {boolean}
		 */
		onBlur: function(e) {
			var self = this;
			self.isInputFocused = false;
			if (self.ignoreFocus) return;
	
			self.close();
			self.setTextboxValue('');
			self.setActiveItem(null);
			self.setActiveOption(null);
			self.setCaret(self.items.length);
			self.isFocused = false;
			self.refreshClasses();
		},
	
		/**
		 * Triggered when the user rolls over
		 * an option in the autocomplete dropdown menu.
		 *
		 * @param {object} e
		 * @returns {boolean}
		 */
		onOptionHover: function(e) {
			if (this.ignoreHover) return;
			this.setActiveOption(e.currentTarget, false);
		},
	
		/**
		 * Triggered when the user clicks on an option
		 * in the autocomplete dropdown menu.
		 *
		 * @param {object} e
		 * @returns {boolean}
		 */
		onOptionSelect: function(e) {
			var value, $target, $option, self = this;
	
			e.preventDefault && e.preventDefault();
			e.stopPropagation && e.stopPropagation();
			self.focus(false);
	
			$target = $(e.currentTarget);
			if ($target.hasClass('create')) {
				self.createItem();
			} else {
				value = $target.attr('data-value');
				if (value) {
					self.setTextboxValue('');
					self.addItem(value);
					if (!self.settings.hideSelected && e.type && /mouse/.test(e.type)) {
						self.setActiveOption(self.getOption(value));
					}
				}
			}
		},
	
		/**
		 * Triggered when the user clicks on an item
		 * that has been selected.
		 *
		 * @param {object} e
		 * @returns {boolean}
		 */
		onItemSelect: function(e) {
			var self = this;
	
			if (self.settings.mode === 'multi') {
				e.preventDefault();
				self.setActiveItem(e.currentTarget, e);
				self.focus(false);
				self.hideInput();
			}
		},
	
		/**
		 * Invokes the provided method that provides
		 * results to a callback---which are then added
		 * as options to the control.
		 *
		 * @param {function} fn
		 */
		load: function(fn) {
			var self = this;
			var $wrapper = self.$wrapper.addClass('loading');
	
			self.loading++;
			fn.apply(self, [function(results) {
				self.loading = Math.max(self.loading - 1, 0);
				if (results && results.length) {
					self.addOption(results);
					self.refreshOptions(false);
					if (self.isInputFocused) self.open();
				}
				if (!self.loading) {
					$wrapper.removeClass('loading');
				}
				self.trigger('load', results);
			}]);
		},
	
		/**
		 * Sets the input field of the control to the specified value.
		 *
		 * @param {string} value
		 */
		setTextboxValue: function(value) {
			this.$control_input.val(value).triggerHandler('update');
			this.lastValue = value;
		},
	
		/**
		 * Returns the value of the control. If multiple items
		 * can be selected (e.g. <select multiple>), this returns
		 * an array. If only one item can be selected, this
		 * returns a string.
		 *
		 * @returns {mixed}
		 */
		getValue: function() {
			if (this.tagType === TAG_SELECT && this.$input.attr('multiple')) {
				return this.items;
			} else {
				return this.items.join(this.settings.delimiter);
			}
		},
	
		/**
		 * Resets the selected items to the given value.
		 *
		 * @param {mixed} value
		 */
		setValue: function(value) {
			debounce_events(this, ['change'], function() {
				this.clear();
				var items = $.isArray(value) ? value : [value];
				for (var i = 0, n = items.length; i < n; i++) {
					this.addItem(items[i]);
				}
			});
		},
	
		/**
		 * Sets the selected item.
		 *
		 * @param {object} $item
		 * @param {object} e (optional)
		 */
		setActiveItem: function($item, e) {
			var self = this;
			var eventName;
			var i, idx, begin, end, item, swap;
			var $last;
	
			$item = $($item);
	
			// clear the active selection
			if (!$item.length) {
				$(self.$activeItems).removeClass('active');
				self.$activeItems = [];
				self.isFocused = self.isInputFocused;
				return;
			}
	
			// modify selection
			eventName = e && e.type.toLowerCase();
	
			if (eventName === 'mousedown' && self.isShiftDown && self.$activeItems.length) {
				$last = self.$control.children('.active:last');
				begin = Array.prototype.indexOf.apply(self.$control[0].childNodes, [$last[0]]);
				end   = Array.prototype.indexOf.apply(self.$control[0].childNodes, [$item[0]]);
				if (begin > end) {
					swap  = begin;
					begin = end;
					end   = swap;
				}
				for (i = begin; i <= end; i++) {
					item = self.$control[0].childNodes[i];
					if (self.$activeItems.indexOf(item) === -1) {
						$(item).addClass('active');
						self.$activeItems.push(item);
					}
				}
				e.preventDefault();
			} else if ((eventName === 'mousedown' && self.isCtrlDown) || (eventName === 'keydown' && this.isShiftDown)) {
				if ($item.hasClass('active')) {
					idx = self.$activeItems.indexOf($item[0]);
					self.$activeItems.splice(idx, 1);
					$item.removeClass('active');
				} else {
					self.$activeItems.push($item.addClass('active')[0]);
				}
			} else {
				$(self.$activeItems).removeClass('active');
				self.$activeItems = [$item.addClass('active')[0]];
			}
	
			self.isFocused = !!self.$activeItems.length || self.isInputFocused;
		},
	
		/**
		 * Sets the selected item in the dropdown menu
		 * of available options.
		 *
		 * @param {object} $object
		 * @param {boolean} scroll
		 * @param {boolean} animate
		 */
		setActiveOption: function($option, scroll, animate) {
			var height_menu, height_item, y;
			var scroll_top, scroll_bottom;
			var self = this;
	
			if (self.$activeOption) self.$activeOption.removeClass('active');
			self.$activeOption = null;
	
			$option = $($option);
			if (!$option.length) return;
	
			self.$activeOption = $option.addClass('active');
	
			if (scroll || !isset(scroll)) {
	
				height_menu   = self.$dropdown_content.height();
				height_item   = self.$activeOption.outerHeight(true);
				scroll        = self.$dropdown_content.scrollTop() || 0;
				y             = self.$activeOption.offset().top - self.$dropdown_content.offset().top + scroll;
				scroll_top    = y;
				scroll_bottom = y - height_menu + height_item;
	
				if (y + height_item > height_menu - scroll) {
					self.$dropdown_content.stop().animate({scrollTop: scroll_bottom}, animate ? self.settings.scrollDuration : 0);
				} else if (y < scroll) {
					self.$dropdown_content.stop().animate({scrollTop: scroll_top}, animate ? self.settings.scrollDuration : 0);
				}
	
			}
		},
	
		/**
		 * Selects all items (CTRL + A).
		 */
		selectAll: function() {
			this.$activeItems = Array.prototype.slice.apply(this.$control.children(':not(input)').addClass('active'));
			this.isFocused = true;
			if (this.$activeItems.length) this.hideInput();
		},
	
		/**
		 * Hides the input element out of view, while
		 * retaining its focus.
		 */
		hideInput: function() {
			var self = this;
	
			self.close();
			self.setTextboxValue('');
			self.$control_input.css({opacity: 0, position: 'absolute', left: -10000});
			self.isInputHidden = true;
		},
	
		/**
		 * Restores input visibility.
		 */
		showInput: function() {
			this.$control_input.css({opacity: 1, position: 'relative', left: 0});
			this.isInputHidden = false;
		},
	
		/**
		 * Gives the control focus. If "trigger" is falsy,
		 * focus handlers won't be fired--causing the focus
		 * to happen silently in the background.
		 *
		 * @param {boolean} trigger
		 */
		focus: function(trigger) {
			var self = this;
	
			if (self.isDisabled) return;
			self.ignoreFocus = true;
			self.$control_input[0].focus();
			self.isInputFocused = true;
			window.setTimeout(function() {
				self.ignoreFocus = false;
				if (trigger) self.onFocus();
			}, 0);
		},
	
		/**
		 * Forces the control out of focus.
		 */
		blur: function() {
			this.$control_input.trigger('blur');
		},
	
		/**
		 * Returns a function that scores an object
		 * to show how good of a match it is to the
		 * provided query.
		 *
		 * @param {string} query
		 * @param {object} options
		 * @return {function}
		 */
		getScoreFunction: function(query) {
			return this.sifter.getScoreFunction(query, this.getSearchOptions());
		},
	
		/**
		 * Returns search options for sifter (the system
		 * for scoring and sorting results).
		 *
		 * @see https://github.com/brianreavis/sifter.js
		 * @return {object}
		 */
		getSearchOptions: function() {
			var settings = this.settings;
			var fields = settings.searchField;
	
			return {
				fields    : $.isArray(fields) ? fields : [fields],
				sort      : settings.sortField,
				direction : settings.sortDirection,
			};
		},
	
		/**
		 * Searches through available options and returns
		 * a sorted array of matches.
		 *
		 * Returns an object containing:
		 *
		 *   - query {string}
		 *   - tokens {array}
		 *   - total {int}
		 *   - items {array}
		 *
		 * @param {string} query
		 * @returns {object}
		 */
		search: function(query) {
			var i, value, score, result, calculateScore;
			var self     = this;
			var settings = self.settings;
			var options  = this.getSearchOptions();
	
			// validate user-provided result scoring function
			if (settings.score) {
				calculateScore = self.settings.score.apply(this, [query]);
				if (typeof calculateScore !== 'function') {
					throw new Error('Selectize "score" setting must be a function that returns a function');
				}
			}
	
			// perform search
			if (query !== self.lastQuery) {
				self.lastQuery = query;
				result = self.sifter.search(query, $.extend(options, {score: calculateScore}));
				self.currentResults = result;
			} else {
				result = $.extend(true, {}, self.currentResults);
			}
	
			// filter out selected items
			if (settings.hideSelected) {
				for (i = result.items.length - 1; i >= 0; i--) {
					if (self.items.indexOf(hash_key(result.items[i].id)) !== -1) {
						result.items.splice(i, 1);
					}
				}
			}
	
			return result;
		},
	
		/**
		 * Refreshes the list of available options shown
		 * in the autocomplete dropdown menu.
		 *
		 * @param {boolean} triggerDropdown
		 */
		refreshOptions: function(triggerDropdown) {
			if (typeof triggerDropdown === 'undefined') {
				triggerDropdown = true;
			}
	
			var self = this;
			var i, n, groups, groups_order, option, optgroup, html, html_children;
			var hasCreateOption;
			var query = self.$control_input.val();
			var results = self.search(query);
			var $active, $create;
			var $dropdown_content = self.$dropdown_content;
	
			// build markup
			n = results.items.length;
			if (typeof self.settings.maxOptions === 'number') {
				n = Math.min(n, self.settings.maxOptions);
			}
	
			// render and group available options individually
			groups = {};
	
			if (self.settings.optgroupOrder) {
				groups_order = self.settings.optgroupOrder;
				for (i = 0; i < groups_order.length; i++) {
					groups[groups_order[i]] = [];
				}
			} else {
				groups_order = [];
			}
	
			for (i = 0; i < n; i++) {
				option = self.options[results.items[i].id];
				optgroup = option[self.settings.optgroupField] || '';
				if (!self.optgroups.hasOwnProperty(optgroup)) {
					optgroup = '';
				}
				if (!groups.hasOwnProperty(optgroup)) {
					groups[optgroup] = [];
					groups_order.push(optgroup);
				}
				groups[optgroup].push(self.render('option', option));
			}
	
			// render optgroup headers & join groups
			html = [];
			for (i = 0, n = groups_order.length; i < n; i++) {
				optgroup = groups_order[i];
				if (self.optgroups.hasOwnProperty(optgroup) && groups[optgroup].length) {
					// render the optgroup header and options within it,
					// then pass it to the wrapper template
					html_children = self.render('optgroup_header', self.optgroups[optgroup]) || '';
					html_children += groups[optgroup].join('');
					html.push(self.render('optgroup', $.extend({}, self.optgroups[optgroup], {
						html: html_children
					})));
				} else {
					html.push(groups[optgroup].join(''));
				}
			}
	
			$dropdown_content.html(html.join(''));
	
			// highlight matching terms inline
			if (self.settings.highlight && results.query.length && results.tokens.length) {
				for (i = 0, n = results.tokens.length; i < n; i++) {
					highlight($dropdown_content, results.tokens[i].regex);
				}
			}
	
			// add "selected" class to selected options
			if (!self.settings.hideSelected) {
				for (i = 0, n = self.items.length; i < n; i++) {
					self.getOption(self.items[i]).addClass('selected');
				}
			}
	
			// add create option
			hasCreateOption = self.settings.create && results.query.length;
			if (hasCreateOption) {
				$dropdown_content.prepend(self.render('option_create', {input: query}));
				$create = $($dropdown_content[0].childNodes[0]);
			}
	
			// activate
			self.hasOptions = results.items.length > 0 || hasCreateOption;
			if (self.hasOptions) {
				if (results.items.length > 0) {
					if ($create) {
						$active = self.getAdjacentOption($create, 1);
					} else {
						$active = $dropdown_content.find("[data-selectable]").first();
					}
				} else {
					$active = $create;
				}
				self.setActiveOption($active);
				if (triggerDropdown && !self.isOpen) { self.open(); }
			} else {
				self.setActiveOption(null);
				if (triggerDropdown && self.isOpen) { self.close(); }
			}
		},
	
		/**
		 * Adds an available option. If it already exists,
		 * nothing will happen. Note: this does not refresh
		 * the options list dropdown (use `refreshOptions`
		 * for that).
		 *
		 * Usage:
		 *
		 *   this.addOption(data)
		 *
		 * @param {object} data
		 */
		addOption: function(data) {
			var i, n, optgroup, value, self = this;
	
			if ($.isArray(data)) {
				for (i = 0, n = data.length; i < n; i++) {
					self.addOption(data[i]);
				}
				return;
			}
	
			value = hash_key(data[self.settings.valueField]);
			if (!value || self.options.hasOwnProperty(value)) return;
	
			self.userOptions[value] = true;
			self.options[value] = data;
			self.lastQuery = null;
			self.trigger('option_add', value, data);
		},
	
		/**
		 * Registers a new optgroup for options
		 * to be bucketed into.
		 *
		 * @param {string} id
		 * @param {object} data
		 */
		addOptionGroup: function(id, data) {
			this.optgroups[id] = data;
			this.trigger('optgroup_add', id, data);
		},
	
		/**
		 * Updates an option available for selection. If
		 * it is visible in the selected items or options
		 * dropdown, it will be re-rendered automatically.
		 *
		 * @param {string} value
		 * @param {object} data
		 */
		updateOption: function(value, data) {
			var self = this;
			var $item, $item_new;
			var value_new, index_item, cache_items, cache_options;
	
			value     = hash_key(value);
			value_new = hash_key(data[self.settings.valueField]);
	
			// sanity checks
			if (!self.options.hasOwnProperty(value)) return;
			if (!value_new) throw new Error('Value must be set in option data');
	
			// update references
			if (value_new !== value) {
				delete self.options[value];
				index_item = self.items.indexOf(value);
				if (index_item !== -1) {
					self.items.splice(index_item, 1, value_new);
				}
			}
			self.options[value_new] = data;
	
			// invalidate render cache
			cache_items = self.renderCache['item'];
			cache_options = self.renderCache['option'];
	
			if (isset(cache_items)) {
				delete cache_items[value];
				delete cache_items[value_new];
			}
			if (isset(cache_options)) {
				delete cache_options[value];
				delete cache_options[value_new];
			}
	
			// update the item if it's selected
			if (self.items.indexOf(value_new) !== -1) {
				$item = self.getItem(value);
				$item_new = $(self.render('item', data));
				if ($item.hasClass('active')) $item_new.addClass('active');
				$item.replaceWith($item_new);
			}
	
			// update dropdown contents
			if (self.isOpen) {
				self.refreshOptions(false);
			}
		},
	
		/**
		 * Removes a single option.
		 *
		 * @param {string} value
		 */
		removeOption: function(value) {
			var self = this;
	
			value = hash_key(value);
			delete self.userOptions[value];
			delete self.options[value];
			self.lastQuery = null;
			self.trigger('option_remove', value);
			self.removeItem(value);
		},
	
		/**
		 * Clears all options.
		 */
		clearOptions: function() {
			var self = this;
	
			self.loadedSearches = {};
			self.userOptions = {};
			self.options = self.sifter.items = {};
			self.lastQuery = null;
			self.trigger('option_clear');
			self.clear();
		},
	
		/**
		 * Returns the jQuery element of the option
		 * matching the given value.
		 *
		 * @param {string} value
		 * @returns {object}
		 */
		getOption: function(value) {
			return this.getElementWithValue(value, this.$dropdown_content.find('[data-selectable]'));
		},
	
		/**
		 * Returns the jQuery element of the next or
		 * previous selectable option.
		 *
		 * @param {object} $option
		 * @param {int} direction  can be 1 for next or -1 for previous
		 * @return {object}
		 */
		getAdjacentOption: function($option, direction) {
			var $options = this.$dropdown.find('[data-selectable]');
			var index    = $options.index($option) + direction;
	
			return index >= 0 && index < $options.length ? $options.eq(index) : $();
		},
	
		/**
		 * Finds the first element with a "data-value" attribute
		 * that matches the given value.
		 *
		 * @param {mixed} value
		 * @param {object} $els
		 * @return {object}
		 */
		getElementWithValue: function(value, $els) {
			value = hash_key(value);
	
			if (value) {
				for (var i = 0, n = $els.length; i < n; i++) {
					if ($els[i].getAttribute('data-value') === value) {
						return $($els[i]);
					}
				}
			}
	
			return $();
		},
	
		/**
		 * Returns the jQuery element of the item
		 * matching the given value.
		 *
		 * @param {string} value
		 * @returns {object}
		 */
		getItem: function(value) {
			return this.getElementWithValue(value, this.$control.children());
		},
	
		/**
		 * "Selects" an item. Adds it to the list
		 * at the current caret position.
		 *
		 * @param {string} value
		 */
		addItem: function(value) {
			debounce_events(this, ['change'], function() {
				var $item, $option;
				var self = this;
				var inputMode = self.settings.mode;
				var i, active, options, value_next;
				value = hash_key(value);
	
				if (inputMode === 'single') self.clear();
				if (inputMode === 'multi' && self.isFull()) return;
				if (self.items.indexOf(value) !== -1) return;
				if (!self.options.hasOwnProperty(value)) return;
	
				$item = $(self.render('item', self.options[value]));
				self.items.splice(self.caretPos, 0, value);
				self.insertAtCaret($item);
				self.refreshClasses();
	
				if (self.isSetup) {
					options = self.$dropdown_content.find('[data-selectable]');
	
					// update menu / remove the option
					$option = self.getOption(value);
					value_next = self.getAdjacentOption($option, 1).attr('data-value');
					self.refreshOptions(self.isFocused && inputMode !== 'single');
					if (value_next) {
						self.setActiveOption(self.getOption(value_next));
					}
	
					// hide the menu if the maximum number of items have been selected or no options are left
					if (!options.length || (self.settings.maxItems !== null && self.items.length >= self.settings.maxItems)) {
						self.close();
					} else {
						self.positionDropdown();
					}
	
					// restore focus to input
					if (self.isFocused) {
						window.setTimeout(function() {
							if (inputMode === 'single') {
								self.blur();
								self.focus(false);
								self.hideInput();
							} else {
								self.focus(false);
							}
						}, 0);
					}
	
					self.updatePlaceholder();
					self.trigger('item_add', value, $item);
					self.updateOriginalInput();
				}
			});
		},
	
		/**
		 * Removes the selected item matching
		 * the provided value.
		 *
		 * @param {string} value
		 */
		removeItem: function(value) {
			var self = this;
			var $item, i, idx;
	
			$item = (typeof value === 'object') ? value : self.getItem(value);
			value = hash_key($item.attr('data-value'));
			i = self.items.indexOf(value);
	
			if (i !== -1) {
				$item.remove();
				if ($item.hasClass('active')) {
					idx = self.$activeItems.indexOf($item[0]);
					self.$activeItems.splice(idx, 1);
				}
	
				self.items.splice(i, 1);
				self.lastQuery = null;
				if (!self.settings.persist && self.userOptions.hasOwnProperty(value)) {
					self.removeOption(value);
				}
	
				if (i < self.caretPos) {
					self.setCaret(self.caretPos - 1);
				}
	
				self.refreshClasses();
				self.updatePlaceholder();
				self.updateOriginalInput();
				self.positionDropdown();
				self.trigger('item_remove', value);
			}
		},
	
		/**
		 * Invokes the `create` method provided in the
		 * selectize options that should provide the data
		 * for the new item, given the user input.
		 *
		 * Once this completes, it will be added
		 * to the item list.
		 */
		createItem: function() {
			var self  = this;
			var input = $.trim(self.$control_input.val() || '');
			var caret = self.caretPos;
			if (!input.length) return;
			self.lock();
	
			var setup = (typeof self.settings.create === 'function') ? this.settings.create : function(input) {
				var data = {};
				data[self.settings.labelField] = input;
				data[self.settings.valueField] = input;
				return data;
			};
	
			var create = once(function(data) {
				self.unlock();
				self.focus(false);
	
				if (!data || typeof data !== 'object') return;
				var value = hash_key(data[self.settings.valueField]);
				if (!value) return;
	
				self.setTextboxValue('');
				self.addOption(data);
				self.setCaret(caret);
				self.addItem(value);
				self.refreshOptions(self.settings.mode !== 'single');
				self.focus(false);
			});
	
			var output = setup.apply(this, [input, create]);
			if (typeof output !== 'undefined') {
				create(output);
			}
		},
	
		/**
		 * Re-renders the selected item lists.
		 */
		refreshItems: function() {
			this.lastQuery = null;
	
			if (this.isSetup) {
				for (var i = 0; i < this.items.length; i++) {
					this.addItem(this.items);
				}
			}
	
			this.refreshClasses();
			this.updateOriginalInput();
		},
	
		/**
		 * Updates all state-dependent CSS classes.
		 */
		refreshClasses: function() {
			var self = this;
			var isFull = self.isFull();
			var isLocked = self.isLocked;
			this.$control
				.toggleClass('focus', self.isFocused)
				.toggleClass('disabled', self.isDisabled)
				.toggleClass('locked', isLocked)
				.toggleClass('full', isFull).toggleClass('not-full', !isFull)
				.toggleClass('dropdown-active', self.isOpen)
				.toggleClass('has-options', !$.isEmptyObject(self.options))
				.toggleClass('has-items', self.items.length > 0);
			this.$control_input.data('grow', !isFull && !isLocked);
		},
	
		/**
		 * Determines whether or not more items can be added
		 * to the control without exceeding the user-defined maximum.
		 *
		 * @returns {boolean}
		 */
		isFull: function() {
			return this.settings.maxItems !== null && this.items.length >= this.settings.maxItems;
		},
	
		/**
		 * Refreshes the original <select> or <input>
		 * element to reflect the current state.
		 */
		updateOriginalInput: function() {
			var i, n, options, self = this;
	
			if (self.$input[0].tagName.toLowerCase() === 'select') {
				options = [];
				for (i = 0, n = self.items.length; i < n; i++) {
					options.push('<option value="' + escape_html(self.items[i]) + '" selected="selected"></option>');
				}
				if (!options.length && !this.$input.attr('multiple')) {
					options.push('<option value="" selected="selected"></option>');
				}
				self.$input.html(options.join(''));
			} else {
				self.$input.val(self.getValue());
			}
	
			if (self.isSetup) {
				self.trigger('change', self.$input.val());
			}
		},
	
		/**
		 * Shows/hide the input placeholder depending
		 * on if there items in the list already.
		 */
		updatePlaceholder: function() {
			if (!this.settings.placeholder) return;
			var $input = this.$control_input;
	
			if (this.items.length) {
				$input.removeAttr('placeholder');
			} else {
				$input.attr('placeholder', this.settings.placeholder);
			}
			$input.triggerHandler('update');
		},
	
		/**
		 * Shows the autocomplete dropdown containing
		 * the available options.
		 */
		open: function() {
			var self = this;
	
			if (self.isLocked || self.isOpen || (self.settings.mode === 'multi' && self.isFull())) return;
			self.focus(true);
			self.isOpen = true;
			self.refreshClasses();
			self.$dropdown.css({visibility: 'hidden', display: 'block'});
			self.positionDropdown();
			self.$dropdown.css({visibility: 'visible'});
			self.trigger('dropdown_open', this.$dropdown);
		},
	
		/**
		 * Closes the autocomplete dropdown menu.
		 */
		close: function() {
			var self = this;
	
			if (!self.isOpen) return;
			self.$dropdown.hide();
			self.setActiveOption(null);
			self.isOpen = false;
			self.refreshClasses();
			self.trigger('dropdown_close', self.$dropdown);
		},
	
		/**
		 * Calculates and applies the appropriate
		 * position of the dropdown.
		 */
		positionDropdown: function() {
			var $control = this.$control;
			var offset = this.settings.dropdownParent === 'body' ? $control.offset() : $control.position();
			offset.top += $control.outerHeight(true);
	
			this.$dropdown.css({
				width : $control.outerWidth(),
				top   : offset.top,
				left  : offset.left
			});
		},
	
		/**
		 * Resets / clears all selected items
		 * from the control.
		 */
		clear: function() {
			var self = this;
	
			if (!self.items.length) return;
			self.$control.children(':not(input)').remove();
			self.items = [];
			self.setCaret(0);
			self.updatePlaceholder();
			self.updateOriginalInput();
			self.refreshClasses();
			self.showInput();
			self.trigger('clear');
		},
	
		/**
		 * A helper method for inserting an element
		 * at the current caret position.
		 *
		 * @param {object} $el
		 */
		insertAtCaret: function($el) {
			var caret = Math.min(this.caretPos, this.items.length);
			if (caret === 0) {
				this.$control.prepend($el);
			} else {
				$(this.$control[0].childNodes[caret]).before($el);
			}
			this.setCaret(caret + 1);
		},
	
		/**
		 * Removes the current selected item(s).
		 *
		 * @param {object} e (optional)
		 * @returns {boolean}
		 */
		deleteSelection: function(e) {
			var i, n, direction, selection, values, caret, option_select, $option_select, $tail;
			var self = this;
	
			direction = (e && e.keyCode === KEY_BACKSPACE) ? -1 : 1;
			selection = getSelection(self.$control_input[0]);
	
			if (self.$activeOption && !self.settings.hideSelected) {
				option_select = self.getAdjacentOption(self.$activeOption, -1).attr('data-value');
			}
	
			// determine items that will be removed
			values = [];
	
			if (self.$activeItems.length) {
				$tail = self.$control.children('.active:' + (direction > 0 ? 'last' : 'first'));
				caret = self.$control.children(':not(input)').index($tail);
				if (direction > 0) { caret++; }
	
				for (i = 0, n = self.$activeItems.length; i < n; i++) {
					values.push($(self.$activeItems[i]).attr('data-value'));
				}
				if (e) {
					e.preventDefault();
					e.stopPropagation();
				}
			} else if ((self.isFocused || self.settings.mode === 'single') && self.items.length) {
				if (direction < 0 && selection.start === 0 && selection.length === 0) {
					values.push(self.items[self.caretPos - 1]);
				} else if (direction > 0 && selection.start === self.$control_input.val().length) {
					values.push(self.items[self.caretPos]);
				}
			}
	
			// allow the callback to abort
			if (!values.length || (typeof self.settings.onDelete === 'function' && self.settings.onDelete.apply(self, [values]) === false)) {
				return false;
			}
	
			// perform removal
			if (typeof caret !== 'undefined') {
				self.setCaret(caret);
			}
			while (values.length) {
				self.removeItem(values.pop());
			}
	
			self.showInput();
			self.refreshOptions(true);
	
			// select previous option
			if (option_select) {
				$option_select = self.getOption(option_select);
				if ($option_select.length) {
					self.setActiveOption($option_select);
				}
			}
	
			return true;
		},
	
		/**
		 * Selects the previous / next item (depending
		 * on the `direction` argument).
		 *
		 * > 0 - right
		 * < 0 - left
		 *
		 * @param {int} direction
		 * @param {object} e (optional)
		 */
		advanceSelection: function(direction, e) {
			var tail, selection, idx, valueLength, cursorAtEdge, $tail;
			var self = this;
	
			if (direction === 0) return;
	
			tail = direction > 0 ? 'last' : 'first';
			selection = getSelection(self.$control_input[0]);
	
			if (self.isInputFocused && !self.isInputHidden) {
				valueLength = self.$control_input.val().length;
				cursorAtEdge = direction < 0
					? selection.start === 0 && selection.length === 0
					: selection.start === valueLength;
	
				if (cursorAtEdge && !valueLength) {
					self.advanceCaret(direction, e);
				}
			} else {
				$tail = self.$control.children('.active:' + tail);
				if ($tail.length) {
					idx = self.$control.children(':not(input)').index($tail);
					self.setActiveItem(null);
					self.setCaret(direction > 0 ? idx + 1 : idx);
					self.showInput();
				}
			}
		},
	
		/**
		 * Moves the caret left / right.
		 *
		 * @param {int} direction
		 * @param {object} e (optional)
		 */
		advanceCaret: function(direction, e) {
			if (direction === 0) return;
			var self = this;
			var fn = direction > 0 ? 'next' : 'prev';
			if (self.isShiftDown) {
				var $adj = self.$control_input[fn]();
				if ($adj.length) {
					self.hideInput();
					self.setActiveItem($adj);
					e && e.preventDefault();
				}
			} else {
				self.setCaret(self.caretPos + direction);
			}
		},
	
		/**
		 * Moves the caret to the specified index.
		 *
		 * @param {int} i
		 */
		setCaret: function(i) {
			var self = this;
	
			if (self.settings.mode === 'single') {
				i = self.items.length;
			} else {
				i = Math.max(0, Math.min(self.items.length, i));
			}
	
			// the input must be moved by leaving it in place and moving the
			// siblings, due to the fact that focus cannot be restored once lost
			// on mobile webkit devices
			var j, n, fn, $children, $child;
			$children = self.$control.children(':not(input)');
			for (j = 0, n = $children.length; j < n; j++) {
				$child = $($children[j]).detach();
				if (j <  i) {
					self.$control_input.before($child);
				} else {
					self.$control.append($child);
				}
			}
	
			self.caretPos = i;
		},
	
		/**
		 * Disables user input on the control. Used while
		 * items are being asynchronously created.
		 */
		lock: function() {
			this.close();
			this.isLocked = true;
			this.refreshClasses();
		},
	
		/**
		 * Re-enables user input on the control.
		 */
		unlock: function() {
			this.isLocked = false;
			this.refreshClasses();
		},
	
		/**
		 * Disables user input on the control completely.
		 * While disabled, it cannot receive focus.
		 */
		disable: function() {
			var self = this;
			self.$input.prop('disabled', true);
			self.isDisabled = true;
			self.lock();
		},
	
		/**
		 * Enables the control so that it can respond
		 * to focus and user input.
		 */
		enable: function() {
			var self = this;
			self.$input.prop('disabled', false);
			self.isDisabled = false;
			self.unlock();
		},
	
		/**
		 * Completely destroys the control and
		 * unbinds all event listeners so that it can
		 * be garbage collected.
		 */
		destroy: function() {
			var self = this;
			var eventNS = self.eventNS;
	
			self.trigger('destroy');
			self.off();
			self.$wrapper.remove();
			self.$dropdown.remove();
			self.$input.show();
	
			$(window).off(eventNS);
			$(document).off(eventNS);
			$(document.body).off(eventNS);
	
			delete self.$input[0].selectize;
		},
	
		/**
		 * A helper method for rendering "item" and
		 * "option" templates, given the data.
		 *
		 * @param {string} templateName
		 * @param {object} data
		 * @returns {string}
		 */
		render: function(templateName, data) {
			var value, id, label;
			var html = '';
			var cache = false;
			var self = this;
			var regex_tag = /^[\t ]*<([a-z][a-z0-9\-_]*(?:\:[a-z][a-z0-9\-_]*)?)/i;
	
			if (templateName === 'option' || templateName === 'item') {
				value = hash_key(data[self.settings.valueField]);
				cache = !!value;
			}
	
			// pull markup from cache if it exists
			if (cache) {
				if (!isset(self.renderCache[templateName])) {
					self.renderCache[templateName] = {};
				}
				if (self.renderCache[templateName].hasOwnProperty(value)) {
					return self.renderCache[templateName][value];
				}
			}
	
			// render markup
			html = self.settings.render[templateName].apply(this, [data, escape_html]);
	
			// add mandatory attributes
			if (templateName === 'option' || templateName === 'option_create') {
				html = html.replace(regex_tag, '<$1 data-selectable');
			}
			if (templateName === 'optgroup') {
				id = data[self.settings.optgroupValueField] || '';
				html = html.replace(regex_tag, '<$1 data-group="' + escape_html(id) + '"');
			}
			if (templateName === 'option' || templateName === 'item') {
				html = html.replace(regex_tag, '<$1 data-value="' + escape_html(value || '') + '"');
			}
	
			// update cache
			if (cache) {
				self.renderCache[templateName][value] = html;
			}
	
			return html;
		}
	
	});
	
	Selectize.count = 0;
	Selectize.defaults = {
		plugins: [],
		delimiter: ',',
		persist: true,
		diacritics: true,
		create: false,
		highlight: true,
		openOnFocus: true,
		maxOptions: 1000,
		maxItems: null,
		hideSelected: null,
		preload: false,
	
		scrollDuration: 60,
		loadThrottle: 300,
	
		dataAttr: 'data-data',
		optgroupField: 'optgroup',
		sortField: '$order',
		sortDirection: 'asc',
		valueField: 'value',
		labelField: 'text',
		optgroupLabelField: 'label',
		optgroupValueField: 'value',
		optgroupOrder: null,
		searchField: ['text'],
	
		mode: null,
		wrapperClass: 'selectize-control',
		inputClass: 'selectize-input',
		dropdownClass: 'selectize-dropdown',
		dropdownContentClass: 'selectize-dropdown-content',
	
		dropdownParent: null,
	
		/*
		load            : null, // function(query, callback) { ... }
		score           : null, // function(search) { ... }
		onInitialize    : null, // function() { ... }
		onChange        : null, // function(value) { ... }
		onItemAdd       : null, // function(value, $item) { ... }
		onItemRemove    : null, // function(value) { ... }
		onClear         : null, // function() { ... }
		onOptionAdd     : null, // function(value, data) { ... }
		onOptionRemove  : null, // function(value) { ... }
		onOptionClear   : null, // function() { ... }
		onDropdownOpen  : null, // function($dropdown) { ... }
		onDropdownClose : null, // function($dropdown) { ... }
		onType          : null, // function(str) { ... }
		onDelete        : null, // function(values) { ... }
		*/
	
		render: {
			/*
			item: null,
			optgroup: null,
			optgroup_header: null,
			option: null,
			option_create: null
			*/
		}
	};
	
	$.fn.selectize = function(settings) {
		settings = settings || {};
	
		var defaults = $.fn.selectize.defaults;
		var dataAttr = settings.dataAttr || defaults.dataAttr;
	
		/**
		 * Initializes selectize from a <input type="text"> element.
		 *
		 * @param {object} $input
		 * @param {object} settings
		 */
		var init_textbox = function($input, settings_element) {
			var i, n, values, value = $.trim($input.val() || '');
			if (!value.length) return;
	
			values = value.split(settings.delimiter || defaults.delimiter);
			for (i = 0, n = values.length; i < n; i++) {
				settings_element.options[values[i]] = {
					'text'  : values[i],
					'value' : values[i]
				};
			}
	
			settings_element.items = values;
		};
	
		/**
		 * Initializes selectize from a <select> element.
		 *
		 * @param {object} $input
		 * @param {object} settings
		 */
		var init_select = function($input, settings_element) {
			var i, n, tagName;
			var $children;
			var order = 0;
			settings_element.maxItems = !!$input.attr('multiple') ? null : 1;
	
			var readData = function($el) {
				var data = dataAttr && $el.attr(dataAttr);
				if (typeof data === 'string' && data.length) {
					return JSON.parse(data);
				}
				return null;
			};
	
			var addOption = function($option, group) {
				var value, option;
	
				$option = $($option);
	
				value = $option.attr('value') || '';
				if (!value.length) return;
	
				option = readData($option) || {
					'text'     : $option.text(),
					'value'    : value,
					'optgroup' : group
				};
	
				option.$order = ++order;
				settings_element.options[value] = option;
	
				if ($option.is(':selected')) {
					settings_element.items.push(value);
				}
			};
	
			var addGroup = function($optgroup) {
				var i, n, $options = $('option', $optgroup);
				$optgroup = $($optgroup);
	
				var id = $optgroup.attr('label');
				if (id && id.length) {
					settings_element.optgroups[id] = readData($optgroup) || {
						'label': id
					};
				}
	
				for (i = 0, n = $options.length; i < n; i++) {
					addOption($options[i], id);
				}
			};
	
			$children = $input.children();
			for (i = 0, n = $children.length; i < n; i++) {
				tagName = $children[i].tagName.toLowerCase();
				if (tagName === 'optgroup') {
					addGroup($children[i]);
				} else if (tagName === 'option') {
					addOption($children[i]);
				}
			}
		};
	
		return this.each(function() {
			var instance;
			var $input = $(this);
			var tag_name = $input[0].tagName.toLowerCase();
			var settings_element = {
				'placeholder' : $input.children('option[value=""]').text() || $input.attr('placeholder'),
				'options'     : {},
				'optgroups'   : {},
				'items'       : []
			};
	
			if (tag_name === 'select') {
				init_select($input, settings_element);
			} else {
				init_textbox($input, settings_element);
			}
	
			instance = new Selectize($input, $.extend(true, {}, defaults, settings_element, settings));
			$input.data('selectize', instance);
			$input.addClass('selectized');
		});
	};
	
	$.fn.selectize.defaults = Selectize.defaults;
	
	Selectize.define('drag_drop', function(options) {
		if (!$.fn.sortable) throw new Error('The "drag_drop" plugin requires jQuery UI "sortable".');
		if (this.settings.mode !== 'multi') return;
		var self = this;
	
		this.setup = (function() {
			var original = self.setup;
			return function() {
				original.apply(this, arguments);
	
				var $control = this.$control.sortable({
					items: '[data-value]',
					forcePlaceholderSize: true,
					start: function(e, ui) {
						ui.placeholder.css('width', ui.helper.css('width'));
						$control.css({overflow: 'visible'});
					},
					stop: function() {
						$control.css({overflow: 'hidden'});
						var active = this.$activeItems ? this.$activeItems.slice() : null;
						var values = [];
						$control.children('[data-value]').each(function() {
							values.push($(this).attr('data-value'));
						});
						self.setValue(values);
						self.setActiveItem(active);
					}
				});
			};
		})();
	
	});
	
	Selectize.define('dropdown_header', function(options) {
		var self = this;
	
		options = $.extend({
			title         : 'Untitled',
			headerClass   : 'selectize-dropdown-header',
			titleRowClass : 'selectize-dropdown-header-title',
			labelClass    : 'selectize-dropdown-header-label',
			closeClass    : 'selectize-dropdown-header-close',
	
			html: function(data) {
				return (
					'<div class="' + data.headerClass + '">' +
						'<div class="' + data.titleRowClass + '">' +
							'<span class="' + data.labelClass + '">' + data.title + '</span>' +
							'<a href="javascript:void(0)" class="' + data.closeClass + '">&times;</a>' +
						'</div>' +
					'</div>'
				);
			}
		}, options);
	
		self.setup = (function() {
			var original = self.setup;
			return function() {
				original.apply(self, arguments);
				self.$dropdown_header = $(options.html(options));
				self.$dropdown.prepend(self.$dropdown_header);
			};
		})();
	
	});
	
	Selectize.define('optgroup_columns', function(options) {
		var self = this;
	
		options = $.extend({
			equalizeWidth  : true,
			equalizeHeight : true
		}, options);
	
		this.getAdjacentOption = function($option, direction) {
			var $options = $option.closest('[data-group]').find('[data-selectable]');
			var index    = $options.index($option) + direction;
	
			return index >= 0 && index < $options.length ? $options.eq(index) : $();
		};
	
		this.onKeyDown = (function() {
			var original = self.onKeyDown;
			return function(e) {
				var index, $option, $options, $optgroup;
	
				if (this.isOpen && (e.keyCode === KEY_LEFT || e.keyCode === KEY_RIGHT)) {
					self.ignoreHover = true;
					$optgroup = this.$activeOption.closest('[data-group]');
					index = $optgroup.find('[data-selectable]').index(this.$activeOption);
	
					if(e.keyCode === KEY_LEFT) {
						$optgroup = $optgroup.prev('[data-group]');
					} else {
						$optgroup = $optgroup.next('[data-group]');
					}
	
					$options = $optgroup.find('[data-selectable]');
					$option  = $options.eq(Math.min($options.length - 1, index));
					if ($option.length) {
						this.setActiveOption($option);
					}
					return;
				}
	
				return original.apply(this, arguments);
			};
		})();
	
		var equalizeSizes = function() {
			var i, n, height_max, width, width_last, width_parent, $optgroups;
	
			$optgroups = $('[data-group]', self.$dropdown_content);
			n = $optgroups.length;
			if (!n || !self.$dropdown_content.width()) return;
	
			if (options.equalizeHeight) {
				height_max = 0;
				for (i = 0; i < n; i++) {
					height_max = Math.max(height_max, $optgroups.eq(i).height());
				}
				$optgroups.css({height: height_max});
			}
	
			if (options.equalizeWidth) {
				width_parent = self.$dropdown_content.innerWidth();
				width = Math.round(width_parent / n);
				$optgroups.css({width: width});
				if (n > 1) {
					width_last = width_parent - width * (n - 1);
					$optgroups.eq(n - 1).css({width: width_last});
				}
			}
		};
	
		if (options.equalizeHeight || options.equalizeWidth) {
			hook.after(this, 'positionDropdown', equalizeSizes);
			hook.after(this, 'refreshOptions', equalizeSizes);
		}
	
	
	});
	
	Selectize.define('remove_button', function(options) {
		if (this.settings.mode === 'single') return;
	
		options = $.extend({
			label     : '&times;',
			title     : 'Remove',
			className : 'remove',
			append    : true,
		}, options);
	
		var self = this;
		var html = '<a href="javascript:void(0)" class="' + options.className + '" tabindex="-1" title="' + escape_html(options.title) + '">' + options.label + '</a>';
	
		/**
		 * Appends an element as a child (with raw HTML).
		 *
		 * @param {string} html_container
		 * @param {string} html_element
		 * @return {string}
		 */
		var append = function(html_container, html_element) {
			var pos = html_container.search(/(<\/[^>]+>\s*)$/);
			return html_container.substring(0, pos) + html_element + html_container.substring(pos);
		};
	
		this.setup = (function() {
			var original = self.setup;
			return function() {
				// override the item rendering method to add the button to each
				if (options.append) {
					var render_item = self.settings.render.item;
					self.settings.render.item = function(data) {
						return append(render_item.apply(this, arguments), html);
					};
				}
	
				original.apply(this, arguments);
	
				// add event listener
				this.$control.on('click', '.' + options.className, function(e) {
					e.preventDefault();
					var $item = $(e.target).parent();
					self.setActiveItem($item);
					if (self.deleteSelection()) {
						self.setCaret(self.items.length);
					}
				});
	
			};
		})();
	
	});
	
	Selectize.define('restore_on_backspace', function(options) {
		var self = this;
	
		options.text = options.text || function(option) {
			return option[this.settings.labelField];
		};
	
		this.onKeyDown = (function(e) {
			var original = self.onKeyDown;
			return function(e) {
				var index, option;
				if (e.keyCode === KEY_BACKSPACE && this.$control_input.val() === '' && !this.$activeItems.length) {
					index = this.caretPos - 1;
					if (index >= 0 && index < this.items.length) {
						option = this.options[this.items[index]];
						if (this.deleteSelection(e)) {
							this.setTextboxValue(options.text.apply(this, [option]));
							this.refreshOptions(true);
						}
						e.preventDefault();
						return;
					}
				}
				return original.apply(this, arguments);
			};
		})();
	});

	return Selectize;
}));$('select').selectize();var TipoNome = {
	adicionarEnum: function(nome, valido) {
		TipoNome[nome] = {
							isValido: function() {
								return valido === true;
							}
							,name: function() {
								return nome;
							}
							,toString: function() {
								return nome;
							}
						 };
	}
};
TipoNome.adicionarEnum("NAO_INFORMADO");
TipoNome.adicionarEnum("VAZIO");
TipoNome.adicionarEnum("SOMENTE_NUMEROS");
TipoNome.adicionarEnum("NOME_COMPLETO", true);
TipoNome.adicionarEnum("NOME_SIMPLES", true);


var ValidadorCpfCnpj =
	{
		"validaCpf" :  function (cpf){
		
			if (/[^\d. -]/g.test(cpf)) return false;
			
			cpf = cpf.replace(/[^\d]/g, "");
			if (cpf.length != 11 
				|| cpf == "00000000000" 
				|| cpf == "11111111111" 
				|| cpf == "22222222222" 
				|| cpf == "33333333333" 
				|| cpf == "44444444444" 
				|| cpf == "55555555555" 
				|| cpf == "66666666666" 
				|| cpf == "77777777777" 
				|| cpf == "88888888888" 
				|| cpf == "99999999999"
				|| cpf == "12345678909") {
				  return false;
			}

			soma = 0;
			var i = 0;
			for (i = 0; i < 9; i++) { 
			   	 soma += parseInt(cpf.charAt(i)) * (10 - i);
			}
			
			resto = 11 - (soma % 11);
			if (resto == 10 || resto == 11) resto = 0;
			if (resto != parseInt(cpf.charAt(9))) return false;
			soma = 0;
			for (i = 0; i < 10; i ++) {
				soma += parseInt(cpf.charAt(i)) * (11 - i);
			}
			resto = 11 - (soma % 11);
			if (resto == 10 || resto == 11)	resto = 0;
			if (resto != parseInt(cpf.charAt(10))) return false;
			return true;
		}
	};

function Avisos() {
	return {
		erros : [],

		adicionarErro : function(message) {
			var erro = {
				id : null,
				message : message
			};
			this.erros.push(erro);
		},

		substituirIdErros: function(fieldId, targetFieldId) {
			$(this.erros).each(function(i, erro) {
				if (erro.id == fieldId) {
					erro.id = targetFieldId;
				}
			});
		},

		adicionarErroCampo : function(fieldId, message) {
			var erro = {
				id : fieldId,
				message : message
			};
			this.erros.push(erro);
		},

		temErroCampo: function (fieldId) {
			var temErro = false;
			$(this.erros).each(function(i, erro) {
				if (erro.id && erro.id == fieldId) {
					temErro = true;
				}
			});
			return temErro;
		},

		debug: function() {
			var messages = [];
			for (var i in this.erros) {
				var erro = this.erros[i];
				messages.push("[" + erro.id + "] - " + erro.message);
			}
			if (messages.length > 0) {
				alert(messages.join("\n"));
			}
		}
	};
};


function toDateDDMMYYYY(value) {
	if (value == null) {
		return null;
	}
	var RE = /^(\d{4})-(\d{2})-(\d{2}).*$/;
	if (RE.test(value)) {
		var dateValue = RE.exec(value);
		if (dateValue == null)
			return null;
		return dateValue[3] + "/" + dateValue[2] + "/" + dateValue[1];
	} else {
		RE = new RegExp("^-?\\d+$");
		if (RE.test(value)) {
			var data = new Date(parseFloat(value));
			var dia = "00" + data.getDate();
			var mes = ("00" + (data.getMonth() + 1));
			dia = dia.substring(dia.length - 2);
			mes = mes.substring(mes.length - 2);
			var dataString =  dia + "/" +  mes + "/" + data.getFullYear();
			return dataString;
		}
	}
	return null;
}


function normalize(valor, defaultValue) {
	if (defaultValue == undefined) {
		defaultValue = null;
	}
	if (valor == null) {
		return defaultValue;
	}
	valor = valor.replace(/^\s+|\s+$/g,"");
	if (valor == "") {
		return defaultValue;
	}
	return valor;
}

function validar(pRegras, customCreateForm) {
	var form = null;
	if (customCreateForm && $.type(customCreateForm) == 'function') {
		form = customCreateForm();
	} else {
		form = createForm();
	}

	var avisos = new Avisos();

	var regras = pRegras;
	if (typeof(pRegras) == 'string') {
		regras = [pRegras];
	}
	for (i in regras) {
		var regra = regras[i];
		FS.REGRAS[regra](form, avisos);
	}

	return avisos;
}

(function($){

	$.fn.clearErrors = function (opts) {
		var options = $.extend({omitirSucesso: false, forcarSemClasse: false, removeValidation: false}, opts);
		return this.each(function() {
			var inputField = $(this);
			var omitirSucesso = options.omitirSucesso;
			if (inputField) {
				var parentDiv = inputField.parents('.form-msg-parent').first();
				var errorField = parentDiv.find('.form-msg').first();
				parentDiv.removeClass("form-erro");
				if (inputField.data("validated") && !options.forcarSemClasse) {
					if (!omitirSucesso) {
						parentDiv.addClass("form-sucesso");
					}
				}
				if (options.forcarSemClasse) {
					parentDiv.removeClass("form-sucesso");
				}
				if (errorField) {
					errorField.text("");
					errorField.hide();
				}
				if (options.removeValidation) {
					inputField.removeData("validated");
				}
			}
		});
	};


	$.fn.clearAllErrors = function (opts) {
		return this.each(function() {
			var me = $(this);
			if (me.context && me.context.tagName && me.context.tagName == 'FORM') {
				$('input, select, textarea', me).clearErrors(opts);
			} else {
				me.clearErrors(opts);
			}
		});
	};



	$.setGlobalError = function(error) {
		$(".form-erro-geral lista-erros").append("<li></li>").text(error.message);
	};

	$.showGlobalErrors = function() {
		$(".form-erro-geral").show();
	};

	$.hideGlobalErrors = function() {
		$(".form-erro-geral").hide();
	};

	$.hasError = function (inputName) {
		var inputField = $("*[name='" + inputName + "']").first();
		if (inputField.length > 0) {
			var parentDiv = inputField.parents('.form-msg-parent').first();
			return parentDiv.hasClass("form-erro");
		}
		return false;
	};
	
	$.setError = function (error) {
		if (error.id != null) {
			var inputField = $("*[name='" + error.id + "']").first();
			if (inputField.length > 0) {
				var parentDiv = inputField.parents('.form-msg-parent').first();
				var errorField = parentDiv.find('.form-msg').first();
				parentDiv.removeClass("form-sucesso");
				parentDiv.addClass("form-erro");
				if (errorField.length > 0) {
					errorField.text(error.message);
					errorField.show();
					errorField.queue(function() {
						inputField.trigger('validationerror', {error: error, field: inputField, errorEl: errorField});
					});
				} else {
					$.setGlobalError(error);
				}
			} else {
				alert("$.setError: Campo '" + inputField.attr('name') + "'/'" + error.id + "' not found");
			}
		}
	};

	$.fn.setGlobalValidationOptions = function (opts) {
		var options = $.extend({customCreateForm: window.createForm, mainForm: 'formPadrao'}, opts);
		return this.each(function(){
			var me = $(this);
			me.data('global-validation-options', options);
			if (me.context && me.context.tagName && me.context.tagName == 'FORM') {
				$('input, select, textarea', me).setGlobalValidationOptions(options);
			}
		});
	};

	$.fn.validate = function(ruleNames, opts) {
		var validationContext = {};
		if ($.type(ruleNames) == 'string') {
			ruleNames = [ruleNames];
		} else if ($.type(ruleNames) == 'undefined') {
			ruleNames = null;
		}
		this.each(function(){
			var me = $(this);
			var globalValidationOptions = me.data('global-validation-options');
			var ruleInputsScopes = [];
			if (me.context && me.context.tagName && me.context.tagName == 'FORM') {
				ruleNames = ruleNames || [];
				$('input, select, textarea', me).each(function() {
					var scope = $(this);
					scope.data("validated", true);
					var validateOptions = scope.data('validateOptions');
					if (validateOptions != undefined && validateOptions.ruleNames && validateOptions.ruleNames.length > 0) {
						ruleNames = $.merge(ruleNames, validateOptions.ruleNames);
						$(ruleNames).each(function(i, ruleName) {
							ruleInputsScopes[ruleName] = scope;
						});
					};

				});
			};
			if (ruleNames != null) {
				var scope = me;
				if (globalValidationOptions && globalValidationOptions.customCreateForm) {
					validationContext.formCalculo = globalValidationOptions.customCreateForm();
				} else {
					validationContext.formCalculo = createForm();
				}
				
				var mainForm = 'formPadrao';
				if (globalValidationOptions && globalValidationOptions.mainForm) {
					mainForm = globalValidationOptions.mainForm;
				}
				validationContext.formPrincipal = validationContext.formCalculo[mainForm];
				validationContext.avisos = new Avisos();
				var parms = [validationContext.formPrincipal, validationContext.avisos, validationContext.formCalculo];
				ruleNames = $.unique(ruleNames);
				$(ruleNames).each(function(i, ruleName){
					if (ruleInputsScopes[ruleName]) {
						scope = ruleInputsScopes[ruleName];
					}
					if (FS.REGRAS[ruleName] == undefined) {
						$.log('A regra ' + ruleName + ' estÃ¡ undefined');
					}
					FS.REGRAS[ruleName].apply(scope, parms);
				});
				$(ruleNames).each(function(i, ruleName){
					if (ruleInputsScopes[ruleName]) {
						scope = ruleInputsScopes[ruleName];
					}
					var fieldId = scope.attr('name');
					if (!validationContext.avisos.temErroCampo(fieldId)) {
						scope.clearErrors();
					}
				});
				validationContext.temErros = validationContext.avisos.erros.length > 0;
			}
			if (me.context && me.context.tagName && me.context.tagName == 'FORM') {
				$('input, select', me).each(function() {
					var scope = $(this);
					var validateOptions = scope.data('validateOptions');
					if (validateOptions != undefined && validateOptions.ruleNames && validateOptions.ruleNames.length > 0) {
						if (!validationContext.avisos.temErroCampo(scope.attr('name'))) {
							scope.clearErrors();
						}
					};

				});
			};
		});
		if (validationContext.temErros) {
			$(validationContext.avisos.erros).each(function(i, erro) {
				$.setError(erro);
			});
		}
		return validationContext;
	};
	
	$.validate = function(opts) {
		// create form padrÃ£o Ã© serializar o formulÃ¡rio como objeto
		opts.createForm = opts.createForm || function() {
			return opts.form.serializeAsObject();
		};
		
		opts.form.setGlobalValidationOptions({customCreateForm: opts.createForm});	
		
		opts.bind = opts.bind || {};
		// associar as validaÃ§Ãµes
		$.each(opts.bind, function(selector, regra) {
			if ($.type(regra) == 'string') {
				$(selector, opts.form).validateOnEvent(regra);
			} else {
				$(selector, opts.form).validateOnEvent(regra.rule || regra.regra, regra);
			}
		});
		
	};

	$.fn.validateOnEvent = function(ruleNames, opts) {
		var usingDefaultEvent = !opts || !opts["event"];
		var options = $.extend({
			event: 'blur',
			selectDefaultEvents: 'change keypress',
			radioDefaultEvents: 'change click',
			ruleNames: ruleNames,
			ruleFunction: $.fn.validate,
			validateOnBlank: false,
			after: null,
			before: null
		}, opts);
		if ($.type(options.ruleNames) == 'undefined') {
			options.ruleNames = null;
		}
		if ($.type(options.ruleNames) == 'string') {
			options.ruleNames = [options.ruleNames];
		}
		$(this).data('validateOptions', options);

		return $(this).each(function(){
			if (usingDefaultEvent) {
				if ($(this).context.tagName == 'SELECT') {
					options.event = options.selectDefaultEvents;
				}
				if ($(this).is(":radio")) {
					options.event = options.radioDefaultEvents;
				}
			}
			$(this).bind(options.event, function() {
				if (!options.validateOnBlank && !$(this).data("validated") && !$(this).data("disable-validations") ) {
					if ($(this).val() == undefined || $(this).val() == null || $.trim($(this).val()) == "" || ($(this).context.type == 'radio' && !$(this).is(":checked"))) {
						$(this).clearErrors();
						if (options.after) {
							options.after.call($(this), validationContext);
						}
						return;
					} else {
						$(this).data("validated", true);	
					}
				}
				if (options.before) {
					options.before.apply(this);
				}
				var validationContext = options.ruleFunction.call($(this), options.ruleNames);
				if (options.after) {
					options.after.call($(this), validationContext);
				}
			});
		});
	};
})(jQuery);/**
 * Autotab - jQuery plugin 1.1b
 * http://www.lousyllama.com/sandbox/jquery-autotab
 * 
 * Copyright (c) 2008 Matthew Miller
 * 
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 * 
 * Revised: 2008-09-10 16:55:08
 */

(function($) {
// Look for an element based on ID or name
var check_element = function(name) {
	var obj = null;
	var check_id = $('#' + name);
	var check_name = $('input[name=' + name + ']');

	if(check_id.length)
		obj = check_id;
	else if(check_name != undefined)
		obj = check_name;

	return obj;
};

/**
 * autotab_magic automatically establishes autotabbing with the
 * next and previous elements as provided by :input.
 * 
 * autotab_magic should called after applying filters, if used.
 * If any filters are applied after calling autotab_magic, then
 * Autotab may not protect against brute force typing.
 * 
 * @name	autotab_magic
 * @param	focus	Applies focus on the specified element
 * @example	$(':input').autotab_magic();
 */
$.fn.autotab_magic = function(focus) {
	for(var i = 0; i < this.length; i++)
	{
		var n = i + 1;
		var p = i - 1;

		if(i > 0 && n < this.length)
			$(this[i]).autotab({ target: $(this[n]), previous: $(this[p]) });
		else if(i > 0)
			$(this[i]).autotab({ previous: $(this[p]) });
		else
			$(this[i]).autotab({ target: $(this[n]) });

		// Set the focus on the specified element
		if(focus != null && (isNaN(focus) && focus == $(this[i]).attr('id')) || (!isNaN(focus) && focus == i))
			$(this[i]).focus();
	}
	return this;
};

/**
 * This will take any of the text that is typed and
 * format it according to the options specified.
 * 
 * Option values:
 *	format		text|number|alphanumeric|all|custom
 *	- Text			Allows all characters except numbers
 *	- Number		Allows only numbers
 *	- Alphanumeric	Allows only letters and numbers
 *	- All			Allows any and all characters
 *	- Custom		Allows developer to provide their own filter
 *
 *	uppercase	true|false
 *	- Converts a string to UPPERCASE
 * 
 *	lowercase	true|false
 *	- Converts a string to lowecase
 * 
 *	nospace		true|false
 *	- Remove spaces in the user input
 * 
 *	pattern		null|(regular expression)
 *	- Custom regular expression for the filter
 * 
 * @name	autotab_filter
 * @param	options		Can be a string, function or a list of options. If a string or
 *						function is passed, it will be assumed to be a format option.
 * @example	$('#number1, #number2, #number3').autotab_filter('number');
 * @example	$('#product_key').autotab_filter({ format: 'alphanumeric', nospace: true });
 * @example	$('#unique_id').autotab_filter({ format: 'custom', pattern: '[^0-9\.]' });
 */
$.fn.autotab_filter = function(options) {
	var defaults = {
		format: 'all',
		uppercase: false,
		lowercase: false,
		nospace: false,
		pattern: null
	};

	if(typeof options == 'string' || typeof options == 'function')
		defaults.format = options;
	else
		$.extend(defaults, options);

	for(var i = 0; i < this.length; i++)
	{
		$(this[i]).bind('keyup', function(e) {
			var val = this.value;

			switch(defaults.format)
			{
				case 'text':
					var pattern = new RegExp('[0-9]+', 'g');
					val = val.replace(pattern, '');
					break;

				case 'alpha':
					var pattern = new RegExp('[^a-zA-Z]+', 'g');
					val = val.replace(pattern, '');
					break;

				case 'number':
				case 'numeric':
					var pattern = new RegExp('[^0-9]+', 'g');
					val = val.replace(pattern, '');
					break;

				case 'alphanumeric':
					var pattern = new RegExp('[^0-9a-zA-Z]+', 'g');
					val = val.replace(pattern, '');
					break;

				case 'custom':
					var pattern = new RegExp(defaults.pattern, 'g');
					val = val.replace(pattern, '');
					break;

				case 'all':
				default:
					if(typeof defaults.format == 'function')
						var val = defaults.format(val);

					break;
			}

			if(defaults.nospace)
			{
				var pattern = new RegExp('[ ]+', 'g');
				val = val.replace(pattern, '');
			}

			if(defaults.uppercase)
				val = val.toUpperCase();

			if(defaults.lowercase)
				val = val.toLowerCase();

			if(val != this.value)
				this.value = val;
		});
	}
};

/**
 * Provides the autotabbing mechanism for the supplied element and passes
 * any formatting options to autotab_filter.
 * 
 * Refer to autotab_filter's description for a detailed explanation of
 * the options available.
 * 
 * @name	autotab
 * @param	options
 * @example	$('#phone').autotab({ format: 'number' });
 * @example	$('#username').autotab({ format: 'alphanumeric', target: 'password' });
 * @example	$('#password').autotab({ previous: 'username', target: 'confirm' });
 */
$.fn.autotab = function(options) {
	var defaults = {
		format: 'all',
		maxlength: 2147483647,
		uppercase: false,
		lowercase: false,
		nospace: false,
		target: null,
		previous: null,
		pattern: null
	};

	$.extend(defaults, options);

	// Sets targets to element based on the name or ID
	// passed if they are not currently objects
	if(typeof defaults.target == 'string')
		defaults.target = check_element(defaults.target);

	if(typeof defaults.previous == 'string')
		defaults.previous = check_element(defaults.previous);

	var maxlength = $(this).attr('maxlength');

	// defaults.maxlength has not changed and maxlength was specified
	if(defaults.maxlength == 2147483647 && maxlength != 2147483647)
		defaults.maxlength = maxlength;
	// defaults.maxlength overrides maxlength
	else if(defaults.maxlength > 0)
		$(this).attr('maxlength', defaults.maxlength)
	// defaults.maxlength and maxlength have not been specified
	// A target cannot be used since there is no defined maxlength
	else
		defaults.target = null;

	if(defaults.format != 'all')
		$(this).autotab_filter(defaults);

	// Go to the previous element when backspace
	// is pressed in an empty input field
	return $(this).bind('keydown', function(e) {
		if(e.which == 8 && this.value.length == 0 && defaults.previous)
			defaults.previous.focus().val(defaults.previous.val());
	}).bind('keyup', function(e) {
		/**
		 * Do not auto tab when the following keys are pressed
		 * 8:	Backspace
		 * 9:	Tab
		 * 16:	Shift
		 * 17:	Ctrl
		 * 18:	Alt
		 * 19:	Pause Break
		 * 20:	Caps Lock
		 * 27:	Esc
		 * 33:	Page Up
		 * 34:	Page Down
		 * 35:	End
		 * 36:	Home
		 * 37:	Left Arrow
		 * 38:	Up Arrow
		 * 39:	Right Arrow
		 * 40:	Down Arrow
		 * 45:	Insert
		 * 46:	Delete
		 * 144:	Num Lock
		 * 145:	Scroll Lock
		 */
		var keys = [8, 9, 16, 17, 18, 19, 20, 27, 33, 34, 35, 36, 37, 38, 39, 40, 45, 46, 144, 145];

		if(e.which != 8)
		{
			var val = $(this).val();

			if($.inArray(e.which, keys) == -1 && val.length == defaults.maxlength && defaults.target)
				defaults.target.focus();
		}
	});
};

})(jQuery);(function($){

	$.jsonPOST = function(userOptions) {
		var options = $.extend(true, 
			{
				type: 'POST',
				contentType: 'application/json',
				beforeSend: function (xmlHttp) {
					xmlHttp.setRequestHeader("Accept", "application/json, text/javascript, */*");
				}
			}, userOptions);

		options.data =  $.toJSON(options.data);
		$.ajax(options);
	};

    $.fn.findNextNode = function (selector) {
    	return this.parents().find(selector).first();
    };

    $.normalizeObject = function (obj, opts) {
    	if (obj == null)
    		return null;
    	var options = $.extend({blankAsNull: true, nullText: null}, opts || {});
    	var newObj = {};
    	if ($.type(obj) === 'array') {
    		newObj = [];
    	}
    	$.each(obj, function(name, value) {
    		if (typeof(value) == 'object') {
    			newObj[name] = $.normalizeObject(value, opts);
    			return;
    		}
    		if (value == undefined) {
    			newObj[name] = null;
    			return;
    		}
    		if (options.blankAsNull) {
	    		if (typeof(value) == 'string' && $.trim(value) == "") {
	    			newObj[name] = null;
	    			return;
	    		}
    		}
    		if (options.nullText) {
	    		if (typeof(value) == 'string' && $.trim(options.nullText) == "") {
	    			newObj[name] = null;
	    			return;
	    		}
    		}
    		newObj[name] = value;
    	});
    	return newObj;
    };

	$.fn.serializeAsObject = function (options) {
		var defaultOptions = {blankAsNull: true};
		options = $.extend(defaultOptions, options || {});
		var formArray = this.serializeArray();
		var rootObject = {};
		var createObject = function(obj, name, value) {
			var index = 0;
			var parentObj = obj;
			while (true) {
				var next = name.indexOf('.', index) + 1;
				var node = "";
				if (next > 0) {
					node = name.substring(index, next - 1);
				} else {
					node = name.substring(index);
				}

				var childObj = parentObj[node];
				if (next > 0) {
					if (childObj == null || typeof(childObj) == 'undefined') {
						childObj = {};
						parentObj[node] = childObj;
					}
				} else {
					if (parentObj[node] !== null && typeof(parentObj[node]) !== 'undefined' && !$.isArray(parentObj[node])) {
						parentObj[node] = [parentObj[node]];
					}
					if ($.isArray(parentObj[node])) {
						parentObj[node].push(value);
					} else {
						parentObj[node] = value;
					}
				}
				parentObj = childObj;
				index = next;
				if (next == 0) {
					break;
				}
			}
		};
		$(formArray).each(function(index, nameValuePair) {
			createObject(rootObject, nameValuePair.name, nameValuePair.value);
		});

		if (options.blankAsNull) {
			rootObject = $.normalizeObject(rootObject);
		}

		return rootObject;
	};

	$.consoleHistory = [];
	
	$.readConsoleLog = function() {
		if ($.toggleConsole.consoleList) {
			if ($.consoleHistory.length > 0) {
				var history = $.consoleHistory.join("</li><li>");
				$.consoleHistory.length = 0;
				var items = "<li>" + history + "</li>";
				$.toggleConsole.consoleList.append(items);
			}
		}
	};
	
	$.applyConsole = function() {
		if (window.console && typeof console.log === "function") {
			$.console_log = function () { console.log.apply(console, arguments); };
		} else {
			$.console_log = function(){ try { $.consoleHistory.push(/*$.toJSON*/($.merge([new Date().getTime()], arguments))); } catch (e) {$.consoleHistory.push(($.merge([new Date()], arguments))); } $.readConsoleLog(); };
			window.console = {log: $.log};
		}
	};
		
	$.toggleConsole = function() {
		if (!$.toggleConsole.console) {
			$("body").append($("<div class='console_logger' style='display: none'><ul></ul></div>"));
			$.toggleConsole.console = $("body > .console_logger");
			$.toggleConsole.consoleList = $.toggleConsole.console.find("ul");
		}
		$.readConsoleLog();
		$.toggleConsole.console.toggle();
	};

	$.log = function() {
		if (!$.console_log) {
			$.applyConsole();
		}
		try {
			$.console_log.apply(this, arguments);
		} catch (e) {
			$.console_log(arguments);
		}
	};

	$.fn.log = function (msg) {
		try {
		  $.log("%s: %o", msg, this);
		  return this;
		} catch (e) {
			// faça nada...
		}
	};

	$.fn.disable = function() {
		return this.each(function() {
			$(this).attr("disabled", true);
		});
	};

	$.fn.enable = function() {
		return this.each(function() {
			$(this).attr("disabled", false);
		});
	};

	$.fn.maskDate = function() {
		return this.each(function() {
			var el = $(this);
			el.bind('keydown', function(e) {
				var removerBarra = el.data('removerBarra');
				if (removerBarra && (e.which == 191 || e.which == 193 || e.which == 111)) {
					e.stopPropagation();
					return false;
				} else {
					el.data('removerBarra', false);
				}

			});
			el.bind('keyup', function(e) {
				var dataString = $.trim(el.val());
				var RE = new RegExp("^(\\d*)/?(\\d*)/?(\\d*)$");
				var ISDIGIT = new RegExp("\\d");
				var data = RE.exec(dataString);
				var removerBarra = el.data('removerBarra');
				if (!((e.which >= 48 && e.which <= 57) || (e.which >= 96 && e.which <= 105))) {
					return;
				}
				if (data == null) {
					return;
				}
				if (parseInt(data[1], 10) > 3 && data[2] == "" || !isNaN(data[1]) && data[1].length == 2) {
					if (dataString.length == 1 || dataString.length == 2) {
						if (ISDIGIT.test(dataString.substring(dataString.length - 1))) {
							el.val(el.val() + "/");
							el.data('removerBarra', true);
							e.stopPropagation();
							return false;
						}
					}
				}
				if (parseInt(data[2], 10) > 1 && data[3] == "" || !isNaN(data[2]) && data[2].length == 2) {
					if (dataString.length == 3 || dataString.length == 4 || dataString.length == 5) {
						if (ISDIGIT.test(dataString.substring(dataString.length - 1))) {
							el.val(el.val() + "/" );
							el.data('removerBarra', true);
							e.stopPropagation();
							return false;
						}
					}
				}
			});
		});
	};


	$.fn.maskPlaca = function() {
		return this.each(function() {
			var el = $(this);
			el.bind('keydown', function(e) {
				var removerTraco = el.data('removerTraco');
				if (removerTraco && (e.which == 191 || e.which == 193 || e.which == 111)) {
					e.stopPropagation();
					return false;
				} else {
					el.data('removerTraco', false);
				}

			});
			el.bind('keyup', function(e) {
				var dataString = $.trim(el.val());
				var RE = new RegExp("^(\\d*)-?(\\d*)/?(\\d*)$");
				var ISDIGIT = new RegExp("\\d");
				var data = RE.exec(dataString);
				var removerTraco = el.data('removerTraco');
				if (!((e.which >= 48 && e.which <= 57) || (e.which >= 96 && e.which <= 105))) {
					return;
				}
				if (data == null) {
					return;
				}
				if (parseInt(data[1], 10) > 3 && data[2] == "" || !isNaN(data[1]) && data[1].length == 2) {
					if (dataString.length == 1 || dataString.length == 2) {
						if (ISDIGIT.test(dataString.substring(dataString.length - 1))) {
							el.val(el.val() + "-");
							el.data('removerTraco', true);
							e.stopPropagation();
							return false;
						}
					}
				}
				if (parseInt(data[2], 10) > 1 && data[3] == "" || !isNaN(data[2]) && data[2].length == 2) {
					if (dataString.length == 3 || dataString.length == 4 || dataString.length == 5) {
						if (ISDIGIT.test(dataString.substring(dataString.length - 1))) {
							el.val(el.val() + "-" );
							el.data('removerTraco', true);
							e.stopPropagation();
							return false;
						}
					}
				}
			});
		});
	};



	$.spriteId = 0;
	$.spriteFunctionId = 0;
	$.fn.createSprite = function (opts) {
		return this.each(function() {
			var el = $(this);
			var options = $.extend({
				spriteSpacing: null,
				spriteSpacingStyleProperty: 'line-height',
				verticalOrientation: false,
				negative: true,
				totalSprites: -1,
				duration: -1,
				checkElement: function() {return true;},
				completed: function() {},
				timeout: function() {},
				status: function(seg, o) {$.log("Aguarde " + seg, o);},
				startOffsetSeconds: 0,
				step: 500,
				data: {}
			}, opts || {});
			options.checkElement(el);
			options.multiplier = options.negative ? -1 : 1;
			var lastOptions = $.spriteOptions(el, undefined, true);
			if (lastOptions) {
				el.clearQueue(lastOptions.data["sprite-queue-name"]);
			}
			var queueName = "sprite-queue" + $.spriteId++;
			$.spriteOptions(el, options);
			el.clearQueue(queueName);
			options.data["sprite-queue-name"] = queueName;
			options.data["elapsed-time-millis"] = options.startOffsetSeconds * 1000;
			var id = $.spriteId++;
			if (options.duration != -1) {
				var duration = options.duration;
				if (typeof(duration) == 'function' ) {
					options.duration = options.duration.call(el);
				}
				for (var sec = 0; sec <= options.duration - options.startOffsetSeconds; sec = sec + (options.step / 1000)) {
					function runNextSprite() {
						var functionId = $.spriteFunctionId++;
						return function(next) {
							try {
								options.data["elapsed-time-millis"] = options.data["elapsed-time-millis"] + options.step;
								el.sprite({elapsed: options.data["elapsed-time-millis"]});
							} catch (e) {
							}
							next();
						};
					}
					el.queue(queueName, runNextSprite());
					el.delay(options.step, queueName);
				}
				el.dequeue(queueName);
			}
		});
	};

	// Save or read sprite options ...
	$.spriteOptions = function(el, options, isCreateSprite) {
		if (options) {
			el.data("smartia-sprite", options);
		} else {
			options = el.data("smartia-sprite");
			if (!options) {
				if (!isCreateSprite) {
					el.createSprite({});
				}
				options = el.data("smartia-sprite");
			}
		}
		return options;
	};

	$.fn.hasSprite = function (callback) {
		return this.each(function() {
			var el = $(this);
			var spriteOptions = el.data("smartia-sprite");
			callback(spriteOptions != null);
		});
	};

	$.fn.sprite = function (opts) {
		return this.each(function() {
			var el = $(this);
			var options = $.spriteOptions(el);
			var spriteNumber = 0;
			if (typeof(opts) == 'object') {
				if (opts.completed) {
					var currentSpriteNumber = options.data["sprite-number"] || 0;
					var currentSpritePercent = Math.round(100*currentSpriteNumber/options.totalSprites);
					var queueName = options.data["sprite-queue-name"];
					var loops = (options.totalSprites - spriteNumber);
					var percentStep = (100 - currentSpritePercent) / loops;
					options.data["sprite-queue-percent-step"] = percentStep;
					options.data["sprite-queue-current-percent"] = currentSpritePercent;
					el.clearQueue(queueName);
					for (var i = 0; i < loops; i++) {
						el.queue(queueName, function(next) {
							var per =   options.data["sprite-queue-current-percent"];
							per = per + options.data["sprite-queue-percent-step"];
							options.data["sprite-queue-current-percent"] = per;
							el.sprite({percent: per, forceCompleted: true});
							if (options.data["sprite-number"] == options.totalSprites) {
								if (opts.continueProcess) {
									opts.continueProcess.call(el);
								}
							}
							next();
						});
						el.delay(40, queueName);
					}
					el.dequeue(queueName);
					return;
				}
				if (opts.elapsed) {
					opts.percent = (100 * opts.elapsed) / (options.duration * 1000);
				}
				if (opts.percent) {
					if (options.totalSprites == -1) {
						throw Error("Para alterar o percentual de sprites, é necessario definir a propriedade totalSprites. Exemplo: $('my_class').setSprite({totalSprites: 12});");
					}
					spriteNumber = opts.percent * options.totalSprites / 100;
				}
			} else {
				spriteNumber = opts;
			}
			opts.completed = opts.completed || opts.forceCompleted;
			var spriteSpacing = options.spriteSpacing;
			if (spriteSpacing == null) {
				var spriteSpacingStyle = el.css(options.spriteSpacingStyleProperty);
				spriteSpacing = parseFloat(spriteSpacingStyle.replace(/[^\d]*/g, ""));
				spriteSpacingUnit = spriteSpacingStyle.replace(/[\d]*/g, "");
			}
			if (spriteNumber > 0.0 && spriteNumber < 1) {
				spriteNumber = 1;
			}
			spriteNumber = Math.round(spriteNumber);
			options.data["sprite-number"] = spriteNumber;
			var width = el.width();
			var height = el.height();
			if (options.verticalOrientation) {
				height = (el.height() + spriteSpacing) * spriteNumber * options.multiplier;
				width = 0;
			} else {
				height = 0;
				width = (el.width() + spriteSpacing) * spriteNumber  * options.multiplier;
			}
			var backgroundPosition = width + spriteSpacingUnit + " " + height + spriteSpacingUnit;
			if (options.totalSprites != -1 && spriteNumber == options.totalSprites) {
				el.clearQueue(options.data["sprite-queue-name"]);
			}
			el.css("background-position", backgroundPosition);
			if (opts.elapsed) {
				options.status(options.duration - (opts.elapsed / 1000),  opts);
			}
			if (options.totalSprites != -1 && spriteNumber >= options.totalSprites) {
				if (opts.completed) {
					options.completed.call(el);
				} else {
					options.timeout.call(el);
				}
			}
		});
	};

	// Esta criação é necessária para que os grupos de radios que não possuam nenhuma radio marcada
	// cheguem ao servidor, pelo POST, com algum valor (no caso, blank). Assim, o Spring pode zerar o
	// bean correspondente.
	$.fn.createBlankValuesForUncheckedRadioGroups = function() {
		return this.each(function() {
			var form$ = $(this);
			var checkedRadioNames = {};
			var blankInputHiddenNames = {};

			// obtem todos os radios marcados
			$("input[type=radio]:checked", form$).each(function() {
				var radioName = $(this).attr('name');
				checkedRadioNames[radioName] = radioName;
			});
			// guarda os nomes únicos dos radios que não estejam na lista de marcados
			$("input[type=radio]", form$).each(function() {
				var radioName = $(this).attr('name');
				if (checkedRadioNames[radioName] == null)
					blankInputHiddenNames[radioName] = radioName;
			});
			// para cada nome de radio (radio group) que não possua radios marcados, cria um input hidden com valor blank
			$.each(blankInputHiddenNames, function(radioName) {
				form$.append('<input type="hidden" value="" name="' + radioName + '"/>');
			});
		});
	};
	
	$.expr[':'].blocked = function (el) {
		var el$ = $(el);
		return el$.data('blocked') || false;
	};
	
	$.doBlock = function (el$, options) {
		el$.data('blocked', true);
		// Backup das configurações de bloqueio
		el$.data('_blocked_options', options);
		// Backup dos atributos relevantes
		el$.data('_blocked_attrs', {
			title: el$.attr('title')
		});
		// Backup de todos os evento atuais
		el$.data('_blocked_events', $.extend(true, {}, el$.data('events'), el$.data('__events__')));
		// Remover todos os eventos que devem ser bloqueados
		el$.unbind(options.blockEvents.join(', '));
		// Função que não faz nada...
		el$.bind('click', $.doNothing);
		// Adicionar classe que faz o bloqueio...
		el$.addClass(options.blockClass);
		// Adicionar mensagem de bloqueio caso exista...
		if (options.blockMessage) {
			el$.attr('title', options.blockMessage);
		}
	};
	
	$.doUnblock = function (el$) {
		// Restore das configurações de bloqueio
		var options = el$.data('_blocked_options');
		var events = el$.data('_blocked_events');
		var attrs = el$.data('_blocked_attrs');

		// Remover as configurações
		el$.removeData('blocked');
		el$.removeData('_blocked_options');
		el$.removeData('_blocked_attrs');
		el$.removeData('_blocked_events');
		
		// Reatribuir os atributos originais
		$.each(attrs, function (name, value) {
			el$.attr(name, value);
		});

		// Remover a função que não faz nada
		el$.unbind('click', $.doNothing);
		
		// Rebind dos eventos originais
		$.each(options.blockEvents, function(i, eventName) {
			$.each(events[eventName] || [], function(i, event) {
				el$.bind(eventName, event.handler || event);
			});
		});
		
		// Adicionar classe que faz o bloqueio...
		el$.removeClass(options.blockClass);
		
	};
	
	$.doNothing = function() {
		$.log("Do nothing!");
		return false;
	};
	
	$.doForParent = function(el$, callback) {
		var options = el$.data('_blocked_options');
		if (options.findParent) {
			var parent$ = options.findParent(el$);
			if (parent$) {
				parent$.each(function() {
					var p$ = $(this);
					if (!p$.is(':blocked')) {
						callback(p$, options);							
					}
				});
			}
		}
	};
	
	$.fn.block = function(opts) {
		var options = $.extend(true, {
			blockClass: 'app-event-block'
			, blockEvents: ['click']
			, blockMessage: "Aguarde..." 
			, findParent: null
			}, opts);
		return this.filter(':not(:blocked)').each(function() {
			var el$ = $(this);
			$.doBlock(el$, options);
			$.doForParent(el$, function(p$, options) {
				$.doBlock(p$, options);	
			});
		});
	};
	
	$.fn.unblock = function(opts) {
		return this.filter(':blocked').each(function() {
			var el$ = $(this);
			$.doForParent(el$, function(p$) {
				$.doUnblock(p$);	
			});
			$.doUnblock(el$);
		});
	};
	
	$.fn.toggleImmediate = function(show) {
		return this.each(function() {
			if (show) {
				$(this).show();
			} else {
				$(this).hide();
			}
		});
	};

	// Substitui, na 'formatString' informada, os placeholders '{n}' pelos valores passados em 'argsArray'. Exemplo:
	// $.stringFormat('Teenage {0} Ninja {1}s... Heroes in a half shell, {1} Power!', ['Mutant', 'Turtle']);
	// resulta em:    'Teenage Mutant Ninja Turtles... Heroes in a half shell, Turtle Power!'
	$.stringFormat = function(formatString, argsArray) {
		$(argsArray).each(function(index, arrayItem) {
			formatString = formatString.replace(new RegExp("\\{" + index + "\\}", "g"), arrayItem);
		});
		return formatString;
	};

	$.getWindowSize = function() {
		if (typeof window.innerWidth  == 'number') {
			width = window.innerWidth;
			height = window.innerHeight;
		} else if(document.documentElement && document.documentElement.clientWidth) {
			width = document.documentElement.clientWidth;
			height = document.documentElement.clientHeight;
		} else {
			width = document.body.clientWidth;
			height = document.body.clientHeight;
		}
		return {"width": parseInt(width, 10), "height": parseInt(height, 10)};
	};

	$.resizeWindow = function(targetWidth, targetHeight) {
		window.resizeTo(targetWidth, targetHeight);
		currentSize = $.getWindowSize();
		var deltaWidth = targetWidth - currentSize.width;
		var deltaHeight = targetHeight - currentSize.height;
		window.resizeTo(targetWidth + deltaWidth, targetHeight + deltaHeight);
	};

	$.ensureMinWindowSize = function(minWidth, minHeight) {
		$(window).unbind('resize.ensureMinWindowsSize').bind('resize.ensureMinWindowsSize', function() {
			var currentSize = $.getWindowSize();
			if (minWidth > currentSize.width || minHeight > currentSize.height) {
				var targetWidth = currentSize.width < minWidth ? minWidth : currentSize.width;
				var targetHeight = currentSize.height < minHeight ? minHeight : currentSize.height;
				$.resizeWindow(targetWidth, targetHeight);
			}
		});
	};

	$.aspect = function(obj, opts) {
		opts = opts || {};
		var aspect = $.extend({
				before: function(before) {

				}
				,around: function(aop) {
					return aop.proceed();
				}
				,afterReturning: function(afterReturning) {

				}
				,afterThrowing: function(afterThrowing) {

				}
				,after: function(after) {

				}
			}, opts.aspect || {});
		var options = $.extend({
			defaultExcludeObjects: [$]
			,defaultExcludeObjectTest: function(object) {
				return false;
			}
			,excludedProperties: ["_prototype"]
			,excludePropertyTest: function(name, value) {
				return false;
			}
		}, opts);
		options.aspect = aspect;
		var testExcludeObject = function(obj) {
			if ($.inArray(obj, options.defaultExcludeObjects) > -1) {
				return true;
			}
			options.defaultExcludeObjectTest(obj);
			return false;
		};
		var testExcludeProperty = function(name, targetFunction) {
			if ($.inArray(name, options.excludedProperties) > -1) {
				return true;
			}
			options.excludePropertyTest(name, targetFunction);
			return false;
		};
		var AopProxyFunction = function(obj, name, targetFunction, aspect) {
			this.IS_AOP_FUNCTION = true;
			return function() {
				var scope = this;
				var aop = {name: name, args: arguments, scope: scope, me: obj, "proceed": function() {
					return targetFunction.apply(aop.scope, aop.args);
				}};
				var value;
				var error;
				aspect.before.call(scope, {name: name, args: arguments, scope: scope, me: obj});
				try {
					value = aspect.around(aop);
					aspect.afterReturning.call(scope, {name: name, args: arguments, scope: scope, me: obj, returnValue: value});
				} catch (e) {
					error = e;
					aspect.afterThrowing.call(scope, {name: name, args: arguments, scope: scope, me: obj, error: error});
					throw e;
				} finally {
					aspect.after.call(scope, {name: name, args: arguments, scope: scope, me: obj, error: error, returnValue: value});
				}
				return value;
			};
		};
		var applyAspect = function(obj) {
			if ($.type(obj) == 'object' && !testExcludeObject(obj)) {
				$.each(obj, function(name, targetFunction) {
					if (targetFunction != null && $.type(targetFunction) == "function" && !testExcludeProperty(name, targetFunction) && !targetFunction.IS_AOP_FUNCTION) { // Só																													// functions...
						obj[name] =	new AopProxyFunction(obj, name, targetFunction, options.aspect);
					}
				});
			}
			return obj;
		};
		return applyAspect(obj);

	};

	$.logAspect = function(obj, opts) {
		var clone = function(target) {
			var dest = [];
			for(var v = 0; v < target.length; v++) {
				dest[v] = target[v];
			}
			return dest;
		};
		var repeat = function(num, str) {
		    return new Array(isNaN(num)? 1 : ++num).join(str);
	    };
		var createMessage = function(template, args) {
			var messageTemplate = clone(template);
			$.each(messageTemplate, function(i, message) {
				if ($.type(message) == 'number') {
					messageTemplate[i] = args[messageTemplate[i]];
				}
			});
			return messageTemplate;
		};
		var depth = 0;
		var options = $.extend({
			messagesTemplates: {
				"before": [0, 4, "inicio >>", 1,"(", 2, ")"]
				,"afterThrowing": [0, 5, "fim    <<", 1, "(", 2, ") Erro: ", 3]
				,"afterReturning": [0, 5, "fim    <<", 1, "(", 2, ") Retornando: ", 3]
				,"afterReturning_sem_retorno": [0, 5, "fim    <<", 1, "(", 2, ")"]
			}
			,enableDepth: true
			,messagePrefix: "\tjsAOP "
			,depthChar: "  "
			,ownerToString: function(obj) {
				return obj;
			}
			,aspectConfig: {
				aspect:{
					before: function(aop) {
						var args = ["", aop.name, aop.args, aop.scope, options.ownerToString(aop.me)];
						if (options.enableDepth) {
							args[0] = repeat(depth, options.depthChar);
							depth++;
						}
						args[0] = options.messagePrefix + args[0];
						if (aop.args.length == 0)
							args[2] = "";
						var logMessage = createMessage(options.messagesTemplates.before, args);
						$.log.apply(this, logMessage);
					}
					,afterThrowing: function(aop) {
						var args = ["", aop.name, aop.args, aop.error, aop.scope, options.ownerToString(aop.me)];
						if (options.enableDepth) {
							depth--;
							args[0] = repeat(depth, options.depthChar);
						}
						args[0] = options.messagePrefix + args[0];
						if (aop.args.length == 0)
							args[2] = "";
						var logMessage = createMessage(options.messagesTemplates.afterThrowing, args);
						$.log.apply(this, logMessage);
					}
					,afterReturning: function(aop) {
						var args = ["", aop.name, aop.args, aop.returnValue, aop.scope, options.ownerToString(aop.me)];
						if (options.enableDepth) {
							depth--;
							args[0] = repeat(depth, options.depthChar);
						}
						args[0] = options.messagePrefix + args[0];
						if (aop.args.length == 0)
							args[2] = "";
						var template = aop.returnValue ? options.messagesTemplates.afterReturning : options.messagesTemplates.afterReturning_sem_retorno;
						var logMessage = createMessage(template, args);
						$.log.apply(this, logMessage);
					}
				}
			}
		}, opts);
		return $.aspect(obj, options.aspectConfig);
	};

	$.getWindowSize = function() {
		if (typeof window.innerWidth  == 'number') {
			width = window.innerWidth;
			height = window.innerHeight;
		} else if(document.documentElement && document.documentElement.clientWidth) {
			width = document.documentElement.clientWidth;
			height = document.documentElement.clientHeight;
		} else {
			width = document.body.clientWidth;
			height = document.body.clientHeight;
		}
		return {"width": parseInt(width, 10), "height": parseInt(height, 10)};
	};

	$.resizeWindow = function(targetWidth, targetHeight) {
		window.resizeTo(targetWidth, targetHeight);
		// devido a bordas, toolbars etc, o tamanho efetivo fica incorreto - calcula a diferença e redimensiona para compensar
		currentSize = $.getWindowSize();
		var deltaWidth = targetWidth - currentSize.width;
		var deltaHeight = targetHeight - currentSize.height;
		window.resizeTo(targetWidth + deltaWidth, targetHeight + deltaHeight);
	};

	$.ensureMinWindowSize = function(minWidth, minHeight) {
		var func = function() {
			var currentSize = $.getWindowSize();
			if (minWidth > currentSize.width || minHeight > currentSize.height) {
				var targetWidth = currentSize.width < minWidth ? minWidth : currentSize.width;
				var targetHeight = currentSize.height < minHeight ? minHeight : currentSize.height;
				$.resizeWindow(targetWidth, targetHeight);
			}
		};
		$(window).unbind('resize.ensureMinWindowsSize').bind('resize.ensureMinWindowsSize', func);
		func();
	};

	String.prototype.padLeft = function(n, pad)
	{
		t = '';
		if(n>this.length){
			for(i=0;i < n-this.length;i++){
				t+=pad;
			}
		}
		return t+this;
	};

	String.prototype.padRight = function(n, pad)
	{
		t = this;
		if(n>this.length){
			for(i=0;i < n-this.length;i++){
				t+=pad;
			}
		}
		return t;
	};


	$.ajaxSetup({
		type: "POST"
		,cache: false
	});
	
	$.__ajax = $.ajax;
	
	$.ajax = function(opts) {
		if ($.type(opts) == 'object') {
			opts.cache = false;
			if (opts.url) {
				var dynamic = new Date().getTime();
				if (opts.url.indexOf('?') > -1) {
					opts.url = opts.url + "&t=" + dynamic;
				} else {
					opts.url = opts.url + "?t=" + dynamic;
				}
			}
		}
		$.__ajax.call(this, opts);
		return $.__ajax;
	};
	
	$.getJSON = function( url, data, callback ) {
		return $.post(url, data, callback, "json");
	};
	
	
	
	$.fn.marcadaguaUpdate = function () {
		return this.each(function () {
			var el = $(this);
			var showOrHideMarcaDagua = el.data('marcadagua-options').showOrHideMarcaDagua;
			if (showOrHideMarcaDagua) {
				showOrHideMarcaDagua();
			}
		});
	};
	
	$.marcadaguaFields = [];
	$.marcadaguaCheckDirty = function() {
		for(var i = 0; i < $.marcadaguaFields.length; i++) {
			var field = $.marcadaguaFields[i];
			if (field.val() != '') {
				if (field.data('isMarcadaguaShowing')) {
					field.marcadaguaUpdate();
				}
			};
		}
		if ($.marcadaguaFields.length != 0) {
			window.setTimeout($.marcadaguaCheckDirty, 200);
		}
	};
	
	$.fn.forceUpperCase = function() {
		return this.bind('blur', function() {
			var val = this.value || "";
			val = val.toUpperCase();
			if (val != this.value) {
				this.value = val;
			}
		});
	};
	
	// Customizado de http://that-matt.com/2010/04/updated-textarea-maxlength-with-jquery-plugin/
	$.fn.maxLengthForTextarea = function(options) {
		 var settings = $.extend({
	          attribute: "data-maxlength"
	         , onLimitEvent: 'limit'
	         , onEditEvent: 'typing'
        	 , truncate: false
	         , findCounter: function(event, maxlength, remaining) {
	        	 var idTextarea = $(this).attr('id');
	        	 if ($.type(idTextarea) == 'string') {	 
	        		 $(".contador_" + idTextarea).text(remaining).toggleClass('negativo', remaining < 0);
	        	 }
	         }
	     }, options);
	    // Event handler to limit the textarea
		 var onEdit = function() {
	        var textarea = $(this);
	        var maxlength = parseInt(textarea.attr(settings.attribute));
	        var used = textarea.val().length;
	        if (settings.truncate && used > maxlength) {
	            textarea.val(textarea.val().substr(0, maxlength));
	            // Call the onlimit handler within the scope of the textarea
	            textarea.trigger(settings.onLimitEvent, [maxlength]);
	        }
	        // Call the onEdit handler within the scope of the textarea
	        textarea.trigger(settings.onEditEvent, [maxlength, maxlength - used]);
	    };
	    return this.find("textarea[data-maxlength]").on('keyup keydown focus', onEdit).on('input paste', onEdit).on('typing', settings.findCounter || function() {}).each(onEdit);	    
	};
	
	/*$.fn.limitarCaracteres = function(options) {		
		var defaults = {  
			maxCarateresMensagem: 1000,  
			seletorContador: '#max_mensagem',
			corFonteContador: '#bbb', 
			resetarContador: false
		};  		
		var options = $.extend(defaults, options);
		var contador = $(options.seletorContador);
		contador.html(options.maxCarateresMensagem);
		if (options.resetarContador) return;
		return this.each(function() {
			$(this).bind('keyup keydown', function() {
				var totalCaracteres = $(this).val().length;
				var caracteresFaltando = parseInt(options.maxCarateresMensagem - totalCaracteres);
				if (caracteresFaltando < 0) contador.css('color', 'red');				
				else contador.css('color', options.corFonteContador);
				contador.html(caracteresFaltando);
			});
		});		
	};*/

	$.fn.tornaTextoExpansivel = function(opts) {
		var options = $.extend({tamanhoResumo: 200, textoLink: 'ver texto completo'}, opts);
		return this.each(function() {
			//debugger;
			var me$ = $(this);
			if (me$.children().length > 0) {
				$.log("O plugin tornaTextoExpansivel só deve ser aplicado em elementos que contenham apenas texto. Pulando este elemento...", me$);
				return;
			}
			var textoOriginal = me$.text();
			if (textoOriginal && textoOriginal.length > options.tamanhoResumo) {
				var dataKey = 'textoOriginal';
				me$.data(dataKey, textoOriginal);
				var tagName = this.nodeName.toLowerCase();
				var textoResumido = textoOriginal.substr(0, options.tamanhoResumo);
				var htmlResumo = textoResumido + "... <a>" + options.textoLink + "</a></" + tagName + ">";
				me$.html(htmlResumo).find('a').one('click', function() {
					var texto$ = $(this).parent();
					texto$.text(texto$.data(dataKey)).removeData(dataKey);
				});
			}
		});
	};
	
	$.fn.autoTabNumerico = function() {
		return this.autotab_magic().autotab_filter('numeric');
	};
	
	$.fn.marcadagua = function (opts) {
		var options = $.extend({targetSelector: '.marcadagua_target', 
		onresize: function(marcadaguaEl, inputEl, marcadaguaParent) {
			var pos = marcadaguaParent.position();
			//marcadaguaEl.css('left', pos.left + "px");
			//marcadaguaEl.css('top', pos.top + "px");
		},
		onshow: function(marcadaguaEl, inputEl, marcadaguaParent) {
			
		}, 
		onhide: function(marcadaguaEl, inputEl, marcadaguaParent){
			
		}}, opts);
		return this.each(function() {
			var el = $(this);
			var myoptions = $.extend({
				
			}, options);
			var target = el.prev(options.targetSelector);
			var field = target.find('input,textarea').first();
			if (field != null) {
				if (field.length == 1) {
					var isAutocompleteDisabled = "off" == field.attr('autocomplete');
					field.data('isMarcadaguaShowing', false);
					var showOrHideMarcaDagua = function(type) {
						options.onresize(el, field, target);
						if (field.val() != '') {
							el.hide();
							field.data('isMarcadaguaShowing', false);
							options.onhide(el, field, target);
						} else {
							if (type == 'forceshow') {
								el.show();
							} else {
								el.fadeIn();
							}
							field.data('isMarcadaguaShowing', true);
							options.onshow(el, field, target);
						}
						options.onresize(el, field, target);
					};
					myoptions.showOrHideMarcaDagua = showOrHideMarcaDagua;
					el.data('marcadagua-options', myoptions);
					field.data('marcadagua-options', myoptions);
					field.bind('blur keyup focus', showOrHideMarcaDagua);
					showOrHideMarcaDagua('forceshow');
					el.click(function() {
						field.click();
						setTimeout(function() { 
							field.focus();
						}, 50);
					});
					el.dblclick(function() {
						field.dblclick();
						setTimeout(function() { 
							field.focus();
						}, 50);
					});
					el.mousedown(function() {
						field.mousedown();
						setTimeout(function() { 
							field.focus();
						}, 50);
					});
					field.bind('validationerror', function(context) {
						/*var me = $(this);
						el.hide();
						function upMe() {
							me.marcadaguaUpdate();
						}
						me.delay(100).queue(upMe).delay(100).queue(upMe).delay(200).queue(upMe).delay(1000).queue(upMe);
						*/
					});
					if (!isAutocompleteDisabled) {
						$.marcadaguaFields.push(field);
						if ($.marcadaguaFields.length == 1) {
							$.marcadaguaCheckDirty();
						}
					}
				} 
			}
		});
	};
	
	$.re = {
		email : new RegExp("^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\\.)+[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?$")
	};
	
	$.fn.center = function () {
        return this.each(function() { 
        	var w = $(window);
        	var me = $(this);
        	var top = Math.max((w.height() - me.outerHeight(true)) / 2, 0) + w.scrollTop() + "px";
            var left = Math.max((w.width() - me.outerWidth(true)) / 2, 0) + w.scrollLeft() + "px";
            $.log(me, top, left, w);
            me.css({position:'absolute', margin:0, top: top, left: left});
        });
    };
	
	$.fatalDiv = null;
	$.fatalErrorDisable = false;
	$.disableFatalError = function() {
		$.fatalErrorDisable = true;
	};
	
	$(window).bind('unload', $.disableFatalError);
	$(window).bind('beforeunload', $.disableFatalError);
	$(document).bind('unload', $.disableFatalError);
	$(document.body).bind('unload', $.disableFatalError);
	$(document.body).bind('unload', $.disableFatalError);
	
	if ("onpagehide" in window) {
		window.addEventListener("pagehide", $.disableFatalError, false);
	}
	 
	$.fatalError = function(opts, opts2) {
		if ($.fatalErrorDisable) {
			return;
		} 
		var options = {title: "Ocorreu um erro", message: "Por favor aguarde um momento e tente novamente."};
		if (opts && $.type(opts) == 'string') {
			options.message = opts;
			if (opts2 && $.type(opts2) == 'string') {
				options.title = opts2;
			}
		} else {
			options = $.extend(options, opts || {});
		}
		if ($.fatalDiv == null) {
			$.fatalDiv = $(document.body).append("<div class='fatalerror' style='display: none'><a title='Fechar Janela' class='ico_fechar' href='#'><span>Fechar Janela</span></a><h2 class='fatalerror-title'></h2><p class='fatalerror-text'></p></div>").find('.fatalerror');
		}
		$.fatalDiv.find('.fatalerror-title').html(options.title);
		$.fatalDiv.find('.fatalerror-text').html(options.message);
		$.fatalDiv.find('.ico_fechar').click(function() {
			$.mask.close();
			return false;
		});
		if ($.mask && $.mask.getExposed()) {
			$.mask.getExposed().clearQueue();
		}
		$.fatalDiv.expose({onLoad: function() {
			var me = this;
			$.fatalDiv.center().show().center();
		},onClose: function() {
			$.fatalDiv.hide();
		}});
	};

	window.j$cache = {};
	window.j$stats = {totalHits: 0, totalMiss: 0, savedTime: 0, usedTime: 0, hits: {}, miss:{}, times: {},
		addHit: function(key) {window.j$stats.hits[key]++; window.j$stats.savedTime = window.j$stats.savedTime + window.j$stats.times[key];}
		,addMiss: function(key) {window.j$stats.miss[key] = (window.j$stats.miss[key] || 0) + 1;}
	};
	window.j$disable = false;
	window.j$ = function() {
		if (window.j$disable) {
			if (arguments.length == 1 && typeof(arguments[0]) == 'string' && (arguments[0].indexOf(':') == -1 || arguments[0].indexOf('=') == -1)) {
				var s = new Date().getTime();
				var val = $.apply(this, arguments);
				var t = new Date().getTime() - s;
				window.j$stats.usedTime = window.j$stats.usedTime + t;
				return val;
			} else {
				return $.apply(this, arguments);
			}
		}
		if (arguments.length == 1 && typeof(arguments[0]) == 'string' && (arguments[0].indexOf(':') == -1 || arguments[0].indexOf('=') == -1)) {
			var key = arguments[0];
			var val = window.j$cache[key];
			if (!val) {
				var s = new Date().getTime();
				val = $(key);
				var t = new Date().getTime() - s;
				window.j$cache[key] = val;
				window.j$stats.times[key] = t;
				window.j$stats.hits[key] = 0;
				//$.log("Created cache for", key, {el: val}, "in", t, "ms");
			} else {
				//$.log("Has cache for", key, val);
				window.j$stats.addHit(key);
			}
			return val;
		} else {
			//$.log("Cant cache multiple arguments for", key, arguments);
			window.j$stats.addMiss(key);
			return $.apply(this, arguments);
		}
	};
	
	
	$.hideSWF = function() {
		$("object,embed").css('visibility', 'hidden');
	};
	
	$.smartiaTooltipDefaults = {
			// use div.tooltip as our tooltip
			//tip: '.tooltip',
			events: {
				def: 'click, close',
				tooltip: 'click, close'
			},
			// use the fade effect instead of the default
						
			effect: navigator.userAgent.match(/msie/i) ? 'toggle' : 'fade', // IE Hack: ClearType with DXTransforms in IE7 ( http://blogs.msdn.com/b/ie/archive/2006/08/31/730887.aspx )
			// how long the tooltip remains visible after the mouse leaves the trigger.
			delay: 150,
			// make fadeOutSpeed similar to the browser's default
			fadeOutSpeed: 300,
			// the time before the tooltip is shown
			predelay: 200,
			relative: true,
			position: "center right"
			,onBeforeShow: function() {
				$.hideSWF();
			}
			,onShow: function() {
				if (navigator.userAgent.match(/msie/i)) {
					// IE Hack: ClearType with DXTransforms in IE7 ( http://blogs.msdn.com/b/ie/archive/2006/08/31/730887.aspx )
					// Quando o atributo filter é utilizado no IE, e o windows estiver com o ClearType habilitado,
					// para este elemento o IE vai desabilitar o ClearType, causando uma impressão estranha se comparar
					// com o resto do site. Por esse motivo, removemos o filter ao final do 'fade'.
					this.getTip().get(0).style.removeAttribute('filter');
				}
				
			}
			,onHide: function() {
				$.hideSWF();
				
			}
		};
})(jQuery);


/**
  Plugin FixedHeader para fixar o header de uma tabela quando o usuário fizer scroll da página
**/
(function($) {

	var window$ = $(window);
	
	// Declaração como objeto apenas para evitar warnings no código
	var Plugin = {};
	
	// Plugin Constructor 
	Plugin = function FixedHeaderPlugin(el, data) {
		// Copia todas as opções como atributos da instância desse plugin
		this.data = data;
		
		// Possibilitar que através de configuração faça override dos métodos públicos do plugin
		$.extend(this, this.data.override);
		
		// Criar o elemento clone
		this.data.fixedElement = this.createFixedElement(el, this.data);
		
		el.trigger('fixed-header-created');
		
		// Static call - Salvar essa instância de plugin dentro do próprio elemento
		Plugin.save(el, this);
		
		// Observar essa instância de plugin
		Plugin.observe(el);
	};
	
	// Public members
	$.extend(Plugin.prototype, {
		// Função default para criação do elemento clone que vai ficar fixo na tela
		createFixedElement: function (el, data) {
			var cloned = el.clone().wrap('<div class=\'' + data.css + '\'></div>').parent().insertBefore(el);
			var height = data.height = el.find(data.headingSelector).outerHeight();
			cloned.height(height).width(el.outerWidth());
			return cloned;
		}
	});
	
	// Static members
	$.extend(Plugin, {
		// Registro de elementos cadastrados para monitoramento
		elements: []
	
		// Armazena ou obtém os dados do plugin dentro do próprio elemento
		, getOrSet: function (el, data) {
			var key = 'fixed-header-plugin';
			if (typeof data == 'undefined') {
				return el.data(key);					
			} else {
				el.data(key, data);
				return data;
			};
		}
		// Atalhos 
		, save: function(el, data) { return Plugin.getOrSet(el, data); }
		, load: function(el) { return Plugin.getOrSet(el); }
	
		//  Monitora o scroll da janela do navegador, e verifica quais os fixedheaders devem ser exibidos nesse momento.
		, onScroll: function() {
			var wtop = window$.scrollTop();
			$.each(Plugin.elements, function(i, el) {
				if (el.is(':visible')) {
					var data = Plugin.load(el).data;
					var elTop = el.offset().top;
					var elBottom = elTop + el.height() - data.height;
					var exibir = wtop - elTop >= 0 && wtop < elBottom;
					data.fixedElement.toggle(exibir);
					if (exibir) {
						el.trigger('fixed-header-scroll');
					}
				}
			});
		}
	
		// Adiciona um elemento para ser monitorado 
		, observe: function(el) {
			Plugin.elements.push(el);
			Plugin.monitor();
		}
		
		// Inicializa ou para o monitor de acordo se houver elemento 
		, monitor: function() {
			if (Plugin.elements.length > 0) {
				window$.bind('scroll', Plugin.onScroll);
			} else {
				window$.unbind('scroll', Plugin.onScroll);
			}
		}
	
	});
	
	$.fn.fixedHeader = function(options) {
		var global = $.extend({
			cssClass: ''
			, fixedHeaderCssClass: 'jsCssFixedHeaderPlugin'
			, headingSelector: 'thead'
		}, options);
		global.css = (global.cssClass || '') + ' ' + (global.fixedHeaderCssClass || '');
		
		return this.each(function() {
			new Plugin($(this), $.extend({}, global));
		});
	};
	
	
})(jQuery);
(function($) {
	$.fn.toggleState = function(enabledState, states) {
	    this.removeClass($(states).not([enabledState]).toArray().join(' '));
	    this.toggleClass(enabledState, true);
	    return this;
	};
	
	$.proxyAll = function(object, scope) {
	    scope = scope || object;
	    $.each(object, function(key, value) {
	        if ($.type(value) === 'function') {
	            object[key] = $.proxy(value, scope);
	        }
	    });
	};
})(jQuery);
(function($) {
	$.fn.openModal = function(options) {
		var me$ = this;
		var opt = $.extend(true, {
			loadSpeed : 'fast',
			closeOnClick : false,
			onBeforeLoad : function() {
				me$.center().show().center();
			},
			onShow : function() {
				me$.center();
			},
			onClose : function() {
				me$.hide(0, function() {
					me$.delay(200).queue(function() {
						me$.trigger('closed-modal');
					});
				});
			}
		}, options);
	    return this.expose(opt);
	};
	
	$.fn.closeModal = function() {
		$.mask.close();
	};
})(jQuery);
(function($) {
	$.fn.compileTemplate = function() {
		return this.each(function() {
			var el$ = $(this);
			
			// Obter os dados do template por val(), mas caso venha branco ou nulo, tente obter por text() para elementos TEXTAREA, ou por html() para qualquer outro elemento  
			var templateValue = el$.val();
			if (!templateValue || "" === $.trim(templateValue)) {
				if (el$.is("textarea")) {
					templateValue = el$.text();
				} else {
					templateValue = el$.html();
				}
			}
			
			// Obter o id do template para usar como nome do template...
			var id = el$.attr('id');
			if (!id || "" === $.trim(id)) {
				id = el$.attr('name');
			}
			
			// Compilar o template
			$.log("Compilando o template", id);
			try {
				$.template(id, templateValue);
			} catch(e) {}
		});
	};
})(jQuery);(function(b){b.fn.mailcheck=function(c,a){var b=Kicksend.mailcheck.suggest(this.val(),c);b?a.suggested&&a.suggested(this,b):a.empty&&a.empty(this)}})(jQuery);
var Kicksend={mailcheck:{threshold:2,suggest:function(b,c){var a=b.split("@");if(2>a)return!1;var d=this.findClosestDomain(a[1],c);return d?{address:a[0],domain:d,full:a[0]+"@"+d}:!1},findClosestDomain:function(b,c){for(var a,d=99,e=null,g=0;g<c.length;g++)a=this.stringDistance(b,c[g]),a<d&&(d=a,e=c[g]);return d<=this.threshold&&null!==e&&e!==b?e:!1},stringDistance:function(b,c){if(null==b||0===b.length)return null==c||0===c.length?0:c.length;if(null==c||0===c.length)return b.length;for(var a=0,d=
0,e=0,g=0;a+d<b.length&&a+e<c.length;){if(b[a+d]==c[a+e])g++;else for(var f=e=d=0;5>f;f++){if(a+f<b.length&&b[a+f]==c[a]){d=f;break}if(a+f<c.length&&b[a]==c[a+f]){e=f;break}}a++}return(b.length+c.length)/2-g}}};
var Apoio =	{
	"parseData" : function(data) {
		if (data == null || data.split('/').length != 3) return null;
		var dia = data.split('/')[0];
		var mes = data.split('/')[1];
		var ano = data.split('/')[2];
		return new Date().setFullYear(ano, mes-1, dia);
	},
	"parseDataRetornoDate" : function(data) {
		if (data == null || data.split('/').length != 3) return null;
		var dia = data.split('/')[0];
		var mes = data.split('/')[1];
		var ano = data.split('/')[2];
		var date = new Date();
		date.setFullYear(ano, mes-1, dia);
		return date;
	},
	"validarDddTelefone" : function(ddd, telefone) {
		var reDdd = /[1-9]{2}/;
		var reTelefone = /^[2-9][0-9]{7}$|^9[0-9]{8}$/;
		if (ddd == null) return "DDD_EM_BRANCO";
		else if (isNaN(ddd) || ddd.length != 2 || !reDdd.test(ddd)) return "DDD_INVALIDO";
		else if (telefone == null) return "TELEFONE_EM_BRANCO";
		else if (isNaN(telefone) || !(telefone.length == 8 || telefone.length == 9) || !reTelefone.test(telefone)) return "TELEFONE_INVALIDO";
		return "OK";
	},
	"valorAusente" : function(value) {
		return value == null || value == undefined;
	},
	
	"valorInformado" : function(value) {
		return !Apoio.valorAusente(value);
	},

	"obtemIdade" : function (value) {
		now = new Date();
		bD = value.split('/');
		if(bD.length==3){
		   born = new Date(bD[2], bD[1]*1-1, bD[0]);
		   years = Math.floor((now.getTime() - born.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
		   return years;
		}
		throw new Error("Data invalida");
	},

	"obtemAnoAtual" : function() {
		return new Date().getFullYear();
	},

	"validarCep" : function(value) {
		var REComHifem = new RegExp("^\\d{5}-\\d{3}$");
		var cepCorretoComHifem = REComHifem.test(value);

		var RESemHifem = new RegExp("^\\d{8}$");
		var cepCorretoSemHifem = RESemHifem.test(value);

		var valido = (cepCorretoComHifem || cepCorretoSemHifem);

		if(!valido) {
			return 1;
		}

		return 0;
	},
	
	"validarNome" : function(value) {
		if (value === undefined || value === null) {
			return TipoNome.NAO_INFORMADO;
		}
		nome = $.trim(value);
		if (nome === "") {
			return TipoNome.VAZIO;
		}
		var re = /^\d+$/;
		if (re.test(nome)) {
			return TipoNome.SOMENTE_NUMEROS;
		} else {
			if (nome.indexOf(' ') > -1) {
				return TipoNome.NOME_COMPLETO;
			} else {
				return TipoNome.NOME_SIMPLES;
			}
		}
    },

	"validarData" : function(value) {
		if (value != null) {
			var CHARS_RE = /[^0-9\/]$/;
			if (CHARS_RE.test(value)) {					
				return 3;
			}
			var DATE_RE = /^([0-3]?\d)\/([01]?\d)\/([12]\d{3})$/;
			if (DATE_RE.test(value)) {
				var data = DATE_RE.exec(value);
				var dia = data[1];
				var mes = data[2] - 1;
				var ano = data[3];
				var date = new Date();
				date.setFullYear(ano, mes, dia);
				if (mes != date.getMonth()) return 2;
				if (dia != date.getDate()) return 2;
				if (ano != date.getFullYear()) return 2;
				return 0;
			}
			return 1;
		}
		return -1;
	},
	"valorSemEspacos" : function (valor) {
		return $.trim(valor);
	},
	"removerMascara": function (valor) {
		if (valor === undefined || valor === null) {
			return valor;
		}
		valor = $.trim(valor);
		valor = valor.replace(new RegExp("[\\D]", "g"), "");
		return valor;
	},
	"tempoHabilitacaoEhValido": function (idade,tempoDeHabilitacao) {
		if (idade === undefined || idade === null) {
			return false;
		}
		if (tempoDeHabilitacao === undefined || tempoDeHabilitacao === null) {
			return false;
		}
		return (idade - 17) >= tempoDeHabilitacao;
	},
	"apenasNumeros": function (valor) {
		if (valor === undefined || valor === null) {
			return false;
		}
		var apenasNumeros = /^\d+$/;
		return apenasNumeros.test(valor);
	},
	"formataDinheiro": function(num) {
	   x = 0;
	   if(num<0) {
	      num = Math.abs(num);
	      x = 1;
	   }
	   if(isNaN(num)) {
		   num = "0";
	   }
	   cents = Math.floor((num*100+0.5)%100);
	   num = Math.floor((num*100+0.5)/100).toString();

	   if(cents < 10) {
		   cents = "0" + cents;
	   }
	   for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++) {
		   num = num.substring(0,num.length-(4*i+3))+'.'+num.substring(num.length-(4*i+3));
	   }		   
	   ret = num + ',' + cents;
	   if (x == 1) {
		   ret = ' - ' + ret;
	   }
	   return 'R$ ' + ret;
	}
};var FS = FS || {};
FS.REGRAS = FS.REGRAS || {};

$.extend(FS.REGRAS, {
	"regraTelaVeiculoModelo" : function (formPadrao, avisos) {
		var descricao = j$("*[name='descricaoModelo']").val();
		
		if (descricao == null || descricao == "") {
			avisos.adicionarErroCampo("formPadrao.veiculo.modelo", "O modelo do veículo deve ser informado.");
			return;
		}
		
		FS.REGRAS["regraVeiculoModelo"](formPadrao, avisos);
		avisos.substituirIdErros("formPadrao.veiculo.modelo", "descricaoModelo");
	}
	,"regraTelaVeiculoZeroKm": function(formPadrao, avisos, formCalculo) {
		$.log("regraTelaVeiculoZeroKm", formCalculo, formCalculo.veiculoPodeSerZeroKm);
		if (formCalculo.veiculoPodeSerZeroKm) {
			FS.REGRAS["regraVeiculoZeroKm"](formPadrao, avisos);
		}
	}
	
	,"regraTelaVeiculoNumeroPassageiros": function(formPadrao, avisos, formCalculo) {
		$.log("regraTelaVeiculoNumeroPassageiros", formCalculo, formCalculo.deveValidarNumeroPassageiros);
		if (formCalculo.deveValidarNumeroPassageiros) {
			FS.REGRAS["regraVeiculoNumeroPassageiros"](formPadrao, avisos);
		}
	}
	
	,"regraTelaVeiculoCepRisco" : function (formPadrao, avisos) {
		if(formPadrao.veiculo.cepRisco != "") {
			if (Apoio.validarCep(formPadrao.veiculo.cepRisco) == 1 ){
				avisos.adicionarErroCampo("formPadrao.veiculo.cepRisco", "O CEP deve estar no formato 99999-999 ou 99999999");
				return;
			}
		} else {
			FS.REGRAS["regraVeiculoCepRisco"](formPadrao, avisos);
		}
	},
	"regraTelaCondutorPrincipalDataNascimento": function (formPadrao, avisos) {
		if (Apoio.valorInformado(formPadrao.condutorPrincipal.dataNascimento)) {
			switch (Apoio.validarData(formPadrao.condutorPrincipal.dataNascimento)) {
				case 1:
					avisos.adicionarErroCampo("formPadrao.condutorPrincipal.dataNascimento", "A data de nascimento do condutor deve estar no formato dia/mes/ano");
					return;
				case 2:
					avisos.adicionarErroCampo("formPadrao.condutorPrincipal.dataNascimento", "A data de nascimento do condutor é inválida");
					return;
				case 3:
					avisos.adicionarErroCampo("formPadrao.condutorPrincipal.dataNascimento", "A data de nascimento do condutor deve estar no formato dia/mes/ano. Aceita somente números e / (barra)");
					return;
			}
			FS.REGRAS["regraCondutorPrincipalDataNascimento"](formPadrao, avisos);
		} else {
			FS.REGRAS["regraCondutorPrincipalDataNascimento"](formPadrao, avisos);
		}
	}
	,"regraTelaCondutorSecundarioDataNascimento": function (formPadrao, avisos) {
		if (Apoio.valorInformado(formPadrao.condutorSecundario.dataNascimento)) {
			switch (Apoio.validarData(formPadrao.condutorSecundario.dataNascimento)) {
			case 1:
				avisos.adicionarErroCampo("formPadrao.condutorSecundario.dataNascimento", "A data de nascimento do condutor deve estar no formato dia/mes/ano");
				return;
			case 2:
				avisos.adicionarErroCampo("formPadrao.condutorSecundario.dataNascimento", "A data de nascimento do condutor é inválida");
				return;
			case 3:
				avisos.adicionarErroCampo("formPadrao.condutorSecundario.dataNascimento", "A data de nascimento do condutor deve estar no formato dia/mes/ano. Aceita somente números e / (barra)");
				return;
			}
			FS.REGRAS["regraCondutorSecundarioDataNascimento"](formPadrao, avisos);
		} else {
			FS.REGRAS["regraCondutorSecundarioDataNascimento"](formPadrao, avisos);
		}
	}
	,"regraTelaProprietarioRelacaoCondutorProprietario" : function (formPadrao, avisos) {
		FS.REGRAS["regraProprietarioRelacaoCondutorProprietario"](formPadrao, avisos);
		avisos.substituirIdErros("formPadrao.proprietario.relacaoCondutorProprietario", "proprietarioEhCondutorPrincipal");
	}
	,"regraTelaProprietarioDataNascimento": function (formPadrao, avisos) {
		if (Apoio.valorInformado(formPadrao.proprietario.dataNascimento)) {
			switch (Apoio.validarData(formPadrao.proprietario.dataNascimento)) {
				case 1:
					avisos.adicionarErroCampo("formPadrao.proprietario.dataNascimento", "A data de nascimento do proprietário deve estar no formato dia/mes/ano");
					return;
				case 2:
					avisos.adicionarErroCampo("formPadrao.proprietario.dataNascimento", "A data de nascimento do proprietário é inválida");
					return;
				case 3:
					avisos.adicionarErroCampo("formPadrao.proprietario.dataNascimento", "A data de nascimento do proprietário deve estar no formato dia/mes/ano. Aceita somente números e / (barra).");
					return;
			}
			FS.REGRAS["regraProprietarioDataNascimento"](formPadrao, avisos);
		} else {
			FS.REGRAS["regraProprietarioDataNascimento"](formPadrao, avisos);
		}
	}
	,"regraTelaRelacaoSegurado": function(formPadrao, avisos, formCalculo) {
		if (Apoio.valorAusente(formCalculo.quemEhSegurado)) {
			avisos.adicionarErroCampo("quemEhSegurado", "O responsável pela contratação do seguro deve ser informado.");
		}
	}	
	,"regraTelaSeguradoDataNascimento": function (formPadrao, avisos, formCalculo) {
		if (formCalculo.quemEhSegurado == 'OUTROS') {
			if (Apoio.valorInformado(formPadrao.segurado.dataNascimento)) {
				switch (Apoio.validarData(formPadrao.segurado.dataNascimento)) {
					case 1:
						avisos.adicionarErroCampo("formPadrao.segurado.dataNascimento", "A data de nascimento do proprietário deve estar no formato dia/mes/ano");
						return;
					case 2:
						avisos.adicionarErroCampo("formPadrao.segurado.dataNascimento", "A data de nascimento do proprietário é inválida");
						return;
					case 3:
						avisos.adicionarErroCampo("formPadrao.segurado.dataNascimento", "A data de nascimento do proprietário deve estar no formato dia/mes/ano. Aceita somente números e / (barra).");
						return;
				}
			}
			if (Apoio.valorAusente(formPadrao.segurado.dataNascimento)) {
				avisos.adicionarErroCampo("formPadrao.segurado.dataNascimento", "A data de nascimento do segurado deve ser informada.");
				return;
			}
			IDADE_MAXIMA = 100;
			if (Apoio.obtemIdade(formPadrao.segurado.dataNascimento) > IDADE_MAXIMA) {
				avisos.adicionarErroCampo("formPadrao.segurado.dataNascimento",  "O segurado não pode ter mais que " + IDADE_MAXIMA + " anos.");
				return;
			}
			if (Apoio.obtemIdade(formPadrao.segurado.dataNascimento) < 0) {
				avisos.adicionarErroCampo("formPadrao.segurado.dataNascimento",  "Data de nascimento inválida.");
				return;
			}
			if (Apoio.obtemIdade(formPadrao.segurado.dataNascimento) < 18) {
				avisos.adicionarErroCampo("formPadrao.segurado.dataNascimento",  "O segurado não pode ter menos de 18 anos.");
				return;
			}
		}
	}
	,"regraTelaSeguroQuantidadeSinistros": function(formPadrao, avisos) {
		if (Apoio.valorInformado(formPadrao.seguro.quantidadeSinistros)) {
			var RE = new RegExp("[\\d]");
			if (!RE.test(Apoio.valorSemEspacos(formPadrao.seguro.quantidadeSinistros))) {
				avisos.adicionarErroCampo("formPadrao.seguro.quantidadeSinistros", "A quantidade de sinistros deve ser informada em números.");
			}
		} else {
			FS.REGRAS["regraSeguroQuantidadeSinistros"](formPadrao, avisos);
		}
	}
	,"regraTelaSeguroConcordoTermoUso": function(formPadrao, avisos, formCalculo) {
		if (Apoio.valorAusente(formCalculo.concordoTermoUso)) {
			avisos.adicionarErroCampo("concordoTermoUso", "Você deve concordar com o termo de uso para continuar.");
		}
	}	
	,"regraTelaSeguroCaptcha": function(formPadrao, avisos, formCalculo) {
		if (Apoio.valorAusente(formCalculo.answer)) {
			avisos.adicionarErroCampo("answer", "O código deve ser informado.");
		}
	}
	
	
	
	// Tela de Solicitacao Proposta
	,"regraTelaSolicitacaoContatoNome": function(formPadrao, avisos, formContato) {
		if (Apoio.valorAusente(formContato.nomeProposta)) {			
			avisos.adicionarErroCampo("nomeProposta", "Informe seu nome.");
			return;
		}
		var tipoNome = Apoio.validarNome(formContato.nomeProposta);
		if (!tipoNome.isValido()) {
			avisos.adicionarErroCampo("nomeProposta", "Nome inválido.");
			return;
		}
	}
	,"regraTelaSolicitacaoContatoEmail": function(formPadrao, avisos, formContato) {
		var RE = $.re.email;
		if (formContato.emailProposta == null) {
			avisos.adicionarErroCampo("emailProposta", "Preencha o e-mail.");
			return;
		}
		if (!RE.test(formContato.emailProposta)) {
			avisos.adicionarErroCampo("emailProposta", "E-mail inválido.");
		}
	}
	,"regraTelaSolicitacaoContatoEmailConfirmacao": function (formPadrao, avisos, formContato) {
		var RE = $.re.email;
		if (formContato.emailPropostaConfirmacao == null) {
			avisos.adicionarErroCampo("emailPropostaConfirmacao", "Preencha a confirmação do e-mail.");
			return;
		}
		if (!RE.test(formContato.emailPropostaConfirmacao)) {
			avisos.adicionarErroCampo("emailPropostaConfirmacao", "E-mail inválido.");
		} else {
			if (formContato.emailProposta != null && formContato.emailProposta != formContato.emailPropostaConfirmacao) {
				avisos.adicionarErroCampo("emailPropostaConfirmacao", "O e-mail informado não confere.");
			}
		}
	}
	,"regraTelaSolicitacaoContatoDddTelefone": function(formPadrao, avisos, formContato) {
		if (formContato.contato == "sim") {
			var resultadoValidacao = Apoio.validarDddTelefone(formContato.dddProposta, formContato.telefoneProposta);
			if (resultadoValidacao == "DDD_EM_BRANCO") {
				avisos.adicionarErroCampo("dddProposta", "Preencha o número de DDD.");
				return;
			}
			if (resultadoValidacao == "DDD_INVALIDO") {
				avisos.adicionarErroCampo("dddProposta", "Número de DDD inválido.");
				return;
			}
			if (resultadoValidacao == "TELEFONE_EM_BRANCO") {
				avisos.adicionarErroCampo("dddProposta", "Preencha o número de telefone.");
				return;
			}
			if (resultadoValidacao == "TELEFONE_INVALIDO") {
				avisos.adicionarErroCampo("dddProposta", "Número de telefone inválido.");
				return;
			}					
		}
	}
	,"regraTelaSolicitacaoContatoMensagemProposta": function(formPadrao, avisos, formContato) {
		if (formContato.mensagemProposta != null && formContato.mensagemProposta.length > 0) {
			var totalCaracteres = formContato.mensagemProposta.replace(/\n/g, "").length;
			var MAX_CARACTERES_MENSAGEM = 1000;
			if (totalCaracteres > MAX_CARACTERES_MENSAGEM) {
				avisos.adicionarErroCampo("mensagemProposta", "A mensagem ultrapassou o limite de "+MAX_CARACTERES_MENSAGEM+" caracteres.");
				return;
			}
		}
	}

	
	// Telas de Contato (Fale Conosco, Fale Conosco Corretora, Dúvida)
	,"regraTelaContatoNome": function(formPadrao, avisos, formContato) {
		if (Apoio.valorAusente(formContato.nome)) {			
			avisos.adicionarErroCampo("nome", "Informe seu nome completo.");
			return;
		}
		var tipoNome = Apoio.validarNome(formContato.nome);
		if (tipoNome == TipoNome.NOME_SIMPLES) {
			avisos.adicionarErroCampo("nome", "Informe seu nome completo.");
			return;
		}
		if (!tipoNome.isValido()) {
			avisos.adicionarErroCampo("nome", "Nome inválido.");
			return;
		}
		var regex = /([^\s]+)(.+)/; // Separa o primeiro nome e os sobrenomes
		var resultado = regex.exec(formContato.nome);
		if (resultado.length == 3) {
			var primeiroNome = $.trim(resultado[1]);
			var sobrenomes = $.trim(resultado[2]);
			if (primeiroNome.length > 40) {
				avisos.adicionarErroCampo("nome", "O primeiro nome deve ter nome máximo 40 caracteres.");
				return;
			}
			if (sobrenomes.length > 80) {
				avisos.adicionarErroCampo("nome", "Os sobrenomes devem ter no máximo 80 caracteres.");
				return;
			}
		}		
	}
	,"regraTelaContatoEmail": function(formPadrao, avisos, formContato) {
		var RE = $.re.email;
		if (formContato.email == null) {
			avisos.adicionarErroCampo("email", "Preencha o e-mail.");
			return;
		}
		if (!RE.test($.trim(formContato.email))) {
			avisos.adicionarErroCampo("email", "E-mail inválido.");
		}
	}
	,"regraTelaContatoDddTelefone": function(formPadrao, avisos, formContato) {
		var resultadoValidacao = Apoio.validarDddTelefone(formContato.dddTelefone, formContato.numeroTelefone);
		if (resultadoValidacao == "DDD_EM_BRANCO") {
			avisos.adicionarErroCampo("dddTelefone", "Preencha o número de DDD.");
			return;
		}
		if (resultadoValidacao == "DDD_INVALIDO") {
			avisos.adicionarErroCampo("dddTelefone", "Número de DDD inválido.");
			return;
		}
		if (resultadoValidacao == "TELEFONE_EM_BRANCO") {
			avisos.adicionarErroCampo("dddTelefone", "Preencha o número de telefone.");
			return;
		}
		if (resultadoValidacao == "TELEFONE_INVALIDO") {
			avisos.adicionarErroCampo("dddTelefone", "Número de telefone inválido.");
			return;
		}
	}
	,"regraTelaContatoDddCelular": function(formPadrao, avisos, formContato) {
		var resultadoValidacao = Apoio.validarDddTelefone(formContato.dddCelular, formContato.numeroCelular);
		if (resultadoValidacao == "DDD_EM_BRANCO") {
			avisos.adicionarErroCampo("dddCelular", "Preencha o número de DDD.");
		} else if (resultadoValidacao == "DDD_INVALIDO") {
			avisos.adicionarErroCampo("dddCelular", "Número de DDD inválido.");
		} else if (resultadoValidacao == "TELEFONE_EM_BRANCO") {
			avisos.adicionarErroCampo("dddCelular", "Preencha o número de telefone.");
		} else if (resultadoValidacao == "TELEFONE_INVALIDO") {
			avisos.adicionarErroCampo("dddCelular", "Número de telefone inválido.");
		}
	}
	,"regraTelaContatoAssunto": function(formPadrao, avisos, formContato) {
		if (formContato.assunto == null) {
			avisos.adicionarErroCampo("assunto", "Informe o assunto.");
		}
	}
	,"regraTelaContatoMensagem": function(formPadrao, avisos, formContato) {
		if (formContato.mensagem == null) {
			avisos.adicionarErroCampo("mensagem", "Preencha a mensagem.");
			return;
		}
		var totalCaracteres = formContato.mensagem.replace(/\n/g, "").length;
		var MAX_CARACTERES_MENSAGEM = 1000;
		if (totalCaracteres > MAX_CARACTERES_MENSAGEM) {
			avisos.adicionarErroCampo("mensagem", "A mensagem ultrapassou o limite de "+MAX_CARACTERES_MENSAGEM+" caracteres.");
			return;
		}
	}
	
	,"regraTelaOpcional": function() {
		
	}
	
	// Tela de trabalhe conosco
	
	,"regraTelaTrabalheConoscoNome": function(formPadrao, avisos, formContato) {
		if (Apoio.valorAusente(formContato.nome)) {			
			avisos.adicionarErroCampo("nome", "Informe seu nome completo.");
		} else {
			var tipoNome = Apoio.validarNome(formContato.nome);
			if (tipoNome == TipoNome.NOME_SIMPLES) {
				avisos.adicionarErroCampo("nome", "Informe seu nome completo.");
			} else if (!tipoNome.isValido()) {
				avisos.adicionarErroCampo("nome", "Nome inválido.");
			} else {
				var regex = /([^\s]+)(.+)/; // Separa o primeiro nome e os sobrenomes
				var resultado = regex.exec(formContato.nome);
				if (resultado.length == 3) {
					var primeiroNome = $.trim(resultado[1]);
					var sobrenomes = $.trim(resultado[2]);
					if (primeiroNome.length > 40) {
						avisos.adicionarErroCampo("nome", "O primeiro nome deve ter nome máximo 40 caracteres.");
					} else if (sobrenomes.length > 80) {
						avisos.adicionarErroCampo("nome", "Os sobrenomes devem ter no máximo 80 caracteres.");
					}
				}
			}
		}
	}
	
	,"regraTelaTrabalheConoscoEmail": function(formPadrao, avisos, formContato) {
		var RE = $.re.email;
		if (formContato.email == null) {
			avisos.adicionarErroCampo("email", "Preencha o e-mail.");
		} else if (!RE.test($.trim(formContato.email))) {
			avisos.adicionarErroCampo("email", "E-mail inválido.");
		}
	}
	
	,"regraTelaTrabalheConoscoDddTelefone": function(formPadrao, avisos, formContato) {
		var resultadoValidacao = Apoio.validarDddTelefone(formContato.dddTelefone, formContato.numeroTelefone);
		if (resultadoValidacao == "DDD_EM_BRANCO") {
			avisos.adicionarErroCampo("dddTelefone", "Preencha o número de DDD.");
		} else if (resultadoValidacao == "DDD_INVALIDO") {
			avisos.adicionarErroCampo("dddTelefone", "Número de DDD inválido.");
		} else if (resultadoValidacao == "TELEFONE_EM_BRANCO") {
			avisos.adicionarErroCampo("dddTelefone", "Preencha o número de telefone.");
		} else if (resultadoValidacao == "TELEFONE_INVALIDO") {
			avisos.adicionarErroCampo("dddTelefone", "Número de telefone inválido.");
		}
	}
	
	,"regraTelaTrabalheConoscoMensagem": function(formPadrao, avisos, formContato) {
		if (formContato.mensagem == null) {
			avisos.adicionarErroCampo("mensagem", "Preencha a mensagem.");
			return;
		}
		var totalCaracteres = formContato.mensagem.replace(/\n/g, "").length;
		var MAX_CARACTERES_MENSAGEM = 2000;
		if (totalCaracteres > MAX_CARACTERES_MENSAGEM) {
			avisos.adicionarErroCampo("mensagem", "A mensagem ultrapassou o limite de "+MAX_CARACTERES_MENSAGEM+" caracteres.");
			return;
		}
	}
	
	
	// Tela de contato de seguro
	
	,"regraTelaContatoSeguroModeloVeiculo": function(formPadrao, avisos, formContato) {
		if (Apoio.valorAusente(formContato.modeloVeiculo) && formContato.fabricante != 'OUTROS') {
			avisos.adicionarErroCampo("modeloVeiculo", "Preencha o modelo.");
		}		
	}
	
	,"regraTelaContatoSeguroOutroModelo": function(formPadrao, avisos, formContato) {		
		if ((formContato.modeloVeiculo == 'OUTROS' && formContato.outroModelo == null)
				|| (formContato.fabricante == 'OUTROS' && formContato.outroModelo == null)) {
			avisos.adicionarErroCampo("outroModelo", "Preencha o modelo.");
		}
	}
	
	,"regraTelaContatoSeguroQtdVeiculosFrota": function(formPadrao, avisos, formContato) {
		if (Apoio.valorAusente(formContato.qtdVeiculosFrota)) {
			avisos.adicionarErroCampo("qtdVeiculosFrota", "Deve ser informado a quantidade de veículos que sua frota possui.");
		} else {
			if (!Apoio.apenasNumeros(formContato.qtdVeiculosFrota)) {
				avisos.adicionarErroCampo("qtdVeiculosFrota", "Quantidade de veículos inválida.");
			} else if (formContato.qtdVeiculosFrota < 1) {
				avisos.adicionarErroCampo("qtdVeiculosFrota", "Quantidade de veículos inválida.");				
			} else if (formContato.qtdVeiculosFrota == 1) {
				avisos.adicionarErroCampo("qtdVeiculosFrota", "A quantidade de veículos deve ser maior que 1.");
			}
		}
	}
	
	,"regraTelaContatoSeguroJaPossuiVeiculo": function(formPadrao, avisos, formContato) {
		if (Apoio.valorAusente(formContato.jaPossuiVeiculo)) {
			avisos.adicionarErroCampo("jaPossuiVeiculo", "Informe se já possui o veículo.");
		}		
	}
	
	,"regraTelaContatoSeguroNome": function(formPadrao, avisos, formContato) {
		if (Apoio.valorAusente(formContato.nome)) {			
			avisos.adicionarErroCampo("nome", "Informe seu nome completo.");
		} else {
			var tipoNome = Apoio.validarNome(formContato.nome);
			if (tipoNome == TipoNome.NOME_SIMPLES) {
				avisos.adicionarErroCampo("nome", "Informe seu nome completo.");
			} else if (!tipoNome.isValido()) {
				avisos.adicionarErroCampo("nome", "Nome inválido.");
			} else {
				var regex = /([^\s]+)(.+)/; // Separa o primeiro nome e os sobrenomes
				var resultado = regex.exec(formContato.nome);
				if (resultado.length == 3) {
					var primeiroNome = $.trim(resultado[1]);
					var sobrenomes = $.trim(resultado[2]);
					if (primeiroNome.length > 40) {
						avisos.adicionarErroCampo("nome", "O primeiro nome deve ter nome máximo 40 caracteres.");
					} else if (sobrenomes.length > 80) {
						avisos.adicionarErroCampo("nome", "Os sobrenomes devem ter no máximo 80 caracteres.");
					}
				}
			}
		}
	}
	
	,"regraTelaContatoSeguroTelefone": function(formPadrao, avisos, formContato) {
		var resultadoValidacao = Apoio.validarDddTelefone(formContato.dddTelefone, formContato.numeroTelefone);
		if (resultadoValidacao == "DDD_EM_BRANCO") {
			avisos.adicionarErroCampo("dddTelefone", "Preencha o número de DDD.");
		} else if (resultadoValidacao == "DDD_INVALIDO") {
			avisos.adicionarErroCampo("dddTelefone", "Número de DDD inválido.");
		} else if (resultadoValidacao == "TELEFONE_EM_BRANCO") {
			avisos.adicionarErroCampo("dddTelefone", "Preencha o número de telefone.");
		} else if (resultadoValidacao == "TELEFONE_INVALIDO") {
			avisos.adicionarErroCampo("dddTelefone", "Número de telefone inválido.");
		}
	}
	
	,"regraTelaContatoSeguroCelular": function(formPadrao, avisos, formContato) {
		var resultadoValidacao = Apoio.validarDddTelefone(formContato.dddCelular, formContato.numeroCelular);
		if (resultadoValidacao == "DDD_EM_BRANCO") {
			avisos.adicionarErroCampo("dddCelular", "Preencha o número de DDD.");
		} else if (resultadoValidacao == "DDD_INVALIDO") {
			avisos.adicionarErroCampo("dddCelular", "Número de DDD inválido.");
		} else if (resultadoValidacao == "TELEFONE_EM_BRANCO") {
			avisos.adicionarErroCampo("dddCelular", "Preencha o número de telefone.");
		} else if (resultadoValidacao == "TELEFONE_INVALIDO") {
			avisos.adicionarErroCampo("dddCelular", "Número de telefone inválido.");
		}
	}
	
	,"regraTelaContatoSeguroCidade": function(formPadrao, avisos, formContato) {
		if (Apoio.valorAusente(formContato.cidade)) {
			avisos.adicionarErroCampo("cidade", "Preencha a cidade.");
		}		
	}
	
	,"regraTelaContatoSeguroEstado": function(formPadrao, avisos, formContato) {
		if (Apoio.valorAusente(formContato.estado)) {
			avisos.adicionarErroCampo("estado", "Preencha o estado.");
		}		
	}
	
	,"regraTelaContatoSeguroEmail": function(formPadrao, avisos, formContato) {
		var RE = $.re.email;
		if (formContato.email == null) {
			avisos.adicionarErroCampo("email", "Preencha o e-mail.");
		} else if (!RE.test($.trim(formContato.email))) {
			avisos.adicionarErroCampo("email", "E-mail inválido.");
		}
	}
	
	,"regraTelaContatoSeguroFabricante": function(formPadrao, avisos, formContato) {		
		if (formContato.fabricante == null) {
			avisos.adicionarErroCampo("fabricante", "Preencha o fabricante.");
		}
	}
	
	,"regraTelaContatoSeguroOutroFabricante": function(formPadrao, avisos, formContato) {		
		if (formContato.fabricante == 'OUTROS' && formContato.outroFabricante == null) {
			avisos.adicionarErroCampo("outroFabricante", "Preencha o fabricante.");
		}
	}
	
	,"regraTelaContatoSeguroRegiao": function(formPadrao, avisos, formContato) {		
		if (formContato.regiao == null) {
			avisos.adicionarErroCampo("regiao", "Preencha a região.");
		}
	}
	
	,"regraTelaContatoSeguroParcelamento": function(formPadrao, avisos, formContato) {		
		if (formContato.fabricante != null 
				&& formContato.modeloVeiculo != null 
				&& formContato.regiao != null
				&& formContato.parcelamento == null) {
			
			avisos.adicionarErroCampo("parcelamento", "Preencha o parcelamento.");
		}
	}
	
	// Tela de comprar da lista de seguradoras
	,"regraTelaComprarSeguradorasPlaca": function(formPadrao, avisos, formPlacaChassi) {
		if (Apoio.valorAusente(formPlacaChassi.placaFormPadrao)) {
			if (Apoio.valorAusente(formPlacaChassi.placaListaSeguradoras)) {
				avisos.adicionarErroCampo("placaListaSeguradoras", "Preencha a placa.");
				return;
			} else {
				var placa = Apoio.valorSemEspacos(formPlacaChassi.placaListaSeguradoras);
				if (!/(^[a-zA-Z]{3}\d{4}$)|(^[a-zA-Z]{3}(\-|\s)\d{4}$)/.test(placa)) {
					avisos.adicionarErroCampo("placaListaSeguradoras", "Placa inválida. Os formatos aceitos são: XXX-9999, XXX9999 ou XXX 9999.");
					return;
				}
			}
		}
	}
	
	,"regraTelaComprarSeguradorasChassi": function(formPadrao, avisos, formPlacaChassi) {
		if (Apoio.valorAusente(formPlacaChassi.chassiFormPadrao)) {
			if (Apoio.valorAusente(formPlacaChassi.chassiListaSeguradoras)) {
				avisos.adicionarErroCampo("chassiListaSeguradoras", "Preencha o chassi.");
				return;
			} else {
				if (formPlacaChassi.chassiListaSeguradoras.length != 17) {
					avisos.adicionarErroCampo("chassiListaSeguradoras", "Chassi inválido. O chassi deve conter 17 caracteres.");
					return;
				}
				if (!/[a-zA-Z0-9]{17}/.test(formPlacaChassi.chassiListaSeguradoras)) {
					avisos.adicionarErroCampo("chassiListaSeguradoras", "Chassi inválido. O chassi deve conter apenas letras e números.");
					return;
				}
			}		
		}
	}
	
	// Tela de roubo furto
	
	,"regraTelaRouboFurtoNome": function(formPadrao, avisos, formRouboFurto) {		
		if (Apoio.valorAusente(formRouboFurto.nome)) {			
			avisos.adicionarErroCampo("nome", "Informe seu nome completo.");
		} else {
			var tipoNome = Apoio.validarNome(formRouboFurto.nome);
			if (tipoNome == TipoNome.NOME_SIMPLES) {
				avisos.adicionarErroCampo("nome", "Informe seu nome completo.");
			} else if (!tipoNome.isValido()) {
				avisos.adicionarErroCampo("nome", "Nome inválido.");
			} else {
				var regex = /([^\s]+)(.+)/; // Separa o primeiro nome e os sobrenomes
				var resultado = regex.exec(formRouboFurto.nome);
				if (resultado.length == 3) {
					var primeiroNome = $.trim(resultado[1]);
					var sobrenomes = $.trim(resultado[2]);
					if (primeiroNome.length > 40) {
						avisos.adicionarErroCampo("nome", "O primeiro nome deve ter nome máximo 40 caracteres.");
					} else if (sobrenomes.length > 80) {
						avisos.adicionarErroCampo("nome", "Os sobrenomes devem ter no máximo 80 caracteres.");
					}
				}
			}
		}
	}
	
	,"regraTelaRouboFurtoHorario": function(formPadrao, avisos, formRouboFurto) {		
		if (Apoio.valorAusente(formRouboFurto.horario)) {
			avisos.adicionarErroCampo("horario", "Preencha o melhor horário para contato.");
		}
	}
	
	,"regraTelaRouboFurtoEmail": function(formPadrao, avisos, formRouboFurto) {		
		var RE = $.re.email;
		if (Apoio.valorAusente(formRouboFurto.email)) {
			avisos.adicionarErroCampo("email", "Preencha o e-mail.");
		} else if (!RE.test($.trim(formRouboFurto.email))) {
			avisos.adicionarErroCampo("email", "E-mail inválido.");
		}
	}
	
	,"regraTelaRouboFurtoTelefone": function(formPadrao, avisos, formRouboFurto) {
		var resultadoValidacao = Apoio.validarDddTelefone(formRouboFurto.ddd, formRouboFurto.telefone);
		if (resultadoValidacao == "DDD_EM_BRANCO") {
			avisos.adicionarErroCampo("ddd", "Preencha o número de DDD.");
		} else if (resultadoValidacao == "DDD_INVALIDO") {
			avisos.adicionarErroCampo("ddd", "Número de DDD inválido.");
		} else if (resultadoValidacao == "TELEFONE_EM_BRANCO") {
			avisos.adicionarErroCampo("ddd", "Preencha o número de telefone.");
		} else if (resultadoValidacao == "TELEFONE_INVALIDO") {
			avisos.adicionarErroCampo("ddd", "Número de telefone inválido.");
		}
	}
	
	// Tela de rechamada
	
	/*
	,"regraTelaRechamadaNome": function(formPadrao, avisos, formRechamada) {		
		if (Apoio.valorAusente(formRechamada.nome)) {			
			avisos.adicionarErroCampo("nome", "Informe seu nome completo.");
		} else {
			var tipoNome = Apoio.validarNome(formRechamada.nome);
			if (tipoNome == TipoNome.NOME_SIMPLES) {
				avisos.adicionarErroCampo("nome", "Informe seu nome completo.");
			} else if (!tipoNome.isValido()) {
				avisos.adicionarErroCampo("nome", "Nome inválido.");
			} else {
				var regex = /([^\s]+)(.+)/; // Separa o primeiro nome e os sobrenomes
				var resultado = regex.exec(formRechamada.nome);
				if (resultado.length == 3) {
					var primeiroNome = $.trim(resultado[1]);
					var sobrenomes = $.trim(resultado[2]);
					if (primeiroNome.length > 40) {
						avisos.adicionarErroCampo("nome", "O primeiro nome deve ter nome máximo 40 caracteres.");
					} else if (sobrenomes.length > 80) {
						avisos.adicionarErroCampo("nome", "Os sobrenomes devem ter no máximo 80 caracteres.");
					}
				}
			}
		}
	}
	*/
	
	,"regraTelaRechamadaNumeroTelefone": function(formPadrao, avisos, formRechamada) {
		var resultadoValidacao = Apoio.validarDddTelefone(formRechamada.dddTelefone, formRechamada.numeroTelefone);
		if (resultadoValidacao == "DDD_EM_BRANCO") {
			avisos.adicionarErroCampo("dddTelefone", "Preencha o número de DDD.");
		} else if (resultadoValidacao == "DDD_INVALIDO") {
			avisos.adicionarErroCampo("dddTelefone", "Número de DDD inválido.");
		} else if (resultadoValidacao == "TELEFONE_EM_BRANCO") {
			avisos.adicionarErroCampo("dddTelefone", "Preencha o número de telefone.");
		} else if (resultadoValidacao == "TELEFONE_INVALIDO") {
			avisos.adicionarErroCampo("dddTelefone", "Número de telefone inválido.");
		}
	}
	
	,"regraTelaRechamadaNumeroCelular": function(formPadrao, avisos, formRechamada) {
		var resultadoValidacao = Apoio.validarDddTelefone(formRechamada.dddCelular, formRechamada.numeroCelular);
		if (resultadoValidacao == "DDD_EM_BRANCO") {
			avisos.adicionarErroCampo("dddCelular", "Preencha o número de DDD.");
		} else if (resultadoValidacao == "DDD_INVALIDO") {
			avisos.adicionarErroCampo("dddCelular", "Número de DDD inválido.");
		} else if (resultadoValidacao == "TELEFONE_EM_BRANCO") {
			avisos.adicionarErroCampo("dddCelular", "Preencha o número de telefone.");
		} else if (resultadoValidacao == "TELEFONE_INVALIDO") {
			avisos.adicionarErroCampo("dddCelular", "Número de telefone inválido.");
		}
	}
	
	,"regraTelaRechamadaHorario": function(formPadrao, avisos, formRechamada) {		
		if (Apoio.valorAusente(formRechamada.horario)) {
			avisos.adicionarErroCampo("horario", "Preencha o melhor horário para contato.");
		}
	}
});(function() {
		
	var inicializarRouboFurto = function() {
		window.createForm = function () {
			var formContato = $("form[name='formRouboFurto']").serializeAsObject();
			return formContato;
		};
		associarRegrasValidacao();
		associarBinds();
	};

	var associarRegrasValidacao = function() {
		
		$('*[name="nome"]').validateOnEvent("regraTelaRouboFurtoNome", {after: function() { $(this).val($(this).val().toUpperCase()); }});
		$('*[name="horario"]').validateOnEvent("regraTelaRouboFurtoHorario");
		$('*[name="email"]').validateOnEvent("regraTelaRouboFurtoEmail");
		$('*[name="telefone"]').validateOnEvent("regraTelaRouboFurtoTelefone");
		
	};
	
	var associarBinds = function() {
		
		$('*[name="ddd"], *[name="telefone"]').autoTabNumerico();
		
		$('*[name="email"]').bind("blur", function() {
			var valorSemEspacos = $.trim($(this).val()); 
			$(this).val(valorSemEspacos);
		});
		
		$('*[name="email"]').keyup(function(){
			var dominiosCorretos = ['hotmail.com', 'gmail.com', 'yahoo.com.br', 'yahoo.com', 'terra.com.br', 'ig.com.br', 'oi.com.br', 'globo.com', 'uol.com.br', 'bol.com.br'];
			$(this).mailcheck(dominiosCorretos, {
				suggested: function(element, suggestion) {
					var RE = $.re.email;
					var valorEmail = element.val();
					if (Apoio.valorInformado(valorEmail) && RE.test($.trim(valorEmail))) {
						element.clearErrors();
						$('.jsContainerSugestaoEmail span').text(suggestion.full);
						$('.jsContainerSugestaoEmail').show();
					}
				},
				empty: function(element) {
					$('.jsContainerSugestaoEmail span').text('');
					$('.jsContainerSugestaoEmail').hide();
				}
			});
		});
		
		$('.jsSugestaoEmail').click(function(){
			$('*[name="email"]').val($(this).text());		
			$('.jsContainerSugestaoEmail span').text('');
			$('.jsContainerSugestaoEmail').hide();
		});
		
		$(".jsEnviar").click(function(){
			var validationContext = $("form[name='formRouboFurto']").validate();
			if (validationContext.temErros) {
				$("form[name='formRouboFurto']").find('.form-erro:first').find("input,select,textarea").first().focus();
				return false;
			}						
			
			$("form[name='formRouboFurto']").createBlankValuesForUncheckedRadioGroups().submit();
			return false;
		});
	};
	
	window.inicializarRouboFurto = inicializarRouboFurto;	
		
})();
(function() {
		
	var inicializarRechamada = function() {
		window.createForm = function () {
			var formContato = $("form[name='formRechamada']").serializeAsObject();
			return formContato;
		};
		associarRegrasValidacao();
		associarBinds();
	};

	var associarRegrasValidacao = function() {
		$('*[name="numeroTelefone"]').validateOnEvent("regraTelaRechamadaNumeroTelefone");
		$('*[name="numeroCelular"]').validateOnEvent("regraTelaRechamadaNumeroCelular");
		$('*[name="horario"]').validateOnEvent("regraTelaRechamadaHorario");
	};
	
	var associarBinds = function() {
		
		$('*[name="dddTelefone"], *[name="numeroTelefone"], *[name="dddCelular"], *[name="numeroCelular"]').autoTabNumerico();
		
		$(".jsEnviar").click(function(){
			var validationContext = $("form[name='formRechamada']").validate();
			if (validationContext.temErros) {
				$("form[name='formRechamada']").find('.form-erro:first').find("input,select,textarea").first().focus();
				return false;
			}						
			
			$("form[name='formRechamada']").createBlankValuesForUncheckedRadioGroups().submit();
			return false;
		});
	};
	
	window.inicializarRechamada = inicializarRechamada;	
		
})();
