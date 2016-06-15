function f1() {
	let n = 5;
	if (true) {
		let n = 10;
	}
	console.log(n); // 5
}

// 上面的函数有两个代码块，都声明了变量 n，运行后输出 5。这表示外层代码块不受内层代码块的影响。如果使用 var 定义变量 n，最后输出的值就是10

// 一个五层的块级作用域，外层作用域无法读取内层作用域的变量
{{{{
	{let insane = 'Hello World'}
	console.log(insane); // 报错
}}}}

// 内层作用域可以定义外层作用域的同名变量

{{{{
	let insane = 'Hello World';
	{let insane = 'Hello World'}
}}}}

// 块级作用域的出现，实际上使得获得广泛应用的立即执行匿名函数 ( IIFE ) 不再必要了

// IIFE 写法
(function () {
	// var tmp = ...;
	// ...
}());

// 块级作用域写法
{
	// let tmp = ...;
	// ...
}

// 另外，ES6 也规定，函数本身的作用域，在其所在的块级作用域之内
/*

function f() { console.log("I am outside!"); }
(function () {
	if(false) {
		// 重复声明一次函数 f
		function f() { console.log("I am inside!"); }
	}

	f();
}());

*/

// 上面代码在 ES5 中运行，会得到 "I am inside!"，但是在 ES6 中运行，会得到 "I am outside!"
// 这是因为 ES5 存在函数提升，不管会不会进入 if 代码块，函数声明都会提升到当前作用域的顶部，得到执行
// 而 ES6 支持块级作用域，不管会不会进入 if 代码块，其内部声明的函数皆不会影响到作用域的外部

/*

{
	let a = "secret";
	function f() {
		return a;
	}
}
f(); // 报错

*/

// 上面代码中，块级作用域外部，无法调用块级作用域内部定义的函数。如果确实需要调用，就要像下面这样处理
let f;
{
	let a ="secret" ;
	f = function () {
		return a;
	};
}
f(); // "secret"


// ES5 的严格模式规定，函数只能在顶层作用域和函数内声明，其他情况 ( 比如 if 代码块、循环代码块 ) 的声明都会报错
// ES5
/*

"use strict";
if (true) {
	function f() {} // 报错
}

*/
// ES6 由于引入了块级作用域，这种情况可以理解成函数在块级作用域内声明，因此不报错，但是构成区块的大括号不能少，否则还是会报错。
// 不报错
/*

"use strict";
if (true) {
	function f() {}
}

*/
// 报错
/*

"use strict";
if (true)
	function f() {}

*/

// 另外，这样声明的函数，在区块外是不可用的

/*

"use strict";
if (true) {
	function f() {}
}
f(); // ReferenceError: f is not defined

*/

// 上面代码中，函数 f 是在块级作用域内部声明的，外部是不可用的。