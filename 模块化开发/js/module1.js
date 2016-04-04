// sea 下的参数名称是不允许修改的
define(function(require,exports,module){
	
	function show(){
		alert(1);
	}

    // exports ：对外提供接口的对象
	exports.show = show;
	
});


