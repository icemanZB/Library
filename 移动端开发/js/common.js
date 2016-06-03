// 公共对象
Common = $.extend(window["Common"], {});

// 切换页面
Common.togglePage = function (params) {
	var defaults = {
		show          : '',
		hide          : '',
		onBeforeToggle: '',
		onToggle      : ''
	};
	var options;

	var args = arguments;
	if (args.length > 1) {
		// 多个分开的参数
		options = $.extend({}, defaults);
		var i = 0;
		$.each(options, function (key, val) {
			if (i >= args.length) return false;
			options[key] = args[i];
			i++;
		});
	}
	else {
		// 单一对象参数
		options = params;
	}

	var beforeScroll = {
		X: window.scrollX,
		Y: window.scrollY
	};

	options.onBeforeToggle && options.onBeforeToggle(beforeScroll);

	$(options.hide).hide();
	$(options.show).show();
	window.scrollTo(beforeScroll.X > 0 ? 1 : 0, beforeScroll.Y > 0 ? 1 : 0);

	options.onToggle && options.onToggle(beforeScroll);
};

// 查看图片
Common.viewImg = function (element) {
	var $element = $(element);
	var img = $element.data('img');
	if (!img) return;
	$element.addClass('loading').text('');
	var $img = $('<img />').one('load', function () {
		$element.replaceWith($img);
	}).attr('src', img);
};

Common.Popup = function (options) {
	// 选项
	if ($.type(options) === "string") {
		options = {content: $(options)};
	}
	options = $.extend({
		modal  : true,
		content: "",
		button : [],
		open   : null,
		close  : null
	}, options);

	var $popup;
	var $con;

	// popup对象
	var popup = {
		ui     : null,
		options: options,
		close  : function () {
			if ($popup.data("static")) {
				$popup.hide();
			} else {
				$popup.remove();
			}

			setTimeout(function () {
				// 修正滚动条位置
				$(window).scrollTop($(window).scrollTop());
			}, 1);

			options.close && options.close(popup);
		}
	};
	if ($.type(options.content) === "string") {
		// 创建 ui
		$popup = $('<div class="popup"></div>');
		if (options.modal) {
			$popup.addClass("modal");
		}
		$con = $('<div class="tipContent" style="position:absolute; left:-9999px; top:-9999px;">').appendTo($popup);
		$con.append('<div class="tipText">' + options.content + '</div>');

		// 创建按钮
		var $btn = $([]);
		$.each(options.button, function (i, n) {
			console.log(n);  // Object {cssClass: "confirmBtn", text: "确 定"}
			if (!n) return;
			var $b = $('<button class="' + (n['class'] || n['cssClass']) + '">' + n.text + '</button>');
			if (n.click) {
				$b.click(function () {
					console.log(this);  // <button class="confirmBtn">确 定</button>
					n.click.call(this, popup);
				});
			}
			$btn = $btn.add($b);
		});
		if ($btn.length) {
			var $btc = $('<div class="btnContent"></div>');
			$btc.append($btn);
			$con.append($btc);
		}

		$popup.appendTo("body");

	} else {
		$popup = options.content;
		if (!$popup.hasClass("popup")) {
			$popup.wrap('<div class="popup"></div>');
			$popup = $popup.parent();
		}
		if ($popup.parent().hasClass("popup")) {
			$popup = $popup.parent();
		}
		if (options.modal) {
			$popup.addClass("modal");
		}

		$con = $popup.find('.tipContent').eq(0);

		// 设置初始化样式
		$con.css({
			position: "absolute",
			left    : "-9999",
			top     : "-9999"
		}).show();

		if (!$popup.data("static")) {
			$popup.data("static", true);
			$popup.find("[role=close], [role=cancel]").click(function () {
				popup.close();
				return false;
			});
		}
	}

	if (!$popup.data("handle")) {
		$popup.data("handle", true).bind("touchmove", function (event) {
			event.preventDefault();
		});
	}

	$(document.activeElement).blur(); // 使当前文本框失去焦点
	popup.ui = $popup;
	$popup.show();  // 这个 show() 是控制外层的 <div class="popup modal"></div> 显示
	// 主要内容居中显示
	$con.css({
		left  : "50%",
		top   : "50%",
		margin: "-" + $con.outerHeight() / 2 + "px 0 0 -" + $con.outerWidth() / 2 + "px"
	});

	// 触发 open 事件
	options.open && options.open(popup);

	// 修正滚动条位置
	setTimeout(function () {
		$(window).scrollTop($(window).scrollTop());
	}, 1);

	// 返回 popup 对象，包含 ui、options、close 方法
	return popup;
};

// 确认对话框
Common.Popup.confirm = function (msg, okClick, cancelClick) {
	Common.Popup({
		content: '<span>' + msg + '</span>',
		button : [
			{
				cssClass: "tipBtn",
				text    : "取 消",
				click   : function (popup) {
					(cancelClick && cancelClick(popup)) || popup.close();
				}
			},
			{
				cssClass: "confirmBtn",
				text    : "确 定",
				click   : function (popup) {
					(okClick && okClick(popup)) || popup.close();
				}
			}
		]
	});
};

// 带确定按钮的对话框
Common.Popup.ok = function (content, btnClick, btnText, btnClass) {
	Common.Popup({
		content: "<span>" + content + "</span>",
		button : [
			{
				cssClass: btnClass || "confirmBtn",
				text    : btnText || "确 定",
				click   : function (popup) {
					(btnClick && btnClick(popup)) || popup.close();
				}
			}
		]
	});
};

// tip
Common.Popup.showTip = function (options) {
	if ($.type(options) == "string" || options.jquery) {
		options = {content: options};
	}

	var $wrap = $('<div class="tipContent filter-float" style="display:block; top:-9999px;"><div class="tipText tc"></div></div>').appendTo("body");
	$wrap.find(".tipText").append(options.content);

	return Common.Popup({
		content  : $wrap,
		showClose: false,
		open     : function (popup) {
			popup.ui.addClass("modalTip");
			// 重写原来的 close 方法
			popup.close = function () {
				popup.ui.fadeOut(500, function () {
					popup.ui.remove();
					options.close && options.close(popup);
				});
			};
			popup.ui.hide().fadeIn(500, function () {
				options.open && options.open(popup);
				if (options.autoClose || typeof(options.autoClose) == "undefined") {
					setTimeout(function () {
						popup.close();
					}, 2000);
				}
			});
		}
	});
};

//loading
Common.Popup.showLoading = function (options) {
	if ($.type(options) == "string") {
		options = {content: options};
	}
	return Common.Popup($.extend(options, {content: '<div class="tc"><div class="loading">' + options.content + '</div></div>'}));
};

function FormatNumber(srcStr, nAfterDot) {
	var srcStr, nAfterDot;
	var resultStr, nTen;
	srcStr = "" + srcStr + "";
	strLen = srcStr.length;
	dotPos = srcStr.indexOf(".", 0);
	if (dotPos == -1) {
		resultStr = srcStr + ".";
		for (i = 0; i < nAfterDot; i++) {
			resultStr = resultStr + "0";
		}
		return resultStr;
	}
	else {
		if ((strLen - dotPos - 1) >= nAfterDot) {
			nAfter = dotPos + nAfterDot + 1;
			nTen = 1;
			for (j = 0; j < nAfterDot; j++) {
				nTen = nTen * 10;
			}
			resultStr = Math.round(parseFloat(srcStr) * nTen) / nTen;
			return resultStr;
		}
		else {
			resultStr = srcStr;
			for (i = 0; i < (nAfterDot - strLen + dotPos + 1); i++) {
				resultStr = resultStr + "0";
			}
			return resultStr;
		}
	}
}
