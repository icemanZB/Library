define(function (require, exports, module) {

	require('./module2.js'); // 依赖模块2 同步

	console.log(module.id);  //  module.uri

	console.log(module.dependencies);  // 依赖的数组 ( 依赖模块的路径 )

	// exports 是 module.exports 的引用
	console.log(module.exports == exports);  // true

	// 异步加载模块
	require.async('./module3.js', function () {
		console.log('模块加载完的回调');
	});

	var a = 100;

	/*
	 exports = {
	 a: a
	 };
	 错误的写法，因为这是赋值，不是添加属性
	 */

	// exports.a = a; 这种是可以的，一般用在添加属性

	// 一般返回对象
	module.exports = {
		a: a
	};

});


