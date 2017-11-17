;(function($) {
	//构造函数
	function ScrollText(settings){
		//默认值
		ScrollText.DEFAULTS ={
			cla:'.ed-scrolltext',
			attr:'*[data-scrolltext=ed-scrolltext]',
			page:false,  //是否一次翻多条
			but:false  //是否显示上下翻页
		};
		this.options = $.extend({}, ScrollText.DEFAULTS, settings||{});

		//构造三步奏
		this.init();  //初始化
		this.renderDOM();  //插入DOM
		this.bindDOM();  //绑定事件
	};

	//第一步 -- 初始化
	ScrollText.prototype.init = function() {
		var self = this;

		this.win =  $(window);  //window
		this.body = $('body');  //body
		this.doc = $(document);  //document

		this.els = this.body.find(this.options.cla+','+this.options.attr);
		this.arrData =[];
	};

	//第二步 -- 根据数据渲染DOM
	ScrollText.prototype.renderDOM = function(){
		var self = this;

		$.each(this.els , function(index, val) {
			var intervalTime = $(this).data('scrolltext-intervaltime')=== undefined ? 2000 : $(this).data('scrolltext-intervaltime');
			var aniTime = $(this).data('scrolltext-anitime')=== undefined ? 200 : $(this).data('scrolltext-anitime');
			var but = $(this).data('scrolltext-but')=== undefined ? false : true;
			var pages =  $(this).data('scrolltext-page')=== undefined ? 1 : $(this).data('scrolltext-page');
			var obj ={
				el:$(this),
				index:index,
				intervalTime:intervalTime,
				aniTime:aniTime,
				but:but,
				page:pages
			};

			//给项目加索引
			$(this).data('index', index);

			obj.adtimer = setInterval(function() {
				if (self.options.page && obj.page>1) {
					var _field =obj.el.find('li:lt(' + obj.page + ')');
				}else{
					var _field =obj.el.find('li:first');
				}

				var _h = _field.height();

				_field.animate({'margin-top': -_h + 'px'}, aniTime, function() {
					_field.css('margin-top', 0).appendTo(obj.el.find('ul'));
				});
			}, intervalTime);

			self.arrData.push(obj);  //数据结构完成

			//开启图片功能
			if (self.options.but) {
				if (self.arrData[index].but) {
					var src = '<div class="ed-scrolltext-btn"><span class="ed-scrolltext-prev">上一条</span><span class="ed-scrolltext-next">下一条</span></div>';
					$(this).append(src);
				}
			}
		});
	};

	//第三步 -- 绑定 DOM 事件
	ScrollText.prototype.bindDOM = function(){
		var self = this;

		console.log(this.arrData);

		//触发
		var stopAnimate = function(event){
			var index = $(this).data('index');
			clearInterval(self.arrData[index].adtimer);
		}
		var startAnimate = function(event){
			var index = $(this).data('index');
			self.arrData[index].adtimer = setInterval(function() {
				if (self.options.page && self.arrData[index].page>1) {
					var _field = self.arrData[index].el.find('li:lt(' + self.arrData[index].page + ')');
				}else{
					var _field = self.arrData[index].el.find('li:first');
				}
				var _h = _field.height();

				_field.animate({'margin-top': -_h + 'px'}, self.arrData[index].aniTime, function() {
					_field.css('margin-top', 0).appendTo(self.arrData[index].el.find('ul'));
				});
			}, self.arrData[index].intervalTime);
		}
		var next = function(event){
			var index = $(this).parents(self.options.cla+','+self.options.attr).data('index');

			if (self.options.page && self.arrData[index].page>1) {
				var _field = self.arrData[index].el.find('li:lt(' + self.arrData[index].page + ')');
			}else{
				var _field = self.arrData[index].el.find('li:first');
			}
			var _h = _field.height();

			_field.animate({'margin-top': -_h + 'px'}, self.arrData[index].aniTime, function() {
				_field.css('margin-top', 0).appendTo(self.arrData[index].el.find('ul'));
			});
		}
		var prev = function(event){
			var index = $(this).parents(self.options.cla+','+self.options.attr).data('index');
			var ul = $(this).parents(self.options.cla+','+self.options.attr).find('ul');
			var leng =  ul.find('li').length-self.arrData[index].page-1;

			if (self.options.page && self.arrData[index].page>1) {
				var _field = self.arrData[index].el.find('li:gt(' + leng + ')');
				var _h = _field.height()*self.arrData[index].page;
			}else{
				var _field = self.arrData[index].el.find('li:last');
				var _h = _field.height();
			}

			_field.css('margin-top', -_h + "px");
			_field.prependTo(ul);
			_field.animate({'margin-top': 0}, self.arrData[index].aniTime);
		}

		//绑定事件
		$(self.els).on('mouseenter', stopAnimate);
		$(self.els).on('mouseleave', startAnimate);
		$('.ed-scrolltext-next').on('click', next);
		$('.ed-scrolltext-prev').on('click', prev);
	};

	window.ScrollText = ScrollText;

	//JQ插件
	$.fn.extend({
		scrolltext:function(settings){
			return $.each(this, function(index, val) {
				new ScrollText(settings);
			});
		}
	});
})(jQuery);