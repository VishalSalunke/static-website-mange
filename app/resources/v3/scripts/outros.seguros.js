(function() {
		
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
	
	var obterModelos = function(fabricante) {
		$.ajax({
			url: "/seguro-moto/fabricante/"+fabricante+"/modelos" 
			, type: "GET"
			, success: function(modelos) {
				var campoModelo = $('*[name="modeloVeiculo"]')[0].selectize;
				campoModelo.clearOptions();
				campoModelo.addOption({value: '', text: 'Selecione...'});
				$.each(modelos, function(i, modelo) {
					campoModelo.addOption({value: modelo.id, text: modelo.nome});
				});
				campoModelo.addOption({value: 'OUTROS', text: 'OUTROS'});
			}
			, error: function() {
				$.fatalError();
			}
		});
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
