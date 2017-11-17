;(function($) {
	//构造函数
	function ImgAuto(settings){
		//默认值
		ImgAuto.DEFAULTS ={
			el:'body',
			cla:'.ed-imgauto',
			attr:'*[data-imgauto=ed-imgauto]'
		};
		this.options = $.extend({}, ImgAuto.DEFAULTS, settings||{});

		this.el = $(this.options.el);  //ul
		this.li = this.el.find('li');  //li
		this.htmlbody = $('html,body');  //win
		this.boxWidth = this.li.width();  //li宽
		this.boxHeight = this.li.height();  //li高

		//构造三步奏
		this.init(this.boxWidth,this.boxHeight);  //初始化
	}

	//第一步 -- 初始化
	ImgAuto.prototype.init = function(boxWidth,boxHeight) {
		var self = this;

		this.el.find(this.options.cla+','+this.options.attr).each(function(index, val) {
			var sourceSrc = $(this).attr('src');
			var imgWidth = $(this).width();
			var imgHeight = $(this).height();

			// 宽高比 两种都可用 推荐第一种
			var scale = Math.min(boxWidth/imgWidth,boxHeight/imgHeight,1);
			//console.log(scale);
			// var scale = (boxWidth/imgWidth < boxHeight/imgHeight) ? boxWidth/imgWidth : boxHeight/imgHeight;

			self.loadPicSize(sourceSrc,imgHeight,boxHeight,scale,$(this));
		});
	};

	//图片预处理
	ImgAuto.prototype.loadPicSize = function(sourceSrc,imgHeight,boxHeight,scale,el) {
		var self = this;
		// 预加载图片，执行回调。
		this.preLoadImg(sourceSrc,function() {
			if (scale <1) {
				console.log('0.1');
				el.css({
					'width': el.width()*scale,
					'height': el.height()*scale,
					'margin-top':(boxHeight-imgHeight*scale)/2
				});
			}else{
				console.log('1');
				el.css({
					'width': el.width(),
					'height': el.height(),
					'margin-top':(boxHeight-imgHeight)/2
				});
			};
			el.fadeIn();
		});
	};

	//预加载图片，执行回调。
	ImgAuto.prototype.preLoadImg = function(src,callback) {
		var img = new Image();
		if(!!window.ActiveXObject){
			img.onreadystatechange = function() {
				if(this.readyState == 'complete') {
					callback();
				};
			};
		}else{
			img.onload = function() {
				callback();
			}
		};
		img.src = src;  //必须在回调执行完 在赋值地址
	};

	window.ImgAuto = ImgAuto;

	//JQ插件
	$.fn.extend({
		imgauto:function(settings){
			return $.each(this, function(index, val) {
				new ImgAuto(settings);
			});
		}
	});
})(jQuery);