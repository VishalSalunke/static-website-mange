(function() {
		
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
