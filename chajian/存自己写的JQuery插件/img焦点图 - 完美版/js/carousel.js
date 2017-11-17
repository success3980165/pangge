;(function($) {
	//构造函数
	function Carousel(settings){
		//默认值
		Carousel.DEFAULTS ={
			el:'.ed-box',
			ul:'.ed-carousel-ul',
			cla:'.ed-carousel',
			attr:'*[data-carousel=ed-carousel]',
			imgcache:false,  //是否图片轮播图
			page:false,  //是否左右翻页
			tab:false,  //切换标签
			auto:false,  //自动轮播
			loading:'./css/i/loading.gif'
		};
		this.options = $.extend({}, Carousel.DEFAULTS, settings||{});

		//构造三步奏
		this.init();  //初始化
		this.renderDOM();  //插入DOM
		this.bindDOM();  //绑定事件
	};

	//第一步 -- 初始化
	Carousel.prototype.init = function() {
		var self = this;

		this.win =  $(window);  //window
		this.body = $('body');  //body
		this.doc = $(document);  //document
		this.carousel = this.body.find(this.options.cla+','+this.options.attr);
		this.arrData =[];
	};

	//第二步 -- 根据数据渲染DOM
	Carousel.prototype.renderDOM = function(){
		var self = this;

		this.carousel.each(function(index, val) {
			var liLength = $(this).find('li').length;  //li.length
			var liWidth= $(this).width();  //li.width
			var ulWidth = liWidth*liLength;  //ul.width
			var ulHeight = $(self.options.ul).height();  //ul.height
			var me = $(this);
			var intervalTime = $(this).data('carousel-intervaltime')=== undefined ? 1000 :$(this).data('carousel-intervaltime');

			$(this).parent().find('.ed-text li:gt(0)').hide();

			$(this).find(self.options.ul).css({
				width: ulWidth
			});

			$(this).find(self.options.ul+'>li').css({
				width:liWidth
			});

			//如果是图片轮播
			if (self.options.imgcache) {
				$(this).find(self.options.ul+'>li img').css({
					display: 'none'
				});
				$(this).find(self.options.ul+'>li').css({
					background: 'url('+self.options.loading+') no-repeat center center'
				});
				$.each($(this).find(self.options.ul+'>li img'), function(index, val) {
					var sourceSrc = $(this).attr('src');
					self.loadPicSize(sourceSrc,$(this));
				});
			}

			//翻页
			if (self.options.page) {
				var elementStr = '<div class="ed-next"></div><div class="ed-prev"></div>';
				var page = $(this).data('carousel-page');
				if (page == 'in') {
					$(this).parent().append(elementStr);
				}else if(page == 'out'){
					$(this).parent().append(elementStr);
					$(this).siblings('.ed-next').css('right', '-50px');
					$(this).siblings('.ed-prev').css('left', '-50px');
				}
			}

			//TAB翻页
			if (self.options.tab) {
				var elementStr_before = '<ul class="ed-tabs">';
				var tab = $(this).data('carousel-tab');
				for (var i = 0; i < liLength; i++) {
					elementStr_before+='<li></li>';
				}
				var elementStr = elementStr_before+'</ul>';
				switch(tab){
					case 'in':
						$(this).parent().append(elementStr);
						var x= $('.ed-tabs>li').width();
						var y = $('.ed-tabs>li').css('margin-right').replace("px","");
						var tabWidth =  x + Number(y);
						$(this).parent().find('.ed-tabs').css('left', (liWidth-liLength*tabWidth)/2);
						$(this).parent().find('.ed-tabs li:eq(0)').addClass('ed-wite');
						break;
					case 'bottom':
						$(this).parent().append(elementStr);
						var x= $('.ed-tabs>li').width();
						var y = $('.ed-tabs>li').css('margin-right').replace("px","");
						var tabWidth =  x + Number(y);
						$(this).parent().find('.ed-tabs').css({
							left: (liWidth-liLength*tabWidth)/2,
							bottom:'-20px'
						});
						$(this).parent().find('.ed-tabs li:eq(0)').addClass('ed-wite');
						break;
				}
			}

			var obj ={
				el:$(this).parent(),
				index:index,
				nowIndex:0,
				intervalTime:intervalTime
			};

			//给项目加索引
			$(this).data('index', index);

			obj.adtimer = setInterval(function() {
				var liLength = me.find(self.options.ul+'>li').length;
				var liWidth= me.find(self.options.ul+'>li').width();

				obj.nowIndex--;
				obj.nowIndex = (obj.nowIndex==-liLength) ? 0 : obj.nowIndex;

				var left = liWidth*obj.nowIndex;

				me.find(self.options.ul).stop().animate({'left':left+'px'},300);
				me.parent().find('.ed-tabs>li').eq(-obj.nowIndex).addClass('ed-wite').siblings('li').removeClass('ed-wite');
				me.parent().find('.ed-text>li').eq(-obj.nowIndex).show().siblings('li').hide();
			}, obj.intervalTime);

			self.arrData.push(obj);
		});

	};
	//第三步 -- 绑定 DOM 事件
	Carousel.prototype.bindDOM = function(){
		var self = this;

		console.log(this.arrData);

		//下翻
		var nextBut = function(event){
			var me = $(this).parent().find(self.options.cla+','+self.options.attr);
			var index = me.data('index');
			var nowIndex = self.arrData[index].nowIndex;
			var liLength = self.arrData[index].el.find(self.options.ul+'>li').length;
			var liWidth= self.arrData[index].el.find(self.options.ul+'>li:first').width();

			nowIndex--;
			nowIndex = (nowIndex==-liLength) ? 0 : nowIndex;
			self.arrData[index].nowIndex = nowIndex;

			var left = liWidth*nowIndex;

			self.arrData[index].el.find(self.options.ul).stop().animate({'left':left+'px'},300);
			self.arrData[index].el.find('.ed-tabs>li').eq(-nowIndex).addClass('ed-wite').siblings('li').removeClass('ed-wite');
			self.arrData[index].el.find('.ed-text>li').eq(-nowIndex).show().siblings('li').hide();
		};

		//上翻
		var prevBut = function(event){
			var me = $(this).parent().find(self.options.cla+','+self.options.attr);
			var index = me.data('index');
			var nowIndex = self.arrData[index].nowIndex;
			var liLength = self.arrData[index].el.find(self.options.ul+'>li').length;
			var liWidth= self.arrData[index].el.find(self.options.ul+'>li:first').width();

			nowIndex = (nowIndex==0) ? -liLength : nowIndex;
			nowIndex++;
			self.arrData[index].nowIndex = nowIndex;

			var left = liWidth*nowIndex;

			self.arrData[index].el.find(self.options.ul).stop().animate({'left':left+'px'},300);
			self.arrData[index].el.find('.ed-tabs>li').eq(-nowIndex).addClass('ed-wite').siblings('li').removeClass('ed-wite');
			self.arrData[index].el.find('.ed-text>li').eq(-nowIndex).show().siblings('li').hide();
		};

		//划过标签
		var moveTab = function(event){
			var me = $(this).parents(self.options.el).find(self.options.cla+','+self.options.attr);
			var index = me.data('index');
			var cur = $(this).index();  //li索引
			var liWidth= self.arrData[index].el.find(self.options.ul+'>li:first').width();
			var left = liWidth*-cur;

			me.find(self.options.ul).stop().animate({'left':left+'px'},300);
			$(this).addClass('ed-wite').siblings('li').removeClass('ed-wite');
			me.find('.ed-text>li').eq(cur).show().siblings('li').hide();
			self.arrData[index].nowIndex = -cur;
		}

		//鼠标离开 开始轮播
		var moveAnimate = function(event){
			var me = $(this).find(self.options.cla+','+self.options.attr)
			var index = me.data('index');

			self.arrData[index].adtimer = setInterval(function() {
				var liLength = me.find(self.options.ul+'>li').length;
				var liWidth= me.find(self.options.ul+'>li:first').width();

				self.arrData[index].nowIndex--;
				self.arrData[index].nowIndex = (self.arrData[index].nowIndex==-liLength) ? 0 : self.arrData[index].nowIndex;

				var left = liWidth*self.arrData[index].nowIndex;

				me.find(self.options.ul).stop().animate({'left':left+'px'},300);
				me.parent().find('.ed-tabs>li').eq(-self.arrData[index].nowIndex).addClass('ed-wite').siblings('li').removeClass('ed-wite');
				me.parent().find('.ed-text>li').eq(-self.arrData[index].nowIndex).show().siblings('li').hide();
			}, self.arrData[index].intervalTime);
		}

		var clearAnimate = function(event){
			var index = $(this).find(self.options.cla+','+self.options.attr).data('index');
			clearInterval(self.arrData[index].adtimer);
		}

		//绑定事件
		self.doc.on('click', '.ed-next', nextBut);
		self.doc.on('click', '.ed-prev', prevBut);
		self.doc.on('mouseover', '.ed-tabs>li', moveTab);
		self.doc.on('mouseover', this.options.el, clearAnimate);
		self.doc.on('mouseout', this.options.el, moveAnimate);
	};

	//图片预处理
	Carousel.prototype.loadPicSize = function(sourceSrc,el) {
		// 预加载图片，执行回调。
		this.preLoadImg(sourceSrc,function() {
			el.fadeIn();
		});
	};

	//预加载图片，执行回调。
	Carousel.prototype.preLoadImg = function(src,callback) {
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

	window.Carousel = Carousel;
	//JQ插件
	$.fn.extend({
		carousel:function(settings){
			return $.each(this, function(index, val) {
				new Carousel(settings);
			});
		}
	});
})(jQuery);