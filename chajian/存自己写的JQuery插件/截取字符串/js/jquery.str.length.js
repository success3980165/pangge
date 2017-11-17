;(function($){

	//截取字符串
	$.fixedTopicWidth = function(str,options){
		var setting = $.extend({
			length:20,  //默认截取字数
			fill:null,  //默认截取替换符号
			fillLength:3 //默认截取替换字数
		},options||{});

		var pos = setting.length-str.length;
		//我要截取的字数减去字符串字数 如果大于0 表示字符串不够截取数 返回截取
		if (pos>=0) {
			return str;
		} else{
			if (setting.fill) {
				var fs ='';
				for (var i = 0; i < setting.fillLength; i++) {
					fs = fs+setting.fill;
				};
				return (str.substr(0,setting.length)+fs);
			} else{
				return str.substr(0,setting.length);
			};
		};
	};


	$.fn.formatTopic = function(options){
		return this.each(function(n){
			//这个时候的this就不再是包装集对象，而是这个闭包对象
			//此时闭包对象中引用是一个html的节点ul li，要访问就需要使用$(this)
			$(this).html($.fixedTopicWidth($(this).html(),options));
		});
	};
})(jQuery);