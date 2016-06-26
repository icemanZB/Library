/*!
 * jQuery JavaScript Library v2.0.3
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03T13:30Z
 */
(function( window, undefined ) {

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//"use strict";
var
	// A central reference to the root jQuery(document)
	/*
	 * 1、为了压缩考虑，jQuery(document) 这种无法压缩
	 * 2、定义变量，有利于后期代码进行可维护
	 */
	rootjQuery,

	// The deferred used on DOM ready
	readyList,

	// Support: IE9
	// For `typeof xmlNode.method` instead of `xmlNode.method !== undefined`
	/*
	 * 在老版本的 IE6 7 8 9中，如果是判断 xml节点 (或方法)，window.a == undefined 这种方式判断会有问题，为了兼容使用 typeof window.a == "undefined"
	 */
	core_strundefined = typeof undefined,  // "undefined"

	// Use the correct document accordingly with window argument (sandbox)
	/*
	 * 使用正确的文档与窗口参数存储为变量用于压缩
	 */
	location = window.location,
	document = window.document,
	docElem = document.documentElement,

	// Map over jQuery in case of overwrite
	/*
	 * 变量冲突的时候使用，如果在外部定义过 window.jQuery = "jQuery"; 那么此时这个变量存的值就是 _jQuery = "jQuery"; 如果外部没有定义，那么 _jQuery = undefined
	 */
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	/*
	 * 变量冲突的时候使用同理上述 _jQuery 变量
	 */
	_$ = window.$,

	// [[Class]] -> type pairs
	/* 用于类型判断 $.type()
	 * 	class2type ={
	 *	    "[object Array]": "array",
	 *	    "[object Boolean]": "boolean",
	 *	    "[object Date]": "date",
	 *	    "[object Error]": "error",
	 *	    "[object Function]": "function",
	 *	    "[object Number]": "number",
	 *	    "[object Object]": "object",
	 *	    "[object RegExp]": "regexp",
	 *	    "[object String]": "string"
	 *   };
	 *
	 */
	class2type = {},

	// List of deleted data cache ids, so we can reuse them
	core_deletedIds = [],

	core_version = "2.0.3",

	// Save a reference to some core methods
	core_concat = core_deletedIds.concat,
	core_push = core_deletedIds.push,
	core_slice = core_deletedIds.slice,
	core_indexOf = core_deletedIds.indexOf,
	core_toString = class2type.toString,
	core_hasOwn = class2type.hasOwnProperty,
	/* 去掉前后空格，ECMA5 中的字符串方法 */
	core_trim = core_version.trim,

	// Define a local copy of jQuery
	/*
	 * 构建 jQuery 对象
	 */
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		/*
		 * jQuery 对象实际上只是初始化构造函数的"强化"，jQuery.fn.init() 才是构造函数
		 * 其实就是 jQuery.prototype.init()   => jQuery.fn = jQuery.prototype
		 */
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Used for matching numbers
	/*
	 * 找数字，正负号、小数点、科学计数法
	 */
	core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,

	// Used for splitting on whitespace
	/*
	 * 用空格分隔单词，匹配空格分隔开
	 */
	core_rnotwhite = /\S+/g,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	/*
	 * (?:\s*(<[\w\W]+>)[^>]*|#([\w-]*)) 匹配元素标签 (创建标签可能会用到) 例如：<p>aaa
	 * #([\w-]*) 匹配元素 ID 的形式，防止 XSS 注入类似 ( #<div>不在创建 div ) 例如：#div1
	 */
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	// Match a standalone tag
	/*
	 * 匹配 "成对" 的独立单标签 例如：<div></div> 、 <p></p>、<li>
	 */
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

	// Matches dashed string for camelizing
	/*
	 * 用在 IE 的 CSS 属性转换上 (驼峰式)
	 * 例如： MsMarginLeft，其他的前缀是 webkitMarginLeft
	 */
	rmsPrefix = /^-ms-/,

	/*
	 * 找到 "-" + "字符" 转成大写，例如： -l ==> L
	 * margin-left ==> marginLeft 或者匹配 CSS3 的数字 ( -2d -> 2d )
	 */
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	/*
	 * 用于转驼峰的回调函数 ( all-> 正则，letter -> 正则中的子项 )
	 */
	fcamelCase = function( all, letter ) {
		/*
		 * 例如： all ==> /-([\da-z])/gi，子项就是 [\da-z] 匹配到对应的字符，转成大写
		 */
		return letter.toUpperCase();
	},

	// The ready event handler and self cleanup method
	/*
	 * DOM 加载成功后触发
	 */
	completed = function() {
		/*
		 * 这两句话就是取消事件，那么其中一个走进来，第二个就走不进来了，也就是事件被取消掉了，所以最终 jQuery.ready() 只会触发一次
		 */
		document.removeEventListener( "DOMContentLoaded", completed, false );
		window.removeEventListener( "load", completed, false );
		/*
		 * 最终调用的是 jQuery.ready() 工具方法
		 */
		jQuery.ready();
	};

/*
 * 将 jQuery 的原型对象赋值给了 jQuery.fn
 */
jQuery.fn = jQuery.prototype = {
	// The current version of jQuery being used
	jquery: core_version,

	constructor: jQuery,
	/*
	 *  入口
	 *  构造函数 function init(){} 初始化和参数的管理
	 *  原型对象 init.prototype = jQuery.prototype
	 *  return this; $() 的返回值是 $.fn.init 的原型对象 ( Object{ } "空" )，于是通过 jQuery.fn.init.prototype = jQuery.fn;
	 *  $() 的返回值从 $.fn.init.prototype 一下子变成 $.fn
	 *  这样所有通过 $ 创建出来的对象都将共享 fn 对象上的成员。因此，jQuery 对象都有了类似 attr 、html 等等方法了
	 */
	init: function( selector, context, rootjQuery ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		/*
		 * 处理当传入 ""、null、undefined、false 这些值时，直接返回 return
		 */
		if ( !selector ) {
			return this;
		}

		// Handle HTML strings
		/*
		 * 例如传入的是 $("div")、$(".box")、$("#div")、$("#div div.box")、$("<div>")、$("<li>hello") ( 这种写法会生成<li></li>不会添加 hello 文本 )
		 */
		if ( typeof selector === "string" ) {
			/*
			 * 判断字符串最左边的字符是否是 "<" 并且最右边的字符是否是 ">" 并且长度大于等于3，所以这个判断是去找标签
			 */
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				/*
				 * $("<div>")  -> match = [null , "<div>" , null]
				 */
				match = [ null, selector, null ];

			} else {
				/*
				 * 使用正则匹配标签加文字 $("<li>hello") 或者 ID 的形式 $("#div")
				 * 像 $("div")、$(".box')、$("#div div.box") 匹配这些复杂选择器的时候 match = null;就会调用 find() -> 最终会调用 sizzle
				 * $("#div1")  -> match = ["#div1",null,"div1"];
				 * $("<li>hello") -> match = ["<li>hello","<li>",undefined];
				 */
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			/*
			 * 其实只有在创建标签和获取 ID 元素 的时候 match 才会有值
			 * match[1] 有值的话，那肯定是创建标签，没有值的话并且不指定上下文的时候肯定是获取 ID 元素
			 */
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				/* match[1] 有值的时候，就是创建标签 $("<li>") */
				if ( match[1] ) {
					/* $("<li>",document) 或者 $("<li>",$(document)) */
					context = context instanceof jQuery ? context[0] : context;

					// scripts is true for back-compat
					/*
					 * jQuery.parseHTML 把字符串转成节点数组，jQuery.merge() 是用在合并 json，但是 json 格式一定是这样子的类数组格式
					 * 最终形成 Object {0:li,1:li,length:2,....}
					 */
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						/* 最终 context = document */
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					/*
					 * 这段是处理创建标签带有属性的 $("<li></li>",{title : "hi",html : "abcd",css : {background:"red"}}).appendTo( "ul" );
					 * rsingleTag 匹配单标签 (<li></li>)，jQuery.isPlainObject() 必须是个 {title : "hi",html : "abcd"}
					 */
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						/*
						 * 此时 context = { title : "hi",html : "abcd" }
						 */
						for ( match in context ) {
							// Properties of context are called as methods if possible
							/*
							 * match 的值 就是 title 、html，在 jQuery 中 this["title"] 没有这个方法，但是有 this["html"] = this.html()
							 */
							if ( jQuery.isFunction( this[ match ] ) ) {
								/* 当有这个方法的时候进行html()函数调用了 this.html( "abcd" ); */
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								/*
								 * 没有方法就添加属性，调用 attr(title,"hi")
								 */
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				/*
				 * 这个就是获取ID的时候 $("#div1")
				 */
				} else {
					/*
					 * $("#div1")  -> match = ["#div1",null,"div1"];  match[2] = "div1"
					 */
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					/*
					 * 一般来说只要判断 elem 存不存在就可以了，但是在 Blackberry 4.6 下，可能这个元素已经不再页面上了但是还能找到
					 * 例如克隆一个节点，然后删除以后，他仍旧能找到，所以在判断看看有没有父级
					 */
					if ( elem && elem.parentNode ) {
						// Inject the element directly into the jQuery object
						/*
						 * jQuery 选择元素的时候是存成一个类数组，所以设置长度为 1，第 0 项就是对应这个 DOM 元素
						 */
						this.length = 1;
						this[0] = elem;
					}

					/*
					 * ID 选择符上下文肯定是 document
					 */
					this.context = document;
					/*
					 * 就是外面传进来的 #div1，存到 this.selector
					 */
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			/*
			 * 当是这种情况的时候 $("div")、$(".box')、$("#div div.box")，就会调用 find
			 */
			/*
			 * 当 context 不存在的时候，肯定进入了这个 if，那么值肯定是 rootjQuery，rootjQuery = $(document)
			 * 传了 context，并且要看 context.jquery 就是表示 这个 context 是不是 jQuery 对象，如果是就调用 context.find( selector );
			 * 例如： $("ul",$(document))   -> $(document).find("ul");
			 */
			} else if ( !context || context.jquery ) {
				/*
				 * find() -> 最终会调用 sizzle
				 */
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			/*
			 * 传了 context，但是不是 jQuery 对象就走 else，this.constructor = jQuery
			 * 例如： $("ul",document)  ->  jQuery(document).find("ul");
			 */
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		/*
		 * 这里的 else if 是帮上面判断 typeof selector === "string" 连在一起的
		 * 选择节点例如：$(this)、$(document)，如果是节点类型肯定有 nodeType
		 */
		} else if ( selector.nodeType ) {
			/*
			 * 连等赋值：selector(DOM节点) 赋值到 this[0] (对象的第0个属性上)，接着在设置执行上下文 (因为节点不需要有什么上下文就直接赋值即可)
			 */
			this.context = this[0] = selector;
			this.length = 1;
			/*
			 * 其实就是想办法把所找到的元素都存到 this 上，形成带下标，length形式的对象
			 */
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		/*
		 * $(function(){})，文档加载
		 * jQuery.isFunction() 判断是不是函数，如果是则调用 ready() 方法
		 */
		} else if ( jQuery.isFunction( selector ) ) {
			/*
			 * 这句就是平时外面写的 $(document).ready(function(){});，这句理解成对应的源码就是$().ready(); $()就是创建对象，在调用实例方法ready()
			 * 其实就是下面的 ready: function( fn ) { // Add the callback  jQuery.ready.promise().done( fn ); return this; }
			 */
			return rootjQuery.ready( selector );
		}
		/*
		 * 这个 if 是用来处理 $( $("#div1") ) 这种情况的
		 * selector.selector 的意思就是表示是否是个 jQuery 对象，如果是的话 selector 肯定有值
		 */
		if ( selector.selector !== undefined ) {
			/*
			 * 这两句其实就是 $("#div1")，表示的是一个意思
			 */
			this.selector = selector.selector;
			this.context = selector.context;
		}
		/*
		 * 处理 $([])、$({})
		 * jQuery.makeArray() 传一个参数的时候就是把类数组转为真正的数组(平时用的)
		 *                    传两个参数的时候就会变成 json (特殊的拥有 length，下标属性的)，一般是源码内部使用、
		 *                    这个方法是工具方法，可以给 jQuery 对象使用，也可以给原生的 JavaScript 使用
		 *                    工具方法一般可以看做 jQuery 底层方法，实例方法可以看成更高一层的方法
		 *
		 * 这个方法类似 jQuery.merge()  最终形成 Object {0:li,1:li,length:2,....}
		 */
		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	/*
	 * 存储选择到元素的字符串形式
	 */
	selector: "",

	// The default length of a jQuery object is 0
	/*
	 * this 对象的长度
	 */
	length: 0,

	/*
	 * 功能是把类数组转为真正的数组，并且是实例下的方法，只能给 jQuery 对象使用 $("div").toArray();
	 */
	toArray: function() {
		/*
		 * [].slice.call(this)，this 是上下文，改变执行环境
		 */
		return core_slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	/*
	 * 可以选择到一个原生的集合，或者是指定集合当中的某一个
	 */
	get: function( num ) {
		/*
		 * 首先看 num 不存在的情况下，其实就是要一个集合，调用 toArray() 方法，转成原生的数组
		 * 如果有 num 并且是负数，就是从后往前找 (this.length + num)
		 * 如果有 num，num 是正数就是走的是 this[ num ]，获取数组中的指定的一个
		 */
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			/*
			 * this 是 jQuery 对象，"[]" 代表着去找 json(特殊形式) 对应的属性，这里 this 不是数组)
			 * this -> Object {0:li,1:li,length:2,....}
			 */
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	/*
	 * jQuery 对象入栈
	 * 这个概念有点类似于进电梯，先进的人在后面，后进的人在前面，出电梯的时候，后进的人先出，先进的人后出
	 * 总结：先进后出
	 */
	pushStack: function( elems ) {
		/*
		 * this.constructor() -> 得到一个空的 jQuery 对象
		 * elems 参数 就是传进来的 DOM 对象
		 * 通过 jQuery.merge() 方法打包成一个 json 对象，例如：$("div").pushStack( $("span") )
		 * { 0: span,context: document,length: 1,prevObject: jQuery.fn.jQuery.init[1],selector: "span" }
		 */
		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		/*
		 * 添加一个 prevObject 属性，存之前的对象。也就是说在 span 下面添加了一个 prevObject 属性存 div
		 * 存这个属性是为了方便找到先入栈的那个元素，例如 $("div").pushStack( $("span") ).css("background","red").end().css("background","yellow");
		 * 这里的 end() 方法就可以找到 div
		 * { 0: div,context: document,length: 1,prevObject: jQuery.fn.jQuery.init[1],selector: "div"}
		 */
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		/*
		 * 调用 jQuery.each() 是工具方法(静态方法)
		 */
		return jQuery.each( this, callback, args );
	},

	/*
	 * rootjQuery.ready( selector ); 上面这句就是对应调用这个实例方法
	 */
	ready: function( fn ) {
		// Add the callback
		/*
		 * jQuery.ready.promise() 先创建了延迟对象，在适当的时候触发 fn
		 * jQuery.ready.promise  搜索下，在下面
		 */
		jQuery.ready.promise().done( fn );

		return this;
	},

	slice: function() {
		/*
		 * this -> { 0: p,1: p,2: p,3: p,context: document,length: 4,prevObject: jQuery.fn.jQuery.init[1],selector: "p" }
		 * core_slice.apply( this, arguments ) -> [].slice.apply(this,[1,3])
		 * 传入 this 是要改变原来的 Array 的指向
		 */
		return this.pushStack( core_slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			/*
			 * +i 就是转数字
			 */
			j = +i + ( i < 0 ? len : 0 );

		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		/*
		 * end() 方法就是利用了栈的原理
		 * 例如：$("div").pushStack( $("span") ).css("background","red").end().css("background","yellow");
		 * 此时的 this 就是 span，那么 span 的 prevObject 就是 div 了，如果没有的话就不做任何处理了
		 */
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	/*
	 * 这三个方法是 jQuery 内部使用的，jQuery 把这三个数组的方法挂载到了 jQuery 对象下，所以 jQuery 就有了数组的这三个方法，不建议在外面使用
	 */
	push: core_push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
/*
 * 将 jQuery.fn 赋值给 jQuery.fn.init.prototype ( jQuery.fn.init.prototype 的原型也就是 jQuery 的原型对象 )
 * jQuery.prototype = jQuery.fn = jQuery.fn.init.prototype
 * 让 jQuery 原型中的 init 方法中的原型对象指向 jQuery 的原型 ( init.prototype = jquery.prototype; )，以便使用 jQuery 的原型对象中的属性和方法
 * 这样所有通过 $ 创建出来的对象都将共享 fn 对象上的成员。因此，jQuery 对象都有了类似 attr 、html 等等方法了
 */
jQuery.fn.init.prototype = jQuery.fn;

/*
 * 新增静态方法(工具方法) jQuery.extend，新增原型方法 jQuery.fn.extend (也就是扩展实例方法)
 * jQuery 继承方式就是拷贝继承
 */
jQuery.extend = jQuery.fn.extend = function() {
	/*
	 * var a = { }; $.extend( a , { name : "hello" } , { age : 30 } );
	 * 其中 arguments[0] 第一个元素就是 a，后续参数都要往 a 身上扩展
	 */
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;  // 是否是深拷贝

	/*
	 * 看是不是深拷贝的情况
	 * $.extend( true , a , b ); 这种情况走的就是这个 if
	 */
	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		/*
		 * 此时目标元素变成了 arguments[1] 就是第二个参数
		 */
		target = arguments[1] || {};
		// skip the boolean and the target
		/* 由于参数项变了，所以要跳过 boolean 和 target */
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	/*
	 * 检测参数是否正确
	 * 当目标元素不是对象就把他变成一个对象
	 */
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	/* 看是不是插件的情况
	 * $.extend({
	 *     aaa : function(){
	 *         alert(1);
	 *     }
	 * });
	* length 和 i 相等表示就是只传入了一个参数，就是插件的情况
	* 此时的 target 就是 this ( $() 这个函数，或者 $.fn (原型) )
	* $.extend();  -> this -> $  -> this.aaa  ->  $.aaa()
	* $.fn.extend(); -> this -> $.fn -> this.aaa ->  $().aaa()
	*/
	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}
	/*
	 * 这个循环就是 N 多个对象扩展到一个对象上 N = { name : "hello" } , { age : 30 }
	 * $.extend( a , { name : "hello" } , { age : 30 } );
	 */
	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			/*
			 * arguments[ i ] 就是 Object {name: "hello"}，Object {age: 30}
			 */
			for ( name in options ) {
				src = target[ name ];  // undefined,undefined
				copy = options[ name ]; // hello,30

				// Prevent never-ending loop
				/*
				 * 防止循环引用
				 * var a = {}; $.extend( a , { name : a } );
				 * 这种情况就是循环引用，{ name : a } 这个整体往 a 进行扩展，扩展完 { name : a }这个对象中的 a 又是个对象，一层层扩展就是循环引用
				 * 也就是说 a , { name : a } 如果这两个 a 相等，就跳出循环
				 */
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				/*
				 * jQuery.isPlainObject(copy) 判断 copy 是不是一个对象
				 * ( copyIsArray = jQuery.isArray(copy) ) 看下是不是数组
				 */
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					/*
					 * 针对数组的情况
					 */
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];
					} else {
						/* 针对 json 的情况
						 * 先看下原有的目标下面有没有这个属性，在看下这个是不是 json，如果这两个条件都满足，就不用重新创建新对象
						 * var a = { name : { job : "it" } }; var b = { name : {age : 30} }; $.extend( true , a  , b );
						 * 例如上述情况，此时的 a 是 -> name : { job : "it",age : 30 }
						 * 之所以没有覆盖掉原来 a 中的 name，就是因为递归的传参的时候传入的是 src，src 就是 { job : "it" }
						 * 如果修改一下源码，clone = {}; 直接创建新对象，那么 a -> name : { age : 30 }
						 */
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					/*
					 * 这句就是递归
					 */
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				/*
				 * 浅拷贝，就是基本类型赋值，没有对象的引用关系
				 */
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

/*
 * 绑定一堆静态方法(工具方法)
 */
jQuery.extend({
	// Unique for each copy of jQuery on the page
	/*
	 * 生成唯一的字符串，在内部使用的，用在一些映射中( 数据缓存，事件操作，ajax 都用到这个属性 )
	 * replace(/\D/g,"") 把非数字的替换成空
	 */
	expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g, "" ),

	/*
	 * 对外提供的工具方法，防止冲突
	 */
	noConflict: function( deep ) {
		/*
		 * 这句话是为了解决在引用 jQuer y库之前就已经定义了$
		 * 那么最开始定义的属性 _$ = window.$ 就是 $ 在 jQuery 库件引入之前的值 ( var $=1233; )
		 * 那么在引入 jQuery 库的时候，window.$ === jQuery 肯定是相等的
		 * 那么就等于 window.$ = 1233
		 */
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}
		/*
		 * 这个 deep 参数是放弃 jQuery 对外的接口 ( var jQuery = 333; )
		 */
		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		/*
		 * 对外提供的接口，return jQuery，在外部接收的任何对象都是 jQuery 了
		 */
		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	/*
	 * DOM 是否加载完 ( 内部 )
	 */
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	/*
	 * 等待多少文件的计数器( 内部 )
	 */
	readyWait: 1,

	// Hold (or release) the ready event
	/*
	 * 推迟 DOM 触发，实际应用的例子是异步加载外部 JavaScript 插件的时候，希望 JavaScript 加载完成以后，在出发 DOM
	 */
	holdReady: function( hold ) {
		if ( hold ) {
			/*
			 * jQuery.readyWait++; 是指等所有的文件都 hold 完成以后，在一次次释放，用于多组文件异步加载完成以后触发 DOM
			 */
			jQuery.readyWait++;
		} else {
			/*
			 * 每次走这里就会释放一次
			 */
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	/*
	 * 准备DOM触发
	 */
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		/*
		 * --jQuery.readyWait 减到 0 的时候，就可以走下面的代码了，不为 0 的时候就 return;
		 *  如果是普通的形式，$.ready()，就是要看 jQuery.isReady 看他是否为 true ，为 true 就说明 DOM 加载完成了
		 *  为 false 就是走下面 jQuery.isReady = true; 设置为 true， 让下面的代码就触发一次
		 */
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		/*
		 * 看看还需不需要等待，直到次数为 0 的时候，就可以走下面的代码了
		 */
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		/*
		 * 最终 jQuery.ready() 就是走了这句话，看对象是否已经完成，就是可以触发 jQuery.ready.promise().done(fn); 这个 fn 了
		 * resolveWith() 和 resolve() 是一样的，只不过可以传参数 resolveWidth("指向",[jQuery] 就是参数 )
		 * 可以理解为 document 就是 fn 的指向， [jQuery] 就是 fn 的参数
		 * $(function(arg){ console.log(this); // document; console.log(arg); // jQuery 函数 })
		 */
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events、
		/*
		 * 主动触发事件，这种写法会进入这个 if， $(document).on("ready",function(){});
		 * 先判断有没有主动触发的方法，有的话就调用 ready()，在取消掉
		 */
		if ( jQuery.fn.trigger ) {
			jQuery( document ).trigger("ready").off("ready");
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	/*
	 * 原生的函数 (alert)，或者 DOM 方法，在低版本的 IE 返回 object，而不是 function
	 */
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	/*
	 * 使用 ECMA5 原生的
	 */
	isArray: Array.isArray,

	isWindow: function( obj ) {
		/*
		 * obj!=null 意思是除了null 和 undefined 以外都可以走到后面那句，因为 null 和 undefined 是不会有属性的，防止报错
		 * window.window 的意思就是全局对象下的浏览器窗口
		 */
		return obj != null && obj === obj.window;
	},

	isNumeric: function( obj ) {
		/*
		 * parseFloat() 不能转的就是返回 NaN，能转的就是数字，isNaN() 判断是否是 NaN
		 * 如果传进来的是 123 isNaN(123) -> false -> !false -> true
		 * 如果传进来的是 NaN parseFloat(NaN) -> NaN -> isNaN(NaN) -> true -> !true -> false
		 * isFinite() 判断是否是个有限的数字   isFinite(123) -> true
		 * 总结：就是判断能不能转数字，并且是要一个有限的数字
		 */
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	/*
	 * 判断数据类型
	 */
	type: function( obj ) {
		if ( obj == null ) {
			/*
			 * 把 null 和 undefined 类型 转为字符串 -> ( "null"、"undefined" )
			 */
			return String( obj );
		}

		// Support: Safari <= 5.1 (functionish RegExp)
		/*
		 * 解释：在老版本的 chrone 和 safari typeof RegExp 返回的是 "function"，正常的应该返回 "object"
		 */

		/*
		 * core_toString -> class2type.toString，class2type 存的是 {}
		 * {}.toString.call([]) == "[object Array]"
		 * typeof obj === "object" || typeof obj === "function" 这两个都不满足的话肯定是基本类型，那么 typeof 就能够判断
		 * 这个双重判断就是为了兼容低版本的浏览器
		 * class2type[ core_toString.call(obj) ] 就是找属性的方式 搜索这个注释找到相应的代码 // Populate the class2type map
		 * class2type[ core_toString.call(obj) ] -> 这个属性就会返回对应的 value 值  array
		 */
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ core_toString.call(obj) ] || "object" :
			typeof obj;
	},

	/*
	 * 判断是否是对象字面量 ( var obj={}; var obj = new Object() ) 只有这两种返回 true
	 */
	isPlainObject: function( obj ) {
		// Not plain objects:
		// - Any object or value whose internal [[Class]] property is not "[object Object]"
		// - DOM nodes
		// - window
		/*
		 * 不满足条件的就会返回 false
		 * 如果把一个 DOM 节点 放到 jQuery.type(DOM); 会返回 object，DOM 节点肯定有 nodeType 排除 DOM 节点
		 * jQuery.type(window); 会返回 object ，所以在判断下是不是 window
		 */
		if ( jQuery.type( obj ) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		// Support: Firefox <20
		// The try/catch suppresses exceptions thrown when attempting to access
		// the "constructor" property of certain host objects, ie. |window.location|
		// https://bugzilla.mozilla.org/show_bug.cgi?id=814622
		/*
		 * 这里是针对 window.location 这类方法，因为 jQuery.type(window.location); 返回 object 他又不是 DOM，也不是 window
		 * core_hasOwn -> {}.hasOwnProperty -> 判断对象下的属性是不是自身下面的
		 * 所有对象都继承 Object 只有 Object 才有 isPrototypeOf 属性，其他对象都是通过原型链查找到的
		 * 那么 Object.hasOwnPrototypeOf("isPrototypeOf") 一定返回 true，其他的比如 Array 下肯定没有 "isPrototypeOf"，那么肯定返回 false
		 * core_hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) 这只有对象自变量才会返回 true
		 * isPrototypeOf() 其实是判断属性和原型之间的关系
		 * 这里的 try 是处理 Firefox < 20 情况下，window.location 频繁调用的时候，会出现递归泄漏的情况
		 */
		try {
			if ( obj.constructor &&
					!core_hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
				return false;
			}
		} catch ( e ) {
			return false;
		}

		// If the function hasn't returned already, we're confident that
		// |obj| is a plain object, created by {} or constructed with new Object
		return true;
	},

	/*
	 * 判断对象是否为空 {}、[]、空构造函数 都会返回 true
	 */
	isEmptyObject: function( obj ) {
		var name;
		/*
		 * 不可枚举属性的实例属性不会出现在 for-in 循环中
		 */
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	// data: string of html
	// context (optional): If specified, the fragment will be created in this context, defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	/*
	 * $("<li></li>") -> $.parseHTML() -> context.createElement( parsed[1] )
	 * $("<li></li><li></li>") -> $.parseHTML() -> jQuery.buildFragment( [ data ], context, scripts )
	 */
	parseHTML: function( data, context, keepScripts ) {
		/*
		 * 如果不是字符串就直接 return null
		 */
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		/*
		 * 对第二个参数的容错，如果没有传，传了 true、false 直接赋值给第三个参数
		 */
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}
		/*
		 * 默认指定 document，这个上下文只能是 document，只不过可能是 iframe 下的 document
		 */
		context = context || document;

		/*
		 * rsingleTag 这个是个正则，判断是不是单标签
		 */
		var parsed = rsingleTag.exec( data ),
		    /*
		     * scripts 默认是 false ( 就是没有传这个参数 )，那么此时 scripts = []
		     */
			scripts = !keepScripts && [];

		// Single tag
		/*
		 * 如果是单标签直接创建
		 */
		if ( parsed ) {
			return [ context.createElement( parsed[1] ) ];
		}

		/*
		 * 处理多标签的情况，创建多个标签，这里会把 scripts 标签创建出来放到数组里面
		 */
		parsed = jQuery.buildFragment( [ data ], context, scripts );

		/*
		 * scripts - > [scripts] -> 然后把这个标签 remove 掉
		 * 如果传的是 false ，那么就不会删除，script 就会留下
		 */
		if ( scripts ) {
			jQuery( scripts ).remove();
		}

		/*
		 * parsed.childNodes 得到的是 DOM 节点，通过 merge 转为节点数组
		 * 然后上面 在 merge 转为 json ， 但是 json 格式一定是这样子的类数组格式
		 * 比如 $("<li></li>") 就会走 "if ( match[1] )" 搜索下看到相应的代码，最终形成 Object {0:li,1:li,length:2,....}
		 */
		return jQuery.merge( [], parsed.childNodes );
	},

	/*
	 * 把字符串转为 json
	 * var str = '{"name":"iceman"}';  $.parseJSON(str).name;
	 * JSON.parse 是 ECMA5 提供的方法，对应的把 json 变成字符串 -> JSON.stringify()
	 */
	parseJSON: JSON.parse,

	// Cross-browser xml parsing
	/*
	 * 把字符串的 XML 形式解析成 XML 文档的 document 对象
	 */
	parseXML: function( data ) {
		var xml, tmp;
		/*
		 * 数据为空或者不是字符串类型直接 return null;
		 */
		if ( !data || typeof data !== "string" ) {
			return null;
		}

		// Support: IE9
		try {
			/*
			 * 解析 XML 的实例对象的方法
			 */
			tmp = new DOMParser();
			xml = tmp.parseFromString( data , "text/xml" );
		} catch ( e ) {
			/*
			 * 处理不合法的 XML，在 IE9 中会报错，在其他的浏览器不会报错，会创建 <parsererror></parsererror>
			 */
			xml = undefined;
		}

		if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	/*
	 * 空函数，写插件的时候会用到
	 */
	noop: function() {},

	// Evaluates a script in a global context
	globalEval: function( code ) {
		var script,
				indirect = eval;  /* eval 存成变量就是 window.eval 是全局的 */

		code = jQuery.trim( code );

		if ( code ) {
			// If the code includes a valid, prologue position
			// strict mode pragma, execute code by injecting a
			// script tag into the document.
			/*
			 * 这里的 if，是为了处理严格模式，在严格模式下是不支持 eval() 解析的
			 */
			if ( code.indexOf("use strict") === 1 ) {
				script = document.createElement("script");
				script.text = code;
				/*
				 * 把内容添加到 head 后，就把 <script> 标签删除了
				 */
				document.head.appendChild( script ).parentNode.removeChild( script );
			} else {
			// Otherwise, avoid the DOM node creation, insertion
			// and removal by using an indirect global eval
				indirect( code );
			}
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	/*
	 * 转驼峰( 内部使用 )
	 */
	camelCase: function( string ) {
		/*
		 * IE 下特殊处理 -ms-transform -> msTransform，其他的都是 -moz-transform -> MozTransform
		 * rmsPrefix => /^-ms-/  找到 ms 转为 ms-， 那么第一个字母就不会大写了
		 * rdashAlpha = /-([\da-z])/gi 找到 "-" + "任意字母或数字转为大写" -l => L -2d=> 2d
		 * fcamelCase : 是一个回调函数，找到正则中的子项，匹配到的字符转成大写，在替换正则这个整体
		 */
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	/*
	 * 是否是指定节点名，内部使用，如 : $.nodeName(document.documentElement,"html");  // true
	 */
	nodeName: function( elem, name ) {
		/*
		 * 在不同的浏览器下，nodeName 获取到的名字可能是大写的，所以要统一转成小写
		 */
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	/*
	 * args 是内部使用的
	 */
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length, /* 数组和类数组是有 length，而 json 是没有的 */
			/*
			 * isArraylike() 判断是不是类数组或者数组，返回 false 就是 json，注意 jQurey 对象的 this 返回 true，因为他是特殊的一种格式的 json
			 */
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					/*
					 * 内部使用的时候是不定参数 args，所以用的是 apply
					 */
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					/*
					 * callback.call( obj[ i ], i, obj[ i ] ); 第一个参数是修改指向，后面那个是 i，最后一个是 value
					 */
					value = callback.call( obj[ i ], i, obj[ i ] );

					/*
					 * 这句就是在 each() 中写了 return false; 就会跳出循环
					 */
					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					/*
					 * json 通过 for-in
					 */
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	trim: function( text ) {
		/*
		 * core_trim = core_version.trim，core_version = "2.0.3"
		 * "2.0.3".trim.call( text );  trim 是 ECMA5 自带的原生的方法
		 */
		return text == null ? "" : core_trim.call( text );
	},

	// results is for internal usage only
	/*
	 * 第二个参数是内部使用的
	 */
	makeArray: function( arr, results ) {
		/*
		 * 这句是看有没有第二个参数，如果有的话就是 {length:0}，没有的话就是[]
		 */
		var ret = results || [];

		if ( arr != null ) {
			/*
			 * Object(arr) 把 arr 放在 Object 中，是因为 isArraylike() 内部私有的方法只能针对的是对象，判断不了像 123 这种参数
			 * isArraylike( Object(123) ) 实际的是返回 false，因为没有 length，那么就会走 else
			 * isArraylike( Object("hello") ) 字符串调用 Object，会有 length，只要有长度就是会为 true
			 */
			if ( isArraylike( Object(arr) ) ) {
				/*
				 * 最后还是调用的是 merge，在内部可以转成特殊形式的 json
				 * 这里有个判断，如果是字符串的话，就直接放到了数组里面，如果是 arguments ，或者 nodeList 就用 merge 转换
				 */
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				/*
				 * core_push = core_deletedIds.push，core_deletedIds 变量就是 []
				 * 其实最后是调用 [].call([],arr);   [].call([],123); 把 123 添加进去了
				 */
				core_push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		/*
		 * core_indexOf = core_deletedIds.indexOf ->  [].indexOf()
		 * $.inArray("w",["a","b","c","d"])
		 * i 是起始的位置，就是从哪里开始查起
		 */
		return arr == null ? -1 : core_indexOf.call( arr, elem, i );
	},

	/*
	 * 对外就是合并数组，对内是转特定格式的 json
	 */
	merge: function( first, second ) {
		var l = second.length,
			i = first.length,
			j = 0;
		/*
		 * 这个是判断第二个参数是不是 json，因为 json 是没有长度的
		 * $.merge(["a","b"],["c","d"])、$.merge(["a","b"],{0:"c",1:"d"}) 一般都是外部使用
		 * if -> $.merge(["a","b"],["c","d"])
		 * else -> $.merge(["a","b"],{0:"c",1:"d"}); 、$.merge({0:"a",1:"b",length:2},{0:"c",1:"d"});、$.merge({0:"a",1:"b",length:2},["c","d"]);
		 */
		if ( typeof l === "number" ) {
			for ( ; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}
		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		/*
		 * 改变 length 值
		 */
		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var retVal,
			ret = [],
			i = 0,
			length = elems.length; // 获取数组的长度
		inv = !!inv; // 如果不写第三个参数的时候就是 undefined， !!undefined => false

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			/*
			 * callback( elems[ i ], i) elems[ i ] 每一个操作的元素, i 下标
			 * !!callback( elems[ i ], i ) 这里也是做了类型转换，根据返回的值自动的转为 true、false
			 */
			retVal = !!callback( elems[ i ], i );
			/*
			 * 如果第三个参数没有传，那么就会把返回 true 的元素添加到 ret 中
			 * 如果传了第三个参数，正好就会把条件相反的添加到 ret 中
			 */
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	/*
	 * 最后一个参数是内部使用的
	 */
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their
		/*
		 * 数组、类数组、特殊的 json
		 */
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					/*
					 * 把结果添加到新数组中，添加过一次 ret.length 就会自动累加
					 */
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			/*
			 * 如果 elems 是 json 就会走这里
			 */
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		/*
		 * 避免得到复合数组 core_concat = core_deletedIds.concat => [].concat.apply([],ret)
		 * [1,2,3,4]. $.map( arr , function(n){
		 *	   return [n+1];
		 * } );
		 * console.log( arr );  // [2,3,4,5]
		 */
		return core_concat.apply( [], ret );
	},

	// A global GUID counter for objects
	/*
	 * 唯一的标识符，在 jQuery 中与事件的操作有很大的关系
	 * 通过他可以把事件和函数关联在一起，方便查找和删除
	 */
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	/*
	 * 修改 this 指向
	 */
	proxy: function( fn, context ) {
		var tmp, args, proxy;

		/*
		 * 这个判断是为了支持简写的方式
		 * var obj = {
		 *     show: function () {
		 *         alert(this);
		 *     }
		 * };
		 * $.proxy(obj,"show") ->  $.proxy(obj.show,obj)
		 */
		if ( typeof context === "string" ) {
			/*
			 * fn[context] -> obj.show
			 */
			tmp = fn[ context ];
			/*
			 * context -> obj
			 */
			context = fn;
			/*
			 * fn -> obj.show
			 */
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		/*
		 * 这段是为了处理这两种形式：1、$.proxy(show, document)(3, 4); 2、$.proxy(show, document, 3)(4);
		 * 拿第二个举例子：
		 * arguments -> (show, document, 3) 那么首先要去掉前2个参数，从第三个参数开始是需要合并的参数，此时的 args 就是 3
		 * core_slice.call( arguments ) -> [].slice.call( arguments ) 转成真正的数组，然后和前面的数组合并
		 */
		args = core_slice.call( arguments, 2 );
		proxy = function() {
			/*
			 * 这里的 arguments 是 [4] 了，fn.apply 就相当于调用了所要执行的函数，那么 arguments 就是这里面的 "(4)"
			 */
			return fn.apply( context || this, args.concat( core_slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		/*
		 * 设置唯一标识，处理事件的时候或者删除的时候有用到
		 */
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		/*
		 * 返回函数，相当于$.proxy(show, document, 3)() 调用了 proxy -> 那就会执行这个函数
		 */
		return proxy;
	},

	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	/*
	 * 内部使用，多功能值的操作，如：$("div").css({"width":"100px","height":"100px"});
	 * elems：操作的元素( 可能是个集合 )、fn：回调函数、key：就是 json 中的 "width"、value：就是 json 中的 "100px"
	 * chainable：为 true 说明现在要设置，为 false 就说明要获取
	 */
	access: function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			length = elems.length,
			/*
			 * key("width") 和 null 进行比较，如果为 null，bulk = true / key 有值，bulk = false
			 */
			bulk = key == null;

		// Sets many values
		/* 设置多组值， 此时的 key = {"width":"100px","height":"100px"}，那就是设置值了，所以 chainable = true; */
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				/*
				 * 递归调用，相当于重新调用了 $("div").css("width","100px")、$("div").css("height","100px")
				 */
				jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
			}

		// Sets one value
		/*
		 * 设置一组值
		 */
		} else if ( value !== undefined ) {
			chainable = true;
		    /*
		     * 判断 value 是否是个函数，如果是个字符串，那么 raw = true
		     */
			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}
			/*
			 * 如果说没有 key 值的情况下
			 */
			if ( bulk ) {
				// Bulk operations run against the entire set
				/*
				 * raw = true，那说明 value 是个字符串
				 */
				if ( raw ) {
					fn.call( elems, value );
					fn = null;

				// ...except when executing function values
				} else {
					bulk = fn;
					/*
					 * fn 这里并不执行，只是套了一层函数
					 */
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}
			/*
			 * 有 key 值的情况下，fn 存在，就调用 fn()
			 * raw ? value : value.call( elems[i], i, fn( elems[i], key ) )
			 * raw = true，那么 value 肯定是字符串，如果 raw = false，那么 value 就是函数
			 */
			if ( fn ) {
				for ( ; i < length; i++ ) {
					fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
				}
			}
		}
		/*
		 * 这里是获取值，chainable = true 就返回 elems，方便链式操作
		 * chainable = false 就是获取值
		 * bluk = true; 没有 key 值的情况下，触发回调函数 bluck = false; 有 key 值
		 * 在判断 length 存不存在，length 存在就是有元素，直接走 fn()， 不存在就返回 emptyGet
		 * emptyGet 一般不写，就是 undefined
		 */
		return chainable ?
			elems :

			// Gets
			/*
			 * $("div").css("width");
			 */
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: Date.now,

	// A method for quickly swapping in/out CSS properties to get correct calculations.
	// Note: this method belongs to the css module but it's needed here for the support module.
	// If support gets modularized, this method should be moved back to the css module.
	/*
	 * CSS交换，内部使用，可以让 jQuery 获取到隐藏元素的值
	 * 原理：先把 display:none; 存起来，在设置 CSS 为：display:block;visibility:hidden;position:absolute;
	 * 然后把获取到的值存起来，最后把 display:none; 替换回来
	 */
	swap: function( elem, options, callback, args ) {
		var ret, name,
			/*
			 * 存老的样式
			 */
			old = {};

		// Remember the old values, and insert the new ones
		/*
		 * 把所有老样式存在 old 中
		 */
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			/*
			 * 把 display:block;visibility:hidden;position:absolute; 给到当前元素
			 */
			elem.style[ name ] = options[ name ];
		}
		/*
		 * 这句话的作用就是类似获取宽度值
		 */
		ret = callback.apply( elem, args || [] );

		// Revert the old values
		/*
		 * 样式还原
		 */
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	}
});

jQuery.ready.promise = function( obj ) {
	/*
	 * 这个变量第一次是没有的，也就是说第一次可以进到 if，后续的就进不进去了
	 * 只要一次加载成功，后续都会出发
	 */
	if ( !readyList ) {

		/*
		 * jQuery.Deferred() 创建延迟对象
		 */
		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		/*
		 * document.readyState === "complete" 查看 DOM 是否已经加载好了，如果已经加载好了就没必要再去检测 DOM 是否加载完成
		 */
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			/*
			 * 不管这个判断走哪个，最终还是调用的是 jQuery.ready 这个工具方法
			 * setTimeout( jQuery.ready ); 这里加的 setTimeout 是为了防止 IE DOM 快加载完成的时候，document.readyState === "complete" 这个会提前触发
			 * 这种是个 Hack 的写法，保证在 IE 下是没问题的
			 */
			setTimeout( jQuery.ready );

		} else {
			// Use the handy event callback
			/* completed 就是对应调用的是上面定义的回调函数，搜索 completed =
			 * completed = function() {
			 *     document.removeEventListener( "DOMContentLoaded", completed, false );
			 *	   window.removeEventListener( "load", completed, false );
			 *	   jQuery.ready();
			 * };
		     * DOM 没有加载完成进行检测
			 */
			/* 
			 * DOMContentLoaded 是高于 load 的，那为什么要检测这两个，而不只检测 DOMContentLoaded
			 * 主要是因为有些浏览器会缓存 load，有可能在一些浏览器 (FF)，缓存了 load 以后会先触发 load 事件
			 * 为了保证第一时间走最快的 DOM 加载，所以就两个都写了
			 */
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );
		}
	}
	/*
	 * 返回 promise()，这个对象就是防止外面修改
	 */
	return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

/*
 * 类数组或者数组或者特殊 json 的判断，内部使用
 */
function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );
	/*
	 * 判断是不是 window，因为要避免在 window 下挂载一些类似 length 属性和下面的判断有冲突
	 */
	if ( jQuery.isWindow( obj ) ) {
		return false;
	}
	/*
	 * 判断是不是元素节点并且 length 是否大于 0，如果都满足肯定是一组元素节点的类数组
	 */
	if ( obj.nodeType === 1 && length ) {
		return true;
	}
	/*
	 * 先判断了 type !== "function" ，因为函数也是对象，也可以挂载类似 length 属性，但是函数不是我们要的，所以要排除掉
	 * 这句是判断特殊的 json 或者 arguments ( 类数组 )
	 * ( length === 0 || typeof length === "number" && length > 0 && ( length - 1 ) in obj )
	 * 如果一个函数的 arguments 长度为 3 那么 (3-1) in arguments -> true
	 * length === 0 是针对函数没有参数的情况下，如果不写 length === 0，那么 arguments = 0; (0-1) in arguments -> false，就有问题了
	 */
	return type === "array" || type !== "function" &&
		( length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj );
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
/*!
 * Sizzle CSS Selector Engine v1.9.4-pre
 * http://sizzlejs.com/
 *
 * Copyright 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-06-03
 */
(function( window, undefined ) {

var i,
	support,
	cachedruns,
	Expr,
	getText,
	isXML,
	compile,
	outermostContext,
	sortInput,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + -(new Date()),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	hasDuplicate = false,
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}
		return 0;
	},

	// General-purpose constants
	strundefined = typeof undefined,
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf if we can't use a native one
	indexOf = arr.indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
		"*(?:([*^$|!~]?=)" + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

	// Prefer arguments quoted,
	//   then not containing pseudos/brackets,
	//   then attribute selectors/non-parenthetical expressions,
	//   then anything else
	// These preferences are here to reduce the number of selectors
	//   needing tokenize in the PSEUDO preFilter
	pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rsibling = new RegExp( whitespace + "*[+~]" ),
	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			// BMP codepoint
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
		return [];
	}

	if ( documentIsHTML && !seed ) {

		// Shortcuts
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, context.getElementsByTagName( selector ) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getElementsByClassName && context.getElementsByClassName ) {
				push.apply( results, context.getElementsByClassName( m ) );
				return results;
			}
		}

		// QSA path
		if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
			nid = old = expando;
			newContext = context;
			newSelector = nodeType === 9 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && context.parentNode || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key += " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = attrs.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Detect xml
 * @param {Element|Object} elem An element or a document
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var doc = node ? node.ownerDocument || node : preferredDoc,
		parent = doc.defaultView;

	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Set our document
	document = doc;
	docElem = doc.documentElement;

	// Support tests
	documentIsHTML = !isXML( doc );

	// Support: IE>8
	// If iframe document is assigned to "document" variable and if iframe has been reloaded,
	// IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
	// IE6-8 do not support the defaultView property so parent will be undefined
	if ( parent && parent.attachEvent && parent !== parent.top ) {
		parent.attachEvent( "onbeforeunload", function() {
			setDocument();
		});
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Check if getElementsByClassName can be trusted
	support.getElementsByClassName = assert(function( div ) {
		div.innerHTML = "<div class='a'></div><div class='a i'></div>";

		// Support: Safari<4
		// Catch class over-caching
		div.firstChild.className = "i";
		// Support: Opera<10
		// Catch gEBCN failure to find non-leading classes
		return div.getElementsByClassName("i").length === 2;
	});

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && documentIsHTML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== strundefined ) {
				return context.getElementsByTagName( tag );
			}
		} :
		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== strundefined && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			div.innerHTML = "<select><option selected=''></option></select>";

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {

			// Support: Opera 10-12/IE8
			// ^= $= *= and empty values
			// Should not select anything
			// Support: Windows 8 Native Apps
			// The type attribute is restricted during .innerHTML assignment
			var input = doc.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "t", "" );

			if ( div.querySelectorAll("[t^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */

	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = rnative.test( docElem.contains ) || docElem.compareDocumentPosition ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = docElem.compareDocumentPosition ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition( b );

		if ( compare ) {
			// Disconnected nodes
			if ( compare & 1 ||
				(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

				// Choose the first element that is related to our preferred document
				if ( a === doc || contains(preferredDoc, a) ) {
					return -1;
				}
				if ( b === doc || contains(preferredDoc, b) ) {
					return 1;
				}

				// Maintain original order
				return sortInput ?
					( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
					0;
			}

			return compare & 4 ? -1 : 1;
		}

		// Not directly comparable, sort on existence of method
		return a.compareDocumentPosition ? -1 : 1;
	} :
	function( a, b ) {
		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Parentless nodes are either documents or disconnected
		} else if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return doc;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch(e) {}
	}

	return Sizzle( expr, document, null, [elem] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val === undefined ?
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null :
		val;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		for ( ; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (see #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[5] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] && match[4] !== undefined ) {
				match[2] = match[4];

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {
							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];

						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
			//   not comment, processing instructions, or others
			// Thanks to Diego Perini for the nodeName shortcut
			//   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType === 4 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

function tokenize( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( tokens = [] );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
}

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var data, cache, outerCache,
				dirkey = dirruns + " " + doneName;

			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {
							if ( (data = cache[1]) === true || data === cachedruns ) {
								return data === true;
							}
						} else {
							cache = outerCache[ dir ] = [ dirkey ];
							cache[1] = matcher( elem, context, xml ) || cachedruns;
							if ( cache[1] === true ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	// A counter to specify which element is currently being matched
	var matcherCachedRuns = 0,
		bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, expandContext ) {
			var elem, j, matcher,
				setMatched = [],
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				outermost = expandContext != null,
				contextBackup = outermostContext,
				// We must always have either seed elements or context
				elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1);

			if ( outermost ) {
				outermostContext = context !== document && context;
				cachedruns = matcherCachedRuns;
			}

			// Add elements passing elementMatchers directly to results
			// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
			for ( ; (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
						cachedruns = ++matcherCachedRuns;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !group ) {
			group = tokenize( selector );
		}
		i = group.length;
		while ( i-- ) {
			cached = matcherFromTokens( group[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	}
	return cached;
};

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function select( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		match = tokenize( selector );

	if ( !seed ) {
		// Try to minimize operations if there is only one group
		if ( match.length === 1 ) {

			// Take a shortcut and set the context if the root selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					support.getById && context.nodeType === 9 && documentIsHTML &&
					Expr.relative[ tokens[1].type ] ) {

				context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
				if ( !context ) {
					return results;
				}
				selector = selector.slice( tokens.shift().value.length );
			}

			// Fetch a seed set for right-to-left matching
			i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
			while ( i-- ) {
				token = tokens[i];

				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( runescape, funescape ),
						rsibling.test( tokens[0].type ) && context.parentNode || context
					)) ) {

						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, seed );
							return results;
						}

						break;
					}
				}
			}
		}
	}

	// Compile and execute a filtering function
	// Provide `match` to avoid retokenization if we modified the selector above
	compile( selector, match )(
		seed,
		context,
		!documentIsHTML,
		results,
		rsibling.test( selector )
	);
	return results;
}

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome<14
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
	// Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return (val = elem.getAttributeNode( name )) && val.specified ?
				val.value :
				elem[ name ] === true ? name.toLowerCase() : null;
		}
	});
}

jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})( window );
// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	/*
	 * 用空格分隔单词，匹配空格分隔开，例如："once memory"
	 * core_rnotwhite = /\S+/g   =>  ["once", "memory"]
	 */
	jQuery.each( options.match( core_rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	/* 如果是字符串，就按照空格切分，例如："once memory"
	 * options : { once : true , memory : true }、optionsCache : {"once memory" : { once : true , memory : true }}
	 */
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// Flag to know if list is currently firing
		firing,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true; /* 说明已经 fire() 过一次了 */
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true; /* 触发进行时 */
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				/*
				 * data[0] 对应的就是执行环境，data[1] 就是 "hello"
				 * 当每个回调函数中 return false; 或者写了 stopOnFalse 的话，就跳出循环不会往后执行了
				 */
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;  /* 触发结束 */
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						/*
						 * 这里把 stack 中的第一个取出来，在重新进行 fire()
						 */
						fire( stack.shift() );
					}
				} else if ( memory ) {
					/*
					 * var cb = $.Callbacks("once memory"); cb.add( aaa );cb.fire();cb.add( bbb );cb.fire(); // 这句就是执行了空数组了
					 * 有 "once" 参数的时候，就只执行一次，清空 list ( 等于讲下次在调用 cb.fire()的时候就是执行的是空数组 )，再有 memory 的时候
					 * 没有 memory 的时候走的是 self.disable();
					 */
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				/*
				 * 一上来的时候，list=[] => true
				 */
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					/*
					 * 这里是针对这一的写法 cb.add(aaa,bbb);
					 */
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							/*
							 * 如果是 function，就 push 到 list 中
							 */
							if ( type === "function" ) {
								/*
								 * 看看有没有 unique 参数，有的话，就会走后面 !self.has(arg)
								 * self.has( arg ) 看看 arg( aaa,bbb ) 在数组中有没有存在
								 */
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								/*
								 * 针对 cb.add( [aaa,bbb] ); 这种情况的
								 */
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						/*
						 * 这里有个流程说明下，var memoryCb = $.Callbacks("memory"); memoryCb.add(aaa); memoryCb.fire(); memoryCb.add(ccc);
						 * 上来先 add 的时候，这里的 memory 是 false，然后 memory、fire()，源码中 fire() 的一句话就是 memory = options.memory && data;
						 * 此时 memory 就存起来了，在 memoryCb.add(ccc); 的时候就会进入这个 if(memory)，然后在调用 fire() 方法
						 */
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						/*
						 * 查看这个 arg 在 list 中 存不存在，存在的话并赋值给 index
						 */
						while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							/*
							 * 在数组中删除
							 */
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			/*
			 * 判断在 list 中有没有填加过 fn
			 * fn 不存在的时候，看看 list 有没有内容，有的话就会有长度，返回 true
			 */
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				firingLength = 0;
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				/*
				 * 阻止后续的操作
				 */
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				/*
				 * 是否是禁止的，list = undefined 就是是禁止的
				 */
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				/*
				 * fired 第一次调用的时候就是 undefined， !fired = true
				 * 第二次调用的时候，就要看 stack，stack = !options.once && []
				 * 如果有了 once 参数，那就返回 false，那么 if 就不会走就只会触发一次 fire()
				 * 如果没有传的话 stack = []，那就会进 if，可以再次执行 fire()
				 */
				if ( list && ( !fired || stack ) ) {
					args = args || [];
					/*
					 * 这里是针对传参的情况  cb.fire("hello");
					 * args 包含了作用域，和具体的参数两个值放进了数组中
					 * args.slice 就是判断是不是数组，是数组的话就直接 args.slice() 返回
					 */
					args = [ context, args.slice ? args.slice() : args ];
					/*
					 * 在之前内部 fire() 的时候，for 循环没有走完 firing = true
					 * 然后把 args 添加到 stack 中
					 */
					if ( firing ) {
						stack.push( args );
					} else {
						/*
						 * 这里就把 cb.fire("hello") 中的 "hello" 参数带到了每一个函数中
						 */
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				/*
				 * 判断有没有调用过 fire()，只要调用过一次 fired = true
				 */
				return !!fired;
			}
		};

	return self;
};
jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				/*
				 * 使用数组做映射关系，对应调用回调函数
				 * jQuery.Callbacks("once memory"); "once" 的作用就是只触发一次 resolve()，之后再触发就不起作用了
				 * setInterval(function(){
				 *     dfd.resolve();
				 * },1000);
				 */
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending", /* 默认是等待的状态 */
			promise = {
				state: function() {
					return state;
				},
				/*
				 * 不管成功或者失败都会走 always
				 */
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				/*
				 * 分别对应的函数是成功、失败、进行
				 */
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					/*
					 * 这里 return jQuery.Deferred() 是为了 给下面的 pipe() 使用
					 */
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var action = tuple[ 0 ],
								/*
								 * 找到参数中的每一个函数，判断是不是函数，如果不是函数就是 fn = false
								 */
								fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							/*
							 * 添加回调函数  deferred["done"](function(){})
							 */
							deferred[ tuple[1] ](function() {
								/*
								 * 如果是函数，就执行这个函数并且带入 arguments 例如：dfd.resolve("hi"); 此时的 arguments 就是 "hi"
								 */
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									/*
									 * 这里是提供给 pipe() 的，会直接出发 done | fail | progress
									 */
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									/*
									 * 如果返回的是字符串的情况
									 * var newDfd = dfd.pipe(function () {
									 *     return arguments[0] + " world";
									 * });
									 * fn ? [ returned ] : arguments fn 有的话取 return 的值，没有的话取 arguments
									 */
									newDefer[ action + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				/*
				 * 当传了 deferred 参数的时候，那就是 promise 所有的内容继承给 deferred，所以 deferred 即拥有自己的状态属性，又有 promise 下的所有方法
				 */
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		/*
		 * 兼容老版本，功能不太一样，但是代码是一样的 pipe 主要是延长 promise
		 */
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ], // 这里就是得到一个回调对象，jQuery.Callbacks("once memory")
				stateString = tuple[ 3 ];  // 状态

			// promise[ done | fail | progress ] = list.add
			/*
			 * 回调对象的 add 方法，赋值给了 promise，tuple[1] => "done"
			 */
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					/* 成功、失败 */
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				/*
				 * tuples[ i ^ 1 ][ 2 ].disable     ( i ^ 1 ) 就是位运算符  1^1=0、0^1=1
				 * 也就是类似取反的操作，如果是 done() 的状态，那么其余的状态都不会去触发 ( reject、notify )
				 * tuples[ 2 ][ 2 ].lock = jQuery.Callbacks("memory").lock
				 */
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			/*
			 * deferred 下面加了三个状态
			 */
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		/*
		 * deferred 继承了 promise
		 */
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			/*
			 * 如果延迟对象传了参数，就是立即执行，在把 deferred 在传入，这是在内部使用的
			 */
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			/*
			 * arguments(一些方法) 转成一个数组
			 */
			resolveValues = core_slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			/*
			 * 未完成的计数器有多少个，当 length = 0 ( 也就是没有传参数的情况 )，remaining = 0
			 * 当 length !=1，说明传了参数了，那么看 subordinate && jQuery.isFunction( subordinate.promise )
			 * subordinate 是参数肯定有为 true，在判断传入的函数是不是延迟对象，是就返回参数列表的长度
			 * 多个参数的时候，remaining 肯定是参数的长度
			 */
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			/*
			 * 当 remaining == 0 的时候，就会创建一个 Deferred 对象
			 * 当传入了 1 个参数，subordinate 是一个延迟对象的话，就赋值给 deferred，如果 subordinate 不是延迟对象，就会创建新的 Deferred 对象
			 * 一个参数的时候就会直接 return deferred.promise(); 其他代码都不走了
			 * 多个参数的时候，deferred = jQuery.Deferred 对象
			 */
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
					if( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) { /* 计数器减到 0 就会触发 resolveWith */
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		/*
		 * 多个参数的时候会进 if
		 */
		if ( length > 1 ) {
			/*
			 * 进行时候的值和作用域
			 */
			progressValues = new Array( length );
			progressContexts = new Array( length );
			/*
			 * 完成时候的作用域
			 */
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				/*
				 * 判断每一项是不是延迟对象
				 */
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						/*
						 * updateFunc 作用就是计数器减掉，并且当 remaining = 0 的时候，触发 resolveWith()
						 */
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						/*
						 * 只要有一个失败就会触发，最后肯定走 fail()
						 */
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					/*
					 * 不是延迟对象就减掉一个，过滤掉不是延迟对象的参数
					 */
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		/*
		 * 如果我们什么都没有等待，就会触发 resolveWith
		 * remaining = 0 取反就是 true，也就是未完成的是 0 个，触发 resolveWith ，说明 done 会立即执行
		 */
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		/* 返回延迟对象 */
		return deferred.promise();
	}
});
jQuery.support = (function( support ) {
	var input = document.createElement("input"),
		fragment = document.createDocumentFragment(),
		div = document.createElement("div"),
		select = document.createElement("select"),
		opt = select.appendChild( document.createElement("option") );

	// Finish early in limited environments
	/*
	 * 经过测试，所有 input 都有默认值 "text"，所以这句没有什么意义
	 */
	if ( !input.type ) {
		return support;
	}

	input.type = "checkbox";

	// Support: Safari 5.1, iOS 5.1, Android 4.x, Android 2.3
	// Check the default checkbox/radio value ("" on old WebKit; "on" elsewhere)
	/*
	 * 在老版本的 webkit 下是 false
	 * 检测出浏览器的差异后，需要解决这个问题，在所有浏览器下表现形式都是一样的，统一返回 "on"
	 * 搜索 "support.checkOn"
	 */
	support.checkOn = input.value !== "";

	// Must access the parent to make an option select properly
	// Support: IE9, IE10
	/*
	 * 在 FF，chrome 中，创建了下拉菜单，这个时候默认子项的第一项是被选中的，在 IE 下并不是
	 */
	support.optSelected = opt.selected;

	// Will be defined later
	/*
	 * 这三个是节点操作，需要等 DOM 加载完，所以初始化了一些值
	 */
	support.reliableMarginRight = true;
	support.boxSizingReliable = true;
	support.pixelPosition = false;

	// Make sure checked status is properly cloned
	// Support: IE9, IE10
	/*
	 * 正常情况让复选框选中，clone 出来的复选框也是选中状态，在 IE10、IE9 中 clone 出来的复选框是没有选中的，通过 Hooks 机制处理这兼容问题
	 */
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	/*
	 * 下拉菜单被禁止了，子项应该不会被禁止，只有在老版本的 webkit 会有问题，子项会被禁止
	 */
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Check if an input maintains its value after becoming a radio
	// Support: IE9, IE10
	input = document.createElement("input");
	/*
	 * 一定要先设置 value，在设置 type，如果先设置 type 再设置 value，所有浏览器都会返回 true
	 * 在 IE 下都是 false ( 包括 IE11 )，其实 IE 的值是 "on"
	 */
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "checked", "t" );
	input.setAttribute( "name", "t" );

	fragment.appendChild( input );

	// Support: Safari 5.1, Android 4.x, Android 2.3
	// old WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: Firefox, Chrome, Safari
	// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP)
	/*
	 * 只有 IE 支持 onfocusin
	 */
	support.focusinBubbles = "onfocusin" in window;

	/*
	 * 这个 div 首先是创建出来的，然后在 clone 一个 div，设置 backgroundClip = ""，在看之前的 div 的 backgroundClip 值是否改变 ( 其实任何与 background 有关系的 都会有这样的问题 )
	 * 正常情况下，修改 clone 元素是不会影响到原来的元素的，在 IE 下 都是会被 clone 的元素所影响到
	 */
	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, marginDiv,
			// Support: Firefox, Android 2.3 (Prefixed box-sizing versions).
			/*
			 * content-box：标准模式、border-box：怪异模式
			 */
			divReset = "padding:0;margin:0;border:0;display:block;-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box",
			body = document.getElementsByTagName("body")[ 0 ];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		container = document.createElement("div");
		/*
		 * margin-top:1px：在 jQuery1x..版本中是有用到的，比如 body.offsetTop;在这个版本中并没有使用
		 */
		container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";

		// Check box-sizing and margin behavior.
		body.appendChild( container ).appendChild( div );

		/*
		 * 这句也是在 jQuery1x..版本中是有用到的，这里并没有使用
		 */
		div.innerHTML = "";
		// Support: Firefox, Android 2.3 (Prefixed box-sizing versions).
		div.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%";

		// Workaround failing boxSizing test due to offsetWidth returning wrong value
		// with some non-1 values of body zoom, ticket #13543
		/*
		 * swap() 是 css 样式转换的方法，可以让 jQuery 获取到隐藏元素的值
		 * body.style.zoom 有值的时候，会影响到 div.offsetWidth 值，所以要统一一下
		 * offsetWidth = width + padding + border，但是上面设置了 box-sizing:border-box; 所以这些都是包括在 width 内的
		 */
		jQuery.swap( body, body.style.zoom != null ? { zoom: 1 } : {}, function() {
			support.boxSizing = div.offsetWidth === 4;
		});

		// Use window.getComputedStyle because jsdom on node.js will break without it.
		/* 在 nodejs 下是没有 window.getComputedStyle */
		if ( window.getComputedStyle ) {
			/* 只有在 Safari 下返回 1%，其他的浏览器返回的都是 px */
			support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			/* 在 IE 下如果是怪异模式，还有 padding 值，width - padding = width;结果在 IE 下 width 是 2px */
			support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

			// Support: Android 2.3
			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. (#3333)
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			marginDiv = div.appendChild( document.createElement("div") );
			marginDiv.style.cssText = div.style.cssText = divReset;
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";

			support.reliableMarginRight =
				!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
		}

		/* 移除创建好的元素 */
		body.removeChild( container );
	});

	return support;
})( {} );

/*
	Implementation Summary

	1. Enforce API surface and semantic compatibility with 1.9.x branch
	2. Improve the module's maintainability by reducing the storage
		paths to a single mechanism.
	3. Use the same single mechanism to support "private" and "user" data.
	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
	5. Avoid exposing implementation details on user objects (eg. expando properties)
	6. Provide a clear path for implementation upgrade to WeakMap in 2014
*/
var data_user, data_priv,
	rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
	rmultiDash = /([A-Z])/g;

function Data() {
	// Support: Android < 4,
	// Old WebKit does not have Object.preventExtensions/freeze method,
	// return new empty object instead with no [[set]] accessor
	/*
	 * Object.freeze(obj) 防止修改对象，只能获取
	 * Object.defineProperty( 属性所在对象,属性所在的对象属性名，一个描述符对象 )
	 * 在 this.cache 对象中默认添加了 "0" 这个属性，并且是不可修改的
	 * 为什么不能修改，假设一个文本节点设置了数据，他是返回空的 {}，那么如果这个时候在有个文本节点设置了数据，他还是返回 {}
	 * 如果这个是可以改的，那么第一个值改掉了，第二个值也随之改变了
	 */
	Object.defineProperty( this.cache = {}, 0, {
		get: function() {
			return {};
		}
	});

	/*
	 * 唯一的标识，用在 <div xxx=""></div>，这个标识就是表示 "xxx"
	 */
	this.expando = jQuery.expando + Math.random();
}

/*
 * this.cache{
 *     1:{},
 *     2:{}
 * }
 */
Data.uid = 1;

/*
 * 判断节点类型
 */
Data.accepts = function( owner ) {
	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	/*
	 * nodeType = 1 说明是元素、nodeType = 9 说明是 document，这些都是可以被分配的标识的
	 * 如 1->{"name":"aa"}、2->{"name":"bb"}..，这些是私有的，只有某个元素有，所以是可以被设置修改
	 * 除了上面的是不能被分配标识的就会返回默认的 "0"->{}，并且是共用的，会有很多不满足条件的会使用它
	 * 还有一些数组之类的是没有 nodeType ，也是可以分配的
	 */
	return owner.nodeType ?
		owner.nodeType === 1 || owner.nodeType === 9 : true;
};

Data.prototype = {
	key: function( owner ) {
		// We can accept data for non-element nodes in modern browsers,
		// but we should not, see #8335.
		// Always return the key for a frozen object.
		if ( !Data.accepts( owner ) ) {
			return 0;
		}

		var descriptor = {},
			// Check if the owner object already has a cache key
			/*
			 * $.data(document.body,"age",30); $.data(document.body,"job","it");
			 * owner 就是 body，然后把随机数放到了 body 上面
			 * 第一次肯定是没有的，找不到的话就分配一个，相同的元素是同一个 ID
			 */
			unlock = owner[ this.expando ];

		// If not, create one
		if ( !unlock ) {
			/*
			 * 分配一个标识
			 */
			unlock = Data.uid++;

			// Secure it in a non-enumerable, non-writable property
			/*
			 * 分配自定义属性
			 */
			try {
				descriptor[ this.expando ] = { value: unlock };
				/*
				 * 这里添加属性，只能获取不能修改
				 */
				Object.defineProperties( owner, descriptor );

			// Support: Android < 4
			// Fallback to a less secure definition
			} catch ( e ) {
				/*
				 * 通过 extend() 把自定义属性加到 body 上面
				 */
				descriptor[ this.expando ] = unlock;
				jQuery.extend( owner, descriptor );
			}
		}

		// Ensure the cache object
		if ( !this.cache[ unlock ] ) {
			this.cache[ unlock ] = {};
		}

		return unlock;
	},
	set: function( owner, data, value ) {
		var prop,
			// There may be an unlock assigned to this node,
			// if there is no entry for this "owner", create one inline
			// and set the unlock as though an owner entry had always existed
			/*
			 * 找到 ID
			 */
			unlock = this.key( owner ),
			/*
			 * 通过 ID 找到对应的 json
			 */
			cache = this.cache[ unlock ];

		// Handle: [ owner, key, value ] args
		if ( typeof data === "string" ) {
			cache[ data ] = value;

		// Handle: [ owner, { properties } ] args
		} else {
			// Fresh assignments by object are shallow copied
			/*
			 * 这个判断是不是没有什么意义，extend() 内部本来就是调用 for-in
			 */
			if ( jQuery.isEmptyObject( cache ) ) {
				jQuery.extend( this.cache[ unlock ], data );
			// Otherwise, copy the properties one-by-one to the cache object
			} else {
				for ( prop in data ) {
					cache[ prop ] = data[ prop ];
				}
			}
		}
		// console.log( this,this.expando );
		return cache;
	},
	get: function( owner, key ) {
		// Either a valid cache is found, or will be created.
		// New caches will be created and the unlock returned,
		// allowing direct access to the newly created
		// empty data object. A valid owner object must be provided.
		/*
		 * 先找到对应的 ID ，在缓存中找到对应的 json
		 */
		var cache = this.cache[ this.key( owner ) ];

		return key === undefined ?
			cache : cache[ key ];
	},
	/*
	 * 对于 get()、set(） 整合
	 */
	access: function( owner, key, value ) {
		var stored;
		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		if ( key === undefined ||
				((key && typeof key === "string") && value === undefined) ) {

			stored = this.get( owner, key );

			return stored !== undefined ?
				stored : this.get( owner, jQuery.camelCase(key) );
		}

		// [*]When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undefined ? value : key;
	},
	remove: function( owner, key ) {
		var i, name, camel,
			unlock = this.key( owner ),
			cache = this.cache[ unlock ];

		/*
		 * 不指定具体的 key 的时候，会删除所有的数据缓存
		 */
		if ( key === undefined ) {
			this.cache[ unlock ] = {};

		} else {
			// Support array or space separated string of keys
			/*
			 * 判断是不是数组， $.removeData(document.body,["age","job"])
			 */
			if ( jQuery.isArray( key ) ) {
				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				/*
				 * jQuery.camelCase 返回驼峰的形式 "all-mame" -> "allName"
				 */
				name = key.concat( key.map( jQuery.camelCase ) );
			} else {
				camel = jQuery.camelCase( key );
				// Try the string as a key before any manipulation
				/*
				 * key 在 cache 中存不存在
				 */
				if ( key in cache ) {
					name = [ key, camel ];
				} else {
					// If a key with the spaces exists, use it.
					// Otherwise, create an array by matching non-whitespace
					name = camel;
					/*
					 * 看看转完驼峰以后在不在 cache 中
					 */
					name = name in cache ?
						/*
						 * name.match( core_rnotwhite ) 是去掉空格后有没有 key
						 */
						[ name ] : ( name.match( core_rnotwhite ) || [] );
				}
			}

			i = name.length;
			while ( i-- ) {
				delete cache[ name[ i ] ];
			}
		}
	},
	hasData: function( owner ) {
		return !jQuery.isEmptyObject(
			this.cache[ owner[ this.expando ] ] || {}
		);
	},
	discard: function( owner ) {
		/*
		 * 删除的是一个整体 1:{"name","aa"} 删除的是 "1" 这个整体
		 */
		if ( owner[ this.expando ] ) {
			delete this.cache[ owner[ this.expando ] ];
		}
	}
};

// These may be used throughout the jQuery core codebase
/*
 * 对外的数据缓存对象
 */
data_user = new Data();
/*
 * 对内的数据缓存对象
 */
data_priv = new Data();


jQuery.extend({
	acceptData: Data.accepts,

	hasData: function( elem ) {
		return data_user.hasData( elem ) || data_priv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return data_user.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		data_user.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to data_priv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return data_priv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		data_priv.remove( elem, name );
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var attrs, name,
			/*
			 * 找到一组元素的第一个
			 */
			elem = this[ 0 ],
			i = 0,
			data = null;

		// Gets all values
		if ( key === undefined ) {
			/*
			 * 判断元素是否存在
			 */
			if ( this.length ) {
				/*
				 * 获取元素中的数据
				 */
				data = data_user.get( elem );

				/*
				 * 用来获取 HTML 中 data-* 的自定义数据
				 * data_priv.get( elem, "hasDataAttrs" ) 第一次进来肯定是 false，在取反
				 */
				if ( elem.nodeType === 1 && !data_priv.get( elem, "hasDataAttrs" ) ) {
					/*
					 * 获取元素所有属性的集合
					 */
					attrs = elem.attributes;
					for ( ; i < attrs.length; i++ ) {
						/*
						 * 获取属性名，如果要获取属性的值的话 attrs[i].value
						 */
						name = attrs[ i ].name;

						if ( name.indexOf( "data-" ) === 0 ) {
							/*
							 * 把 data- 截掉，然后转驼峰
							 */
							name = jQuery.camelCase( name.slice(5) );
							/*
							 * 这个方法就是把自定义属性 "data-*" 放到 $.data() 中
							 */
							dataAttr( elem, name, data[ name ] );
						}
					}
					/*
					 * 这里在设置一下，下次就不走了
					 */
					data_priv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		/*
		 * 设置多个属性值 $("div").data({name:"iceman",age:28})
		 */
		if ( typeof key === "object" ) {
			return this.each(function() {
				data_user.set( this, key );
			});
		}

		return jQuery.access( this, function( value ) {
			var data,
				camelKey = jQuery.camelCase( key );

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			/*
			 * 这个 if 走的都是获取的操作
			 */
			if ( elem && value === undefined ) {
				// Attempt to get data from the cache
				// with the key as-is
				data = data_user.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to get data from the cache
				// with the key camelized
				/*
				 * 转完驼峰再去找
				 */
				data = data_user.get( elem, camelKey );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				data = dataAttr( elem, camelKey, undefined );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return;
			}

			// Set the data...
			/*
			 * 设置
			 * 这里会处理一种特殊情况
			 * $("div").data("nameAge","hi");
			 * $("div").data("name-age","hello");
			 * this.cache ={
			 *     1:{
			 *         "nameAge":"hello",
			 *         "name-age":"hello"
			 *     }
			 * };
			 * 如果是只有 $("div").data("name-age","hello"); 只会出现 "nameAge":"hello"
			 */
			this.each(function() {
				// First, attempt to store a copy or reference of any
				// data that might've been store with a camelCased key.
				var data = data_user.get( this, camelKey );

				// For HTML5 data-* attribute interop, we have to
				// store property names with dashes in a camelCase form.
				// This might not apply to all properties...*
				data_user.set( this, camelKey, value );

				// *... In the case of properties that might _actually_
				// have dashes, we need to also store a copy of that
				// unchanged property.
				if ( key.indexOf("-") !== -1 && data !== undefined ) {
					data_user.set( this, key, value );
				}
			});
		/*
		 * null 对应的是 key ，因为 key 已经有了所以就不用传了
		 * arguments.length == 1 的话就是 false，那么这个回调函数就是获取操作
		 * 后面两个参数没什么用
		 */
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each(function() {
			data_user.remove( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	/*
	 * data === undefined 是为了如果之前 $.data() 设置过，然后又在 HTML 中也设置了同样的属性名，那么就不会再添加到 $.data() 中
	 * elem.nodeType === 1 是要一个元素
	 */
	if ( data === undefined && elem.nodeType === 1 ) {
		/*
		 * key 就是转完驼峰的属性名
		 * rmultiDash 是个正则，找大写的字母，在转成小写 例如： data-ice-name -> data-iceName -> data-ice-name
		 */
		name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();
		/*
		 * 通过属性名找到对应的属性的值
		 */
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
					// Only convert to a number if it doesn't change the string
					/*
					 * +data 就是转数字，这句就是判断是不是字符串的数字，如果是就存对应的数字
					 */
					+data + "" === data ? +data :
					/*
					 * 如果属性值是 "a100" 那么上面 +"a100" 就会变成 NaN，那么就会走最后一句，该什么就是什么
					 * rbrace 这个正则就是判断是不是一个 json，如果是的话，就把字符串的 json 转为真正的 json
					 */
					rbrace.test( data ) ? JSON.parse( data ) :
					data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			data_user.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}
jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			/*
			 * type 就是队列的名字，默认是 "fx"
			 */
			type = ( type || "fx" ) + "queue";
			/*
			 * 先去取一下 queue 存不存在
			 * $.queue(document,"q1",aaa); 第一次走 queue 肯定是没有的
			 * $.queue(document,"q1",bbb); 第二次走就有了
			 */
			queue = data_priv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			/*
			 * data 就是第三个参数
			 */
			if ( data ) {
				/*
				 * 第一次当 queue 没有的时候，就创建一个 data 缓存
				 * $.queue(document,"q1",[ccc]); 当第三个参数是个数组的时候，不管之前添加过多少个，都会被覆盖掉
				 */
				if ( !queue || jQuery.isArray( data ) ) {
					queue = data_priv.access( elem, type, jQuery.makeArray(data) );
				} else {
					/*
					 * 之后的几次直接添加到之前创建的 data 缓存中
					 */
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ), /* 获得队列 */
			startLength = queue.length,
			fn = queue.shift(), /* 找到队列数组的第一项 */
			hooks = jQuery._queueHooks( elem, type ),
			/* next() 就是出队的操作 */
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		/*
		 * "inprogress" 是针对 "fx" 的
		 *  之后的出队操作的时候，有 "inprogress" 的话就删除，然后长度减减
		 */
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {
			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			/*
			 * 这里 animate() 第一次调用的时候，就是默认 "fx"，然后直接在队列里面添加了 "inprogress"
			 * 就是第一次的时候直接执行出队的操作，后续就不会执行了
			 */
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			/*
			 * 这里在执行队列中的函数
			 */
			fn.call( elem, next, hooks );
		}

		/*
		 * 主动触发 remove 操作，清理缓存
		 */
		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
	/*
	 * 出队结束之后，在缓存中删除
	 */
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return data_priv.get( elem, key ) || data_priv.access( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				data_priv.remove( elem, [ type + "queue", key ] );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		/*
		 * 默认省略了 type
		 */
		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		/*
		 * 根据长度来判断是设置还是获取
		 * 获取的话，只查看一组元素的第一个元素
		 */
		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			/*
			 * 对每一个进行设置
			 */
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				/*
				 * 这里先设置一下 hooks，当上面调用的时候，data_priv.get( elem, key ) 这个就会找到，直接返回
				 */
				jQuery._queueHooks( this, type );

				/*
				 * 这里是针对运动，入完队以后直接出队
				 * $(this).animate({width:300},2000);
				 * $(this).animate({height:300},2000);
				 * $(this).animate({width:300},2000) 走这句的时候就会执行这里的出队操作
				 * 由于后续的操作不需要执行出队，所以加了这个 "inprogress"，第一次的时候 "inprogress" 这个肯定是没有的，走完了出队以后，"inprogress" 就有了
				 */
				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		/*
		 * jQuery.fx.speeds 这个是在运动中定义过的，可以写 "fast"、"slow"
		 */
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		/*
		 * 清除队列
		 */
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	/*
	 * 所有运动做完之后，可以进行 done() 的调用
	 * $(this).animate({width:300},2000).animate({left:200},2000);
	 * $(this).promise().done(function(){
	 *     console.log(1234);
	 * });
	 */
	promise: function( type, obj ) {
		var tmp,
			count = 1, /* 计数有多少个要执行的队列 */
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				/*
				 * 当所有的都出队了，就说明已经完成了，就会执行done()
				 */
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while( i-- ) {
			tmp = data_priv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var nodeHook, boolHook,
	rclass = /[\t\r\n\f]/g,
	rreturn = /\r/g,
	rfocusable = /^(?:input|select|textarea|button)$/i;

jQuery.fn.extend({
	attr: function( name, value ) {
		/*
		 * this：每一个元素
		 * jQuery.attr：回调方法 ( 实际调用的是工具方法中的 attr() )
		 * name -> value 键值对
		 * arguments.length > 1 决定是设置还是获取
		 */
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			/*
			 * 实际调用的是工具方法中的 removeAttr()
			 */
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		return this.each(function() {
			delete this[ jQuery.propFix[ name ] || name ];
		});
	},

	addClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,  // this 就是 $("div")
			proceed = typeof value === "string" && value; // 如果是字符串，就返回该字符串，如果不是，则返回 false

		/*
		 * 传了回调函数
		 * $("div").addClass(function(index){
		 *     return "box" + index;
		 * });
		 */
		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call( this, j, this.className ) );
			});
		}

		if ( proceed ) {
			// The disjunction here is for better compressibility (see removeClass)
			/*
			 * 通过正则把字符串中的空格分成数组 $("div").addClass("box1 box2");  classes = [box1,box2]
			 */
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			/*
			 * 循环每一个元素 $("div")
			 */
			for ( ; i < len; i++ ) {
				elem = this[ i ];
				/*
				 * 看看是不是元素节点，如果是其他节点 cur = false
				 * 先去找自身的 className 有没有，没有的话，就返回 cur = " " ( 空格 )
				 * 有的话，找到之前的 className，并且前后加上空格
				 * rclass 正则：匹配一些空白的字符 (回车、换行、换页)，替换成 " " 是空格，不是空， cur = elem.clssName
				 */
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					" "
				);

				/*
				 * 等于 " "，会返回真
				 */
				if ( cur ) {
					j = 0;
					/*
					 * clazz 存储所要添加的 class，判断是否在原来的 cur 中，没有找到就添加
					 */
					while ( (clazz = classes[j++]) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}
					elem.className = jQuery.trim( cur );

				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
		/*
			 * "&&" 优先级高于 "||" ， alert( 1 || 0 && 2 ) => 1
			 * 先计算 typeof value === "string" && value， arguments.length === 0 是没有写参数的时候，作用是删除所有 className
			 */
			proceed = arguments.length === 0 || typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call( this, j, this.className ) );
			});
		}
		if ( proceed ) {
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					""
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						// Remove *all* instances
						/*
						 * 当 clazz 存在再 cur 中，那就 replace() " "
						 */
						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}
					/*
					 * value ="" 或者不存在的时候，就删除所有
					 */
					elem.className = value ? jQuery.trim( cur ) : "";
				}
			}
		}

		return this;
	},

	/*
	 * stateVal = true 就是不管元素中有没有这个 className，都是添加操作
	 * stateVal = false 就是不管元素中有没有这个 className，都是删除操作
	 */
	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					classNames = value.match( core_rnotwhite ) || [];

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			/*
			 * 这里平时几乎用不到，不建议使用
			 * $("div").toggleClass(false)，就是删除已有的 className
			 * $("div").toggleClass(true) 通过缓存的形式在添加回去
			 */
			} else if ( type === core_strundefined || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					data_priv.set( this, "__className__", this.className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				this.className = this.className || value === false ? "" : data_priv.get( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[0]; // 获取集合中第一个元素

		/*
		 * 获取操作
		 */
		if ( !arguments.length ) {
			if ( elem ) {
				/*
				 * valHooks：option select radio checkbox 针对这四个获取做兼容处理
				 * jQuery.valHooks[ elem.type ] 当 elem 是一个 select，他的 type 是 select-one 那么在 valHooks 中是找不到的
				 * jQuery.valHooks[ elem.nodeName.toLowerCase() ] select 的 nodeName 还是 select 那么在 valHooks 就找到了
				 * elem 的 option.type 是 ""，所以又要走后面 option.nodeName 就是 option
				 */
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				/*
				 * 处理兼容问题，像 input 是没有兼容问题的就不会走这个 if
				 */
				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		/*
		 * 设置的时候是针对每一个元素的
		 */
		return this.each(function( i ) {
			var val;

			/*
			 * 判断一定是元素节点
			 */
			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			/*
			 * $("input").val(null)
			 */
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += ""; // 数字转字符串
			} else if ( jQuery.isArray( val ) ) {
				/*
				 * 针对数组 $("#input2").val(["hello"]);当 val 是数组的时候就不是设置值了，而是去匹配每一项，然后选中
				 * <input type="checkbox" id="input2" value="hello">
				 */
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			/*
			 * 如果不满足这些条件就直接 this.value = val; 满足了就在 set() 中进行操作
			 */
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

/*
 * 这些工具方法都是内部使用的
 */
jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// attributes.value is undefined in Blackberry 4.7 but
				// uses .value. See #6932
				/*
				 * 在 IE6 7 下 <option>111</option>  option.value 是空的，<option value="hello">111</option>这样写就可以找到 "hello"
				 * 那么 IE 6 7 下使用 text 做兼容， option.text 获取到的就是 111
				 * elem.attributes.value 在 IE 的高版本是 undefined，在 IE6 7 是 [object]，elem.attributes.value.specified 在 IE 6 7 下是 false
				 * 那么就会去找 elem.text 相应的内容
				 */
				var val = elem.attributes.value;
				return !val || val.specified ? elem.value : elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,  // 如果是单选的时候 one =true，有 multiple属性就是多选 one = false
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				/*
				 * 如果是单选的话，就只会循环一次
				 */
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// IE6-9 doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							/*
							 * jQuery.support.optDisabled 如果是禁用的元素是不会走这个 if 的
							 */
							( jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ), // 针对是数组
					i = options.length;

				while ( i-- ) {
					option = options[ i ];
					/*
					 * 相应的 select 选中 $("select").val(111); 然后 "111" 就会被选中
					 * value 值和相应的 option 值匹配成功就会选中
					 */
					if ( (option.selected = jQuery.inArray( jQuery(option).val(), values ) >= 0) ) {
						optionSet = true;
					}
				}

				// force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attr: function( elem, name, value ) {
		var hooks, ret,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		/*
		 * 当元素不存在的时候、是文本、是注释、是属性 这几个属性没办法设置就先过滤掉
		 */
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		/*
		 * 当元素不支持 getAttribute 的时候 ( typeof elem.getAttribute === undefined )
		 * 那就是用 prop() 代替 attr()，这种情况是出现在：$(document).attr("title","hello"); === $(document).prop("title","hello")
		 */
		if ( typeof elem.getAttribute === core_strundefined ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		/*
		 * nType = 1 就是元素节点，jQuery.isXMLDoc() -> Sizzle 中的方法，就是调用的是 Sizzle.isXML;就是判断当前节点是不是 XML 下的节点
		 * 那么一但是 XML 节点是不会走这个 if，如果是 HTML 下的元素节点是有兼容问题，就会走这个 if
		 */
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase(); // 统一转成小写
			/*
			 * hooks 机制，先通过 support 检测，然后通过 hooks 找到具体的方法，分为两种(set、get)，有获取到这个值，说明做到兼容了
			 * attrHooks 只是针对设置的，如果是这种情况 atrr("type","radio")
			 * jQuery.expr 是 Sizzle.selectors，它下面有个 match:matchExpr，matchExpr 这下面是一堆的正则表达式，找到 bool -> new RegExp( "^(?:" + booleans + ")$", "i" );
			 * 那么 booleans 是 "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped"
			 * 也就是正则去匹配 booleans， 就是说 jQuery.expr.match.bool 这个整体去匹配上面一串，然后 test(name)，在字符串中是否存在，存在就要做 boolHook，不存在就是 nodeHook ( undefined )
			 * boolHook 对应是下面一个 boolHook={ set:function(){}}
			 */
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
		}

		/*
		 * value !== undefined 就是设置的时候
		 */
		if ( value !== undefined ) {

			/*
			 * $("div").attr("ice",null); 当第二个参数是 null 的时候，调用的是 removeAttr();
			 */
			if ( value === null ) {
				jQuery.removeAttr( elem, name );

			} else if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				/*
				 * 首先 hooks 存在，并且是有 set() 方法，那么通过 set() 获取到这个值，这个值有的话就说明有值，做到兼容了
				 * 如果等于 undefined 就说明没有兼容性，就跳过
				 */
				return ret;

			} else {
				/*
				 * 没有兼容问题的时候，调用原生的 setAttribute(); 把 value 转为字符串的形式
				 */
				elem.setAttribute( name, value + "" );
				return value;
			}
			/*
			 * 获取
			 */
		} else if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {
			/*
			 * jQuery.find = Sizzle 就是 Sizzle 对象
			 * Sizzle.attr() 就是 getAttribute() 兼容的操作
			 * 例如：$("div").attr("title"); 调用的就是这里
			 */
			ret = jQuery.find.attr( elem, name );

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( core_rnotwhite ); // 匹配空格，返回的是一个数组 ["ice","href","id"]

		if ( attrNames && elem.nodeType === 1 ) {
			/*
			 * 删除多个属性 $("div").removeAttr("ice href id");
			 */
			while ( (name = attrNames[i++]) ) {
				/*
				 * jQuery.propFix[ name ]：看看有没有兼容问题 类似 class -> className
				 */
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( jQuery.expr.match.bool.test( name ) ) {
					// Set corresponding property to false
					elem[ propName ] = false;
				}

				elem.removeAttribute( name );
			}
		}
	},

	attrHooks: {
		type: {
			/*
			 * 只有设置有兼容问题，get ( 获取 )是没有的
			 */
			set: function( elem, value ) {
				/*
				 * 单选框的兼容，就是在 support里面有的，先设置 value，在设置 type 类型的时候，在 IE 下获取不到 value 值，IE 获取的是 "on"
				 */
				if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					/*
					 * 重新设置 type 类型，在去赋值 value 就没有问题了
					 * 先设置 type，在赋值是没有兼容问题的
					 */
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		/*
		 * 不是 XML 的就是有兼容问题
		 */
		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			return hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ?
				ret :
				( elem[ name ] = value );

		} else {
			return hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ?
				ret :
				elem[ name ];
		}
	},

	propHooks: {
		/*
		 * tabIndex：光标切换顺序，在 IE 下，不是 div 他也可以得到 tabIndex，所以要做兼容
		 * rfocusable：/^(?:input|select|textarea|button)$/i; 不是这些的统一返回 -1
		 */
		tabIndex: {
			get: function( elem ) {
				return elem.hasAttribute( "tabindex" ) || rfocusable.test( elem.nodeName ) || elem.href ?
					elem.tabIndex :
					-1;
			}
		}
	}
});

// Hooks for boolean attributes
/*
 * 针对的是这样的情况：$("input").attr("checked",true)
 * $("input").attr("checked","checked") -> $("input").attr("checked",true)
 */
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			/*
			 * elem.setAttribute("checked","checked");
			 */
			elem.setAttribute( name, name );
		}
		return name;
	}
};
jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = jQuery.expr.attrHandle[ name ] || jQuery.find.attr;

	jQuery.expr.attrHandle[ name ] = function( elem, name, isXML ) {
		var fn = jQuery.expr.attrHandle[ name ],
			ret = isXML ?
				undefined :
				/* jshint eqeqeq: false */
				// Temporarily disable this handler to check existence
				(jQuery.expr.attrHandle[ name ] = undefined) !=
					getter( elem, name, isXML ) ?

					name.toLowerCase() :
					null;

		// Restore handler
		jQuery.expr.attrHandle[ name ] = fn;

		return ret;
	};
});

// Support: IE9+
// Selectedness for an option in an optgroup can be inaccurate
/*
 * 下拉菜单的选中状态，在 IE 下创建的 select 有子项的话，默认是没有选中状态的，标准浏览器有
 */
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		}
	};
}

/*
* 把这里面的值转小写 tabIndex -> tabindex
* */
jQuery.each([
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
});

// Radios and checkboxes getter/setter
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			/*
			 * 判断是不是数组，相应的选中或者取消状态
			 */
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	};
	/*
	 * support.checkOn = false，在老版本的 webkit 就会走这个if，解决兼容问题，让这个值"" 变成 "on"
	 * 通过 jQuery 的 Hooks 机制，专门解决兼容问题的
	 */
	if ( !jQuery.support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			// Support: Webkit
			// "" is returned instead of "on" if a value isn't specified
			return elem.getAttribute("value") === null ? "on" : elem.value;
		};
	}
});
var rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = data_priv.get( elem ); // 第一次没有数据的时候返回的是空对象

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		/*
		 * 在绑定的函数下加 guid
		 */
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		/*
		 * 在缓存中添加 events 对象 var elemData = { events:{} };
		 */
		if ( !(events = elemData.events) ) {
			events = elemData.events = {};
		}

		/*
		 * 这个 handle 就是真正的事件函数   var elemData = { events:{},handle:function(e){} };
		 */
		if ( !(eventHandle = elemData.handle) ) {
			eventHandle = elemData.handle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				/*
				 * 通过 jQuery.event.dispatch，对后续的事件进行操作
				 */
				return typeof jQuery !== core_strundefined && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			/* 把元素挂载到对象上，与正真的操作分离，防止内存泄漏 */
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		/*
		 * 按照空格匹配，返回数组 "click mouseover" ["click","mouseover"]
		 */
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			/*
			 * 处理特殊情况的事件，例如 onmouseenter 是不兼容的，需要用 onmouseover 模拟
			 */
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			/*
			 * 定义不同事件的数组，var elemData = { events:{ click:[] }};
			 */
			if ( !(handlers = events[ type ]) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0; // 委托计数，并且委托会放到数组的最前面

				// Only use addEventListener if the special events handler returns false
				/*
				 * 这里一旦有模拟的事件，就走特殊的绑定事件，没有的话就走公用的
				 */
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					if ( elem.addEventListener ) {
						/*
						 * 事件绑定执行事件操作，必须是针对的是元素，所以要判断 elem.addEventListener，对象就不能绑定
						 */
						elem.addEventListener( type, eventHandle, false );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				/*
				 * 有委托的情况
				 */
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				/*
				 * 存储函数
				 */
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			/* 这里是想要做优化，有了一个全局的标识，但是并没有用 */
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		/*
		 * 防止内存泄漏
		 */
		elem = null;
		/*
		 * var elemData = {
		 *     events : {
		 *	       "click" : [      // arr 数组下有两个属性  arr.delegateCount 当前元素的委托的个数  arr.length = 2
		 *			    {},   //委托的,
		 *			    {
		 *				    data: undefined,
		 *				    guid: 3,  // 对应关系，是第几个添加的事件，3 说明是第三个绑定的 ( 根据绑定的顺序分配的 )
		 *				    handler: function (){},  // 绑定的事件函数 ( 普通函数 )
		 *				    namespace: "",  // 命名空间
		 *				    needsContext: false,  // 有委托的时候就是 false，没有委托是 undefined，当是 span:first ( 伪类的情况 ) 这种情况的时候是 true
		 *				    origType: "click", // 原始的 type 类型 ( mouseenter )，这个可能不兼容
		 *				    selector: "span", // 有委托，这里选择器就会有值
		 *				    type: "click"  // 现在的类型  ( mouseover )，需要用这个 type 进行模拟
		 *			    },
		 *			    {}
		 *		    ],
		 *		    "mouseover" : [
		 *			    {}
		 *		    ]
		 *    },
		 *	  handle : function(e){} // 真正的事件函数
		 * };
		 */
		console.log(elemData);
	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = data_priv.hasData( elem ) && data_priv.get( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		/*
		 * 这里的 types 就是 $("#span1").off("click");中的 click
		 */
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			/*
			 * 判断命名空间中有没有 type，没有 type 就是删除命名空间下所有的事件
			 */
			if ( !type ) {
				for ( type in events ) {
					/*
					 * 这里是针对命名空间的 $("#span1").off("click.aaa");
					 */
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					/*
					 * removeEventListener()
					 */
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				/*
				 * 针对自定义事件的时候删除
				 */
				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		/*
		 * 清空 events，说明什么事件都没有了
		 */
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;
			data_priv.remove( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special,
			eventPath = [ elem || document ],
			type = core_hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = core_hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf(":") < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join(".");
		event.namespace_re = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		/*
		 * noBubble = true 就是不能网上冒泡，就不会走这个 if
		 * 意图是找到所有的祖先节点，并且存起来
		 */
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === (elem.ownerDocument || document) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			/*
			 * 筛选出满足条件的父节点，并且调用执行
			 */
			handle = ( data_priv.get( cur, "events" ) || {} )[ event.type ] && data_priv.get( cur, "handle" );
			/*
			 * 主动触发函数执行
			 */
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		/*
		 * 有默认行为，并且没有阻止默认行为的时候
		 */
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( eventPath.pop(), data ) === false) &&
				jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && jQuery.isFunction( elem[ type ] ) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					elem[ type ]();
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	/*
	 * 派发事件的具体操作
	 */
	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		/*
		 * jQuery.event.fix 对 event 兼容处理
		 */
		event = jQuery.event.fix( event );

		var i, j, ret, matched, handleObj,
			handlerQueue = [],
			args = core_slice.call( arguments ),
			handlers = ( data_priv.get( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};  // jQuery.event.special 对事件兼容处理

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		/*
		 * preDispatch：事件触发前的一个方法，做特殊处理，但是源码中并没有用到，留了个接口供以后使用
		 */
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		/*
		 * jQuery.event.handlers 执行顺序的队列，委托的曾经越深，执行的越早
		 */
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		/*
		 * event.isPropagationStopped() 是否是冒泡，是就不走 while
		 * event.isPropagationStopped() 阻止自身的冒泡、event.isImmediatePropagationStopped() 阻止所有的冒泡
		 */
		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			/*
			 * isImmediatePropagationStopped = true;当前元素的其他事件不要触发
			 */
			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );
					/*
					 * return false; 阻止默认事件和冒泡
					 */
					if ( ret !== undefined ) {
						if ( (event.result = ret) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		/*
		 * 件执行完成之后，调用 postDispatch 进行特殊处理
		 */
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	/*
	 * 队列操作
	 * 委托的要比绑在自身的事件执行顺序要靠前，委托的层级越深越靠前
	 */
	handlers: function( event, handlers ) {
		var i, matches, sel, handleObj,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.disabled !== true || event.type !== "click" ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
		}

		return handlerQueue;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		/*
		 * 解决键盘相关兼容性问题的具体函数
		 * IE 8 以下的版本不支持 event.which，charCode 支持也不是很好，用 keyCode
		 */
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		/*
		 * 解决鼠标相关兼容性问题的具体函数
		 * event：是 jQuery 中的 event 对象，original 是原生的 event 对象
		 */
		filter: function( event, original ) {
			var eventDoc, doc, body,
				button = original.button; // 点击鼠标左键、中建、右键的属性值

			// Calculate pageX/Y if missing and clientX/Y available
			/*
			 * pageX/Y 在低版本的 IE 是不支持的，clientX/Y 是所有浏览器都支持
			 * pageX/Y 是算上滚动条的距离 ( 页面的距离 )，clientX/Y 是不算滚动条的 ( 可视区的距离 )
			 */
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;
				/*
				 * clientTop：是指的是边框的高度
				 */
				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			/*
			 * 有些低版本的浏览器不支持 which，但是支持 button
			 * 在 IE 下，click 的 which 右键值是得不到的，需要使用 mousedown
			 */
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	fix: function( event ) {
		/*
		 * 设置唯一标示，类似一个缓存，下次进来有的话就不用走后面了
		 */
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event, // 原生的 event 对象，在使用的时候可以 $("div").on("click",function(ev){ ev：jQuery 的 event，ev.originalEvent：原生的 event })
			fixHook = this.fixHooks[ type ];  // 看看有没有兼容的事件

		/*
		 * 没有兼容的时候也做了处理
		 * rmouseEvent = /^(?:mouse|contextmenu)|click/; 匹配成功就调用 this.mouseHooks，就是针对鼠标的兼容处理
		 * rfocusMorph = /^(?:focusinfocus|focusoutblur)$/; 针对键盘的兼容处理
		 */
		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		/*
		 * copy 就是带有很多属性的集合
		 */
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		/*
		 * 创建 jQuery 下的 event 对象
		 */
		event = new jQuery.Event( originalEvent );

		/*
		 * 这里进行了 copy 赋值，把原生下的属性赋值给了 jQuery 对象下的 event 属性
		 */
		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: Cordova 2.5 (WebKit) (#13255)
		// All events should have a target; Cordova deviceready doesn't
		/*
		 * deviceready：这个事件是移动端的事件，看看设备有没有就绪，调用这个事件的时候它没有事件源的，所以做了兼容处理
		 */
		if ( !event.target ) {
			event.target = document;
		}

		// Support: Safari 6.0+, Chrome < 28
		// Target should not be a text node (#504, #13143)
		/*
		 * 在上述注释的浏览器版本中，事件源的 nodeType 可能等于3 ( 文本 )，因为事件源不能等于文本，所以做了兼容处理
		 */
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		return fixHook.filter? fixHook.filter( event, originalEvent ) : event;
	},
	/*
	 * 针对特殊事件的处理
	 */
	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			/*
			 * load 是不允许冒泡的
			 */
			noBubble: true
		},
		focus: {
			// Fire native event if possible so blur/focus sequence is correct
			/*
			 * focus 不支持冒泡操作
			 */
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					this.focus();
					return false;
				}
			},
			/*
			 * 如果委托的时候，冒泡到 div，而 focus 是不支持冒泡的，这个时候就会用到这个属性，用 focusin 代替，它是支持冒泡事件的
			 * 但是 focusin 支持不是很好，jQuery 也有对应的处理方式
			 */
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {
			// For checkbox, fire native event so checked state will be right
			/*
			 * 这段就是处理这种情况的
			 * <input type="checkbox" id="input1">
			 * $("#input1").on("click",function(){});
			 * $("#input1").trigger("click");
			 */
			trigger: function() {
				if ( this.type === "checkbox" && this.click && jQuery.nodeName( this, "input" ) ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			/*
			 * 主动触发，如果是 a 标签，是不会触发默认行为的，其他标签是可以的
			 * $("a").on("click",function(){ alert(1); });
		     * $("a").trigger("click");  弹出 1 ，但是链接并不会跳转
			 */
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},
		/*
		 * 关闭页面时候触发，做的是 Firefox 兼容
		 */
		beforeunload: {
			/*
			 * postDispatch 事件结束之后调用
			 */
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		/*
		 * 判断是否支持冒泡，支持通过主动触发执行
		 */
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = function( elem, type, handle ) {
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle, false );
	}
};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	/*
	 * 防止没有 new 操作
	 */
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	/*
	 * 把相应的属性继承到 jQuery 对象的 event 上
	 */
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	/*
	 * 设置缓存，在 fix 方法中就可以直接返回了
	 */
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	/*
	 * 是否阻止了默认事件
	 */
	isDefaultPrevented: returnFalse,
	/*
	 * 是否冒泡
	 */
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	/*
	 * 阻止默认事件
	 */
	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && e.preventDefault ) {
			e.preventDefault();
		}
	},
	/*
	 * 阻止冒泡，阻止的是父级的事件
	 */
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && e.stopPropagation ) {
			e.stopPropagation();
		}
	},
	/*
	 * 阻止冒泡，并且阻止了当前元素的其他的事件
	 */
	stopImmediatePropagation: function() {
		/*
		 * 把 isImmediatePropagationStopped 值设置为 ture，那上面的 dispatch 方法中有判断，就不会走 while 循环了，那么元素自身的其他事件就不会触发
		 */
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
// Support: Chrome 15+
/*
 * 让 mouseover、mouseout 模拟 mouseenter、mouseleave
 */
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,  // 当前要触发的事件类型
		/*
		 * 具体的兼容处理
		 */
		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			/*
			 * 看看是否是包含关系，并且两个元素是否相等
			 */
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				/*
				 * 事件触发
				 */
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// Create "bubbling" focus and blur events
// Support: Firefox, Chrome, Safari
/*
 * 让 focus、blur 支持冒泡操作，原理是通过 trigger 模拟事件行为，因为 trigger 本身是支持冒泡的
 * $("#div1").on("focus",function(){}); $("input").trigger("focus");
 */
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				/*
				 * simulate 是用来模拟操作的
				 */
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			/*
			 * 这两个目前就是只是对 focusin、focusout 处理
			 */
			setup: function() {
				if ( attaches++ === 0 ) {
					/*
					 * 把函数绑定在 document 上，因为它是支持 focus、blur 这两个事件
					 * 第三个参数是 true，说明是捕获的操作行为，由于 focus 本身是没有冒泡的，所以就不能写成 false
					 */
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	/*
	 * one 参数是内部使用的，帮 one() 方法有关系
	 */
	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var origFn, type;

		// Types can be a map of types/handlers
		/*
		 * $("div").on({
		 *     "click":function(){},
		 *     "mouseover":function(){}
		 * });
		 */
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			/*
			 * 返回当前对象，防止在往下走
			 */
			return this;
		}

		/*
		 * 参数顺序修正
		 */
		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		/*
		 * 内部 one() 方法会走这里
		 */
		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				/*
				 * 一上来就是取消当前元素的事件操作，下次点击就没有用了  jQuery() -> jQuery(this)
				 * origFn.apply( this, arguments ); 然后这个原来传进来的函数执行一次
				 */
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			/*
			 * 给 fn 加 guid 的唯一标识，用来快速找到对应的函数
			 */
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		/*
		 * 这里多传了一个 1，让事件只执行一次
		 */
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		/*
		 * 参数修正
		 */
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	/*
	 * triggerHandler 不会触发当前事件所带的默认行为
	 */
	triggerHandler: function( type, data ) {
		var elem = this[0];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
});
/*
 * DOM 操作
 */
var isSimple = /^.[^:#\[\.,]*$/,
	rparentsprev = /^(?:parents|prev(?:Until|All))/,
	rneedsContext = jQuery.expr.match.needsContext,
	// methods guaranteed to produce a unique set when starting from a unique set
	/*
	 * 这几个是不存在重复情况的
	 */
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	/*
	 * $("ul").find("li")
	 */
	find: function( selector ) {
		var i,
			ret = [],
			self = this, // ul
			len = self.length;

		/*
		 * $("ul").find($(li))
		 */
		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter(function() {
				/*
				 * 循环每一个 ul 看看有没有包括要选择的 li ( li 和 ul 是包含关系 return true; )
				 */
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			}) );
		}

		/*
		 * 通过循环过后 ret 就会存储我们想要的 li
		 */
		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		/*
		 * jQuery.unique() 去除重复的 DOM 节点
		 */
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = this.selector ? this.selector + " " + selector : selector;
		return ret;
	},

	has: function( target ) {
		var targets = jQuery( target, this ), // span
			l = targets.length;
		/*
		 * $("div").has("span")
		 * this 就是 div
		 * 在 div 下面找 span，包含就返回 true
		 */
		return this.filter(function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		/*
		 * pushStack 就是栈的管理，先进后出
		 * winnow 是筛选的公用的方法
		 */
		return this.pushStack( winnow(this, selector || [], true) );
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector || [], false) );
	},

	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			/*
			 * rneedsContext 是 Sizzle 的一个正则，判断一些复杂的伪类
			 * $("p:first").is("p:last") 这个会走 jQuery( selector )
			 */
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [], // 筛选到结果放到这里
			/*
			 * 判断伪类和元素的情况下用 jQuery( selectors, context || this.context ) 获取到元素
			 */
			pos = ( rneedsContext.test( selectors ) || typeof selectors !== "string" ) ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			/*
			 * 通过父级一层层往上找，并且找到一个满足的就不会向上在找了
			 */
			for ( cur = this[i]; cur && cur !== context; cur = cur.parentNode ) {
				// Always skip document fragments
				if ( cur.nodeType < 11 && (pos ?
					pos.index(cur) > -1 :

					// Don't pass non-elements to Sizzle
					cur.nodeType === 1 &&
						jQuery.find.matchesSelector(cur, selectors)) ) {

					cur = matched.push( cur );
					break;
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.unique( matched ) : matched );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		/*
		 * 没有传参数的情况
		 */
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
		/*
		 * 传了参数的情况 $("#span1").index("span")
		 * this[0] 获取的是 $("#span1") 的 DOM 节点
		 * this[0] 在所有 jQuery(elem) 中的索引位置
		 */
		if ( typeof elem === "string" ) {
			return core_indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
		/*
		 *  $("span").index( $("#span1") ) ;
		 */
		return core_indexOf.call( this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				/*
				 * selector.nodeType 判断是不是原生的，如果是直接转成数组
				 * selector 是 jQuery 获取到的元素，转成特殊形式的数组
				 */
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
		    /*
		     * $("div").add("span"); this.get() => "div"，set => "span"
		     * 通过 merge() 进行合并
		     */
			all = jQuery.merge( this.get(), set );

		return this.pushStack( jQuery.unique(all) );
	},

	addBack: function( selector ) {
		/*
		 * $("div").find("span").css("color","red").addBack().css("border","1px solid red");
		 * this => "span"
		 * 当 selector 没有值的时候，通过 this.prevObject 找到栈的下一层 "div"
		 * 有筛选条件的时候，通过 filter 进行筛选
		 */
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

function sibling( cur, dir ) {
	/*
	 * 兄弟节点中可能会有文本节点，所以要去掉文本节点
	 * <span>span</span>asdddd<p>p</p>
	 * 直到找到元素节点 return 出去
	 */
	while ( (cur = cur[dir]) && cur.nodeType !== 1 ) {}

	return cur;
}

/*
 * 节点获取的相关方法
 */
jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		/*
		 * parent.nodeType !== 11 排除掉文档碎片，因为他是属于 DOM 一种，也有 nodeType
		 */
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	/*
	 * <div>div</div>
	 * <span>span</span>
	 * ( elem.parentNode || {} ).firstChild => "div"
	 * elem => "span"
	 */
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	/*
	 * 会获取到元素节点、空白节点、文本节点、注释节点
	 * elem.childNodes 在原生中本身就会获取所有的节点类型
	 * elem.contentDocument 是在 iframe 操作，就是获取 iframe 节点的那个页面的 document，elem.contentDocument 只有 ifrmae 中有，其他会返回 undefined
	 */
	contents: function( elem ) {
		return elem.contentDocument || jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	/*
	 * 扩展 jQuery 对象下的方法
	 */
	jQuery.fn[ name ] = function( until, selector ) {
		/*
		 * $("span").parent().css("border","1px solid red");
		 * this => "span"，fn 就是遍历中的函数
		 */
		var matched = jQuery.map( this, fn, until );

		/*
		 * 判断函数名字有没有 Until，有的话 "until" 参数就是筛选条件
		 */
		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}

		/*
		 * 判断是否是多个元素
		 */
		if ( this.length > 1 ) {
			// Remove duplicates
			/*
			 * 判断有没有重复的
			 * <div>div<p>p<span>span</span></p></div>
			 * <p>p<span>span</span></p>
			 * $("span").parents().css("border","1px solid red");
			 * 这个时候就会出现重复的 body 和 html
			 * guaranteedUnique = {
			 *      children: true,  // 只能获取元素节点
			 *      contents: true, // 能获取元素节点和文本节点
			 *      next: true,
			 *      prev: true
			 * }
			 */
			if ( !guaranteedUnique[ name ] ) {
				/*
				 * unique 不仅会去重，而且会进行重新排序
				 */
				jQuery.unique( matched );
			}

			// Reverse order for parents* and prev-derivatives
			/*
			 * rparentsprev = /^(?:parents|prev(?:Until|All))/
			 * 有 parents、prev 是需要从内向外的排序顺序，除了这两个剩下的都是从外向内的( 或者先写的会在数组的前面一项 )
			 */
			if ( rparentsprev.test( name ) ) {
				/*
				 * 修正排序
				 */
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
});

jQuery.extend({
	/*
	 * expr 过滤条件
	 * elems 元素
	 */
	filter: function( expr, elems, not ) {
		var elem = elems[ 0 ];

		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		/*
		 * jQuery.find = Sizzle
		 * 如果是一个元素就会调用 jQuery.find.matchesSelector( elem, expr )
		 * 多个元素调用 jQuery.find.matches();
		 */
		return elems.length === 1 && elem.nodeType === 1 ?
			jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
			jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
				return elem.nodeType === 1;
			}));
	},
	/*
	 * elem：当前要操作的每一个元素
	 * dir：通过它决定公用方法是操作父级还是同辈节点
	 * until：截止到什么位置结束
	 */
	dir: function( elem, dir, until ) {
		var matched = [],
			truncate = until !== undefined;  // 看看有没截止的操作，有的话就是 true，没有的话就是 false
		/*
		 * elem.nodeType !== 9  指的是 html，那么 html 的 parentNode 是存在的，他是 document，那么 document 不属于页面上的标签，所以要排除掉
		 */
		while ( (elem = elem[ dir ]) && elem.nodeType !== 9 ) {
			/*
			 * 判断是不是元素节点
			 */
			if ( elem.nodeType === 1 ) {
				/*
				 * 有截止操作就进这个 if，如果是 parentUntil("body") 就会直接跳出
				 */
				if ( truncate && jQuery( elem ).is( until ) ) {
					break;
				}
				matched.push( elem );
			}
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var matched = [];

		for ( ; n; n = n.nextSibling ) {
			/*
			 * n.nodeType === 1 判断是不是元素节点
			 */
			if ( n.nodeType === 1 && n !== elem ) {
				matched.push( n );
			}
		}

		return matched;
	}
});

// Implement the identical functionality for filter and not
/*
 * $("div").filter(".box")
 * elements 操作的每一个元素 div
 * qualifier 就是 ".box"
 * not 就是一个开关 true、false
 */
function  winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			return !!qualifier.call( elem, i, elem ) !== not;
		});

	}

	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		});

	}

	if ( typeof qualifier === "string" ) {
		/*
		 * isSimple => /^.[^:#\[\.,]*$/ 起始位置是所有字符，后面是不包括":#[.,"
		 * 匹配成功： .box、div、#div1、:odd、ul li、
		 * 匹配不成功：div:odd、ul #li、ul[title="hello"]、div.box、ul,ol
		 */
		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}
		/*
		 * 复杂的选择器是不能加 ":not(" + expr + ")" 的，所以这里没有传 not 这个参数
		 */
		qualifier = jQuery.filter( qualifier, elements );
	}

	/*
	 * 复杂选择器通过这里来进一步筛选是 filter 还是 not
	 */
	return jQuery.grep( elements, function( elem ) {
		return ( core_indexOf.call( qualifier, elem ) >= 0 ) !== not;
	});
}
var rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	manipulation_rcheckableType = /^(?:checkbox|radio)$/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

	// We have to close these tags to support XHTML (#13200)
	/*
	 * 这里是做兼容处理的
	 * 其中 "1"、"2" 这种数字表示层级
	 */
	wrapMap = {

		// Support: IE 9
		option: [ 1, "<select multiple='multiple'>", "</select>" ],

		thead: [ 1, "<table>", "</table>" ],
		col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		_default: [ 0, "", "" ]
	};

// Support: IE 9
wrapMap.optgroup = wrapMap.option;

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

jQuery.fn.extend({
	text: function( value ) {
		/*
		 * jQuery.access() 进行统一的获取或者设置
		 */
		return jQuery.access( this, function( value ) {
			return value === undefined ?
				/*
				 * jQuery.text( this ) 获取 ( Sizzle.getText )，是 Sizzle 中的一个功能，就是专门获取文本节点
				 * this.empty().append( ( this[ 0 ] && this[ 0 ].ownerDocument || document ).createTextNode( value ) ) 设置
				 * 设置的时候会先清空，在 document 下直接调用原生的 createTextNode() 可以把 value 整体的字符串当做文本添加
				 */
				jQuery.text( this ) :
				this.empty().append( ( this[ 0 ] && this[ 0 ].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	append: function() {
		return this.domManip( arguments, function( elem ) {
			/*
			 * 在 IE 低版本中，要把 tr 直接放到 body 里面，会出现一个小问题，他会自动添加 tbody 标签
			 * 这个时候添加就会出问题
			 */
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip( arguments, function( elem ) {
			/*
			 * this.nodeType === 1 => 元素
			 * this.nodeType === 11 => 文档碎片
			 * this.nodeType === 9 => document
			 */
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		});
	},

	before: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		});
	},

	after: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				/*
				 * 添加到下一个兄弟节点的前面
				 */
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		});
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		var elem,
		    /*
		     * selector 是一个筛选的参数
		     */
			elems = selector ? jQuery.filter( selector, this ) : this,
			i = 0;

		for ( ; (elem = elems[i]) != null; i++ ) {
			/*
			 * remove() 操作就会走 if，这句话就是删除相关的数据
			 */
			if ( !keepData && elem.nodeType === 1 ) {
				/*
				 * getAll() 的作用就是获取当前元素下的所有子元素，返回一个集合，搜索 getAll( context, tag ) 在下面找到这个方法
				 */
				jQuery.cleanData( getAll( elem ) );
			}

			/*
			 * 判断有没有父级，只有父级才能调用 elem.parentNode.removeChild
			 */
			if ( elem.parentNode ) {
				/*
				 * 这里是删除的元素中包含有 <script> 的时候， remove() 会在执行 <script> 标签中的内容，而 detach() 是不会的
				 * 一旦是 detach() 就调用了 setGlobalEval()，作用就是把 JavaScript 设置为全局的，这样就只会执行一次
				 */
				if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
					/*
					 * getAll( elem, "script" ) 在元素下找 script 标签
					 */
					setGlobalEval( getAll( elem, "script" ) );
				}
				elem.parentNode.removeChild( elem );
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			/*
			 * 判断是不是元素节点
			 */
			if ( elem.nodeType === 1 ) {

				// Prevent memory leaks
				/*
				 * 清除数据缓存，并且是对里面的子元素进行清空
				 */
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				/* 调用原生的方法，置空所有内容 */
				elem.textContent = "";
			}
		}

		return this;
	},
	/*
	 * deepDataAndEvents：是针对子元素 clone 出来的也有事件，如果是 false，子元素就不会触发事件
	 */
	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		/*
		 * 当第二个参数不存在的情况下，默认已第一个为准 就是会变成 clone(true) => clone(true,true)
		 */
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return jQuery.access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;
			/*
			 * 获取的操作
			 */
			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			/*
			 * rnoInnerhtml.test( value ) 这个正则的作用，rnoInnerhtml = /<(?:script|style|link)/i 就是检查这些标签
			 * $("span").get(0).innerHTML="<script>alert(1)<\/script>"; 不执行 <script> 标签 ( 不解析 )
			 * $("span").html("<script>alert(1)<\/script>");  会执行 <script> 标签的内容
			 * 如果有正则里面的标签就不会走这个 if
			 *
			 * !wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] 这个是针对 XML 规范的一个判断
			 * $("span").get(0).innerHTML="<tr></tr>"; 这个是不符合 XML 规范的，在原生中是不会添加内容的
			 * $("span").html("<tr></tr>"); jQuery 可以添加，也就是说一旦检测到不符合规范的就不会走这个 if
			 */
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {
				/*
				 * 找是不是单标签 $("span").html("<div/>") 处理这种情况的，解析出来的是<div></div>
				 */
				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};

						// Remove element nodes and prevent memory leaks
						if ( elem.nodeType === 1 ) {
							/*
							 * 清空子元素的内容(数据)
							 */
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch( e ) {}
			}
			/*
			 * 通过 append() 添加，触发 <script>
			 */
			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var
			// Snapshot the DOM in case .domManip sweeps something relevant into its fragment
			args = jQuery.map( this, function( elem ) {
				return [ elem.nextSibling, elem.parentNode ];
			}),
			i = 0;

		// Make the changes, replacing each context element with the new content
		this.domManip( arguments, function( elem ) {
			var next = args[ i++ ],
				parent = args[ i++ ];

			if ( parent ) {
				// Don't use the snapshot next if it has moved (#13810)
				if ( next && next.parentNode !== parent ) {
					next = this.nextSibling;
				}
				jQuery( this ).remove();
				/*
				 * 删除操作，在添加到相应的位置
				 */
				parent.insertBefore( elem, next );
			}
		// Allow new content to include elements from the context set
		}, true );

		// Force removal if there was no new content (e.g., from empty arguments)
		return i ? this : this.remove();
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, callback, allowIntersection ) {

		// Flatten any nested arrays
		/*
		 * 转数组
		 */
		args = core_concat.apply( [], args );

		var fragment, first, scripts, hasScripts, node, doc,
			i = 0,
			l = this.length,
			set = this,
			iNoClone = l - 1,
			value = args[ 0 ],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		/*
		 * 文档碎片针对 checked 在老版本的 WebKit 是不兼容的
		 * <span></span><span></span><span></span><div>div</div>
		 * $("span").append($("div")); 那么三个 span 里面都有 div，后面两个是 clone() 操作，那么 clone() 对 chekcbox 的选中状态就会有问题
		 * 那么就会进这个 if，就没有走 clone()，而是直接创建出来的
		 */
		if ( isFunction || !( l <= 1 || typeof value !== "string" || jQuery.support.checkClone || !rchecked.test( value ) ) ) {
			return this.each(function( index ) {
				var self = set.eq( index );
				if ( isFunction ) {
					/*
					 * $("span").append(function(i,html){ return "hello"; });
					 * value => function
					 * args[ 0 ] => "hello"
					 */
					args[ 0 ] = value.call( this, index, self.html() );
				}
				/*
				 * 回调处理之后的结果在调用 doManip
				 */
				self.domManip( args, callback, allowIntersection );
			});
		}

		if ( l ) {
			/*
			 * jQuery.buildFragment：创建文档碎片
			 */
			fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, !allowIntersection && this );
			first = fragment.firstChild;

			/*
			 * jQuery.buildFragment => "<h1>h1</h1>" 此时 fragment.childNodes.length === 1
			 */
			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				/*
				 * 获取 scripts，但不执行 <script> 中的内容，原理就是 <script type="true"></script> 解析的时候就不认为是 <script>，因为 type 类型不匹配
				 * disableScript() 这个函数就是做的这个事情
				 */
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;
					/*
					 * 有一个是直接添加的，剩下都是 clone
					 */
					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
							// Support: QtWebKit
							// jQuery.merge because core_push.apply(_, arraylike) throws
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}

					callback.call( this[ i ], node, i );
				}

				/*
				 * <span><div>div</div></span><span><div>div</div></span><span><div>div</div></span>
				 * $("span").append("<script>alert(123)<\/script>") 只会弹一次，但是每个标签中都添加了 <script> 标签
				 * 也就是说 clone 出来的并不会执行 <script>
				 */
				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						/*
						 * 判断有没有设置全局缓存的 key 值，有的话就不会走这里的 if
						 */
						if ( rscriptType.test( node.type || "" ) &&
							!data_priv.access( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

							/*
							 * $("span").append("<script src="a.js"><\/script>")
							 */
							if ( node.src ) {
								// Hope ajax is available...
								jQuery._evalUrl( node.src );
							} else {
								jQuery.globalEval( node.textContent.replace( rcleanScript, "" ) );
							}
						}
					}
				}
			}
		}

		return this;
	}
});

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	/*
	 * selector 参数就是 $("div").appendTo( $("div") ); 中的 $("div")
	 */
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			/*
			 * $("div").appendTo( "div" ); 针对这种情况
			 */
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: QtWebKit
			// .get() because core_push.apply(_, arraylike) throws
			core_push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
});

jQuery.extend({
	/*
	 * 内部的 clone()
	 */
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
		    /*
		     * 原生的 clone()
		     */
			clone = elem.cloneNode( true ),
			inPage = jQuery.contains( elem.ownerDocument, elem );

		// Support: IE >= 9，IE11 是会被选中的
		// Fix Cloning issues
		/*
		 * 处理兼容问题的
		 * <input type="checkbox">
		 * $("input").prop("checked",true); $("input").clone().appendTo("body");
		 * 那么 clone 出来的是会选中的，但是在原生中是不会选中的
		 *
		 * jQuery.support.noCloneChecked IE 9、10 是返回 false
		 */
		if ( !jQuery.support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) && !jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		/*
		 * 是否要 clone() 事件
		 */
		if ( dataAndEvents ) {
			/*
			 * 判断子项是否要 clone()
			 */
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		/*
		 * clone 的元素包含 <script> 标签的时候，他会把 <script> 变成全局的
		 */
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		// Return the cloned set
		return clone;
	},

	buildFragment: function( elems, context, scripts, selection ) {
		var elem, tmp, tag, wrap, contains, j,
			i = 0,
			l = elems.length,
			fragment = context.createDocumentFragment(),
			/*
			 * 收集创建好的节点，最后统一添加
			 */
			nodes = [];

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				/*
				 * 这个 if 是针对 $("div").append(oSpan);$("div").append($("span"));
				 */
				if ( jQuery.type( elem ) === "object" ) {
					// Support: QtWebKit
					// jQuery.merge because core_push.apply(_, arraylike) throws
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				/*
				 * rhtml = /<|&#?\w+;/; 判断是否有标签存在，没有标签就会进这个 if
				 * 是针对 $("div").append("hello");
				 */
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				/*
				 * 标签的形式，或者是多组标签的形式会走这个 else
				 * 是针对 $("div").append("<h1>hello</h1>");
				 */
				} else {
					tmp = tmp || fragment.appendChild( context.createElement("div") );

					// Deserialize a standard representation
					/*
					 * 有特殊标签进行特殊处理，例如：<tr> 这种 上面有提到过
					 */
					tag = ( rtagName.exec( elem ) || ["", ""] )[ 1 ].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;
					tmp.innerHTML = wrap[ 1 ] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[ 2 ];

					// Descend through wrappers to the right content
					j = wrap[ 0 ];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Support: QtWebKit
					// jQuery.merge because core_push.apply(_, arraylike) throws
					jQuery.merge( nodes, tmp.childNodes );

					// Remember the top-level container
					tmp = fragment.firstChild;

					// Fixes #12346
					// Support: Webkit, IE
					/*
					 * 清空临时变量，防止内存泄漏
					 */
					tmp.textContent = "";
				}
			}
		}

		// Remove wrapper from fragment
		fragment.textContent = "";

		i = 0;
		while ( (elem = nodes[ i++ ]) ) {

			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			/*
			 * <span>span1<span>span2</span></span>
			 * <div>div</div>
			 *
			 * $("span").replaceWith( $("div") );
			 * 找不到要替换操作的节点的时候，就跳出
			 */
			if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			/*
			 * 添加文档碎片
			 */
			tmp = getAll( fragment.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( (elem = tmp[ j++ ]) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		return fragment;
	},
	/*
	 * 清除相关数据缓存和事件 ( remove() )
	 */
	cleanData: function( elems ) {
		var data, elem, events, type, key, j,
			special = jQuery.event.special,
			i = 0;

		for ( ; (elem = elems[ i ]) !== undefined; i++ ) {
			if ( Data.accepts( elem ) ) {
				key = elem[ data_priv.expando ];

				if ( key && (data = data_priv.cache[ key ]) ) {
					events = Object.keys( data.events || {} );
					if ( events.length ) {
						for ( j = 0; (type = events[j]) !== undefined; j++ ) {
							/*
							 * 这里的 if 是为了针对两种不同的情况，一种是很多事模拟的事件( 主动触发 )，还有一种就是真正的事件
							 */
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								/*
								 * 这里是删除真正的事件
								 */
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}
					/*
					 * 删除数据缓存
					 */
					if ( data_priv.cache[ key ] ) {
						// Discard any remaining `private` data
						delete data_priv.cache[ key ];
					}
				}
			}
			// Discard any remaining `user` data
			delete data_user.cache[ elem[ data_user.expando ] ];
		}
	},

	_evalUrl: function( url ) {
		return jQuery.ajax({
			url: url,
			type: "GET",
			dataType: "script",
			async: false,
			global: false,
			"throws": true
		});
	}
});

// Support: 1.x compatibility
// Manipulating tables requires a tbody
function manipulationTarget( elem, content ) {
	return jQuery.nodeName( elem, "table" ) &&
		/* 看看是不是 tr，然后获取 tbody，如果没有就手动创建，实现兼容 */
		jQuery.nodeName( content.nodeType === 1 ? content : content.firstChild, "tr" ) ?

		elem.getElementsByTagName("tbody")[0] ||
			elem.appendChild( elem.ownerDocument.createElement("tbody") ) :
		elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = (elem.getAttribute("type") !== null) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );

	if ( match ) {
		elem.type = match[ 1 ];
	} else {
		elem.removeAttribute("type");
	}

	return elem;
}

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var l = elems.length,
		i = 0;
	/*
	 * 利用 refElements 缓存开关来进行触发，在 domManip 中可以看到相关代码
	 */
	for ( ; i < l; i++ ) {
		data_priv.set(
			elems[ i ], "globalEval", !refElements || data_priv.get( refElements[ i ], "globalEval" )
		);
	}
}

function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	if ( data_priv.hasData( src ) ) {
		pdataOld = data_priv.access( src );
		pdataCur = data_priv.set( dest, pdataOld );
		events = pdataOld.events;

		if ( events ) {
			delete pdataCur.handle;
			pdataCur.events = {};
			/*
			 * 把原生的事件 copy 到当前的 clone 出来的
			 */
			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	if ( data_user.hasData( src ) ) {
		udataOld = data_user.access( src );
		udataCur = jQuery.extend( {}, udataOld );

		data_user.set( dest, udataCur );
	}
}


function getAll( context, tag ) {
	/*
	 * 第二个参数没写就是获取所有元素，写了就是获取指定的标签
	 */
	var ret = context.getElementsByTagName ? context.getElementsByTagName( tag || "*" ) :
			context.querySelectorAll ? context.querySelectorAll( tag || "*" ) :
			[];
	/*
	 * 当第二个参数没写的时候就会走：jQuery.merge( [ context ], ret ) 把自身合并进去
	 * 如果是 getAll(elem,false) 返回的结果就是不包含当前的元素
	 */
	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], ret ) :
		ret;
}

// Support: IE >= 9
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	/*
	 *  manipulation_rcheckableType = /^(?:checkbox|radio)$/i 判断是不是复选框或者是单选框
	 */
	if ( nodeName === "input" && manipulation_rcheckableType.test( src.type ) ) {
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}
jQuery.fn.extend({
	wrapAll: function( html ) {
		var wrap;

		/*
		 * 可以通过函数回调的形式操作
		 * $("span").wrapAll(function(){
		 *     return "<div>";
		 * });
		 * 这里是分开包装的不是整体包装
		 */
		if ( jQuery.isFunction( html ) ) {
			return this.each(function( i ) {
				jQuery( this ).wrapAll( html.call(this, i) );
			});
		}

		if ( this[ 0 ] ) {

			// The elements to wrap the target around
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				/*
				 * 相当于把创建出来的 "<div>" 添加到第一个 <span> 的前面
				 */
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map(function() {
				var elem = this;
				/*
				 * 找元素节点，处理多标签的情况
				 * $("span").wrapAll("<div><p></p></div>");
				 */
				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function( i ) {
				jQuery( this ).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
			    /*
			     * 找到所有的子元素
			     */
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function( i ) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			/*
			 * 排除 body
			 */
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	}
});
var curCSS, iframe,
	// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rmargin = /^margin/,
	rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
	rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
	rrelNum = new RegExp( "^([+-])=(" + core_pnum + ")", "i" ),
	elemdisplay = { BODY: "block" },

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: 0,
		fontWeight: 400
	},

	cssExpand = [ "Top", "Right", "Bottom", "Left" ],
	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];

// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// check for vendor prefixed names
	/*
	 * 把第一个字母变成大写 transform -> Transform ，在拼接之后的
	 */
	var capName = name.charAt(0).toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function isHidden( elem, el ) {
	// isHidden might be called from jQuery#filter function;
	// in that case, element will be second argument
	/*
	 * el 这个参数是针对 jQuery#filter 的
	 * jQuery.contains( elem.ownerDocument, elem ); 是针对创建的元素，没有添加到页面的话，jQuery 认为就是隐藏的元素
	 */
	elem = el || elem;
	return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
}

// NOTE: we've included the "window" in window.getComputedStyle
// because jsdom on node.js will break without it.
function getStyles( elem ) {
	return window.getComputedStyle( elem, null );
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		/*
		 * $("span").show() 的时候获取
		 */
		values[ index ] = data_priv.get( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			/*
			 * 这里是处理之前没有调用 hide()的时候，怎么获取元素本身的 display
			 * span{ display:none; }
			 * $("span").show();
			 */
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			/*
			 * css_defaultDisplay() 获取元素默认的 display
			 */
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = data_priv.access( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
			}
		} else {

			if ( !values[ index ] ) {
				hidden = isHidden( elem );

				/*
				 * 调用 $("span").hide() 的时候就会走这里
				 * 当不是隐藏的时候就会进 if，通过 jQuery.css(elem, "display") 得到默认的值
				 */
				if ( display && display !== "none" || !hidden ) {
					data_priv.set( elem, "olddisplay", hidden ? display : jQuery.css(elem, "display") );
				}
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	/*
	 * 这里是正真的显示隐藏的操作
	 */
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			/*
			 * values[ index ] 是检测元素之前的 display 的属性
			 * <span></span>
			 *
			 * $("span").hide().show();
			 * 在 hide() 的时候监测 元素是什么，比如 getComputedStyle().display -> inline
			 */
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.fn.extend({
	css: function( name, value ) {
		return jQuery.access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			/*
			 * 判断是不是数组，针对 $("div").css(["color","width","height"]);
			 */
			if ( jQuery.isArray( name ) ) {
				/*
				 *  getStyles 就是 getComputedStyle()
				 */
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					/*
					 * styles 不传的话，就会重复调用 getComputedStyle()，影响性能
					 */
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			/*
			 * value 存在的时候就需要设置，调用的是 jQuery.style() -> style
			 * 不存在的时候调用 jQuery.css() -> curCSS = function(){} -> getComputedStyle()
			 */
			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		/*
		 * 这里通过第二个参数决定是 show() 还是 hide() 行为
		 */
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each(function() {
			/*
			 * isHidden() 检测当前元素是否隐藏，如果是隐藏的就是返回 true
			 */
			if ( isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	/*
	 * 透明度的特殊处理
	 * $("div").css("opacity"); 在样式里面没有写 opacity 的话，就认为他是不透明的
	 */
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"columnCount": true,
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": "cssFloat"
	},

	// Get and set the style property on a DOM Node
	/*
	 * extra 是针对尺寸方法的 $("div").width()/height()...
	 */
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		/*
		 * 针对的是元素节点
		 */
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			/*
			 * rrelNum = new RegExp( "^([+-])=(" + core_pnum + ")", "i" );  += 、 -= 的操作
			 * $("#div1").width("+=100");
			 */
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				/*
				 * ret[1] 就是 "-" 或者 "+"  + +1 => +1 、 - +1 => -1
				 */
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			/*
			 * cssNumber 这里面的都是不用加单位的
			 */
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// Fixes #8908, it can be done more correctly by specifying setters in cssHooks,
			// but it would mean to define eight (for every problematic property) identical functions
			/*
			 * clone 了一个元素，并且对他的 background 进行设置为 ""，他会影响到没有 clone 之前的元素
			 */
			if ( !jQuery.support.clearCloneStyle && value === "" && name.indexOf("background") === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			/*
			 * 针对尺寸的额外操作
			 */
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {
				style[ name ] = value;
			}

		} else {
			// If a hook was provided get the non-computed value from there
			/*
			 * 获取操作
			 */
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	/*
	 * style 用来多个值获取，单个值不传，为了提高性能
	 * curCSS =function(){} 这个方法中也调用了 getComputedStyle()，为了防止重复调用在获取多值的时候
	 */
	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
		    /*
		     * 转驼峰形式 background-color -> backgroundColor
		     */
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		/*
		 * cssProps: { "float": "cssFloat" }
		 * vendorPropName 添加浏览器前缀
		 */
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		/*
		 * cssHooks：怪异模式下宽度和高度的解析不同，或者 opacity 不写的时候获取是 ""，其实应该是 1
		 */
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		/*
	  	 * 返回 "noraml" 的话转成对应的数值
	  	 * cssNormalTransform = {
		 *     letterSpacing: 0,
		 *     fontWeight: 400
		 * }
		 */
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		/*
		 * $("div").css("width") -> 获取到的值肯定带单位的
		 * 有 "extra" 这个参数会把单位去掉
		 */
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	}
});

curCSS = function( elem, name, _computed ) {
	var width, minWidth, maxWidth,
		computed = _computed || getStyles( elem ),

		// Support: IE9
		// getPropertyValue is only needed for .css('filter') in IE9, see #12537
		/*
		 * #div1{ filter:alpha(opacity=50); }
		 * window.getComputedStyle( document.getElementById("div1"),null )["filter"] 在 IE 9 下， filter 是 undefined
		 * window.getComputedStyle( document.getElementById("div1"),null ).getPropertyValue("filter") 这样就能获取到
		 */
		ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined,
		style = elem.style;

	if ( computed ) {

		/*
		 * elem.ownerDocument = document
		 * jQuery.contains( elem.ownerDocument, elem ) 一般情况下载页面上已有的元素都会返回 true
		 * 动态创建元素，并且该元素还没有添加到页面的时候，它就会返回 false
		 */
		if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
			ret = jQuery.style( elem, name );
		}

		// Support: Safari 5.1
		// A tribute to the "awesome hack by Dean Edwards"
		// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
		// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
		/*
		 * rmargin = /^margin/; 针对 margin 开头的样式处理
		 * rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ); 不去匹配带 "px" 像素单位的值，匹配除了像素以外的 "%" 的值
		 * 也就是说 margin 设置了 "%" 就会进这个 if
		 *
		 * #div1 { margin-left : 10%; }
		 * $("#div1").css("margin-left");  135px; 但是在 Safari 5.1.7 中得到的是 10%
		 */
		if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

			// Remember the original values
			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			// Put in the new values to get a computed value out
			style.minWidth = style.maxWidth = style.width = ret;
			ret = computed.width;

			// Revert the changed values
			/*
			 * 值还原
			 */
			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret;
};


function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {
			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

// Try to determine the default display value of an element
function css_defaultDisplay( nodeName ) {
	var doc = document,
	    /*
	     * elemdisplay = { BODY: "block" }，body 是不能动态创建，给 body 一个默认的值
	     */
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {
			// Use the already-created iframe if possible
			/*
			 * 处理 iframe 隐藏的时候，在 iframe 中的元素是显示的，但是 getComputedStyle() 获取到的是 none;
			 * 动态创建 iframe，并且显示
			 */
			iframe = ( iframe ||
				jQuery("<iframe frameborder='0' width='0' height='0'/>")
				.css( "cssText", "display:block !important" )
			).appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = ( iframe[0].contentWindow || iframe[0].contentDocument ).document;
			doc.write("<!doctype html><html><body>");
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}

// Called ONLY from within css_defaultDisplay
function actualDisplay( name, doc ) {
	/*
	 * 动态创建一个标签添加到 body 中，在用 css() 获取动态创建标签的元素的 display，最后删除动态创建的元素
	 */
	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),
		display = jQuery.css( elem[0], "display" );
	elem.remove();
	return display;
}

jQuery.each([ "height", "width" ], function( i, name ) {
	/*
	 * cssHooks.get()、 cssHooks.set()
	 */
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return elem.offsetWidth === 0 && rdisplayswap.test( jQuery.css( elem, "display" ) ) ?
					jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					}) :
					getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
});

// These hooks cannot be added until DOM ready because the support test
// for it is not run until after DOM ready
jQuery(function() {
	// Support: Android 2.3
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				if ( computed ) {
					// Support: Android 2.3
					// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
					// Work around by temporarily setting element display to inline-block
					return jQuery.swap( elem, { "display": "inline-block" },
						curCSS, [ elem, "marginRight" ] );
				}
			}
		};
	}

	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// getComputedStyle returns percent when specified for top/left/bottom/right
	// rather than make the css module depend on the offset module, we just check for it here
	if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
		jQuery.each( [ "top", "left" ], function( i, prop ) {
			jQuery.cssHooks[ prop ] = {
				get: function( elem, computed ) {
					if ( computed ) {
						computed = curCSS( elem, prop );
						// if curCSS returns percentage, fallback to offset
						return rnumnonpx.test( computed ) ?
							jQuery( elem ).position()[ prop ] + "px" :
							computed;
					}
				}
			};
		});
	}

});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		// Support: Opera <= 12.12
		// Opera reports offsetWidths and offsetHeights less than zero on some elements
		return elem.offsetWidth <= 0 && elem.offsetHeight <= 0;
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});
var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function(){
			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		})
		.filter(function(){
			var type = this.type;
			// Use .is(":disabled") so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !manipulation_rcheckableType.test( type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

//Serialize an array of form elements or a set of
//key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// Item is non-scalar (array or object), encode its numeric index.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}
jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			/*
			 * 并没有委托的操作
			 */
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
});

jQuery.fn.extend({
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	/*
	 * 事件委托，内部调用的是 on
	 */
	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	}
});
var
	// Document location
	ajaxLocParts,
	ajaxLocation,

	ajax_nonce = jQuery.now(),

	ajax_rquery = /\?/,
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat("*");

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( core_rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			while ( (dataType = dataTypes[i++]) ) {
				// Prepend if requested
				if ( dataType[0] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

				// Otherwise append
				} else {
					(structure[ dataType ] = structure[ dataType ] || []).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		});
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, type, response,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = url.slice( off );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax({
			url: url,

			// if "type" variable is undefined, then "GET" method will be used
			type: type,
			dataType: "html",
			data: params
		}).done(function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		}).complete( callback && function( jqXHR, status ) {
			self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
		});
	}

	return this;
};

// Attach a bunch of functions for handling common AJAX events
jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ){
	jQuery.fn[ type ] = function( fn ){
		return this.on( type, fn );
	};
});

jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var transport,
			// URL without anti-cache param
			cacheURL,
			// Response headers
			responseHeadersString,
			responseHeaders,
			// timeout handle
			timeoutTimer,
			// Cross-domain detection vars
			parts,
			// To know if global events are to be dispatched
			fireGlobals,
			// Loop variable
			i,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks("once memory"),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( (match = rheaders.exec( responseHeadersString )) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {
								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {
							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (prefilters might expect it)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" )
			.replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( core_rnotwhite ) || [""];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger("ajaxStart");
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + ajax_nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ajax_nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout(function() {
					jqXHR.abort("timeout");
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader("etag");
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger("ajaxStop");
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		});
	};
});

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

		// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s[ "throws" ] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}
// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /(?:java|ecma)script/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {
	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				script = jQuery("<script>").prop({
					async: true,
					charset: s.scriptCharset,
					src: s.url
				}).on(
					"load error",
					callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					}
				);
				document.head.appendChild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
});
var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( ajax_nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( ajax_rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});
jQuery.ajaxSettings.xhr = function() {
	try {
		return new XMLHttpRequest();
	} catch( e ) {}
};

var xhrSupported = jQuery.ajaxSettings.xhr(),
	xhrSuccessStatus = {
		// file protocol always yields status code 0, assume 200
		0: 200,
		// Support: IE9
		// #1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	// Support: IE9
	// We need to keep track of outbound xhr and abort them manually
	// because IE is not smart enough to do it all by itself
	xhrId = 0,
	xhrCallbacks = {};

if ( window.ActiveXObject ) {
	jQuery( window ).on( "unload", function() {
		for( var key in xhrCallbacks ) {
			xhrCallbacks[ key ]();
		}
		xhrCallbacks = undefined;
	});
}

jQuery.support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
jQuery.support.ajax = xhrSupported = !!xhrSupported;

jQuery.ajaxTransport(function( options ) {
	var callback;
	// Cross domain only allowed if supported through XMLHttpRequest
	if ( jQuery.support.cors || xhrSupported && !options.crossDomain ) {
		return {
			send: function( headers, complete ) {
				var i, id,
					xhr = options.xhr();
				xhr.open( options.type, options.url, options.async, options.username, options.password );
				// Apply custom fields if provided
				if ( options.xhrFields ) {
					for ( i in options.xhrFields ) {
						xhr[ i ] = options.xhrFields[ i ];
					}
				}
				// Override mime type if needed
				if ( options.mimeType && xhr.overrideMimeType ) {
					xhr.overrideMimeType( options.mimeType );
				}
				// X-Requested-With header
				// For cross-domain requests, seeing as conditions for a preflight are
				// akin to a jigsaw puzzle, we simply never set it to be sure.
				// (it can always be set on a per-request basis or even using ajaxSetup)
				// For same-domain requests, won't change header if already provided.
				if ( !options.crossDomain && !headers["X-Requested-With"] ) {
					headers["X-Requested-With"] = "XMLHttpRequest";
				}
				// Set headers
				for ( i in headers ) {
					xhr.setRequestHeader( i, headers[ i ] );
				}
				// Callback
				callback = function( type ) {
					return function() {
						if ( callback ) {
							delete xhrCallbacks[ id ];
							callback = xhr.onload = xhr.onerror = null;
							if ( type === "abort" ) {
								xhr.abort();
							} else if ( type === "error" ) {
								complete(
									// file protocol always yields status 0, assume 404
									xhr.status || 404,
									xhr.statusText
								);
							} else {
								complete(
									xhrSuccessStatus[ xhr.status ] || xhr.status,
									xhr.statusText,
									// Support: IE9
									// #11426: When requesting binary data, IE9 will throw an exception
									// on any attempt to access responseText
									typeof xhr.responseText === "string" ? {
										text: xhr.responseText
									} : undefined,
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};
				// Listen to events
				xhr.onload = callback();
				xhr.onerror = callback("error");
				// Create the abort callback
				callback = xhrCallbacks[( id = xhrId++ )] = callback("abort");
				// Do send the request
				// This may raise an exception which is actually
				// handled in jQuery.ajax (so no try/catch here)
				xhr.send( options.hasContent && options.data || null );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
});
var fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [function( prop, value ) {
			var tween = this.createTween( prop, value ),
				target = tween.cur(),
				parts = rfxnum.exec( value ),
				unit = parts && parts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

				// Starting value computation is required for potential unit mismatches
				start = ( jQuery.cssNumber[ prop ] || unit !== "px" && +target ) &&
					rfxnum.exec( jQuery.css( tween.elem, prop ) ),
				scale = 1,
				maxIterations = 20;

			if ( start && start[ 3 ] !== unit ) {
				// Trust units reported by jQuery.css
				unit = unit || start[ 3 ];

				// Make sure we update the tween properties later on
				parts = parts || [];

				// Iteratively approximate from a nonzero starting point
				start = +target || 1;

				do {
					// If previous iteration zeroed out, double until we get *something*
					// Use a string for doubling factor so we don't accidentally see scale as unchanged below
					scale = scale || ".5";

					// Adjust and apply
					start = start / scale;
					jQuery.style( tween.elem, prop, start + unit );

				// Update scale, tolerating zero or NaN from tween.cur()
				// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
				} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
			}

			// Update tween properties
			if ( parts ) {
				start = tween.start = +start || +target || 0;
				tween.unit = unit;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[ 1 ] ?
					start + ( parts[ 1 ] + 1 ) * parts[ 2 ] :
					+parts[ 2 ];
			}

			return tween;
		}]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	});
	return ( fxNow = jQuery.now() );
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( (tween = collection[ index ].call( animation, prop, value )) ) {

			// we're done with this property
			return tween;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

jQuery.Animation = jQuery.extend( Animation, {

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

function defaultPrefilter( elem, props, opts ) {
	/* jshint validthis: true */
	var prop, value, toggle, tween, hooks, oldfire,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHidden( elem ),
		dataShow = data_priv.get( elem, "fxshow" );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE9-10 do not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		if ( jQuery.css( elem, "display" ) === "inline" &&
				jQuery.css( elem, "float" ) === "none" ) {

			style.display = "inline-block";
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		anim.always(function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowX = opts.overflow[ 1 ];
			style.overflowY = opts.overflow[ 2 ];
		});
	}


	// show/hide pass
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// If there is dataShow left over from a stopped hide or show and we are going to proceed with show, we should pretend to be hidden
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	if ( !jQuery.isEmptyObject( orig ) ) {
		if ( dataShow ) {
			if ( "hidden" in dataShow ) {
				hidden = dataShow.hidden;
			}
		} else {
			dataShow = data_priv.access( elem, "fxshow", {} );
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;

			data_priv.remove( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( prop in orig ) {
			tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}
	}
}

function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE9
// Panic based approach to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || data_priv.get( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = data_priv.get( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each(function() {
			var index,
				data = data_priv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		});
	}
});

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth? 1 : 0;
	for( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p*Math.PI ) / 2;
	}
};

jQuery.timers = [];
jQuery.fx = Tween.prototype.init;
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	if ( timer() && jQuery.timers.push( timer ) ) {
		jQuery.fx.start();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};

// Back Compat <1.8 extension point
jQuery.fx.step = {};

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}
jQuery.fn.offset = function( options ) {
	if ( arguments.length ) {
		return options === undefined ?
			this :
			this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
	}

	var docElem, win,
		elem = this[ 0 ],
		box = { top: 0, left: 0 },
		doc = elem && elem.ownerDocument;

	if ( !doc ) {
		return;
	}

	docElem = doc.documentElement;

	// Make sure it's not a disconnected DOM node
	if ( !jQuery.contains( docElem, elem ) ) {
		return box;
	}

	// If we don't have gBCR, just use 0,0 rather than error
	// BlackBerry 5, iOS 3 (original iPhone)
	if ( typeof elem.getBoundingClientRect !== core_strundefined ) {
		box = elem.getBoundingClientRect();
	}
	win = getWindow( doc );
	return {
		top: box.top + win.pageYOffset - docElem.clientTop,
		left: box.left + win.pageXOffset - docElem.clientLeft
	};
};

jQuery.offset = {

	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// Set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) && ( curCSSTop + curCSSLeft ).indexOf("auto") > -1;

		// Need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;

		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );

		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// Fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {
			// We assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();

		} else {
			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || docElem;

			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position") === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || docElem;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return jQuery.access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : window.pageXOffset,
					top ? val : window.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ? elem : elem.nodeType === 9 && elem.defaultView;
}
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return jQuery.access( this, function( elem, type, value ) {
				var doc;

				/*
				 * 计算浏览器可视区的宽高 $(window).width();
				 */
				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				/*
				 * $(document).height() 页面的高度
				 */
				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});
// Limit scope pollution from any deprecated API
// (function() {

// The number of elements contained in the matched element set
jQuery.fn.size = function() {
	return this.length;
};

jQuery.fn.andSelf = jQuery.fn.addBack;

// })();
if ( typeof module === "object" && module && typeof module.exports === "object" ) {
	// Expose jQuery as module.exports in loaders that implement the Node
	// module pattern (including browserify). Do not create the global, since
	// the user will be storing it themselves locally, and globals are frowned
	// upon in the Node module world.
	module.exports = jQuery;
} else {
	// Register as a named AMD module, since jQuery can be concatenated with other
	// files that may use define, but not via a proper concatenation script that
	// understands anonymous AMD modules. A named AMD is safest and most robust
	// way to register. Lowercase jquery is used because AMD module names are
	// derived from file names, and jQuery is normally delivered in a lowercase
	// file name. Do this after creating the global so that if an AMD module wants
	// to call noConflict to hide this version of jQuery, it will work.
	if ( typeof define === "function" && define.amd ) {
		define( "jquery", [], function () { return jQuery; } );
	}
}

// If there is a window object, that at least has a document property,
// define jQuery and $ identifiers
if ( typeof window === "object" && typeof window.document === "object" ) {
	window.jQuery = window.$ = jQuery;
}

})( window );
