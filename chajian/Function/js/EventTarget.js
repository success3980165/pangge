/*
	自定义事件
	观察者模式由两类对象组成：主体和观察者。
*/
function EventTarget() {
	//EventTarget类型有一个单独的属性handlers，用于储存事件处理程序。
	this.handlers = {};
}

EventTarget.prototype = {
	constructor: EventTarget,

	//用于注册给定类型事件的事件处理程序。
	addHandler: function(type, handler) {
		if (typeof this.handlers[type] == "undefined") {
			this.handlers[type] = [];
		}

		this.handlers[type].push(handler);
	},

	//用于触发一个事件
	fire: function(event) {
		if (!event.target) {
			event.target = this;
		}
		if (this.handlers[event.type] instanceof Array) {
			var handlers = this.handlers[event.type];
			for (var i = 0, len = handlers.length; i < len; i++) {
				handlers[i](event);
			}
		}
	},

	//用于注销某个事件类型的事件处理程序。
	removeHandler: function(type, handler) {
		if (this.handlers[type] instanceof Array) {
			var handlers = this.handlers[type];
			for (var i = 0, len = handlers.length; i < len; i++) {
				if (handlers[i] === handler) {
					break;
				}
			}

			handlers.splice(i, 1);
		}
	}
};