(function ($) {

	// 重写 _resize 方法，修复 bug

	!iScroll.prototype._resize_fix && $.extend(iScroll.prototype, {
		_resize_fix: iScroll.prototype._resize,
		_resize    : function () {
			if ($(this.wrapper).is(":visible")) {
				// 当某个元素隐藏的时候，iScroll 计算高度是有问题的
				// 场景用在 tab 切换的时候，切到另外个tab，然后再切换回来就会有错乱的情况，因为之前的 tab 已经被隐藏了，高度计算就有问题
				// 这里当显示的时候，在重新计算一下高度 refresh()，等于手动调用内部方法 _resize()
				// 具体项目在 E:\project\js\Trunk\商城\webapp\list1.html 看看
				// iScroll 必须研究下
				this._resize_fix();
			}
		}
	});

	// jq插件
	$.fn.selectscroller = function (options) {

		return this.click(function () {

			var $this = $(this);
			var selectscroller = $this.data("selectscroller");

			if (!selectscroller) {
				selectscroller = new SelectScroller($this, $.extend({}, $.fn.selectscroller.defaults, selectscroller ? selectscroller.options : {}, options));
				$this.data("selectscroller", selectscroller);
			} else {
				selectscroller.show();
			}

			return false;
		});

	};

	// 默认设置
	$.fn.selectscroller.defaults = {
		source    : [], // 数据源 $("#select, ...") or [[[value, name], ...], ...]
		defaults  : null, // 默认值 [value, ...]
		ok        : "确定", // 确定按钮
		title     : "", // 标题
		addClass  : "", // 添加样式
		beforeShow: null, // 显示前的事件 function(Selectscroller)
		show      : null, // 显示时的事件 function(Selectscroller)
		scroll    : null, // 滚动事件 function(Selectscroller, index, value)
		select    : null, // 选择事件 function(Selectscroller, values)
		change    : null, // 改变事件 function(Selectscroller, values)
		close     : null // 关闭事件 function(Selectscroller)
	};

	function SelectScroller(target, options) {
		this.element = $(target);
		this.options = options;
		this.source = null; // 格式化的数据源
		this.currents = null; //当前值
		this.ui = null; // ui

		this.generate();
	}

	SelectScroller.prototype = {
		generate       : function () {
			var that = this;

			var options = that.options;

			if (!options.source || typeof(options.source) == "string" || !options.source.length) {
				return;
			}

			var $ui = $('<div class="select-scroller-ui"></div>');

			var html = ''
				+ '<div class="select-scroller-cover"></div>'
				+ '<div class="select-scroller">'
				+ '<div class="ss-header">'
				+ '<span class="ss-header-l"></span>'
				+ '<span class="ss-header-r"></span>'
				+ '</div>'
				+ '<div class="ss-select-wraper clearfix">'
				+ '{{select}}'  // {{select}} 只是个占位符
				+ '</div>'
				+ '</div>';

			var source = [];
			var currents = options.defaults || [];  // ["1980", "01", "01"]

			// 日期 select 就走了 if
			if (!options.source.jquery) {

				source = options.source;

				if (!currents.length) {
					$.each(source, function (i, v) {
						currents.push(v[0][0]);
					});
				}

			} else {
				var _defaults = [];
				options.source.each(function () {

					_defaults.push(this.value);

					var a = [];

					$(this).find("option").each(function () {
						a.push([this.value, $(this).text()]);
					});

					source.push(a);
				});

				if (!currents.length) {
					currents = _defaults;
				}
			}

			// 赋值到构造函数的属性上
			that.source = source;
			that.currents = currents;

			// console.log(source);

			var html2 = "";
			var str = "";
			var widthPercent = 100 / source.length;

			$.each(source, function (i, data) {
				str = ''
					+ '<div class="ss-select" style="width:' + widthPercent + '%;">'
					+ '<div class="ss-select-wa">'
					+ '<div class="ss-select-wb">'
					+ '<div class="ss-select-wc">'
					+ '<div class="ss-select-wd">'
					+ '<div class="ss-select-scroller">'
					+ '<ul>'
					+ that.generateOptions(data)
					+ '</ul>'
					+ '</div>'
					+ '</div>'
					+ '<div class="ss-select-we"></div>'
					+ '</div>'
					+ '</div>'
					+ '</div>'
					+ '</div>';
				html2 += str;
			});

			html = html.replace("{{select}}", html2); // 替换占位符

			$ui.html(html); // 添加到容器中

			var $header   = $ui.find(".ss-header"),
			    $header_l = $header.find(".ss-header-l"),
			    $header_r = $header.find(".ss-header-r");

			var $title, $ok;

			if (options.title) {
				// console.log( options.title ); 出生日期
				$title = $('<label>' + options.title + '</label>').appendTo($header_l);
			}

			// console.log( options.ok ); 确定
			if (options.ok) {
				$ok = $('<a href="#" class="ss-btn ss-ok">' + options.ok + '</a>').appendTo($header_r).click(function () {
					that.ok();
					return false;
				}).bind('touchstart', function () {
					$(this).addClass("active");
				}).bind('touchend', function () {
					$(this).removeClass("active");
				});
			}

			that.ui && that.ui.remove();

			$ui.hide().addClass(options.addClass).appendTo("body");

			$ui.data({
				"element"       : that.element,
				"selectscroller": that
			});

			that.ui = $ui;
			that.ui.cover = $ui.find(".select-scroller-cover").hide();  // 遮罩层初始隐藏
			that.ui.ss = $ui.find(".select-scroller");
			that.ui.selects = that.ui.ss.find(".ss-select-scroller"); // 找到添加 iScroll 的 div

			that.ui.ok = $ok;
			that.ui.title = $title;

			// 点击遮罩层隐藏
			that.ui.cover.click(function () {
				that.close();
			});

			// 为了让 iScroll 计算高度不出问题，这里先显示一下
			that.ui.show();

			that.ui.selects.each(function (i, div) {
				$(div).data("iScroll", new iScroll(div, {
					hScroll    : false,
					vScroll    : true,
					hScrollbar : false,
					vScrollbar : false,
					bounce     : true,
					momentum   : true,
					snap       : "li",
					onScrollEnd: function () {
						that.options.scroll && that.options.scroll.call(that.element, that, i, that.getSelectVal(that.ui.selects.eq(i)));
					}
				}));
			});

			that.show();

		},
		// 生成 option
		generateOption : function (data) {
			// data => [1916, "1916年"]
			return '<li data-val="' + data[0] + '">' + data[1] + '</li>';
		},
		generateOptions: function (data) {
			var that = this;
			var html = '<li></li><li></li>';
			$.each(data, function (i, v) {
				// console.log(i,v);  0 [1916, "1916年"]
				html += that.generateOption(v);
			});
			html += '<li></li><li></li>';
			return html;
		},
		// 显示
		show           : function () {
			this.options.beforeShow && this.options.beforeShow.call(this.element, this);
			this.ui.show();
			this.setVal();
			this.ui.cover.fadeIn(350);
			this.ui.ss.removeClass("ss-slideup-out").addClass("ss-slideup-in");
			this.options.show && this.options.show.call(this.element, this);
		},
		// 设值
		setVal         : function (values) {
			var that = this;
			values = values || that.currents;
			$.each(values, function (i, v) {
				that.setSelectVal(that.ui.selects.eq(i), v);
			});
		},
		setSelectVal   : function ($select, value) {
			var iScroll = $select.data("iScroll");
			if (iScroll) {
				var $li = $select.find("li[data-val=" + value + "]:first");
				// iScroll.scrollToPage：重新定位，减掉 2 是因为有 2 个空的 li
				iScroll.scrollToPage(0, $li.length ? $li.index() - 2 : 0);
			}
		},
		// 取值
		getVal         : function () {
			var that = this;
			var values = [];
			that.ui.selects.each(function () {
				values.push(that.getSelectVal($(this)));
			});
			return values;
		},
		getSelectVal   : function ($select) {

			var iScroll = $select.data("iScroll");

			if (!iScroll) {
				return "";
			}
			// 这里没有理解为什么不直接用 iScroll.currPageY，iScroll.currPageY 是动态改变的，iScroll.pagesY 是个恒定的数组
			var currPageY = Math.min(iScroll.currPageY, iScroll.pagesY.length - 4 - 1);

			return $select.find("li[data-val]").eq(currPageY).data("val") || "";
		},
		// 关闭
		close          : function () {
			var that = this;
			if (that.closing) {
				return;
			}
			that.closing = true;
			that.ui.cover.fadeOut(350);
			that.ui.ss.removeClass("ss-slideup-in").addClass("ss-slideup-out");
			setTimeout(function () {
				that.ui.hide();
				that.closing = false;
				that.options.close && that.options.close.call(that.element, that);
			}, 350);
		},
		// 完成
		ok             : function () {
			var that     = this,
			    values   = that.getVal(),
			    currents = that.currents,
			    bChanged = false;

			// console.log(currents); 默认值
			// console.log( values ); 当前选中的值

			$.each(values, function (i) {
				if (values[i] != currents[i]) {
					bChanged = true;
					if (that.options.source.jquery) {
						that.options.source.eq(i).val(values[i]).trigger("change");
					}
				}
			});

			that.currents = values;
			that.options.select && that.options.select.call(that.element, that, values);
			bChanged && that.options.change && that.options.change.call(that.element, that, values);
			that.close();
		}

	};

	$(document).on("touchmove", ".select-scroller", function (ev) {

		ev.preventDefault();
		ev.stopPropagation();

	}).one("touchstart", function () {

		$(document).on("click", ".ss-select-scroller li", function () {
			var $li = $(this);

			// 过滤掉空的 li
			if (!$li.data("val")) {
				return;
			}

			var $select = $li.closest(".ss-select-scroller");
			var $ui = $select.closest(".select-scroller-ui");

			if (!$select.length || !$ui.length) {
				return;
			}

			var iScroll = $select.data("iScroll");

			iScroll.scrollToPage(0, $li.index() - 2);
		});

	});

})(jQuery);
