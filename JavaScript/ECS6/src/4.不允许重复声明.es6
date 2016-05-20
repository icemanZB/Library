// let 不允许在相同作用域内，重复声明同一个变量
// 报错
function aaa() {
	let a = 10;
	var a = 1;
}

// 报错
function bbb() {
	let b = 10;
	let b = 1;
}

// 因此，不能在函数内部重新声明参数
function func1(arg) {
	let arg; // 报错
}

function func2(arg) {
	{
		let arg; // 不报错
	}
}
