(function($) {
	
	// Fixar altura do header-wrapper
	$('.header-wrapper').height($(".header-wrapper>header").outerHeight());
	
	// Acordeon 
	$('h4.accordion-title').click(function(){
		$(this).parent().find('div.accordion-content').slideToggle(300);
	});
	
	// Build number
	$(document).bind('keyup', 'alt+del', function() {
		$('.build-number').toggleClass('show');
	});
	
	// Certisign, Verisign
	function vopenw(selo) {	
		var tbar='location=no,status=yes,resizable=yes,scrollbars=yes,width=560,height=535';	
		var sw = window.open((selo == 'Certisign') ? 'https://www.certisign.com.br/seal/splashcerti.htm' : 'https://sealinfo.verisign.com/splash?&form_file=fdf/splash.fdf&dn=www.smartia.com.br&lang=pt','CRSN_Splash',tbar);	
		sw.focus();
	}
	window.vopenw = vopenw;
	
})(jQuery);