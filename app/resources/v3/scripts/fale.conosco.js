(function() {
		
	var FORM_CONTATO = null;
	
	var inicializarTelaFaleConosco = function() {
		FORM_CONTATO = $('form[name="formContato"]'); 
		FORM_CONTATO.setGlobalValidationOptions({customCreateForm: function() {
			return FORM_CONTATO.serializeAsObject();
		}});
		associarRegrasValidacao();
		associarBinds();
	};

	var associarRegrasValidacao = function() {
		
		$('*[name="nome"]').validateOnEvent("regraTelaContatoNome", {after: function() {$(this).val($(this).val().toUpperCase());}});
		$('*[name="email"]').validateOnEvent("regraTelaContatoEmail", {after: function() {$(this).val($(this).val().toLowerCase());}});
		$('*[name="numeroTelefone"]').validateOnEvent("regraTelaContatoDddTelefone");
		$('*[name="numeroCelular"]').validateOnEvent("regraTelaContatoDddCelular");
		$('*[name="assunto"]').validateOnEvent("regraTelaContatoAssunto");
		$('*[name="mensagem"]').validateOnEvent("regraTelaContatoMensagem");
	};
		
	var associarBinds = function() {
		
		$(document.body).maxLengthForTextarea();
		
		$('*[name="email"]').bind("blur", function() {
			var valorSemEspacos = $.trim($(this).val()); 
			$(this).val(valorSemEspacos);
		});
		
		$('*[name="dddTelefone"], *[name="numeroTelefone"], *[name="dddCelular"], *[name="numeroCelular"]').autoTabNumerico();
		
		$(".jsEnviar").click(function(){
			var validationContext = $("form[name='formContato']").validate();
			if (validationContext.temErros) {
				$("form[name='formContato']").find('.form-erro:first').find("input,select,textarea").first().focus();
				return false;
			}

			enviarContato();
			return false;
		});
		
		$('.jsFinalizar').click(function(){
			$('.form-enviado').removeClass('sucesso');
   			$('.form-fale-conosco').removeClass('sucesso');
   			limparFormulario();
		});
	};
	
	var limparFormulario = function() {
		$('*[name="assunto"]')[0].selectize.setValue('');
		$('*[name="assunto"]').clearErrors();
		$('input:not([type="hidden"]), textarea').val('');
	};
	
	
	var enviarContato = function() {
		if (!FORM_CONTATO.validate().temErros) {
			$.ajax({
				beforeSend: function() {
					$('.jsEnviar').attr('disabled', 'disabled').text('Enviando...');
				},
			   	type: "POST",
			   	url: "seguro-auto/enviar-contato-fale-conosco", 
			   	data: FORM_CONTATO.serializeAsObject(),
			   	success: function(enviouFaleconosco) {
			   		$('.jsEnviar').removeAttr('disabled').text('Enviar');
			   		if (enviouFaleconosco) {
			   			$('.form-enviado').addClass('sucesso');
			   			$('.form-fale-conosco').addClass('sucesso');
			   		} else {
			   			$.fatalError();
			   		}
			   	},
			   	error: function() {
			   		$('.form-enviado').removeClass('sucesso');
		   			$('.form-fale-conosco').removeClass('sucesso');
			   		$('.jsEnviar').removeAttr('disabled').text('Enviar');
			   		$.fatalError();
			   	}
			});
		}
	};
	
	window.inicializarTelaFaleConosco = inicializarTelaFaleConosco;		
})();
