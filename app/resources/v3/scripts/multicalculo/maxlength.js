(function (window, $) {
	function PluginMaxLength(options) {
		$.extend(true, this, options);
	}
	
	PluginMaxLength.prototype = {
		$: function(selector) {
			if (this.$container)
				return this.$container.find(selector);
			return $(selector);
		}, 
		instalar: function() {
			this.$('[data-maxlength]').each(function() {
				var $el = $(this);
				if (!$el.data('PluginMaxLength')) {
					var $input = $el.find('input');
					if($input.size())
						$input.attr('maxlength', $el.attr('data-maxlength'));
					$el.data('PluginMaxLength', true);
				}
			});	
		},
	};
	window.PluginMaxLength = PluginMaxLength;
})(window, jQuery);