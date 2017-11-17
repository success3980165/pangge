$(document).ready(function() {
	var index=0;
	var three = $('.ey_pl,.next,.prev');
	var max = $('.ey_w');
	var p =  $('.ey_p2 li');
	var b = $('.ey_ul');
	var c = max.width();
	var d = b.width();
	var e =Math.floor(d/c);

	//隐藏3个元素
	three.hide();
	max.hover(function() {
		three.show();
	},function(){
		three.hide();
	});

	//隐藏其他标题
	$('.ey_p2 li:gt(0)').hide();

	//变深
	$('.next,.prev').hover(function() {
		$(this).addClass('n_p_show');
	},function(){
		$(this).removeClass('n_p_show');
	});

	//添加LI
	for (var i = 0; i < e; i++) {
		$('.ey_pl').append('<li></li>');
	};

	//给第一个LI添加红点样式
	var a = $('.ey_pl li');
	a.eq(0).addClass('ey_wite');


	//设定红点UL的位置
	var f = $('.ey_pl').width();
	$('.ey_pl').css('left',(c-f)/2);

	//下翻
	$('.next').click(function(){
		index--;
		index = (index==-e) ? 0 : index;
		var left = c*index;
		b.stop().animate({'left':left+'px'},300);
		a.eq(-index).addClass('ey_wite').siblings('li').removeClass('ey_wite');
		p.eq(-index).show().siblings('li').hide();

	});

	//上翻
	$('.prev').click(function(){
		index = (index==0) ? -e : index;
		index++;
		var left = c*index;
		b.stop().animate({'left':left+'px'},300);
		a.eq(-index).addClass('ey_wite').siblings('li').removeClass('ey_wite');
		p.eq(-index).show().siblings('li').hide();
	});

	//划过红点LI
	a.mouseover(function() {
		var cur = $(this).index();
		var left = c*-cur;
		b.stop().animate({'left':left+'px'},300);
		a.eq(cur).addClass('ey_wite').siblings('li').removeClass('ey_wite');
		p.eq(cur).show().siblings('li').hide();
		index=-cur;
	});

	//定时器轮播
	max.mouseover(function() {
		clearInterval(timer);
	});

	max.mouseout(function(){
		timer = setInterval(move,3000);
	});

	timer = setInterval(move,3000);
	function move(){
		index--;
		index = (index==-e) ? 0 : index;
		var left = c*index;
		b.stop().animate({'left':left+'px'},300);
		a.eq(-index).addClass('ey_wite').siblings('li').removeClass('ey_wite');
		p.eq(-index).show().siblings('li').hide();
	};

});