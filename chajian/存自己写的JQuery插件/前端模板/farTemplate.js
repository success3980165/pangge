;(function($) {
	/**
	 * [FarTemplate 视图模板引擎]
	 * @param {[object]} settings [配置参数]
	 */
	function FarTemplate(settings){
		//默认值
		var DEFAULTS ={
			className:'.ed-template',
			attr:'*[data-template=ed-template]',
			jsonStr: '',
			temp: null
		};

		var options = $.extend({},DEFAULTS, settings||{});  //不可修改参数 ，默认待修改参数， 后传入覆盖待修改参数

		//目标元素
		var self = $(this);
		var target = self.next();

		// initialize 判断使用格式
		if (options.temp !== null) {
			var template = options.temp;
		} else if (target.is('script') && target.attr('type').indexOf('temp') >= 0) {
			var template = target.html();
		} else {
			var template = self.html();
		}

		// 渲染HTML
		var htmlStr = renderDOM(options.jsonStr, template);

		//done
		self.html(htmlStr);
		return $(this);
	}

	/**
	 * [renderDOM 判断数据类型 组合HTML]
	 * @param  {[array/object]} data     [数据]
	 * @param  {[string]} template [模板]
	 * @return {[string]}          [html字符串]
	 */
	function renderDOM(data, template){
		// console.log(data, template);
		var html = '';

		// 如果数据是JSON串 则转成对象
		if (type(data) === 'string') {
			data = JSON.parse(data);
		};

		if (type(data) === 'object') {
			//处理jsonObject
			html = concatHtml(data, template);
		} else if (type(data) === 'array') {
			//处理array
			for (var i in data) {
				html += concatHtml(data[i], template) + '\n';
			}
		} else {
			//处理错误格式
			if (typeof data == 'string' && data.indexOf('<') === 0) {
				html = 'jkinfo: it looks like an error of php outputs';
			} else {
				html = "jkinfo: datatype should be only json or array~";
			}
		}
		//
		return html;
	}

	/**
	 * [type 判断数据类型]
	 * @param  {[object]} obj [要检测的对象]
	 * @return {[string]}        [类型]
	 */
	function type(obj) {
		var s = Object.prototype.toString.call(obj);
		return s.match(/\[object (.*?)\]/)[1].toLowerCase();
	}

	/**
	 * [concatHtml 拼串 判断双花括号值的类型]
	 * @param  {[array/object]} data     [数据]
	 * @param  {[string]} template [模板]
	 * @return {[string]}          [html字符串]
	 */
	function concatHtml(data, template) {
		// console.log(template, data);
		return template.replace(/\{\{([\w\.]*)\}\}/g, function(key, val) {
			// console.log(key,val);
			if (type(data[val]) === 'string' || type(data[val]) === 'number') {
				return data[val];  //如果是字符串和数字，就直接返回，不操作
			} else if (type(data[val]) === 'object') {  //如果是3维度 则要加标签
				var itemsethtml = '';  // ------未完待开发------
				$.each(data[val], function(key, val) {
					// console.log(key,val);
					itemsethtml += '<a href="#">' + val + '</a> '; //指定用a包裹
				});
				return itemsethtml;
			} else if (data[val] === undefined) {
				return '';
			} else {
				return 'information: a value died here.';
			}
		});
	}

	//JQ插件
	$.fn.extend({
		fartemplate: FarTemplate
	});

})(window.jQuery || window.Zepto);