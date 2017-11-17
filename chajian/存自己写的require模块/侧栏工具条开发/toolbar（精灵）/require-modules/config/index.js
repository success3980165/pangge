require.config({
	//基目录
	baseUrl: "require-modules",
	//指定路径　　
	paths: {
		"jquery": "jquery/2.1.4/jquery-2.1.4.min",
		"bootstrap" : "http://cdn.bootcss.com/bootstrap/3.2.0/js/bootstrap",
		"validate": "js/validate",
		"scrollto": "js/scrollto",
		"backtop": "js/backtop",
		"bt":"js/bt"
	},
	//优先加载
	priority:['jquery','bootstrap']
});

/*BT青年写法*/
require(['jquery','validate',"bt"], function($,validate,bt) {
	$(function() {
		console.log(validate.isEqual(2,2));

		$('#backTop').backtops({
			mode:'move',
			pos:100,
			speed:2000,
			dest:1000
		});
	});
});

/*jquery青年写法*/
/*require(['jquery','validate',"backtop"], function($,validate,backtop) {
	$(function() {
		console.log(validate.isEqual(2,2));

		$('#backTop').backtops({
			mode:'move',
			pos:100,
			speed:2000,
			dest:1000
		});
	});
});*/

/*文艺青年写法*/
/*require(['jquery','validate',"backtop"], function($,validate,backtop) {
	$(function() {
		console.log(validate.isEqual(2,2));
		new backtop.BackTop($('#backTop'),{
			mode:'move',
			pos:100,
			speed:2000,
			dest:1000
		});
	});
});*/

/*普通青年写法*/
/*require(['jquery','validate',"scrollto"], function($,validate,scrollto) {
	$(function() {
		console.log(validate.isEqual(2,2));
		checkPosition($(window).height());
		var scroll = new scrollto.ScrollTo({
			dest:0,
			speed:500
		});

		//这里的scroll.move函数的this指向的是#backTop
		//通过$.proxy() 改变指向到实例化对象上
		//scroll.move,scroll  scroll.go,scroll
		$('#backTop').on('click', $.proxy(scroll.move,scroll));
		$(window).on('scroll', function(){
			checkPosition($(window).height());
		});

		function checkPosition(pos){
			if ($(window).scrollTop()>pos) {
				$('#backTop').fadeIn();
			}else{
				$('#backTop').fadeOut();
			};
		}
	});
});*/


/*2B青年写法*/
/*require(['jquery','validate'], function($,validate) {
	$(function() {
		console.log(validate.isEqual(2,2));
		checkPosition($(window).height());

		$('#backTop').on('click', move);  //go
		$(window).on('scroll', function(){
			checkPosition($(window).height());
		});

		function move(){
			$('html,body').animate({
				scrollTop: 0
			}, 800);
		}

		function go(){
			$('html,body').scrollTop(0);
		}

		function checkPosition(pos){
			if ($(window).scrollTop()>pos) {
				$('#backTop').fadeIn();
			}else{
				$('#backTop').fadeOut();
			};
		}
	});
});*/