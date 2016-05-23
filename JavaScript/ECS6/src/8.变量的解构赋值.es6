let {log, sin, cos, PI}=Math;

console.log(PI);

// [x, y] = [y, x]; 变量交换

// 从函数返回多个值
// 返回一个数组

function example() {
	return [1, 2, 3];
}
var [a, b, c] = example();

// 返回一个对象

function example2() {
	return {
		foo: 1,
		bar: 2
	};
}
var {foo, bar} = example2();

// 函数参数的定义，解构赋值可以方便地将一组参数与变量名对应起来

// 参数是一组有次序的值
function f([x, y, z]) {
	// ...
}
f([1, 2, 3]);

// 参数是一组无次序的值
function f2({x, y, z}) {
	// ...
}
f2({z: 3, y: 2, x: 1});

// 提取 JSON 数据，解构赋值对提取 JSON 对象中的数据，尤其有用

var jsonData = {
	id    : 42,
	status: "OK",
	data  : [867, 5309]
};

let {id, status, data: number} = jsonData;

console.log(id, status, number); // 42, "OK", [867, 5309]

// 函数参数的默认值，指定参数的默认值，就避免了在函数体内部再写 var foo = config.foo || 'default foo'; 这样的语句
jQuery.ajax = function (url, {
	async = true,
	beforeSend = function () {},
	cache = true,
	complete = function () {},
	crossDomain = false,
	global = true,
	// ... more config
}) {
	// ... do stuff
};

// 遍历 Map 结构，任何部署了 Iterator 接口的对象，都可以用 for...of 循环遍历。Map 结构原生支持 Iterator 接口，配合变量的解构赋值，获取键名和键值就非常方便

var map = new Map();
map.set("first", "hello");
map.set("second", "world");

for (let [key, value] of map) {
	// first is hello
	// second is world
	console.log(key + " is " + value);
}

// 如果只想获取键名，或者只想获取键值，可以写成下面这样

// 获取键名
for (let [key] of map) {
	// ...
}

// 获取键值
for (let [,value] of map) {
	// ...
}

// 输入模块的指定方法，加载模块时，往往需要指定输入那些方法。解构赋值使得输入语句非常清晰
const { SourceMapConsumer, SourceNode } = require("source-map");










