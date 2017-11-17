;(function($){
	$.fn.movieSlice = function(options){
		var setting = $.extend({
			movieElement : '#movieElement',
			next : '#nextMovie',
			prev : '#precMovie',
			first : '#firstMovie',
			last : '#lastMovie',
			active :'active',
			ul:'.ul',
			tab:'/images/max'
		},options || {});
		var thumbnails = this;  //缩略图img
		setting.cur = 0;//创建一个属性cur=0 点击按钮的时候下标赋值，如果点击缩略图setting.cur会被index覆盖


		/*
		 * 给缩略图编号，为每一个缩略图设定相应的数据，以此可以在showPhoto通过下标访问
		 */
		thumbnails.each(function(n) {
			$(this).data('photo-number',n);  //N 要设定数据的值
		});

		//事件触发
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


		var replacePath = function(str,path){  //改变路径
			if (path) {
				return str.replace(/\/images\/min/,path);  //replace替换路径
			}else{
				return str.replace(/\/images\/min/,'/images/max');
			};
		};
		var showPhoto = function(index){  //显示图片
			if (index<0) {
				index=thumbnails.length-1;  //如果第一张 则跳到最后一张
			};
			if (index>=thumbnails.length) {	//如果最后一张 则跳到第一张
				index=0;
			};
			$(setting.movieElement).attr('src', replacePath(thumbnails[index].src , setting.tab)).css('opacity', '0.0').animate({opacity:1.0},300);
			$(thumbnails).parent().removeClass();  //移除样式
			$(thumbnails[index]).parent().addClass(setting.active); //添加小图样式
			var scrollLeft = $(thumbnails).parent().width()+20;
			$(setting.ul).mCustomScrollbar("scrollTo",scrollLeft*index);
			setting.cur = index;  //覆盖setting.cur 保证按钮能正确使用
		};


		showPhoto(0);  //初始化
		return this;
	};
})(jQuery);