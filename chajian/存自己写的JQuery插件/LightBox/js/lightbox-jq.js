;(function($) {
	/*
		流
		1.初始化事件委托,
			renderDOM -> getGroup -> initPopup(这3个是在初始化和事件委托里执行的) -> showMaskAndPopup(让大白显示大小位置动画) -> getIndexOf -> * loadPicSize -> preLoadImg -> changePic ->*
		2.翻页事件流
			goto ->  loadPicSize -> preLoadImg -> changePic
	*/
	var LightBox = function(settings) {
		var self = this;

		LightBox.SETTINGS = {
			speed:500,
			distancesWidth:0,
			distancesHeight:0
		}
		this.options = $.extend({}, LightBox.SETTINGS, settings||{});

		// 创建弹出层和遮罩层
		this.popupMask = $('<div id="lightbox-mask">');
		this.popupWin = $('<div id="lightbox-popup">');

		// 保存到body
		this.bodyNode = $(document.body);

		// 渲染剩余的DOM元素，并且插入到body
		this.renderDOM();

		this.picViewArea = this.popupWin.find('div.lightbox-pic-view');	// 获取图片的预览区域
		this.popupPic = this.popupWin.find('img.lightbox-image');		// 获取图片
		this.picCaptionArea = this.popupWin.find('div.lightbox-pic-caption');	//获取图片描述区域
		this.prevBtn = this.popupWin.find('span.lightbox-prev-btn');	// 获取切换按钮
		this.nextBtn = this.popupWin.find('span.lightbox-next-btn');

		this.captionText = this.popupWin.find('p.lightbox-pic-desc');	// 获取图片描述文本
		this.currentIndex = this.popupWin.find('span.lightbox-of-index'); 	// 获取图片当前索引
		this.closeBtn = this.popupWin.find('span.lightbox-close-btn'); 	// 获取关闭按钮


		// 事件委托，获取组的数据
		this.groupName = null;
		this.groupData = [];	// 用来存储同一组的数据

		// 事件委托到body
		this.bodyNode.on('click', '.js-lightbox,*[data-role=lightbox]', function(event) {
			// 阻止事件冒泡，防止其他父级元素上的click事件触发。
			event.stopPropagation();
			// 拿到点击的图片所在的组别
			var currentGroupName = $(this).attr('data-group');

			if(currentGroupName != self.groupName){
				self.groupName = currentGroupName;  //如果不是当前组，就赋值新组
				// 根据当前组名获取同一组数据
				self.getGroup();
			};
			// 初始化弹出层
			self.initPopup($(this));
		});

		// 关闭弹出和遮罩
		this.popupMask.click(function(event) {
			$(this).fadeOut();
			self.popupWin.fadeOut();
			self.clear = false;  //关闭窗口事件开关
		});
		this.closeBtn.click(function(event) {
			self.popupMask.fadeOut();
			self.popupWin.fadeOut();
			self.clear = false;  //关闭窗口事件开关
		});

		// 绑定前后切换按钮的事件
		this.prevBtn.on('mouseenter', function(event) {
			if(!$(this).hasClass('disabled')&&self.groupData.length>1){
				$(this).addClass('lightbox-prev-btn-show');
			};
		});
		this.prevBtn.on('mouseleave', function(event) {
			if(!$(this).hasClass('disabled')&&self.groupData.length>1){
				$(this).removeClass('lightbox-prev-btn-show');
			};
		});
		this.nextBtn.on('mouseenter', function(event) {
			if(!$(this).hasClass('disabled')&&self.groupData.length>1){
				$(this).addClass('lightbox-next-btn-show');
			};
		});
		this.nextBtn.on('mouseleave', function(event) {
			if(!$(this).hasClass('disabled')&&self.groupData.length>1){
				$(this).removeClass('lightbox-next-btn-show');
			};
		});

		//窗口变化调整事件
		var timer = null;
		this.clear = false;   //当弹出层关闭时 仍然会触发窗口事件，所以设置开关
		$(window).resize(function(event) {
			if (self.clear) {
				window.clearTimeout(timer);
				timer = setTimeout(function(){
					self.loadPicSize(self.groupData[self.index].src);
				}, 500);
			}
		});

		//键盘控制GOTO
		$(window).on('keyup', function(event) {
			var keyvalue = event.which;
			if (self.clear) {
				if (keyvalue==37 || keyvalue==38) {
					self.prevBtn.trigger('click');
				}else if(keyvalue==39 || keyvalue==40){
					self.nextBtn.trigger('click');
				}
			}
		});

		// 前进后退
		this.flag = true;	// 防止连续点击
		this.prevBtn.click(function(event) {
			if(!$(this).hasClass('disabled')&&self.flag) {
				self.flag = false;
				event.stopPropagation();
				self.goto('prev');
			};
		});
		this.nextBtn.click(function(event) {
			if(!$(this).hasClass('disabled')&&self.flag) {
				self.flag = false;
				event.stopPropagation();
				self.goto('next');
			};
		});
	};

	LightBox.prototype = {
		//大框  没进行图片加载完成 事前加载那块
		showMaskAndPopup:function(sourceSrc,currentId) {
			var self = this;
			// 先隐藏掉图片
			this.popupPic.hide();
			this.picCaptionArea.hide();
			// 显示遮罩层
			this.popupMask.fadeIn();

			var winWidth = $(window).width(),
			winHeight = $(window).height();

			//大图背景白色区域，并淡入
			this.picViewArea.css({
				width: winWidth/2,
				height: winHeight/2
			});
			this.popupWin.fadeIn();

			// 根据当前点击的元素ID获取在当前组别里面的索引
			this.index = this.getIndexOf(currentId);
			// 不用JQ的$(this).index()方法是因为用插件不确定在DOM元素中的兄弟节点不一定全是我们想要的图片元素，这是用这种方法获取索引值就不准确了！

			var groupDataLenght = this.groupData.length;
			if(groupDataLenght>1) {
				// this.prevBtn  this.nextBtn
				if(this.index === 0) {
					this.prevBtn.addClass('disabled');
					this.nextBtn.removeClass('disabled');
				}else if(this.index === groupDataLenght-1){
					this.nextBtn.addClass('disabled');
					this.prevBtn.removeClass('disabled');
				}else {
					this.nextBtn.removeClass('disabled');
					this.prevBtn.removeClass('disabled');
				};
			}else if(groupDataLenght==1){
				this.nextBtn.addClass('disabled');
				this.prevBtn.addClass('disabled');
			};

			var viewHeight = winHeight/2+10;
			//大图宽高
			this.popupWin.css({
				width: winWidth/2+10,
				height: viewHeight,
				marginLeft:-(winWidth/2+10)/2,  //做一个上-下的效果
				top:-viewHeight
			}).animate({
				top:(winHeight-viewHeight)/2
				},self.options.speed,function() {
				// 实现加载图片按图片尺寸显示预览区域
				// 回调函数，传入大图地址
				self.loadPicSize(sourceSrc);
			});
		},
		//切换大图
		goto:function(dir) {
			if(dir === 'next'){
				this.index++;
				if(this.index >= this.groupData.length-1) {
					this.nextBtn.addClass('disabled').removeClass('lightbox-next-btn-show');
				};
				if(this.index != 0) {
					this.prevBtn.removeClass('disabled');
				};

				// 获取源图地址
				var src = this.groupData[this.index].src;
				this.loadPicSize(src);

			}else if(dir === 'prev') {
				this.index--;
				if(this.index <= 0) {
					this.prevBtn.addClass('disabled').removeClass('lightbox-prev-btn-show');
				};
				if(this.index != this.groupData.length-1) {
					this.nextBtn.removeClass('disabled');
				};
				var src = this.groupData[this.index].src;
				this.loadPicSize(src);
			};
		},
		//图片预处理
		loadPicSize:function(sourceSrc) {
			var self = this;
			// 每次加载时清除宽度和高度
			self.popupPic.css({
				width:'auto',
				height:'auto'
			}).hide();

			this.picCaptionArea.hide();

			// 预加载图片，执行回调。
			this.preLoadImg(sourceSrc,function() {
				self.popupPic.attr('src',sourceSrc);  //给大图 赋值src
				var picWidth = self.popupPic.width(),  //获取大图实际宽高
				picHeight = self.popupPic.height();

				self.changePic(picWidth,picHeight);  //显示大图
			});
		},
		//预加载图片，执行回调。
		preLoadImg:function(src,callback) {
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
		},
		//图片加载 传入实际图片宽高
		changePic:function(width,height) {
			var self = this,
			winWidth = $(window).width(),
			winHeight = $(window).height();
			winWidth -= self.options.distancesWidth;
			winHeight -= self.options.distancesHeight;

			// 如果图片的宽高比，大于浏览器视口的宽高比，判断是否溢出
			var scale = Math.min(winWidth/(width+10),winHeight/(height+10),1);

			width = width*scale;
			height = height*scale;

			//大白大小
			this.picViewArea.animate({
				width:width-10,
				height:height-10
			},self.options.speed);

			//弹出层大小、位置，执行回调
			this.popupWin.animate({
				width:width,
				height:height,
				marginLeft:-(width/2),
				top:(winHeight-height)/2+self.options.distancesHeight/2
			},self.options.speed,function() {
				self.popupPic.css({  //淡入大图
					width:width-10,
					height:height-10
				}).fadeIn();
				self.picCaptionArea.fadeIn();  //淡入描述
				self.flag = true;  // 在图片加载动画完成后开启 开关
				self.clear = true;  // 在显示大图时 开启窗口事件调整图片大小 开关
			});

			// 设置描述文字和当前索引
			this.captionText.text(this.groupData[this.index].caption);
			this.currentIndex.text('当前索引：' + (this.index+1) + ' of ' + this.groupData.length);

		},
		//当前索引
		getIndexOf:function(currentId) {
			var index = 0;
			$(this.groupData).each(function(i) {
				index = i;
				if(this.id === currentId) {
					return false;		// 相当于break
				}
			});
			return index;
		},
		//将$(this)传进来
		initPopup:function(currentObj) {
			console.log('$(this)传进来 '+currentObj);
			var self = this,
			sourceSrc = currentObj.attr('data-source'),  //大图地址
			currentId = currentObj.attr('data-id');  //图片id
			this.showMaskAndPopup(sourceSrc,currentId);  //对应大图 传入参数
		},
		// 获取数据
		getGroup:function() {
			var self = this;

			// 根据当前的组别的名称获取页面中所有相同组别的对象
			var groupList = this.bodyNode.find('*[data-group='+this.groupName+']');

			// 清空数组内数据
			self.groupData.length = 0;

			groupList.each(function() {
				self.groupData.push({
					src:$(this).attr('data-source'),
					id:$(this).attr('data-id'),
					caption:$(this).attr('data-caption')
				});
			});

			console.log('获得新数组数据:'+self.groupData);
		},
		// 创建DOM
		renderDOM:function() {
			var strDom = '<div class="lightbox-pic-view"><span class="lightbox-btn lightbox-prev-btn"></span><img class="lightbox-image" src="" alt=""><span class="lightbox-btn lightbox-next-btn"></span></div><div class="lightbox-pic-caption"><div class="lightbox-caption-area"><p class="lightbox-pic-desc"></p><span class="lightbox-of-index">当前索引：0  fo  0</span></div><span class="lightbox-close-btn"></span></div>'

			// 插入到this.popupWin
			this.popupWin.html(strDom);
			// 把遮罩层和弹出层插入到body
			this.bodyNode.append(this.popupMask,this.popupWin);
		}
	};

	window['LightBox'] = LightBox;
	//JQ插件
	$.fn.extend({
		lightbox:function(settings){
			return $.each(this, function(index, val) {
				new LightBox(settings);
			});
		}
	});
})(jQuery);