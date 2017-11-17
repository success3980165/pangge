;(function($){
	//构造函数
	function Conterbox(opts){
		//默认值
		Conterbox.DEFAULTS ={
			el:'body'
		};

		this.opts = $.extend({}, Conterbox.DEFAULTS, opts||{});
		this.htmlbody = $('html,body');  //win
		this.win = $(window);
		this.cla ='.ed-conterbox';
		this.attr ='*[data-conterbox=ed-conterbox]';
		//构造三步奏
		this.init();  //初始化

		this.bindDOM();  //绑定事件
	};

	//第一步 -- 初始化
	Conterbox.prototype.init = function() {
		var self = this;

		$(this.opts.el).find(this.cla+','+this.attr).each(function(index, val) {
			var windowwidth = $(window).width();
			var windowheight = $(window).height();
			var dwidth = $(this).width();
			var dheight = $(this).height();

			$(this).css({
				left: (windowwidth-dwidth)/2,
				top: (windowheight-dheight)/2
			});
		});
	};

	//第三步 -- 绑定 DOM 事件
	Conterbox.prototype.bindDOM = function(){
		var self = this;

		// on windows resize
		var winResize = function(){
			self.init();
		};

		//绑定事件
		this.win.on('resize', winResize);
	};

	//JQ插件
	$.fn.extend({
		conterbox:function(){
			return $.each(this, function(index, val) {
				new Conterbox();
			});
		}
	});

	window.Conterbox = Conterbox;
})(jQuery);
