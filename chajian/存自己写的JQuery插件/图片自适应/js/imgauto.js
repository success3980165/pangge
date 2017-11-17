;(function($) {
	/**
	 * [ImgAuto 构造函数]
	 * @param {[obj]} settings [配置项]
	 * @note   [注意获取图片的宽高，计算比。一定要在图片加载后的回调里 在获取]
	 */
	function ImgAuto(settings){
		//默认值
		ImgAuto.DEFAULTS ={
			cla:'.ed-imgauto',
			attr:'*[data-imgauto=ed-imgauto]'
		};
		this.options = $.extend({}, ImgAuto.DEFAULTS, settings||{});
		this.body = $('body');

		//构造三步奏
		this.init();  //初始化
	}

	//第一步 -- 初始化
	/**
	 * [init 初始化]
	 * @return {[null]}  [计算图片比，执行图片处理]
	 */
	ImgAuto.prototype.init = function() {
		var self = this;
		this.body.find(this.options.cla+','+this.options.attr).each(function(index, val) {
			var box = $(this).parent();
			var boxWidth = box.width();
			var boxHeight = box.height();
			self.loadPicSize(boxWidth,boxHeight,val,$(this));
		});
	};

	/**
	 * [loadPicSize 图片预加载 each中执行]
	 * @param  {[number]} imgHeight [图片高]
	 * @param  {[number]} scale     [比例]
	 * @param  {[element]} val       [image]
	 * @param  {[jquerySelect]} el        [当前图片元素]
	 * @return {[null]}           [执行最后赋值操作]
	 */
	ImgAuto.prototype.loadPicSize = function(boxWidth,boxHeight,val,el) {
		var self = this;
		var imgWidth,imgHeight,scale;
		if (val.complete) {
			imgWidth = el.width();
			imgHeight = el.height();

			// 宽高比 两种都可用 推荐第一种
			scale = Math.min(boxWidth/imgWidth,boxHeight/imgHeight,1);
			console.log(imgWidth,imgHeight,scale);

			this.preLoadImg(scale,imgHeight,boxHeight,el,function(){
				el.show();
			});
		} else {
			el.load(function() {
				imgWidth = el.width();
				imgHeight = el.height();

				// 宽高比 两种都可用 推荐第一种
				scale = Math.min(boxWidth/imgWidth,boxHeight/imgHeight,1);
				self.preLoadImg(scale,imgHeight,boxHeight,el,function(){
					el.show();
				});
			});
			el.on('error', function(event) {
				event.preventDefault();
				alert('图片没加载成功');
			});
		}
	};

	/**
	 * [preLoadImg 图片加载后的宽高赋值]
	 * @param  {[number]}   scale     [比例]
	 * @param  {[number]}   imgHeight [图片高]
	 * @param  {[number]}   boxHeight [容器高]
	 * @param  {[jquerySelect]} el   当前图片元素]
	 * @param  {Function} callback  [回调函数]
	 * @return {[nluu]}             [完成]
	 */
	ImgAuto.prototype.preLoadImg = function(scale,imgHeight,boxHeight,el,callback) {
		if (scale === 0) {  //图片与容易相等时
			console.log('等图');
			el.css({
				'width': el.width(),
				'height': el.height(),
				'margin-top':0
			});
		}else if (scale <1) {  //图片大于比例 缩放赋值居中
			console.log('大图');
			el.css({
				'width': el.width()*scale,
				'height': el.height()*scale,
				'margin-top':(boxHeight-imgHeight*scale)/2
			});
		}else{  //大于1 代表图片没有容器大（既小图片）显示全部居中
			console.log('小图');
			el.css({
				'width': el.width(),
				'height': el.height(),
				'margin-top':(boxHeight-imgHeight)/2
			});
		}
		callback();
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