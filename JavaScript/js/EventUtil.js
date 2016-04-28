var EventUtil = {
	addHandler      : function (element, type, handler) {
		if (element.addEventListener) {
			element.addEventListener(type, handler, false);
		} else if (element.attachEvent) {
			element.attachEvent("on" + type, handler);
		} else {
			element["on" + type] = handler;
		}
	},
	removeHandler   : function (element, type, handler) {
		if (element.removeEventListener) {
			element.removeEventListener(type, handler, false);
		} else if (element.detachEvent) {
			element.detachEvent("on" + type, handler);
		} else {
			element["on" + type] = null;
		}
	},
	getEvent        : function (ev) {
		return ev ? ev : window.event;
	},
	getTarget       : function (ev) {
		return ev.target || ev.srcElement;
	}, // 返回事件的目标
	preventDefault  : function (ev) {
		if (ev.preventDefault) {
			ev.preventDefault();
		} else {
			ev.returnValue = false;
		}
	},  // 取消事件默认行为
	stopPropagation : function (ev) {
		if (ev.stopPropagation) {
			ev.stopPropagation(); // IE不支持事件捕获，所以在夸浏览器的情况下，也只能用来阻止事件冒泡
		} else {
			ev.cancelBubble = true;
		}
	}, // 阻止事件冒泡
	getRelatedTarget: function (ev) {
		if (ev.relatedTarget) {
			return ev.relatedTarget;
		} else if (ev.toElement) {
			return ev.toElement;
		} else if (ev.fromElement) {
			return ev.fromElement;
		} else {
			return null;
		}
	},
	getMouseButton  : function (ev) {
		// 能力检测无法确定差异，支持 DOM 版鼠标事件的浏览器可以通过 hasFeature() 检测
		if (document.implementation.hasFeature("MouseEvents", "2.0")) {
			return ev.button;
		} else {
			switch (ev.button) {
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
	getWheelDelta   : function (ev) {
		if (ev.wheelDelta) {
			return (clinet.engine.opera && clinet.engine.opera < 9.5 ? -ev.wheelDelta : ev.wheelDelta);
		} else {
			return -ev.detail * 40;
		}
	},
	getCharCode     : function (ev) {
		if (typeof ev.charCode === "number") {
			return ev.charCode;
		} else {
			return ev.keyCode;
		}
	}
};





















