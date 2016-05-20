// TDZ："temporal dead zone" 暂时性死区
// 只要块级作用域内存在let命令，它所声明的变量就 "绑定"( binding )这个区域，不再受外部的影响

var tmp = 123;
if (true) {
	// TDZ 开始
	tmp = "abc"; // ReferenceError
	console.log(tmp); // ReferenceError

	// 在 let 命令声明变量 tmp 之前，都属于变量 tmp 的 "死区"
	let tmp; // TDZ 结束
	console.log(tmp); // undefined

	tmp = 123;
	console.log(tmp); // 123
}
/*
 * 上面代码中，存在全局变量 tmp，但是块级作用域内 let 又声明了一个局部变量 tmp，导致后者绑定这个块级作用域，所以在 let 声明变量前，对 tmp 赋值会报错
 * ES6 明确规定，如果区块中存在 let 和 const 命令，这个区块对这些命令声明的变量，从一开始就形成了封闭作用域。凡是在声明之前就使用这些变量，就会报错
 * 总之，在代码块内，使用 let 命令声明变量之前，该变量都是不可用的
 */

