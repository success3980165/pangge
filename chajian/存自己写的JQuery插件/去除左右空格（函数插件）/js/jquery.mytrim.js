;(function($){
	$.extend({
		ltrim : function ltrim(text){
			return (text || '').replace(/^\s+/g,'');
		},
		rtrim : function rtrim(text){
			return (text || '').replace(/\s+$/g,'');
		}
	});
})(jQuery);

