define(function(require,exports){
	
	// require : 模块之间依赖的接口
	// 当引入的是sea下面的模块的时候,那么 require 执行完的结果就是 exports
	var a = require('./module3.js').a;   // 100

	function show(){
		alert(a);
	}
	
	exports.show = show;
	
});





