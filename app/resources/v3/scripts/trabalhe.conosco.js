(function() {
		
	var FORM_CONTATO = null;
	
	var inicializarTelaTrabalheConosco = function() {
		FORM_CONTATO = $('form[name="formContato"]'); 
		FORM_CONTATO.setGlobalValidationOptions({customCreateForm: function() {
			return FORM_CONTATO.serializeAsObject();
		}});
		associarRegrasValidacao();
		associarBinds();
	};

	var associarRegrasValidacao = function() {
		
		$('*[name="nome"]').validateOnEvent("regraTelaTrabalheConoscoNome", {after: function() {$(this).val($(this).val().toUpperCase());}});
		$('*[name="email"]').validateOnEvent("regraTelaTrabalheConoscoEmail", {after: function() {$(this).val($(this).val().toLowerCase());}});
		$('*[name="numeroTelefone"]').validateOnEvent("regraTelaTrabalheConoscoDddTelefone");
		$('*[name="mensagem"]').validateOnEvent("regraTelaTrabalheConoscoMensagem");
	};
		
	var associarBinds = function() {
		
		$(document.body).maxLengthForTextarea();
		
		$('*[name="email"]').bind("blur", function() {
			var valorSemEspacos = $.trim($(this).val()); 
			$(this).val(valorSemEspacos);
		});
		
		$('*[name="dddTelefone"], *[name="numeroTelefone"]').autoTabNumerico();
		
		$(".jsEnviar").click(function(){
			var validationContext = $("form[name='formContato']").validate();
			if (validationContext.temErros) {
				$("form[name='formContato']").find('.form-erro:first').find("input,select,textarea").first().focus();
				return false;
			}

			$('.form-enviado').addClass('sucesso');
   			$('.form-fale-conosco').addClass('sucesso');
			return false;
		});
		
		$('.jsFinalizar').click(function(){
			$('.form-enviado').removeClass('sucesso');
   			$('.form-fale-conosco').removeClass('sucesso');
   			limparFormulario();
		});
	};
	
	var limparFormulario = function() {
		$('input:not([type="hidden"]), textarea').val('');
	};
	
	window.inicializarTelaTrabalheConosco = inicializarTelaTrabalheConosco;		
})();
