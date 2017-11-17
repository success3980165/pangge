var mp3;
var fixedBug = isIos();
$(function() {
	if (fixedBug == true) {
		console.log('is ios');
		mp3 = new Audio();
		mp3.src = $("#mp3").attr("src");
		mp3.loop = true;
		mp3.autoplay = true;
		$("#mp3").remove();
	} else {
		console.log('not ios');
		playmusic();
	}

	$(".music").on("click", function() {
		if ($(this).hasClass("play")) {
			$(this).removeClass("play");
			$("#music>span").addClass("zshow").html("关闭");
			setTimeout(function() {
				$("#music>span").removeClass("zshow");
			}, 1000);
			if (fixedBug == true) {
				mp3.pause();
			} else {
				document.getElementById("mp3").pause();
			}
		} else {
			$(this).addClass("play");
			$("#music>span").addClass("zshow").html("开启");
			setTimeout(function() {
				$("#music>span").removeClass("zshow");
			}, 1000);
			if (fixedBug == true) {
				mp3.play();
			} else {
				document.getElementById("mp3").play();
			}
		}
	})
})

//not ios 运行播放
function playmusic() {
	//加入播放动画并播放
	$(".music").addClass("play");
	if (fixedBug == true) {
		mp3.play();
	} else {
		document.getElementById("mp3").play();
	}
}

//判断是否是IOS系统
function isIos() {
	var userAgentInfo = navigator.userAgent;
	var Agents = new Array("iPhone", "iPad");
	var flag = false;
	for (var v = 0; v < Agents.length; v++) {
		if (userAgentInfo.indexOf(Agents[v]) > 0) {
			flag = true;
			break;
		}
	}
	return flag;
}