define(function (require, exports) {

	// require ：模块之间依赖的接口，参数是url，同样是需要用相对地址
	// 当引入的是 sea 下面的模块的时候，那么 require 执行完的结果就是 exports
	var ex = require('./module3.js');

	console.log(num); // 200

	function show() {
		console.log(ex.a); // 100
	}

	exports.show = show;

});


