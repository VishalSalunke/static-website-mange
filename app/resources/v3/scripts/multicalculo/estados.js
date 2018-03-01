(function (window, $) {
	function Estados() {
		this.estados = {};
		this.estadoListeners = {};
		this.expressoes = {};
		this.ultimaAvaliacao = {};
		this.grupos = {};
	}
	
	Estados.prototype = {
		temEstado: function(expressaoEstado) {
			return this.getGrupoEstado(expressaoEstado).situacao;
		}
		, declarar: function(expressaoEstado) {
			var grupoEstado = this.getGrupoEstado(expressaoEstado);
			this.declararGrupoSeNecessario(grupoEstado);
			this.estados[grupoEstado.estado] = grupoEstado.situacao;
			return grupoEstado;
		}
		, declararGrupoSeNecessario: function (expressaoEstado) {
			var grupoEstado = this.getGrupoEstado(expressaoEstado);
			if (grupoEstado.grupo && grupoEstado.estadosDoGrupo.indexOf(grupoEstado.estado) === -1)
				grupoEstado.estadosDoGrupo.push(grupoEstado.estado);
		}
		, ativar: function(expressaoEstado) {
			var grupoEstado = this.getGrupoEstado(expressaoEstado);
			//console.log("ativando", grupoEstado.grupo, grupoEstado.estado);
			this.estados[grupoEstado.estado] = true;
			if (grupoEstado.grupo)
				this.desativarOutrosEstadosDoGrupo(grupoEstado);
			if (!grupoEstado.situacao) // se situacao anterior == false
				this.notificarAlteracao(grupoEstado.estado);
		}
		, desativar: function(expressaoEstado) {
			var grupoEstado = this.getGrupoEstado(expressaoEstado);
			//console.log("desativando", grupoEstado.grupo, grupoEstado.estado);
			this.estados[grupoEstado.estado] = false;
			if (grupoEstado.situacao) // se situacao anterior == true
				this.notificarAlteracao(grupoEstado.estado);
		}
		, trocar: function(expressaoEstado) {
			var grupoEstado = this.getGrupoEstado(expressaoEstado);
			if (grupoEstado.situacao)
				this.desativar(grupoEstado);
			else
				this.ativar(grupoEstado);
		}
		, desativarOutrosEstadosDoGrupo: function(expressaoEstado) {
			var me = this;
			var grupoEstado = this.getGrupoEstado(expressaoEstado);
			if (grupoEstado.grupo) {
				$.each(grupoEstado.estadosDoGrupo, function(i, estado) {
					if (estado != grupoEstado.estado)
						me.desativar(estado);
				});
			}
		}
		, quandoAlterar: function(expressaoEstado, callback, options) {
			var grupoEstado = this.getGrupoEstado(expressaoEstado);
			this.listenersDoEstado(grupoEstado.estado, true).push(callback);
			if (!options || !options.desativarPrimeiraChamada)
				callback(this.temEstado(grupoEstado.estado), grupoEstado.estado);
		}
		, observarExpressao: function(expressao, callback, options) {
			this.observadoresDaExpressao(expressao).push(callback);
			if (!options || !options.desativarPrimeiraChamada) {
				var situacao = this.avaliarExpressao(expressao);
				callback(situacao, expressao);
				this.ultimaAvaliacao[expressao] = situacao;
			}
		}
		, observadoresDaExpressao: function(expressao) {
			expressao = $.trim(expressao);
			this.expressoes[expressao] = this.expressoes[expressao] || [];
			return this.expressoes[expressao]; 
		}
		, listenersDoEstado: function(expressaoEstado, create) {
			var grupoEstado = this.getGrupoEstado(expressaoEstado);
			var listeners = this.estadoListeners[grupoEstado.estado] || [];
			if (create)
				this.estadoListeners[grupoEstado.estado] = listeners;
			return listeners;
		}
		, notificarAlteracao: function(expressaoEstado) {
			var grupoEstado = this.getGrupoEstado(expressaoEstado);
			var situacao = this.temEstado(grupoEstado.estado);
			$.each(this.listenersDoEstado(grupoEstado.estado), function(i, callback) {
				callback(situacao, grupoEstado.estado);
			});
			this.verificarObservadores(grupoEstado.estado);
		}
		, verificarObservadores: function(estado) {
			var me = this;
			$.each(this.expressoes, function(expressao, observadores) {
				if (expressao.indexOf(estado) > -1) {
					var situacao = me.avaliarExpressao(expressao);
					if (situacao != me.ultimaAvaliacao[expressao]) {
						$.each(observadores, function(i, callback) {
							callback(situacao, expressao);
						});
					}
					me.ultimaAvaliacao[expressao] = situacao;
				}
			});
		}
		, avaliarExpressao: function(expressao) {
			var me = this;
			var tentativas = 10;
			while (tentativas > 0) {
				try {
					with (me.estados) {
						return eval("(" + expressao + ") == true");
					}
				} catch (e) {
					if (e.message.indexOf(" is not defined") > -1) {
						var estadoNaoDefinido = e.message.replace(" is not defined", "");
						me.declarar(estadoNaoDefinido);
						tentativas--;
					} else {
						throw e;
					}
				}
			}
		}
		, getGrupoEstado: function(estado) {
			if ($.type(estado) != 'string') 
				return estado;
			var tokens = estado.split('::', 2);
			var me = this;
			if (tokens.length == 1)
				return {estado: tokens[0], situacao: me.estados[tokens[0]] == true};
			var nomeGrupo = tokens[0];
			return {estado: tokens[1]
					, grupo: nomeGrupo
					, estadosDoGrupo: me.obterGrupoDeEstado(nomeGrupo)
					, situacao: me.estados[tokens[1]] == true};
		}
		, obterGrupoDeEstado: function(grupo) {
			return this.grupos[grupo] = this.grupos[grupo] || [];
		}					
	};
	
	function PluginEstados(estados, $container, opcoes) {
		$.extend(true, this, {
			inputSomenteLeituraSelector: 'input, select, textarea', 
			estados : estados, 
			$container: $container || $(document)
		}, opcoes);	
	}
	
	PluginEstados.prototype = {
		instalar: function() {
			this.instalarPluginExibirQuando();
			this.instalarPluginAtivarEstado();
			this.instalarPluginTrocarEstado();
			this.instalarPluginTrocarClasseQuando();
			this.instalarPluginSomenteLeituraQuando();
			this.instalarPluginEditavelQuando();
		}
		, instalarPluginExibirQuando: function() {
			var me = this;
			me.instalarPlugin('exibirQuando', function($el, expressao) {
				me.estados.observarExpressao(expressao, me.exibirOuEsconder.bind(me, $el));
			});
		}
		, instalarPluginSomenteLeituraQuando: function() {
			var me = this;
			me.instalarPlugin('somenteLeituraQuando', function($el, expressao) {
				me.estados.observarExpressao(expressao, me.editavelOuSomenteLeituraQuando.bind(me, $el, 'somenteLeitura'));
			});
		}
		, instalarPluginEditavelQuando: function() {
			var me = this;
			me.instalarPlugin('editavelQuando', function($el, expressao) {
				me.estados.observarExpressao(expressao, me.editavelOuSomenteLeituraQuando.bind(me, $el, 'editavel'));
			});
		}
		, editavelOuSomenteLeituraQuando: function($el, modo, situacao) {
			var editavel = (modo == 'editavel' 		 && situacao) 
						|| (modo == 'somenteLeitura' && !situacao );
			$el.find(this.inputSomenteLeituraSelector).add($el.filter(this.inputSomenteLeituraSelector)).each(function () {
				var $input = $(this);
				//console.log("editavel", this, editavel);
				$input.trigger('editavel', [editavel]);
				$input.trigger('somenteLeitura', [!editavel]);
			});
		}
		, instalarPluginAtivarEstado: function() {
			var me = this;
			me.instalarPlugin('ativarEstado', function($el, expressao) {
				me.estados.declarar(expressao);
				var value = $el.val();
				if ($el[0].tagName == 'OPTION') {
					$el.closest("SELECT").on('change', function() {
						var $select = $(this);
						var expressaoOption = $select.find('option:selected').data('ativarestado');
						if ($select.val() == value)
							me.estados.ativar(expressao);
						else if (!expressaoOption || expressaoOption != expressao)
							me.estados.desativar(expressao);
					});
				} else{
					$el.on('click', function() {
						me.estados.ativar(expressao);
					});
				}
			});
		}
		, instalarPluginTrocarEstado: function() {
			var me = this;
			me.instalarPlugin('trocarEstado', function($el, expressao) {
				me.estados.declarar(expressao);
				$el.on('click', function() {
					me.estados.trocar(expressao);
				});
			});
		}
		, instalarPluginTrocarClasseQuando: function() {
			var me = this;
			me.instalarPlugin('trocarClasseQuando', function($el, opcoesJSON) {
				var opcoes = JSON.parse(opcoesJSON);
				$.each(opcoes, function(expressao, classe) {
					me.estados.observarExpressao(expressao, function (situacao) {
						$el.toggleClass(classe, situacao);
					});	
				});
			});
		}
		, instalarPlugin: function(pluginName, callback) {
			var pluginNamespace = "PluginEstados:" + pluginName; 
			this.$container.find('[data-' + pluginName + ']').each(function() {
				var $el = $(this);
				if (!$el.data(pluginNamespace)) {
					callback($el, $el.attr('data-' + pluginName));
					$el.data(pluginNamespace, true);
				}
			});
		}
		, exibirOuEsconder: function($el, situacao, expressao) {
			$el.toggle(situacao);
			if ($el.attr('selected'))
				$el.removeAttr('selected');
			$el.trigger('alterandoExibicao.pluginEstados', [situacao, expressao]);
		}
	};
	
	window.Estados = Estados;
	window.PluginEstados = PluginEstados;
})(window, jQuery);
