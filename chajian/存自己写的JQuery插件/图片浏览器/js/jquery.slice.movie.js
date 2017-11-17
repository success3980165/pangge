;(function($){
	$.fn.movieSlice = function(options){
		var setting = $.extend({
			movieElement : '#movieElement',
			next : '#nextMovie',
			prev : '#precMovie',
			first : '#firstMovie',
			last : '#lastMovie',
			replacePath : function(str,path){  //改变路径
				if (path) {
					return srt.replace(/min/,path);  //replace替换路径
				}else{
					return str.replace(/min/,'max');
				};
			}
		},options || {});
		var thumbnails = this;  //缩略图img


		/*
		 * 给缩略图编号，为每一个缩略图设定相应的数据，以此可以在showPhoto通过下标访问
		 */
		thumbnails.each(function(n) {
			$(this).data('photo-number',n);  //N 要设定数据的值
		});

		setting.cur = 0;//创建一个属性cur=0 点击按钮的时候下标赋值，如果点击缩略图setting.cur会被index覆盖


		this.on('click', function() {  //点击小图显示大图
			showPhoto($(this).data('photo-number'));
		});
		$(setting.movieElement).click(function() {  //点击大图看下一张图大图
			showPhoto(setting.cur+1);
		});
		$(setting.prev).on('click', function() {  //上一张
			showPhoto(setting.cur-1);
		});
		$(setting.next).on('click', function() {  //下一张
			showPhoto(setting.cur+1);
		});
		$(setting.first).on('click', function() {  //第一章
			showPhoto(0);
		});
		$(setting.last).on('click', function() {  //最后一张
			showPhoto(thumbnails.length-1);
		});


		var showPhoto = function(index){  //显示图片
			if (index<0) {
				index=thumbnails.length-1;  //如果第一张 则跳到最后一张
			};
			if (index>=thumbnails.length) {	//如果最后一张 则跳到第一张
				index=0;
			};
			$(setting.movieElement).attr('src', setting.replacePath(thumbnails[index].src)).css('opacity', '0.0').animate({opacity:1.0},300);

			setting.cur = index;  //覆盖setting.cur 保证按钮能正确使用
		};


		showPhoto(0);
		return this;
	};
})(jQuery);