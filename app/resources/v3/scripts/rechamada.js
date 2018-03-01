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
