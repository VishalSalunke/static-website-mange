(function ($) {
	
	/*
	$('.jsFaleConoscoEnviar').click(function () {
		$('.jsFaleConosco').addClass('sucesso');
	});
	
	$('.jsFormProdutoEnviar').click(function () {
		$('.jsFormProduto').addClass('sucesso');
	});
	*/

})(jQuery);

var TipoNome = {
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
		
	var inicializarTelaContato = function() {
		window.createForm = function () {
			var formContato = $("form[name='formContato']").serializeAsObject();
			return formContato;
		};
		associarRegrasValidacao();
		associarBinds();
	};

	var associarRegrasValidacao = function() {
		$('*[name="modeloVeiculo"]').validateOnEvent("regraTelaContatoSeguroModeloVeiculo", {after: function() {
			var valorTipoSeguro = $('*[name="tipoSeguro"]').val();
			var containerOutroModelo = $('.jsOutroModelo');
			var outroModelo = $('*[name="outroModelo"]');
			if (valorTipoSeguro == 'MOTO') {				
				if ($(this).val() == 'OUTROS') {
					outroModelo.clearErrors();
					containerOutroModelo.removeClass('invisivel');
					$('.jsEnviar').text('Solicitar Contato');
				} else {
					containerOutroModelo.addClass('invisivel');					
					outroModelo.val('');
					$('.jsEnviar').text('Calcular Seguro');
				}
			} else {
				$(this).val($(this).val().toUpperCase());
			}
		}});
		$('*[name="qtdVeiculosFrota"]').validateOnEvent("regraTelaContatoSeguroQtdVeiculosFrota");
		$('*[name="jaPossuiVeiculo"]').validateOnEvent("regraTelaContatoSeguroJaPossuiVeiculo");
		$('*[name="nome"]').validateOnEvent("regraTelaContatoSeguroNome", {after: function() {$(this).val($(this).val().toUpperCase());}});		
		$('*[name="numeroTelefone"]').validateOnEvent("regraTelaContatoSeguroTelefone");
		$('*[name="numeroCelular"]').validateOnEvent("regraTelaContatoSeguroCelular");		
		$('*[name="cidade"]').validateOnEvent("regraTelaContatoSeguroCidade", {after: function() {$(this).val($(this).val().toUpperCase());}});
		$('*[name="estado"]').validateOnEvent("regraTelaContatoSeguroEstado");
		$('*[name="email"]').validateOnEvent("regraTelaContatoSeguroEmail", {after: function() {$(this).val($(this).val().toLowerCase());}});
				
		// Campos especificos da moto
		$('*[name="outroModelo"]').validateOnEvent("regraTelaContatoSeguroOutroModelo", {after: function() {$(this).val($(this).val().toUpperCase());}});
		$('*[name="fabricante"]').validateOnEvent("regraTelaContatoSeguroFabricante", {after: function() {			
			var valorFabricante = $(this).val();
			if (valorFabricante != "") {			
				var containerOutroFabricante = $('.jsOutroFabricante');
				var outroFabricante = $('*[name="outroFabricante"]');
				var containerOutroModelo = $('.jsOutroModelo');
				var outroModelo = $('*[name="outroModelo"]');
				var containerModeloVeiculo = $('.jsModeloVeiculo');				
				var modeloVeiculo = $('*[name="modeloVeiculo"]');
				if (valorFabricante == 'OUTROS') {
					outroFabricante.clearErrors();
					containerOutroFabricante.removeClass('invisivel');
					outroModelo.clearErrors();
					containerOutroModelo.removeClass('invisivel');
					containerModeloVeiculo.addClass('invisivel');
					modeloVeiculo.val('');
					$('.jsEnviar').text('Solicitar Contato');
				} else {
					containerOutroFabricante.addClass('invisivel');					
					outroFabricante.val('');
					containerOutroModelo.addClass('invisivel');
					outroModelo.val('');
					modeloVeiculo.clearErrors();
					containerModeloVeiculo.removeClass('invisivel');
					var opcaoSelecionada = $(this).find('option:selected');
					obterModelos(opcaoSelecionada.val());
					$('.jsEnviar').text('Calcular Seguro');
				}
			}
		}});
		$('*[name="outroFabricante"]').validateOnEvent("regraTelaContatoSeguroOutroFabricante", {after: function() {$(this).val($(this).val().toUpperCase());}});
		$('*[name="regiao"]').validateOnEvent("regraTelaContatoSeguroRegiao");		
		$('*[name="parcelamento"]').validateOnEvent("regraTelaContatoSeguroParcelamento");
	};
	
	var associarBinds = function() {
		
		$('*[name="dddTelefone"], *[name="numeroTelefone"], *[name="dddCelular"], *[name="numeroCelular"]').autoTabNumerico();
		
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
			var validationContext = $("form[name='formContato']").validate();
			if (validationContext.temErros) {
				$("form[name='formContato']").find('.form-erro:first').find("input,select,textarea").first().focus();
				return false;
			}
			
			var tipoSeguro = $('*[name="tipoSeguro"]').val();			
			if (tipoSeguro == 'FROTA') {
				var qtdVeiculosFrota = $('*[name="qtdVeiculosFrota"]').val();
				var mensagem = "Solicitação de seguro para Frota ("+qtdVeiculosFrota+" veículos).";
				$('*[name="mensagem"]').val(mensagem);
			}
			
			$("form[name='formContato']").createBlankValuesForUncheckedRadioGroups().submit();
			return false;
		});
	};
	
	window.inicializarTelaContato = inicializarTelaContato;	
	
	var inicializarTelaResultadoCalculo = function() {
		$(".jsEnviar").click(function(){
			var parcelamentos = obterParcelamentos();
			var mensagem = "Solicitação de seguro para Motocicleta. Opções de parcelamento: "  + parcelamentos;
			$('*[name="mensagem"]').val(mensagem);
			$("form[name='formContato']").submit();
		});
	};
		
	var obterParcelamentos = function() {
		var parcelamentos = '';
		$.each($('.jsParcelamento'), function(i, parcelamento) {
			parcelamentos += parcelamento.innerHTML + "; ";
		});
		return parcelamentos;
	};	
	
	window.inicializarTelaResultadoCalculo = inicializarTelaResultadoCalculo;	
})();
