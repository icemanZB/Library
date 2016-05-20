// 全局对象是最顶层的对象，在浏览器环境指的是 window 对象，在 Node.js 指的是 global 对象。ES5 之中，全局对象的属性与全局变量是等价的

window.a = 1;
a // 1

a = 2;
window.a // 2

// let 命令、const 命令、class 命令声明的全局变量，不属于全局对象的属性。也就是说，从 ES6 开始，全局变量将逐步与全局对象的属性脱钩
var a2 = 1;

// 如果在 Node 的 REPL 环境，可以写成 global.a
// 或者采用通用方法，写成 this.a
window.a2 // 1

let b2 = 1;
window.b2 // undefined

// 全局变量 a2 由 var 命令声明，所以它是全局对象的属性
// 全局变量 b2 由 let 命令声明，所以它不是全局对象的属性，返回 undefined



