// sea 下的参数名称和参数顺序是不允许修改的，建议这三个参数都写上
define(function(require,exports,module){

	// var r = require;  这种写法也是不允许的，相当于这三个参数就是关键字
	
	function show(){
		console.log(1);
	}

    // exports ：对外提供接口的对象
	exports.show = show;
	
});


