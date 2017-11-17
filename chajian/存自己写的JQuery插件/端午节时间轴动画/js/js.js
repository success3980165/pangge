/*获得DOM对象*/
var g =function(id){
	return document.getElementById(id);
}
/*图片加载器*/
var imgs =['img/zzr_2.png','img/zzr_3.png','img/zzr_4.png'];
var imgs_onload = function(){
	var nowimg =imgs.pop();
	console.log('加载图片',nowimg,'完成');
	if (imgs.length ==0) {
		s1.start();
	};
}
for(s in imgs){
	var img = new Image;
	img.onload = imgs_onload;
	img.src =imgs[s];
	console.log(s);  //0 1 2
}

/*时间轴对象构造函数*/
var Timeline = function (){
	this.order =[] ; //动画序列
	this.add = function(timeout,func,log){ //时间出发，函数，日志
		this.order.push({
			timeout:timeout,
			func:func,
			log:log
		});
	}
	this.start =function(ff){ //ff 快进
		for(s in this.order){
			(function(me){
				var timeout=me.timeout;
				var func=me.func;
				var log=me.log;

				//如果小于0 就归0
				timeout=Math.max(timeout-(ff||0),0);

				setTimeout(func, timeout);
				setTimeout(function(){
					console.log('time-',timeout,'log->',log);
				}, timeout);
			})(this.order[s])
		}
	}
}