define(['jquery','scrollto'],function ($,scrollto){

	//构造函数
	function BackTop(el,opts){
		this.opts = $.extend({}, BackTop.DEFAULTS, opts||{});
		this.$el = $(el);
		this.scroll = new scrollto.ScrollTo({
			dest:this.opts.dest,
			speed:this.opts.speed
		});

		this._checkPosition();

		//绑定事件和THIS指向
		if (this.opts.mode == 'move') {
			this.$el.on('click', $.proxy(this._move,this));
		}else{
			this.$el.on('click', $.proxy(this._go,this));
		};
		$(window).on('scroll', $.proxy(this._checkPosition,this));
	}

	//默认值
	BackTop.DEFAULTS ={
		dest:0,
		mode:'move',
		pos:$(window).height(),
		speed:800
	}

	//移动到
	BackTop.prototype._move=function(){
		this.scroll.move();
	}

	//快速到
	BackTop.prototype._go=function(){
		this.scroll.go();
	}

	//元素fade
	BackTop.prototype._checkPosition=function(){
		//console.log(this);
		if ( $(window).scrollTop() > this.opts.pos) {
			this.$el.fadeIn();
		}else{
			this.$el.fadeOut();
		};
	}

	//JQ插件
	$.fn.extend({
		backtops:function(opts){
			return $.each(this, function(index, val) {
				new BackTop(this,opts);
			});
			// return this.each(function(index, el) {
			// 	new BackTop(this,opts);
			// });
			//return this;  //上面返回了each
		}
	});

	//返回对象
	return{
		BackTop:BackTop
	}
});