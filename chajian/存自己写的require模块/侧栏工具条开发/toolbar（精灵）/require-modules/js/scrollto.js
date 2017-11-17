define(['jquery'],function ($){

	//构造函数
	function ScrollTo(opts){
		this.opts = $.extend({}, ScrollTo.DEFAULTS, opts||{});
		this.$el = $('html,body');
	}

	//默认值
	ScrollTo.DEFAULTS ={
		dest:0,
		speed:800
	}

	//移动到
	ScrollTo.prototype.move=function(){
		//判断当前滚动条位置是否在默认值
		if ($(window).scrollTop() != this.opts.dest) {
			//判断html,body不在执行动画时
			if (!this.$el.is(':animated')) {
				//console.log(this);
				this.$el.animate({
					scrollTop: this.opts.dest
				}, this.opts.speed);
			};
		};
	}

	//快速到
	ScrollTo.prototype.go=function(){
		//判断当前滚动条位置是否在默认值
		if ($(window).scrollTop() != this.opts.dest) {
			this.$el.scrollTop(this.opts.dest);
		};
	}

	//返回对象
	return {
		ScrollTo:ScrollTo
	}
});