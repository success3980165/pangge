;(function($) {
	//构造函数
	function StrInterception(settings){
		//默认值
		StrInterception.DEFAULTS ={
			cla:'.ed-strInterception',
			attr:'*[data-strInterception="ed-strInterception"]'
		};
		this.options = $.extend({}, StrInterception.DEFAULTS, settings||{});

		this.body = $('body');
		this.arrData =[];

		//构造三步奏
		this.init();  //初始化
		this.renderDOM();  //渲染DOM
	}

	//第一步 -- 初始化
	StrInterception.prototype.init = function() {
		var self = this;

		this.body.find(this.options.cla+','+this.options.attr).each(function(index, val) {
			var i = 0;  //计数器
			var open = true ;
			var str = $(this).text();
			var num = self.getStrLength(str);
			var length = $(this).data('strlength');
			var fill =  $(this).data('strfill') || '';
			var arr = Array.prototype.join.call(str, ',').split(',');  //先用逗号拆分单个字符，在把字符串转为数组
			var obj ={
				str:str,  //原来字符串
				num:num,  //计算后的字符数量
				arr:arr,  //所有单位的数组
				len:length,  //要截取的数量
				fill:fill
			}

			if (obj.num > obj.len) {
				$.each(obj.arr, function(index, val) {
					var ii = self.getStrLength(val);

					if (i < obj.len) {
						if (ii === 1) {
							i++;
						}else if(ii === 2){
							i+=2;
						}
					}else if(i >= obj.len && open){
						open = false;
						obj.index = index;  //实际上单位的数量
					}
				});
			}

			self.arrData.push(obj);
		});
	};

	//第二步 -- 根据数据渲染DOM
	StrInterception.prototype.renderDOM = function(){
		var self = this;
		// console.log(this.arrData);
		this.body.find(this.options.cla+','+this.options.attr).each(function(i, val) {
			var str = self.arrData[i].str;
			var arr = self.arrData[i].arr;
			var num = self.arrData[i].num;
			var index = self.arrData[i].index;
			var len = self.arrData[i].len;
			var fill = self.arrData[i].fill;

			if (num<=len) {
				$(this).text(str).addClass('red');
			}else {
				if (!fill) {
					$(this).text(str.substring(0,index));
				}else{
					$(this).text(str.substring(0,index)+fill);
				}
			}

			$(this).show();
		});
	};

	/**
	 * [getStrLength 返回字符串个数，中文占2字符]
	 * @param  {[string]} str [源数据]
	 * @return {[number]}     [个数]
	 */
	StrInterception.prototype.getStrLength = function(str) {
		var cArr = str.match(/[^\x00-\xff]/ig);
		return str.length + (cArr == null ? 0 : cArr.length);
	};

	window.StrInterception = StrInterception;

	//JQ插件
	$.fn.extend({
		strinterception:function(settings){
			return $.each(this, function(index, val) {
				new StrInterception(settings);
			});
		}
	});
})(jQuery);