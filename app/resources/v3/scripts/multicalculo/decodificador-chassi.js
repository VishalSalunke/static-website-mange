;(function(window, $){
	
	var DecodificadorChassi = {};
	
	DecodificadorChassi.isChassiValido = function(chassi) {
		return chassi && chassi.trim() != '' && chassi.length == 17;
	};
	
	DecodificadorChassi.isChassiDecodificado = function(data) {
		return data && data.codigoRetorno == 1;
	};
	
	DecodificadorChassi.obterVeiculos = function(data) {
		return Array.isArray(data.listVeiculoFipe) ? obterVeiculosChassi(data) : obterVeiculosChassiFipe(data);
	};
	
	function obterVeiculosChassi(data) {
		var veiculosChassi = [];
		var tamanhoArray = data.listVeiculoFipe.length;
		for (var i = 0; i < tamanhoArray; i++) {
			if (data.listVeiculoFipe[i].listVeiculos) {
				
				if (Array.isArray(data.listVeiculoFipe[i].listVeiculos)) {
					var tamanhoArrayInterno = data.listVeiculoFipe[i].listVeiculos.length;
					for (var j = 0; j < tamanhoArrayInterno; j++) {
						var veiculoCorrente = data.listVeiculoFipe[i].listVeiculos[j];
						var veiculo = {};
						veiculo.codigo = veiculoCorrente.codigoBare;
						veiculo.descricao = veiculoCorrente.descricaoVeiculo;
						veiculo.fipe = data.listVeiculoFipe[i].codigoFipe;
						inserirVeiculo(veiculosChassi, veiculo)
					}
					
				} else {
					var veiculoCorrente = data.listVeiculoFipe[i].listVeiculos;
					var veiculo = {};
					veiculo.codigo = veiculoCorrente.codigoBare;
					veiculo.descricao = veiculoCorrente.descricaoVeiculo;
					veiculo.fipe = data.listVeiculoFipe[i].codigoFipe;
					inserirVeiculo(veiculosChassi, veiculo)
				}
			}
		}
		return veiculosChassi;
	}
	
	function obterVeiculosChassiFipe(data) { 
		var veiculosChassi = [];
		
		if (Array.isArray(data.listVeiculoFipe.listVeiculos)) {
			var tamanhoArray = data.listVeiculoFipe.listVeiculos.length;
			for (var i = 0; i < tamanhoArray; i++) {
				if (data.listVeiculoFipe.listVeiculos[i]) {
					var veiculo = {};
					var veiculoCorrente = data.listVeiculoFipe.listVeiculos[i];
					veiculo.codigo = veiculoCorrente.codigoBare;
					veiculo.descricao = veiculoCorrente.descricaoVeiculo;
					veiculo.fipe = data.listVeiculoFipe.codigoFipe;
					inserirVeiculo(veiculosChassi, veiculo)
				}
			}								
			
		// Voltou somente um resultado e nao e mais um array 
		} else {
			var veiculo = {};
			var veiculoRetornado = data.listVeiculoFipe.listVeiculos;
			veiculo.codigo = veiculoRetornado.codigoBare;
			veiculo.descricao = veiculoRetornado.descricaoVeiculo; 
			veiculo.fipe = data.listVeiculoFipe.codigoFipe; 
			inserirVeiculo(veiculosChassi, veiculo)
		}
		
		return veiculosChassi;
	}
	
	function inserirVeiculo(veiculosChassi, veiculo) {
		if (!isVeiculoExiste(veiculosChassi, veiculo)) veiculosChassi.push(veiculo);
		
	}
	
	function isVeiculoExiste(veiculosChassi, veiculo) {
		var tamanhoArray = veiculosChassi.length;
		for (var i = 0; i < tamanhoArray; i++) {
			if (veiculosChassi[i].codigo == veiculo.codigo) return true;
		}
		return false;
	}
	
	
	window.DecodificadorChassi = DecodificadorChassi;
	
}(window, jQuery));