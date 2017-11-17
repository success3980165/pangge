// 时间格式化
// 使用：var d = new Date().format('yyyy-MM-dd');
Date.prototype.format = function(format) {
	var date = {
		"M+": this.getMonth() + 1,
		"d+": this.getDate(),
		"h+": this.getHours(),
		"m+": this.getMinutes(),
		"s+": this.getSeconds(),
		"q+": Math.floor((this.getMonth() + 3) / 3),
		"S+": this.getMilliseconds()
	};
	if (/(y+)/i.test(format)) {
		format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
	}
	for (var k in date) {
		if (new RegExp("(" + k + ")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
		}
	}
	return format;
}

//获取时间区间
//使用：getRecentMonth(7)、getRecentMonth（14）、getRecentMonth（30），默认30天
function getRecentMonth(day) {
	var today = new Date(),
		day = day || 30,
		monthSeconds = today.getTime() - 1000 * 60 * 60 * 24 * day;
	return {
		start: new Date(monthSeconds).format('yyyy-MM-dd'),
		end: new Date().format('yyyy-MM-dd')
	}
}