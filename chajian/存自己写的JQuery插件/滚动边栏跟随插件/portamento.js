(function($) {

	$.fn.portamento = function(options) {

		var thisWindow = $(window);
		var thisDocument = $(document);

		$.fn.viewportOffset = function() {  //除了有个能力检测判断 其他都没JB用
			var win = $(window);
			var offset = $(this).offset();  //.offset()方法允许我们检索一个元素相对于文档（document）的当前位置。

			return {
				left: offset.left - win.scrollLeft(),
				top: offset.top - win.scrollTop()
			};
		};

		/**
		 * 测试，看看如果位置: 固定支持。
		 */
		function positionFixedSupported() {
			var container = document.body;
			if (document.createElement && container && container.appendChild && container.removeChild) {  //如果不支持创建节点 返回空
				var el = document.createElement("div");  //创建元素标签

				/**
				 * getBoundingClientRect方法返回一个对象，该对象提供当前元素节点的大小、它相对于视口（viewport）的位置等信息，基本上就是CSS盒状模型的内容。
				 * getBoundingClientRect方法的所有属性，都把边框（border属性）算作元素的一部分。也就是说，都是从边框外缘的各个点来计算。因此，width和height包括了元素本身 + padding + border。
				 * bottom：元素底部相对于视口的纵坐标。
				 * height：元素高度（等于bottom减去top）。
				 * left：元素左上角相对于视口的坐标。
				 * right：元素右边界相对于视口的横坐标。
				 * top：元素顶部相对于视口的纵坐标。
				 * width：元素宽度（等于right减去left）。
				 */
				if (!el.getBoundingClientRect) {  //如果不支持就返回空
					return null;
				}

				//el.innerHTML = "x";
				el.style.cssText = "position:fixed;top:100px;";
				container.appendChild(el);  //在body 插入DIV

				var
				originalHeight         =   container.style.height,   //获取body高度
				originalScrollTop      =   container.scrollTop;   //获取body
				container.style.height = "3000px";  //设置body高
				container.scrollTop    = 500;  //设置body

				var
				elementTop             = el.getBoundingClientRect().top;  //元素顶部相对于视口的纵坐标。
				container.style.height = originalHeight;  //设置baody的高 originalHeight

				var
				isSupported            = elementTop === 100;  //返回个布尔值

				container.removeChild(el);  //删除div
				container.scrollTop = originalScrollTop;  //
				return isSupported;
			}
			return null;
		}

		/**
		 *  兼容IE
		 */
		function getScrollerWidth() {
			var scr = null;
			var inn = null;
			var wNoScroll = 0;
			var wScroll = 0;

			//外滚动 div
			scr = document.createElement('div');
			scr.style.position = 'absolute';
			scr.style.top = '-1000px';
			scr.style.left = '-1000px';
			scr.style.width = '100px';
			scr.style.height = '50px';
			scr.style.overflow = 'hidden';

			//内在的内容 div
			inn = document.createElement('div');
			inn.style.width = '100%';
			inn.style.height = '200px';

			//把inn插入进scr
			scr.appendChild(inn);

			//把scr插入进body
			document.body.appendChild(scr);

			//offsetWidth 元素在屏幕上占用所有可见空间。不包括外边距。
			wNoScroll = inn.offsetWidth;

			//显示滚动条
			scr.style.overflow = 'auto';

			//offsetWidth 元素在屏幕上占用所有可见空间。不包括外边距。
			wScroll = inn.offsetWidth;

			//删除元素
			document.body.removeChild(document.body.lastChild);

			//Pixel width of the scroller
			return (wNoScroll - wScroll);
		}

		// ---------------------------------------------------------------------------------------------------

		// 覆盖默认
		var opts = $.extend({}, $.fn.portamento.defaults, options);

		var panel = this;  //要fixed的 元素
		var wrapper = opts.wrapper;  //要对齐的元素
		var gap = opts.gap;  //fixed时 上留白
		var disableWorkaround = opts.disableWorkaround;  //禁用变通方法  false
		var fullyCapableBrowser = positionFixedSupported();  //返回true

		if (panel.length != 1) {
			return this;
		}

		if (/*!fullyCapableBrowser && */disableWorkaround) {  //如果禁用  停止
			return this;
		}

		var brother_height = opts.brother.innerHeight() > 0 ?opts.brother.innerHeight() :0;

		panel.wrap('<div class="portamento_container" />');  //$.wrap()在集合中匹配的每个元素周围包裹一个HTML结构。
		var float_container = $('.portamento_container');  //包裹要fixed的元素 并设置最小高 和宽
		float_container.css({
			'min-height': panel.outerHeight(),  //获取匹配元素集合中第一个元素的当前计算宽度值,包括padding，border和选择性的margin。返回一个整数（不包含“px”）表示的值 ，或如果在一个空集合上调用该方法，则会返回 null。
			'width': panel.outerWidth()
		});

		// 计算滚动范围的上限
		var panelOffset = panel.offset().top;  //fixed元素 坐标相对于文档的 TOP值
		var panelMargin = parseFloat(panel.css('marginTop').replace(/auto/, 0));  //margin-top:0;
		var realPanelOffset = panelOffset - panelMargin;  //panelOffset-0 = 有个屁用啊

		if (window.portamento_type === undefined) {
			var topScrollBoundary = realPanelOffset - gap;  //去掉参数GAP
			window.portamento_type = realPanelOffset - gap;
		}else {
			var topScrollBoundary = window.portamento_type;
		}

		//元素的内外边距
		var wrapperPaddingFix = parseFloat(wrapper.css('paddingTop').replace(/auto/, 0));  //父级元素 paddingTop:0;
		var containerMarginFix = parseFloat(float_container.css('marginTop').replace(/auto/, 0));  //包裹要fixed的元素 marginTop:0;

		// 做一些工作来修复 IE 误报文档的宽度
		var ieFix = 0;

		var isMSIE = /*@cc_on!@*/ 0;

		if (isMSIE) {  //如果是IE浏览器 就获取误差
			ieFix = getScrollerWidth() + 4;
		}

		// ---------------------------------------------------------------------------------------------------

		thisWindow.bind("scroll.portamento", function() {
			if (thisWindow.height() > panel.outerHeight() && thisWindow.width() >= (thisDocument.width() - ieFix)) { // 如果该窗口不足够大不会滚动

				var y = thisDocument.scrollTop(); // 当前的滚动位置的文档
				console.log(y,topScrollBoundary);

				if (y >= (topScrollBoundary)) {  //如果滚动位置 大于 起始位置
					if ((panel.innerHeight() - wrapper.viewportOffset().top) - wrapperPaddingFix + gap >= wrapper.height()) { //如果到底了
						if (panel.hasClass('fixed') || thisWindow.height() >= panel.outerHeight()) {
							panel.removeClass('fixed');
							panel.css('top', (wrapper.height() - panel.innerHeight() - brother_height) + 'px');
						}
					} else { //如果是在中间
						panel.addClass('fixed');

						if (/*fullyCapableBrowser*/ true) {
							panel.css('top', gap + 'px');  //10
						} else {
							panel.clearQueue();  //当.clearQueue()方法被访问的时候，所有在这个列队中未执行的函数将被移除 。当不使用参数的时候，.clearQueue()会从标准的动画队列fx中移除剩下的函数。这个方法类似.stop(true)。然而.stop()方法只适用在动画中。.clearQueue()还可以用来移除用.queue()方法添加到普通jQuery列表的任何函数。
							panel.css('position', 'absolute').animate({
								top: (0 - float_container.viewportOffset().top + gap)
							});
						}
					}
				} else {  //如果小于 起始位置
					panel.removeClass('fixed');
					panel.css('top', '0');
				}
			} else {  //去掉定位样式
				console.log('error：fixed的元素高度大于了window高度');
				panel.removeClass('fixed');
			}
		});

		// ---------------------------------------------------------------------------------------------------

		thisWindow.bind("resize.portamento", function() {
			// 阻止用户得到不良行为，如果他们调整窗口的大小太小
			if (thisWindow.height() <= panel.outerHeight() || thisWindow.width() < thisDocument.width()) {
				if (panel.hasClass('fixed')) {
					panel.removeClass('fixed');
					panel.css('top', '0');
				}
			} else {
				thisWindow.trigger('scroll.portamento');
			}
		});

		// ---------------------------------------------------------------------------------------------------

		thisWindow.bind("orientationchange.portamento", function() {
			// 如果设备的方向发生了变化，，触发 resize 事件
			thisWindow.trigger('resize.portamento');
		});

		// ---------------------------------------------------------------------------------------------------
		thisWindow.trigger('scroll.portamento');

		return this;
	};

	//默认
	$.fn.portamento.defaults = {
		'wrapper': $('body'),
		'brother': $('#portamento-border'),
		'gap': 10,
		'disableWorkaround': false
	};

})(jQuery);