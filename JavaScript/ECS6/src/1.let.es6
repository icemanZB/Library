// let 命令所声明的变量，只在所在的代码块内有效

{
	let a = 10;
	var b = 1;
}

// console.log(a);  // ReferenceError: a is not defined.
console.log(b);  // 1

// for 循环的计数器，就很合适使用 let 命令

var arr = [];
for (var i = 0; i < 10; i++) {
	arr[i] = function () {
		console.log(i);
	};
}

// 变量 i 是 var 声明的，在全局范围内都有效。所以每一次循环，新的 i 值都会覆盖旧值，导致最后输出的是最后一轮的 i 的值
arr[6](); // 10

// 如果使用 let 声明的变量仅在块级作用域内有效，最后输出的是 6
var arr2 = [];
for (let j = 0; j < 10; j++) {
	arr2[j] = function () {
		console.log(j);
	};
}

// 上面代码中，变量 i 是 let 声明的，当前的 i 只在本轮循环有效，所以每一次循环的 i 其实都是一个新的变量，所以最后输出的是 6
arr2[6](); // 6

// 不存在变量提升，let 不像 var 那样会发生 "变量提升" 现象。所以，变量一定要在声明后使用，否则报错。

console.log(foo); // 输出 undefined
// console.log(bar); // 报错 ReferenceError: bar is not defined

var foo = 2;
let bar = 2;

/*
 * 上面代码中，变量 foo 用 var 命令声明，会发生变量提升，即脚本开始运行时，变量 foo 已经存在了，但是没有值，所以会输出 undefined
 * 变量 bar 用 let 命令声明，不会发生变量提升。这表示在声明它之前，变量 bar 是不存在的，这时如果用到它，就会抛出一个错误。
 */


