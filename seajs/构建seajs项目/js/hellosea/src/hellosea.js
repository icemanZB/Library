define(function (require, exports, module) {

	// var util = require('./util'); require('jquery');

	var util = require('./util');

	require('jquery');
	require('jquerySayHello');

	$("#box2").sayHello();


	setInterval(function () {
		$("#box").css('background-color', util.randomColor());
	}, 1500);


});