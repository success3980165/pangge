var adtimer; //不写也好使啊
$(function() {
	var t_ext = $(".text ul");
	var index = 0;
	var len = $(".text ul li").length;

	//
	function adtimer_text(argument) {
		adtimer = setInterval(function() {
			var _field = t_ext.find('li:first'); //此变量不可放置于函数起始处,li:first取值是变化的
			var _h = _field.height(); //取得每次滚动高度(多行滚动情况下,此变量不可置于开始处,否则会有间隔时长延时)

			_field.animate({
					'margin-top': -_h + 'px'
				},
				300,
				function() {
					_field.css('margin-top', 0).appendTo(t_ext); //隐藏后,将该行的margin值置零,并插入到最后,实现无缝滚动
				});
			// console.log(_field);  //输出到控制台
		}, 1000);

		console.log('定时器ID '+adtimer);
	}
	adtimer_text();

	$('.text,.btn').mouseover(function(event) {
		clearInterval(adtimer);
	});
	$('.text,.btn').mouseout(function(event) {
		adtimer_text();
	});

	//
	$('.btn').find('.mouse_top').click(function(event) {
		var last = t_ext.find('li:last');
		var _h = last.height();
		$(".text ul").css('margin-top', -_h + "px");
		last.prependTo(t_ext);
		$(".text ul").animate({
			'margin-top': 0
		}, 300, function() {

		});
	});

	//
	$('.btn').find('.mouse_bottom').click(function(event) {
		var _field = t_ext.find('li:first');
		var _h = _field.height();
		_field.animate({
			'margin-top': -_h + 'px'
		}, 300, function() {
			_field.css('margin-top', 0).appendTo(t_ext);
		});
	});
});