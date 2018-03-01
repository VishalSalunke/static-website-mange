(function() {
		
	var MIN_COMISSAO = 5;
	var MAX_COMISSAO = 35;
	
	var inicializarTelaComissoes = function() {
		inicializar();
		associarBinds();
	};
	
	var inicializar = function() {
		$('button').removeAttr('disabled').text('Salvar');
		$('tr').css('background-color', 'white');
	};
		
	var associarBinds = function() {
		$('#corretor').change(function() {
			var url = document.URL.replace(/\?.*/g, '');
			window.location.href = url + '?corretor=' + this.value;
		});
		
		$('button').click(function() {
			var inputValorComissao = $(this).parent().parent().find('*[name="valorComissao"]');
			var valorComissao = inputValorComissao.val();
			if (!$.isNumeric(valorComissao)) {
				alert('Valor de comissão inválido.');
			} else {
				if (valorComissao >= MIN_COMISSAO && valorComissao <= MAX_COMISSAO) {
					var linhaComissao = $(this).parent().parent(); 
					salvarComissao(linhaComissao);					
				} else {
					alert('Valor de comissão deve estar entre '+MIN_COMISSAO+' e '+MAX_COMISSAO+'.');
				}
			}
		});
	};
	
	
	var salvarComissao = function(linhaComissao) {
		var corretorSeguradoraCanalId = linhaComissao.find('*[name="corretorSeguradoraCanalId"]').val();
		var valorComissao = linhaComissao.find('*[name="valorComissao"]').val();
		$.ajax({
			beforeSend: function() {
				linhaComissao.find('button').attr('disabled', 'disabled').text('Salvando...');
			},
		   	type: "POST",
		   	url: "/seguro-auto/comissao/salvar", 
		   	data: "corretorSeguradoraCanalId="+corretorSeguradoraCanalId+"&comissao="+valorComissao,
		   	success: function(salvouComissao) {
		   		linhaComissao.find('button').removeAttr('disabled').text('Salvar');
		   		if (salvouComissao) {
		   			linhaComissao.css('background-color', 'yellow');
		   			setTimeout(function() {
		   				linhaComissao.css('background-color', 'white');	
		   			}, 3000);
		   		} else {
		   			alert('Erro ao salvar comissão.');
		   			recarregar();
		   		}
		   	},
		   	error: function() {
		   		alert('Erro ao salvar comissão.');
	   			recarregar();
		   	}
		});
	};
	
	function recarregar() {
		window.location.href = document.URL;
	}
	
	window.inicializarTelaComissoes = inicializarTelaComissoes;		
})();
