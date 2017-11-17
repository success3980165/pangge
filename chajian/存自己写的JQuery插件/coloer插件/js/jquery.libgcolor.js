//
;(function($){
	$.fn.extend({
		'alertBgColor':function(options){
			var options = $.extend({
				odd:'odd',  /*偶数样式*/
				even:'even',  /*奇数样式*/
				selected :'selected'  /*选中行的样式*/
			},options || {});

			//console.log($(this));

			$('ul>li:odd').addClass(options.odd);
			$('ul>li:even').addClass(options.even);
			$('ul>li').click(function() {
				//判断是否选中
				var hasSelected = $(this).hasClass(options.selected);
				console.log(hasSelected);
				//如果选中，就删除selected类，反之加上
				$(this)[hasSelected?'removeClass':'addClass'](options.selected).find(':checkbox').prop('checked', !hasSelected).attr('checked', !hasSelected);
			});
			$('ul>li:has(:checked)').addClass(options.selected);
			return this;
		}
	});
})(jQuery);