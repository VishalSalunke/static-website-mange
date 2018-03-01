(function (window, jQuery) {
	function FormularioSeguradora(seguradora, opcoes) {
		$.extend(true, this, {
			logo: 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
			rotuloAcaoSecundaria: 'Cancelar', 
			rotuloAcaoPrimaria: 'Salvar',
			template: "<div id='formSeguradoraContainer' class='aguardando'><div id='formFrameExpose'></div><div class='aguarde'></div><div id='formFrameContainer'><iframe id='formFrame' class='frame' src='about:blank'></iframe><div class='acoes'><img class='logo'><div><div class='alertas js-alertas-container'></div><a href='javascript:void(0);' class='btn acaoSecundaria'></a><a href='javascript:void(0);' class='btn acaoPrimaria'>recalcular</a></div></div></div></div>",
			alertasTemplate: "<a class=\"js-tooltip alerta-destaque-form-seg\">ver alertas</a><div class=\"tooltip js-alertas\"></div>",
			containerSelector: "#formSeguradoraContainer",
			bloquearAcaoPrimaria: true
		}, opcoes || {});
		this.seguradora = seguradora;
		this.inicializar(); 
	}
	FormularioSeguradora.prototype = {
		inicializar: function() {
			FormularioSeguradora.instance = this;
			$(window).off('formulario.carregado');
			$(this.containerSelector).remove();
			$('body').append(this.template);
			this.formSeguradoraContainer = $(this.containerSelector);
			this.$frame = this.formSeguradoraContainer.find('iframe');
			this.formSeguradoraContainer.find('.acaoSecundaria').text(this.rotuloAcaoSecundaria).on('click', this.acaoSecundaria.bind(this));
			this.$aguarde = this.formSeguradoraContainer.find('.aguarde');
			this.$acaoPrimaria = this.formSeguradoraContainer.find('.acaoPrimaria').text(this.rotuloAcaoPrimaria).on('click', this.acaoPrimaria.bind(this));
			this.$alertas = this.formSeguradoraContainer.find('.alertas');
			if (window.statics && this.seguradora)
				this.logo = window.statics + '/images/lista-seguradoras/logos/logo-seguradora-' + this.seguradora + '.png';
			this.formSeguradoraContainer.find('.logo').attr('src', this.logo);
			var me = this;
			var resize = function() { me.$frame.height(($(window).height() - 140));};
			$(window).off('resize.formulario').on('resize.formulario', resize);
			resize();
			me.formSeguradoraContainer.show();
		}
		, abrir: function(defaultData) {
			var me = this;
			me.defaultData = defaultData;
			$(window).on('formulario.carregado', function(e, formulario) {
				me.formulario = formulario;
				if (defaultData)
					formulario.set(defaultData);
				me.formSeguradoraContainer.removeClass('aguardando');
			});
			this.$frame.attr('src', window.base + '/seguro-auto/multicalculo/formulario/' + this.seguradora);
		}
		, obter: function() {
			var dadosDoFormulario = this.formulario.get();
			return dadosDoFormulario;
		}
		, acaoSecundaria: function() {
			if (this.onAcaoSecundaria)
				this.onAcaoSecundaria(this, this.obter()); 
		}
		, acaoPrimaria: function() {
			if (this.bloquearAcaoPrimaria)
				this.$acaoPrimaria.block();
			if (this.onAcaoPrimaria)
				this.onAcaoPrimaria(this, this.obter(), this.$acaoPrimaria.unblock.bind(this.$acaoPrimaria)); 
		}
		, fechar: function() {
			this.formSeguradoraContainer.hide();
		}
		, obterFormSeguradora: function(dados) {
			return dados[dados._nomeFormSeguradora];
		}
		, encapsularFormSeguradora: function(seguradora, dados) {
			var formSeguradora = {};
			var _nomeFormSeguradora = 'form' + seguradora.substring(0, 1).toUpperCase() + seguradora.substring(1);
			formSeguradora[_nomeFormSeguradora] = typeof(dados) == 'string' ? JSON.parse(dados) : dados;
			formSeguradora._nomeFormSeguradora = _nomeFormSeguradora;
			return formSeguradora;
		}
		, exibirAlertas: function(alertas) {
			this.$alertas.html(this.alertasTemplate);
			this.$alertas.find('.js-alertas').html("<ul><li>" + alertas.join("</li><li>") + "</li></ul>");
			this.inicializarTooltip(this.$alertas.find('.js-tooltip'));
			this.$alertas.fadeIn();
		}
		, inicializarTooltip: function($el) {
			$el.each(function() {
				var $link = $(this);
				var conteudo = $link.next();
				$link.qtip({
					content: conteudo,
					delay: 15000,
					show: 'mouseenter',
					hide: { when: { event: 'mouseout' }, delay: 350, fixed: true },
					position: {
						corner: {
							target: 'topMiddle',
							tooltip: 'topMiddle'
						}
					}
				});
			});
		}
		, apagarAlertas: function() {
			this.$alertas.fadeOut();
			this.$alertas.html("");
		}
	};
	
	window.FormularioSeguradora = FormularioSeguradora;
	
	var camposEscondidos = null;
	$(document).bind('keydown', function(e) {
		if (e.keyCode == 27 && FormularioSeguradora && FormularioSeguradora.instance)
			FormularioSeguradora.instance.fechar();
		if (e.keyCode == 119  && FormularioSeguradora && FormularioSeguradora.instance) {
			if (camposEscondidos) {
				camposEscondidos.hide();
				camposEscondidos = null;
			} else {
				camposEscondidos = $('[data-exibirQuando]:hidden', FormularioSeguradora.instance.$frame.contents()[0]).show();
			}
		}
				
	});
})(window, jQuery);