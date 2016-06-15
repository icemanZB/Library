// const 声明一个只读的常量。一旦声明，常量的值就不能改变
'use strict';
const PI = 3.1415;
console.log( PI); // 3.1415
// PI = 3; // TypeError: "PI" is read-only

// 注意，如果是常规模式，对常量赋值不会报错，但也是无效的
/*

const PI = 3.1415;
PI = 3; // 常规模式时，重新赋值无效，但不报错
PI // 3.1415

*/


// const foo;  // SyntaxError: missing = in const declaration

// 上面代码表示，对于 const 来说，只声明不赋值，就会报错。同样的，这行命令在常规模式下不报错，但 foo 以后也没法重新赋值了
/*

const foo;
foo = 1; // 常规模式，重新赋值无效
foo // undefined

*/

// const 的作用域与 let 命令相同：只在声明所在的块级作用域内有效

if (true) {
	const MAX = 5;
}

MAX // Uncaught ReferenceError: MAX is not defined


// const 命令声明的常量也是不提升，同样存在暂时性死区，只能在声明的位置后面使用


if (true) {
	console.log(MAX2); // ReferenceError
	const MAX2 = 5;
}

// 上面代码在常量MAX声明之前就调用，结果报错


// const 声明的常量，也与 let 一样不可重复声明

var message = "Hello!";
let age = 25;

// 以下两行都会报错
const message = "Goodbye!";
const age = 30;

// 对于复合类型的变量，变量名不指向数据，而是指向数据所在的地址。const 命令只是保证变量名指向的地址不变，并不保证该地址的数据不变，所以将一个对象声明为常量必须非常小心

const foo = {};
foo.prop = 123;

foo.prop;  // 123

// foo = {}; // TypeError: "foo" is read-only

// 上面代码中，常量 foo 储存的是一个地址，这个地址指向一个对象。不可变的只是这个地址，即不能把 foo 指向另一个地址，但对象本身是可变的，所以依然可以为其添加新属性。

const a = [];
a.push("Hello"); // 可执行
a.length = 0;    // 可执行
// a = ["Dave"];    // 报错


// 上面代码中，常量 a 是一个数组，这个数组本身是可写的，但是如果将另一个数组赋值给 a ，就会报错。 如果真的想将对象冻结，应该使用 Object.freeze() 方法

const foo2 = Object.freeze({});

// 常规模式时，下面一行不起作用，严格模式时，该行会报错
foo2.prop = 123;

// 上面代码中，常量 foo 指向一个冻结的对象，所以添加新属性不起作用，严格模式时还会报错。

// 除了将对象本身冻结，对象的属性也应该冻结。下面是一个将对象彻底冻结的函数
var constantize = (obj) => {
	Object.freeze(obj);
	Object.keys(obj).forEach( (key, value) => {
		if ( typeof obj[key] === "object" ) {
			constantize( obj[key] );
		}
	});
};

// ES5 只有两种声明变量的方法：var 命令和 function 命令。
// ES6 除了添加 let 和 const 命令，后面章节还会提到，另外两种声明变量的方法：import 命令和 class 命令。所以，ES6 一共有 6 种声明变量的方法。












