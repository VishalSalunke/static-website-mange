(function($) {
	// Inicializa o style para pesquisa
	$(document.body).append('<style id="search-style">.search-result .hidden {display:none;}</style>');
	var $searchStyle = $('#search-style');
	var $textoBuscaTermo = $('#texto-busca-termo');
	var ie8 = $('html').hasClass('ie8');

	// Inicializa busca por termo
	$textoBuscaTermo.on('keyup', function() {
		var value = this.value;
		if (value) {
			Filtro.filtroCorrente.desmarcar();
			value = value.toLowerCase();
			buscaContendoTermo(value);
		} else
			Filtro.filtroCorrente.aplicar();
		return false;
	});

	// Constroi objeto de filtro
	function Filtro(elemento) {
		this.$elemento = $(elemento);
		this.termo = this.$elemento.text().toLowerCase();

		this.$elemento.on('click', function() {
			Filtro.aplicar($(this).text().toLowerCase());
			return false;
		});
		
		Filtro.elementos[this.termo] = this;
	};
	Filtro.elementos = [];
	Filtro.aplicar = function(termo) {
		if(Filtro.filtroCorrente)
			Filtro.filtroCorrente.desmarcar();
		var filtro = Filtro.elementos[termo.toLowerCase()];
		if(filtro)
			filtro.aplicar();
	};
	Filtro.prototype.aplicar = function() {
		Filtro.filtroCorrente = this;
		buscaIniciandoComTermo(this.termo);
		this.$elemento.addClass('current');
		$textoBuscaTermo.val("");		
	};
	Filtro.prototype.desmarcar = function() {
		this.$elemento.removeClass('current');
	};

	// Filtros
	function buscaContendoTermo(termo) {
		if(ie8) {
			$('.search-result dt,.search-result dt+dd').addClass('hidden');		
			$('.search-result dt[data-index*="' + termo + '"],.search-result dt[data-index*="' + termo + '"]+dd').removeClass('hidden');
		} else {
			$searchStyle.html(
				'.search-result dt:not([data-index*="' + termo + '"]),' +
				'.search-result dt:not([data-index*="' + termo + '"])+dd { display: none; }'
			);
		}
	}

	function buscaIniciandoComTermo(termo) {
		if(ie8) {
			$('.search-result dt,.search-result dt+dd').addClass('hidden');		
			$('.search-result dt[data-index^="' + termo + '"],.search-result dt[data-index^="' + termo + '"]+dd').removeClass('hidden');
		} else {
			$searchStyle.html(
				'.search-result dt:not([data-index^="' + termo + '"]),' +
				'.search-result dt:not([data-index^="' + termo + '"])+dd { display: none; }'
			);
		}
	}

	// Inicializa filtro
	$('.filter a[href="#"]').each(function() {
		new Filtro(this);
	});
	Filtro.aplicar('A');
})(jQuery);