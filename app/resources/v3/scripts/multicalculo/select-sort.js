(function (window, $) {
	function PluginSelectSort(options) {
		$.extend(true, this, options);
	}
	
	PluginSelectSort.prototype = {
		$: function(selector) {
			if (this.$container)
				return this.$container.find(selector);
			return $(selector);
		}, 
		instalar: function() {
			this.$('[data-sort]').each(function() {
				var $el = $(this);
				if (!$el.data('PluginSelectSort')) {
					$el.find('select').each(function() {
						var $select = $(this);
						var options = $select.find('option');
						options.sort(function(a,b) {
							if (a.text === '[Selecione]' || a.text < b.text) return -1;
							else if (a.text > b.text) return 1;
							else return 0;
						});
						$select.empty().append(options);	
					});
					$el.data('PluginSelectSort', true);
				}
			});	
		},
	};
	window.PluginSelectSort = PluginSelectSort;
})(window, jQuery);