(function (window, $) {
	numeral.language('pt-br');
	
	function blankAsNull(value) {
		var type = $.type(value);
		if (type == 'undefined') {
			value = null;
		} else if (type == 'string') {
			value = $.trim(value);
			if (value == "")
				value = null;
		}
		return value;
	}
	
	function level(flatObj) {
		var object = {};
		function createOrSet(object, path, value) {
			if (path.length != 1) {
				var subObj = object[path[0]] || {};
				object[path[0]] = subObj;
				createOrSet(subObj, path.slice(1), value);
			} else {
				object[path[0]] = value;
			}
		}
		$.each(flatObj, function(id, value) {
			createOrSet(object, id.split('.'), value);
		});
		return object;
	}
	
	function flat(object) {
		var flat = {}; 
		function traverse(flat, object, parentPath) {
			$.each(object, function(id, value) {
				var path = parentPath == '' ? id : parentPath + '.' + id; 
				var type = $.type(value);
				if (type == 'object') {
					traverse(flat, value, path);
				} else if (type == 'array') {
					flat[path] = [];
					$.each(value, function(i, val) {
						var item = {};
						traverse(item, val, '');
						flat[path][i] = item;
					});
				} else {
					flat[path] = value;
				}
			});
		}
		traverse(flat, object, '');
		return flat;
	}


	function Formulario(options) {
		var me = this;
		$.extend(this, options);
		this.formCssSelector = "[data-formulario=\"" + this.form + "\"]";
		this.$el = this.$container.find(this.formCssSelector);
		if (this.$el.length == 0) {
			this.$el = this.$container.filter(this.formCssSelector);
		}
		if (!this.estados) {
			this.estados = new Estados;
			this.estados.ativar("sempre");
		}
		this.campos = {};
		this.formPrefix = me.form.charAt(0).toLowerCase() + me.form.slice(1) + ".";
		$.each(this.metadados[this.form], function(id, campo) {
			me.campos[id] = new Campo(me, campo, id);
		});
	}
	
	Formulario.level = level;
	Formulario.flat = flat;
	
	
	Formulario.prototype = {
		exibir: function() {
			var me = this;
			
			this.$el.find('[data-campo]').each(function() {
				var $campo = $(this);
					if ($campo.closest("[data-formulario]").attr('data-formulario') == me.form) {
					var id = $campo.attr('data-campo');
					if (me.prefixoDoCampo) {
						id = id.indexOf(me.prefixoDoCampo) == 0 ? me.formPrefix + id.substring(me.prefixoDoCampo.length + 1)  : id;
					}
					var campo = me.campo(id);
					if (campo)
						me.campo(id).substituir($campo);
					else
						console.log("[ERROR] Campo " + id + " não encontrado", $campo[0]);
				}
			});
			
			if (me.onRender) {
				me.onRender();
			}
		}
		, remover: function() {
			this.$el.remove();
		}
		, campo: function(id) {
			return this.campos[id];
		}
		, incluirHtml: function(html) {
			this.$el.append(html);
		}
		, set: function (data) {
			this.flatData = flat(data);
			this.data = data;
			var me = this;
			var prefixo = me.prefixoDoCampo && me.formPrefix || ""; 
			$.each(this.flatData, function(id, value) {
				var campo = me.campo(prefixo + id);
				if (campo)
					campo.set(value);
			});
		}
		, get: function(options) {
			var me = this;
			options = $.extend({manterCamposOriginais: true, somenteCamposDaTela: false, blankAsNull: true, flat: false}, options);
			var object = {};
			$.each(this.campos, function (id, campo) {
				if (me.itemMultiplo)
					id = id.substring(me.formPrefix.length);
				var value = campo && campo.existe() ? 
								campo.get({blankAsNull: options.blankAsNull, manterCamposOriginais: options.manterCamposOriginais, somenteCamposDaTela: options.somenteCamposDaTela})
							 : me.flatData[id];
				object[id] = options.blankAsNull ? blankAsNull(value) : value;
			});
			var result = deepMerge(options.manterCamposOriginais ? this.data : {}, level(object));
			return options.flat ? flat(result) : result;
		}
		, restaurarValor: function ($input, manter) {
			var valor = $input.data('formulario-valor');
			if (valor)
				console.log("[INFO] O valor '" + valor + "' foi recuperado no campo", $input[0]);
			if (!manter)
				$input.data('formulario-valor', null);
			return valor;
		}
	};
	
    function deepMerge(objeto1, objeto2) {
    	if (!objeto1) return objeto2;
    	
    	$.each(objeto2, function(chave, valor){
    		if ($.type(valor) === 'object') {
    			objeto1[chave] = deepMerge(objeto1[chave], valor);
    		} else {
    			objeto1[chave] = valor;
    		}
    	});
    	
    	return objeto1;
    }
	
	function jQueryId(value) {
		return value.replace(/\./g, '\\.');
	}
	function escapeRegExp(string){
	  return string.replace(/([.*+?^=!:{}()$|\[\]\/\\])/g, "\\$1");
	}
	
	function quoteattr(s, preserveCR) {
	    preserveCR = preserveCR ? '&#13;' : '\n';
	    return ('' + s) /* Forces the conversion to string. */
	        .replace(/&/g, '&amp;') /* This MUST be the 1st replacement. */
	        .replace(/'/g, '&apos;') /* The 4 other predefined entities, required. */
	        .replace(/"/g, '&quot;')
	        .replace(/</g, '&lt;')
	        .replace(/>/g, '&gt;')
	        /*
	        You may add other replacements here for HTML only 
	        (but it's not necessary).
	        Or for XML, only if the named entities are defined in its DTD.
	        */ 
	        .replace(/\r\n/g, preserveCR) /* Must be before the next replacement. */
	        .replace(/[\r\n]/g, preserveCR);
	        ;
	}
	
	function Campo(formulario, meta, id) {
		if (formulario.prefixoDoCampo)
			id = formulario.prefixoDoCampo + id;
		this.id = id;
		this.$id = jQueryId(id);
		this.classId = id.replace(/[^\w\d]/g, '_');
		this.formulario = formulario;
		this.meta = $.extend(true, {}, meta);
		this.meta.id = id;
		this.tipo = meta.tipo;
		this.data = [];
		this.rotulo = this.meta.rotulo || this.meta.id;
		this.wrapper = {start: "", end: ""};
	}
	Campo.prototype = {
		criarHtml: function() {
			return this.formulario.campoTemplate(this);
		}
		, substituir:function($el) {
			var $parent = $el.parent();
			if ($el.length > 0) {
				var opcoes = $el.attr('data-campo-opcoes');
				//this.previousClasses = $el[0].className;
				this.htmlTemplate = $el.html();
				var tagName = $el[0].tagName;
				var tagAttributes = "";
				$.each($el.prop('attributes'), function(i, attr) {
					if (attr.name != 'data-campo' && attr.name != 'data-campo-opcoes')
						tagAttributes += attr.name + "=\"" + quoteattr(attr.value) + "\""; 
				});
				this.wrapper.start = "<" + tagName + " " + tagAttributes + ">";
				this.wrapper.end = "</" + tagName + ">";
				if (opcoes)
					$.extend(true, this, JSON.parse(opcoes));
				if (this.usarComoTemplate) {
					$el.replaceWith(doT.compile($el.html())(this));
				} else if (!this.manter) {
					$el.replaceWith(this.criarHtml());
				}
				this.$el = $parent.find('[data-campo="' + this.$id + '"]');
				//this.$el.addClass(this.previousClasses);
				this.$input = this.$el.find('[data-input="' + this.$id + '"],[data-multiplo-container]');
				this.$value = this.$el.find('[data-value="' + this.$id + '"]');
				this.$el.data('campo', this);
				this.$input.data('campo', this);
				this.adicionarEventos();
			}
		}
		, adicionarNovoItem: function() {
			var me = this;
			if (this.existe()) {
				var dataIndex = this.data.length;
				var campoId = this.id + "[" + this.data.length + "]";
				var $item = $(this.htmlTemplate.replace(new RegExp(escapeRegExp(this.id), "g"), campoId));
				$item.attr('data-multiplo-item', campoId);
				if (this.tipo == 'formulario') {
					$item.appendTo(this.$input);
					var formularioFilho = new Formulario({
						$container: $item
						, campoTemplate: this.formulario.campoTemplate
						, metadados: this.formulario.metadados
						, form: this.meta.formulario
						, prefixoDoCampo: campoId
						, onRender: me.formulario.onRender
						, itemMultiplo: true
					});
					this.data.push(formularioFilho);
					formularioFilho.exibir();
					$item.find('.jsRemover').on('click', function() {
						me.removerItem(dataIndex);
					});
					return formularioFilho;
				}
			}
		}
		, removerItem: function(index) {
			this.data[index].remover();
			this.data.splice(index, 1);
		}
		, set: function(value) {
			var me = this;
			if (this.existe()) {
				if (this.tipo == 'formulario') {
					if (value) {
						$.each(value, function(i, val) {
							me.adicionarNovoItem().set(val);	
						});
					}
				} else if (this.existe()) {
					var valorConvertido = this.converter(value); 
					this.$input.val(valorConvertido);
					if (blankAsNull(valorConvertido) != blankAsNull(this.$input.val())) {
						this.$input.data('formulario-valor', valorConvertido);
						if (this.$input.is("select")) {
							this.$input.append("<option value='" + valorConvertido + "' selected=selected>" + valorConvertido + "</option>");
							console.log("[WARN] O valor '" + valorConvertido + "' foi adicionado no select ", this.$input[0]);
						} else {
							console.log("[WARN] O valor '" + valorConvertido + "' não foi adicionado corretamente no campo", this.$input[0]);
						}
					}
					this.$input.trigger('change').trigger('keyup');
				}
			}
		}
		, get: function(options) {
			if (this.tipo == 'formulario') {
				var values = [];
				$.each(this.data, function (i, formularioFilho) {
					if (formularioFilho)
						values.push(formularioFilho.get(options));
				});
				return values;
			}
			return this.existe() ? this.converter(this.$input.val()) : undefined;
		}
		, existe: function() {
			return this.$input != null && this.$input.length > 0;
		}
		, converter: function(value) {
			if (this.tipo == 'date' && typeof(value) == 'number') {
				// Utilizado UTC para evitar erro de cálculo por causa do horário de verão
				return moment(value).utc().format('DD/MM/YYYY');
			}
			if (this.tipo == 'date' && typeof(value) == 'string' && blankAsNull(value) != null) {
				// Adicionado uma hora para evitar erro de cálculo por causa do horário de verão
				var date = moment(value, 'DD/MM/YYYY').add(1, 'hours');
				return date.isValid() ? date.valueOf() : null;
			}
			if (this.tipo == 'currency' && typeof(value) == 'number')
				return numeral(value).format('0,0.00');
			if (this.tipo == 'currency' && typeof(value) == 'string')
				return numeral().unformat(value);
			if (this.tipo == 'boolean' && typeof(value) == 'boolean')
				return value + "";
			return value;
		}
		, rotuloOpcao: function(id) {
			var opcao = this.meta.opcoes[id];
			return (opcao && opcao.rotulo) || id;
		}
		, adicionarEventos: function() {
			var me = this;
			if (me.meta.exibirQuando)
				me.$el.on('alterandoExibicao.pluginEstados', function(e, situacao) {
					if (!situacao)
						me.$input.val("");
				});
			this.$el.find('.jsAdicionar').on('click', function() {
				me.adicionarNovoItem();
			});
			this.$input.on('change', function() {
				var value = me.$input.val();
				if (me.$input.is("select")) {
					var selectize = me.$input[0].selectize;
					if (selectize) {
						value = selectize.getOption(value);
						if (value && value[0])
							value = $(value[0]).text();
						else
							value = "";
					} else {
						value = me.$input.find("option:selected").text();
					}
				}
				me.$value.text(value);
			});
		}
		, template: function() {
			return doT.compile(this.htmlTemplate)(this);
		}
	};
	
	window.Formulario = Formulario;
})(window, jQuery);