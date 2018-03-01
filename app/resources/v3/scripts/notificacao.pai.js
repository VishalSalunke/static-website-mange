;(function() {
	'use strict';

	function inicializarNotificacaoPai() {
		
		var $bodyContent = $('.body-content');

		// Reportar a altura pro parent no onload.
		function postarAltura() {
			if($bodyContent[0]) {
				parent.postMessage($bodyContent.height(), "*");
			} else {
				if (navigator.appVersion.indexOf("MSIE") >= 0) {
					parent.postMessage($("body").height() + 50, "*");
				} else {
					parent.postMessage($("html").height(), "*");
				}
			}
		}

		// Reportar a altura pro parent nas requisições ajax dos updatepanels.
		function pageLoad(sender, args) {
			postarAltura();
		}

		$(function() {
			postarAltura();
		});

		// Reportar a altura pro parent no resize.
		$(window).resize(function() {
			postarAltura();
		});

		// Reportar a altura pro parent nas requisições ajax.
		$(document).bind("ajaxSend", function() {
			postarAltura();
		}).bind("ajaxComplete", function() {
			postarAltura();
		});		
		
		// Condutor
		$('input[name="formPadrao.condutorPrincipal.possuiDependentesEntre17e25anos"], input[name="formPadrao.condutorPrincipal.possuiResidentesEntre17e25anos"], input[name="formPadrao.condutorPrincipal.coberturaOutrosCondutores"], input[name="formPadrao.condutorPrincipal.algumOutroCondutorEhMaisJovemQuePrincipal"]').click(function(){
			postarAltura();
		});
		
		// Localização
		$('input[name="formPadrao.veiculo.cepCirculacaoIgualPernoite"]').click(function(){
			postarAltura();
		});
		
		// Proprietário
		$('input[name="proprietarioEhCondutorPrincipal"]').click(function(){
			postarAltura();
		});
		
		// Segurado
		$('input[name="quemEhSegurado"], input[name="formPadrao.segurado.cepResidenciaIgualPernoite"]').click(function(){
			postarAltura();
		});
		
		// Seguro
		$('input[name="formPadrao.seguro.modalidade"], input[name="formPadrao.seguro.utilizarBonus"], input[name="formPadrao.seguro.sabeMesFimVigencia"]').click(function(){
			postarAltura();
		});
		
	};
	
	if (window.notificarPai) {
		$(inicializarNotificacaoPai);		
	}
})();