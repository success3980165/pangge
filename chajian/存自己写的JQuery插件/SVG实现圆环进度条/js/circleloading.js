;(function($) {
	//构造函数
	function CircleLoading(settings){
		//默认值
		CircleLoading.DEFAULTS ={
			cla:'.ed-circleloading',
			attr:'*[data-circleloading=ed-circleloading]',
			text:false,  //是否显示当前值
			img:false,  //是否显示图片
			number:false,  //开启数显
			range:false //开启滑块
		};
		this.options = $.extend({}, CircleLoading.DEFAULTS, settings||{});

		//构造三步奏
		this.init();  //初始化
		this.renderDOM();  //插入DOM
		this.bindDOM();  //绑定事件
	};

	//第一步 -- 初始化
	CircleLoading.prototype.init = function() {
		var self = this;

		this.win =  $(window);  //window
		this.body = $('body');  //body
		this.doc = $(document);  //document

		this.els = this.body.find(this.options.cla+','+this.options.attr);
		this.arrData =[];
	};

	//第二步 -- 根据数据渲染DOM
	CircleLoading.prototype.renderDOM = function(){
		var self = this;

		$.each(this.els , function(index, val) {
			var width = $(this).width();
			var height = $(this).height();
			var bg = $(this).data('circleloading-bg');
			var tg = $(this).data('circleloading-tg');
			var url = $(this).data('circleloading-src');
			var text = $(this).data('circleloading-text');
			var number = $(this).data('circleloading-number');
			var range = $(this).data('circleloading-range');
			var val = $(this).data('circleloading-val') === undefined ? 0 : $(this).data('circleloading-val');
			var base = $(this).find('.ed-circleloading-bg').css('cx') === $(this).find('.ed-circleloading-tg').css('cx') && $(this).find('.ed-circleloading-tg').css('cy') === $(this).find('.ed-circleloading-bg').css('cy') ? $(this).find('.ed-circleloading-bg').css('cx').slice(0, -2) : null;
			var obj ={
				el:$(this),
				index:index,
				width:width,
				height:height,
				val:val,  //值
				base:base  //坐标
			};

			if (bg === undefined) {
				obj.bgStroke = {
					color:'#ccc',
					width:25,
					opacity:1
				};
			}else{
				var bgcssarr = self.returnArr(bg);
				obj.bgStroke = {
					color:bgcssarr[0],
					width:bgcssarr[1],
					opacity:bgcssarr[2]
				};
			}

			if (tg === undefined) {
				obj.tgStroke = {
					color:'#36c',
					width:25,
					linecap:'inherit',
					opacity:1
				}
			}else{
				var tgcssarr = self.returnArr(tg);
				obj.tgStroke = {
					color:tgcssarr[0],
					width:tgcssarr[1],
					linecap:tgcssarr[2],
					opacity:tgcssarr[3]
				};
			}

			if (text === undefined) {
				obj.textcss ={
					color:'#36c',
					weight:'normal',
					size:12,
					lineheight:1.5,
					offset:'topleft'

				};
			}else {
				var textarr = self.returnArr(text);
				obj.textcss = {
					color:textarr[0],
					weight:textarr[1],
					size:textarr[2],
					lineheight:textarr[3],
					offset:textarr[4]

				};
			}

			if (url === undefined) {
				obj.img = null;
			}else {
				var imgurl = self.returnArr(url);
				obj.img = {
					url :imgurl[0],
					size:imgurl[1]
				};
			}

			if (number !== undefined) {
				obj.inpNumber = number;
			}

			if (range !== undefined) {
				obj.inpRange = range;
			}

			self.arrData.push(obj);  //数据结构完成

			$(this).find('.ed-circleloading-bg').css({
				'stroke': self.arrData[index].bgStroke.color,
				'stroke-width': self.arrData[index].bgStroke.width + 'px',
				'stroke-opacity': self.arrData[index].bgStroke.opacity
			});
			$(this).find('.ed-circleloading-tg').css({
				'stroke': self.arrData[index].tgStroke.color,
				'stroke-width': self.arrData[index].tgStroke.width + 'px',
				'stroke-linecap': self.arrData[index].tgStroke.linecap,
				'stroke-opacity': self.arrData[index].tgStroke.opacity
			});

			//开启文字功能
			if (self.options.text) {
				var text ='<div class="ed-circleloading-text">'+ val +'%</div>';
				$(this).prepend(text);
				if (self.arrData[index].textcss.offset == 'topleft') {
					$(this).find('.ed-circleloading-text').css({
						'color': self.arrData[index].textcss.color,
						'font-weight': self.arrData[index].textcss.weight,
						'font-size': self.arrData[index].textcss.size + 'px',
						'line-height': self.arrData[index].textcss.lineheight,
						'top':0,
						'left':0
					});
				}else if(self.arrData[index].textcss.offset == 'topright'){
					$(this).find('.ed-circleloading-text').css({
						'color': self.arrData[index].textcss.color,
						'font-weight': self.arrData[index].textcss.weight,
						'font-size': self.arrData[index].textcss.size + 'px',
						'line-height': self.arrData[index].textcss.lineheight,
						'top':0,
						'right':0
					});
				}else if (self.arrData[index].textcss.offset == 'bottomleft') {
					$(this).find('.ed-circleloading-text').css({
						'color': self.arrData[index].textcss.color,
						'font-weight': self.arrData[index].textcss.weight,
						'font-size': self.arrData[index].textcss.size + 'px',
						'line-height': self.arrData[index].textcss.lineheight,
						'bottom':0,
						'left':0
					});
				}else if(self.arrData[index].textcss.offset == 'bottomright'){
					$(this).find('.ed-circleloading-text').css({
						'color': self.arrData[index].textcss.color,
						'font-weight': self.arrData[index].textcss.weight,
						'font-size': self.arrData[index].textcss.size + 'px',
						'line-height': self.arrData[index].textcss.lineheight,
						'bottom':0,
						'right':0
					});
				}else if(self.arrData[index].textcss.offset == 'center'){
					$(this).find('.ed-circleloading-text').css({
						'color': self.arrData[index].textcss.color,
						'font-weight': self.arrData[index].textcss.weight,
						'font-size': self.arrData[index].textcss.size + 'px',
						'line-height': 1,
						'width':self.arrData[index].textcss.size*3,
						'height':self.arrData[index].textcss.size,
						'top':(self.arrData[index].height-self.arrData[index].textcss.size)/2,
						'left':(self.arrData[index].width-self.arrData[index].textcss.size*3)/2
					});
				}
			}

			//开启图片功能
			if (self.options.img) {
				if (self.arrData[index].img !== null) {
					var src = '<div class="ed-circleloading-img" style="background:url('+self.arrData[index].img.url+') no-repeat center center"></div>';
					$(this).prepend(src);

					$(this).find('.ed-circleloading-img').css({
						'width':self.arrData[index].img.size+'%',
						'height':self.arrData[index].img.size+'%',
						'top':(100-self.arrData[index].img.size)/2+'%',
						'left':(100-self.arrData[index].img.size)/2+'%'
					});
				}
			}

			//开启数显功能
			if (self.options.number && self.arrData[index].inpNumber) {
				var inpN = '<input data-circleloading-index="'+self.arrData[index].index+'" value="'+self.arrData[index].val+'" class="ed-circleloading-number '+self.arrData[index].inpNumber+'" type="number"  min="0" max="100">';
				$(this).prepend(inpN);
			}

			//开启滑块功能
			if (self.options.range && self.arrData[index].inpRange) {
				var inpR='<input data-circleloading-index="'+self.arrData[index].index+'" value="'+self.arrData[index].val+'" class="ed-circleloading-range '+self.arrData[index].inpRange+'" type="range"  min="0" max="100">';
				$(this).prepend(inpR);
			}
		});
	};

	//第三步 -- 绑定 DOM 事件
	CircleLoading.prototype.bindDOM = function(){
		var self = this;

		console.log(this.arrData);

		//触发
		var loads = function(event){
			$.each(self.els, function(index, val) {
				var val = self.arrData[index].val;
				var base = self.arrData[index].base;
				var percent = val / base;
				var perimeter = Math.PI * 2 * 80;

				$(this).find('.ed-circleloading-tg').attr('stroke-dasharray', perimeter * percent + " " + perimeter * (1 - percent));
			});
		}

		//change
		var change = function(event){
			var index = $(this).data('circleloading-index');
			var nowval = $(this).val();
			var val =  self.arrData[index].val;
			var base = self.arrData[index].base;
			var percent = nowval / base;
			var perimeter = Math.PI * 2 * 80;

			if (nowval > 100 || nowval < 0) {
				alert('数值不能大于100');
				$(this).val(val);
				return false;
			}

			self.arrData[index].el.find('.ed-circleloading-text').text(nowval+'%');
			self.arrData[index].el.find('.ed-circleloading-tg').attr('stroke-dasharray', perimeter * percent + " " + perimeter * (1 - percent));
			self.arrData[index].el.find('.ed-circleloading-number').val(nowval);
			self.arrData[index].el.find('.ed-circleloading-range').val(nowval);
		}

		//绑定事件
		this.doc.ready(loads);
		$('.ed-circleloading-number').on('change', change);
		$('.ed-circleloading-range').on('change', change);
	};

	//返回数组
	CircleLoading.prototype.returnArr = function(str){
		return str.split(" ");
	}

	window.CircleLoading = CircleLoading;

	//JQ插件
	$.fn.extend({
		circleloading:function(settings){
			return $.each(this, function(index, val) {
				new CircleLoading(settings);
			});
		}
	});
})(jQuery);