/*跨浏览器事件处理程序*/
var EventUtil = {

	/**
	 * [addHandler 添加事件]
	 * @param {[type]} element [元素对象]
	 * @param {[type]} type    [事件类型]
	 * @param {[type]} handler [处理函数]
	 */
	addHandler: function(element, type, handler) {
		if (element.addEventListener) {
			element.addEventListener(type, handler, false);
		} else if (element.attachEvent) {
			element.attachEvent("on" + type, handler);
		} else {
			element["on" + type] = handler;
		}
	},

	/**
	 * [removeHandler 移除事件]
	 * @param  {[type]} element [元素对象]
	 * @param  {[type]} type    [事件类型]
	 * @param  {[type]} handler [处理函数]
	 */
	removeHandler: function(element, type, handler) {
		if (element.removeEventListener) {
			element.removeEventListener(type, handler, false);
		} else if (element.detachEvent) {
			element.detachEvent("on" + type, handler);
		} else {
			element["on" + type] = null;
		}
	},

	/**
	 * [preventDefault 取消事件默认行为]
	 * @param  {[type]} event [event对象]
	 */
	preventDefault: function(event) {
		if (event.preventDefault) {
			event.preventDefault();
		} else {
			event.returnValue = false;
		}
	},

	/**
	 * [stopPropagation 取消事件传播]
	 * @param  {[type]} event [event对象]
	 */
	stopPropagation: function(event) {
		if (event.stopPropagation) {
			event.stopPropagation();
		} else {
			event.cancelBubble = true;
		}
	},

	/**
	 * [getEvent 获取event对象]
	 * @param  {[type]} event [event对象,本身就是一个构造函数]
	 * @return {[type]}       [兼容模式返回event对象]
	 */
	getEvent: function(event) {
		return event ? event : window.event;
	},

	/**
	 * [getTarget 获取事件目标]
	 * @param  {[type]} event [event对象]
	 * @return {[type]}       [事件目标]
	 */
	getTarget: function(event) {
		return event.target || event.srcElement;
	},

	/**
	 * [getButton 获取button属性]
	 * @param  {[type]} event [event对象]
	 * @return {[type]}       [0=左键，1=中键，2=右键]
	 */
	getButton: function(event) {
		if (document.implementation.hasFeature("MouseEvents", "2.0")) {
			return event.button;
		} else {
			switch (event.button) {
				case 0:
				case 1:
				case 3:
				case 5:
				case 7:
					return 0;
				case 2:
				case 6:
					return 2;
				case 4:
					return 1;
			}
		}
	},

	/**
	 * [getCharCode 获得键值]
	 * @param  {[type]} event [event对象]
	 * @return {[number]}       [返回键值]
	 */
	getCharCode: function(event) {
		if (typeof event.charCode == "number") {
			return event.charCode;
		} else {
			return event.keyCode;
		}
	},

	/**
	 * [getRelatedTarget 获取relatedTarget属性]
	 * @param  {[type]} event [event对象]
	 * @return {[type]}       [对于其他事件，返回NULL]
	 * @example       [这个属性只对于mouseover/mouseout事件有效]
	 */
	getRelatedTarget: function(event) {
		if (event.relatedTarget) {
			return event.relatedTarget;
		} else if (event.toElement) {
			return event.toElement;
		} else if (event.fromElement) {
			return event.fromElement;
		} else {
			return null;
		}

	},

	/**
	 * [getWheelDelta 获取滚轮wheelDelt值]
	 * @param  {[type]} event [event对象]
	 * @return {[number]}       [+-120]
	 * @example       [client.js检测用户代理]
	 */
	getWheelDelta: function(event) {
		if (event.wheelDelta) {
			return (client.engine.opera && client.engine.opera < 9.5 ? -event.wheelDelta : event.wheelDelta);
		} else {
			return -event.detail * 40;
		}
	},

	/**
	 * [setClipboardText 粘贴到剪切板]
	 * @param {[type]} event [event对象]
	 * @param {[String]} value [要加入剪切板的值]
	 */
	setClipboardText: function(event, value) {
		if (event.clipboardData) {
			event.clipboardData.setData("text/plain", value);
		} else if (window.clipboardData) {
			window.clipboardData.setData("text", value);
		}
	},

	/**
	 * [getClipboardText 获取剪切板信息]
	 * @param  {[type]} event [event对象]
	 * @return {[String]}       [值]
	 * @example       [cut事件：在将选中的内容从文档中移除，加入剪贴板后触发。]
	 * @example       [copy事件：在选中的内容加入剪贴板后触发。]
	 * @example       [paste事件：在剪贴板内容被粘贴到文档后触发。]
	 */
	getClipboardText: function(event) {
		var clipboardData = (event.clipboardData || window.clipboardData);
		return clipboardData.getData("text");
	}
};