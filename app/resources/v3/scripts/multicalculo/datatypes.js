(function (window, $) {
	function PluginDataTypes(options) {
		$.extend(true, this, {types: PluginDataTypes.types}, options);
	}
	PluginDataTypes.types = {
		'date': function($el) {
			$el.mask('99/99/9999');
		},
		'currency': function($el) {
			$el.mask("#.##0,00", {reverse: true, maxlength: false});
		},
		'cep': function($el) {
			$el.mask("99999-999");
		},
		'cpf': function($el) {
			$el.mask("999.999.999-99");
		},
		'number': function($el){
			$el.mask("#9", {reverse: true, maxlength: false});
		},
		'placa': function($el) {
			//$el.mask("AAA9999");
			// Desabilitei para poder colocar a placa "AAVISAR"
		}
	};
	
	PluginDataTypes.prototype = {
		$: function(selector) {
			if (this.$container)
				return this.$container.find(selector);
			return $(selector);
		}, 
		instalar: function() {
			var me = this;
			this.$('[data-type],[data-formato]').each(function() {
				var $el = $(this);
				if (!$el.data('PluginDataType')) {
					me.instalarDataType($el, $el.attr('data-formato') || $el.attr('data-type'));
					$el.data('PluginDataType', true);
				}
			});	
		},
		instalarDataType: function($el, dataType) {
			var dataTypePlugin = this.types[dataType];
			if (dataTypePlugin)
				dataTypePlugin($el);
		}
	};
	window.PluginDataTypes = PluginDataTypes;
})(window, jQuery);