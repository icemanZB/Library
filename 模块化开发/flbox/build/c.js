// c.js
define(function (require, exports, module) {
	require('./b');
	console.log("hello module c");

	console.log("c finished");
});