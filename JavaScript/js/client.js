var clinet = function () {
	// 呈现引擎
	var engine = {
		ie    : 0,
		gecko : 0,
		webkit: 0,
		khtml : 0,
		opera : 0,
		ver   : null // 具体版本号
	};

	var browser = {
		ie     : 0,
		firefox: 0,
		safari : 0,
		konq   : 0,
		opera  : 0,
		chrome : 0,
		// 具体版本
		ver    : null
	};
	// 识别平台
	var system  = {
		win: false,
		mac: false,
		x11: false,  // Unix

		// 移动设备
		iphone   : false,
		ipod     : false,
		ipad     : false,
		ios      : false,
		android  : false,
		nokiaN   : false,
		winMobile: false,

		// 游戏系统
		wii: false,
		ps : false
	};

	var ua = navigator.userAgent;
	/*
	 * 要正确的识别呈现引擎，关键是检测顺序要正确，所以第一步要识别 opera ，因为他用户代理字符串有可能模仿其他浏览器
	 * 第二位检测的呈现引擎室 WebKit ，因为 WebKit 的用户代理字符串中包含 "Gecko" 和 "KHTML" ，所以如果先检测他们，可能会得出错误结果
	 * 不过 WebKit 的用户代理字符串中的 "AppleWebKit" 是独一无二的，所以检测这个字符串最合适。
	 * 接下来是 KHTML，同样 KHTML 的用户代理字符串中也包含 "Gecko" ，所以在排除 KHTML 之前无法准确检测基于 "Gecko" 的浏览器
	 * 此外，由于 Konqueror3.1 及更早的版本中不包含 KHTML 的版本，所以要使用 Konqueror 代替
	 * 检测完 WebKit 和 KHTML 后，就可以准确的检测 Gecko 了，但是 Gecko 的版本号不会出现在字符串 "Gecko" 的后面，而是在 "rv:" 后面
	 * Gecko 的版本号位于字符串 "rv:" 与一个闭括号之间，所以正则要查找出所有不是闭括号的字符，还要查找 "Gecko/" 后面 8 个数字。
	 * 最后是 IE，IE 的版本号位于字符串"MSIE"后面，一个分号前面。IE 通常会保证以标准浮点数值形式给出其版本号，但有时还不一定
	 * 因此，取反的字符类 [^;] 保证取得多个小数点以及任何字符串
	 * */
	// 要识别 Opera 必须检测 window.opera ,Opera5 及更高的版本都有这个对象
	if (window.opera) {
		// 在 Opera7.6 及更高的版本中，调用 verson() 方法可以返回一个表示浏览器版本的字符串
		engine.ver = browser.ver = window.opera.version();
		engine.opera = browser.opera = parseFloat(engine.ver);
	} else if (/AppleWebKit\/(\S+)/.test(ua)) {  // \S 匹配一个非空白字符、+ 匹配前面元字符 1 次或多次
		// 用户代理字符串中的版本号与下一部分的分隔符是一个空格
		engine.ver    = RegExp["$1"];
		engine.webkit = parseFloat(engine.ver);

		// 确定是 Chrome 还是 Safari
		if (/Chrome\/(\S+)/.test(ua)) {
			browser.ver    = RegExp["$1"];
			browser.chrome = parseFloat(browser.ver);
		} else if (/Version\/(\S+)/.test(ua)) {
			browser.ver    = RegExp["$1"];
			browser.safari = parseFloat(browser.ver);
		} else {
			// 近似确定版本号
			var safariVersion = 1;
			if (engine.webkit < 100) {
				safariVersion = 1;
			} else if (engine.webkit < 312) {
				safariVersion = 1.2;
			} else if (engine.webkit < 412) {
				safariVersion = 1.3;
			} else {
				safariVersion = 2;
			}

			browser.safari = browser.ver = safariVersion;
		}
	} else if (/KHTML\/(\S+)/.test(ua) || /Konqueror\/([^;]+)/.test(ua)) {
		// 这是 Konqueror
		engine.ver = browser.ver = RegExp["$1"];
		engine.khtml = browser.konq = parseFloat(engine.ver);
	} else if (/rv:([^\)]+)\) Gecko\/\d{8}/.test(ua)) {
		engine.ver   = RegExp["$1"];
		engine.gecko = parseFloat(engine.ver);
		// 确定是不是 Firefox
		if (/Firefox\/(\S+)/.test(ua)) {
			browser.ver     = RegExp["$1"];
			browser.firefox = parseFloat(browser.ver);
		}
	} else if (/MSIE ([^;]+)/.test(ua)) {
		engine.ver = browser.ver = RegExp["$1"];
		engine.ie = browser.ie = parseFloat(engine.ver);
	}

	// 检测浏览器
	browser.ie    = engine.ie;
	browser.opera = engine.opera;

	var p      = navigator.platform; // 检测平台
	system.win = p.indexOf("Win") == 0;
	system.mac = p.indexOf("Mac") == 0;
	system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);

	// 检测Windows操作系统
	if (system.win) {
		// 第一步就是匹配 windos95 和 windos98 ，对这两个字符串，只有 Gecko 与其他浏览器不同，即没有 "dows" ，而且 "Win" 版本号之间没有空格
		// /Win(?:dows )?([^do]{2})/   由于版本可能是任何两个字符编码，所以要用两个非空格字符
		// Gecko 在 Windows NT 时会在末尾添加 "4.0" ，所以直接查找小数值 (\d+\.\d+)? 这样正则表达式包含了第二个捕获组，用于取得 NT 版本号
		// 这个模式与 Opera 表示 Windows NT 字符串之间的唯一区别，就是 "NT" 与 "4.0" 之间的空格  \s?
		// (?:) 会作为匹配校验，并出现在匹配结果字符里面，它跟(...)不同的地方在于，不作为子匹配返回。非捕获性分组(?:)
		// (?=) 会作为匹配校验，但不会出现在匹配结果字符串里面,正则前瞻(?=)

		if (/Win(?:dows )?([^do]{2})\s?(\d+\.\d+)?/.test(ua)) {
			if (RegExp["$1"] == "NT") {
				switch (RegExp["$2"]) {
					case "5.0":
						system.win = "2000";
						break;
					case "5.1":
						system.win = "XP";
						break;
					case "6.0":
						system.win = "Vista";
						break;
					case "6.1":
						system.win = "7";
						break;
					default:
						system.win = "NT";
						break;
				}
			} else if (RegExp["$1"] == "9x") {
				system.win = "ME";
			} else {
				system.win = RegExp["$1"];
			}
		}
	}

	// 移动设备
	system.iphone = ua.indexOf("iPhone") > -1;
	system.ipod   = ua.indexOf("iPod") > -1;
	system.ipad   = ua.indexOf("iPad") > -1;
	system.nokiaN = ua.indexOf("NokiaN") > -1;

	// 检测 iOS 版本
	// 在 iOS3 之前，用户代理字符串中只包含 "CPU like Mac OS" ，后来 iPhone 中又改成 "CPU iPhone OS 3_0 like Mac OS X"
	// iPad 中又改成了 "CPU OS 3_2 like Mac OS X"
	if (system.mac && ua.indexOf("Mobile") > -1) {
		if (/CPU (?:iPhone )?OS (\d+_\d+)/.test(ua)) {
			system.ios = parseFloat(RegExp.$1.replace("_", "."));
		} else {
			system.ios = 2;  // 不能真正检测出来，只是猜测
		}
	}

	// 检测 Android 版本
	// 由于所有版本的 Android 都有版本值，所以可以精确的检测所有版本
	if (/Android (\d+\.\d+)/.test(ua)) {
		system.android = parseFloat(RegExp.$1);
	}

	// 移动设备平台是 Windows Mobile(Windows CE)
	// Windows Mobile 5.0 及以前的版本 Mozilla/4.0 ( compatible; MSIE 4.0.1; Windows CE; PPC; 240X320 ) Pocket PC
	//  Mozilla/4.0 ( compatible; MSIE 4.0.1; Windows CE; Smartphone; 176X220 ) Smartphone
	// Windows Phone 7 用户代理字符串 Mozilla/4.0 ( compatible; MSIE 7.0; Windows Phone OS 7.0; Trident/3.1; IEMobile/7.0 )
	if (system.win == "CE") { // 如果是 CE ，说明是老版本的 Windows Mobile
		system.winMobile = system.win;
	} else if (system.win == "Ph") { // 设备是Window Phone 7 +
		if (/Windows Phone OS (\d+.\d+)/.test(ua)) {
			system.win       = "Phone";
			system.winMobile = parseFloat(RegExp["$1"]);
		}
	}

	// 游戏系统 ( 任天堂 Wii 和 Playstation3 )
	// Opera/9.10 ( Nintendo Wii;U; ; 1621; en )  、 Mozilla/5.0 ( PLAYSTATION 3; 2.00)
	system.wii = ua.indexOf("Wii") > -1;
	system.ps  = /playstation/i.test(ua);

	// 在此检测呈现引擎、平台和设备
	return {
		engine : engine,
		browser: browser,
		system : system
	};
}();

if (clinet.engine.ie) { // 如果是 IE，client.ie 的值应该大于 0
	// 针对IE的代码
} else if (clinet.engine.gecko > 1.5) {
	if (clinet.engine.ver === "1.8.1") {
		// 针对这个版本执行某些操作
	}
}
// 判断是否是 WebKit
if (clinet.engine.webkit) {
	if (clinet.browser.chrome) {
		// 执行针对 Chrome 的代码
	} else if (clinet.browser.safari) {
		// 执行针对 Safari 的代码
	}
} else if (clinet.engine.gecko) {
	if (clinet.browser.firefox) {
		// 执行针对 Firefox 的代码
	} else {
		// 执行针对其他 Gecko 浏览器代码
	}
}

if (clinet.system.win) {
	if (clinet.system.win == "XP") {
		// 说明是 XP
	} else if (clinet.system.win == "Vista") {
		// 说明是 Vista
	}
}

if (clinet.engine.webkit) {
	if (clinet.system.ios) {
		// iOS 手机的内容
	} else if (clinet.system.android) {
		// Android 手机内容
	} else if (clinet.system.nokiaN) {
		// 诺基亚手机内容
	}
}
