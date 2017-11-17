//第一种与第二种相同结果
;(function($){
	$.fn.extend({
		'color':function(value){
			return this.css("color",value);
		}
	});
})(jQuery);



//第一种与第二种相同结果
/*;(function($){
	$.fn.color = function(value){
		return this.css('color',value);
	};
})(jQuery);*/



//第三种
/*;(function($){
	$.fn.extend({
		'color' : function(value){
			if (value == undefined) {
				return this.css('color');
			}else{
				return this.css('color',value);
			};
		}
	});
})(jQuery);*/