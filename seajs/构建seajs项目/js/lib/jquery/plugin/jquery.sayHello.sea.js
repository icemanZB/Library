define(function (require, exports, module) {
	$.fn.sayHello = function () {
		console.log(1111);
		return this.css("background","red");
	};

});