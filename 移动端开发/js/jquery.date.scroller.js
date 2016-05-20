(function ($) {

	// 日期选择器插件
	$.fn.datescroller = function (options) {

		options = options || {};

		options.formField = $(options.formField);

		if (options.beforeShow) {
			options.__beforeShow = options.beforeShow;
			delete options.beforeShow;
		}
		if (options.scroll) {
			options.__scroll = options.scroll;
			delete options.scroll;
		}
		if (options.select) {
			options.__select = options.select;
			delete options.select;
		}

		(function () {
			if (options.source) {
				return;
			}

			var yearsAround = options.yearsAround || -100;
			delete options.yearsAround;

			var now = new Date();
			var years = [];
			var currYear = now.getFullYear();
			for (var i = 0; i <= Math.abs(yearsAround); i++) {
				years.push(
					yearsAround < 0 ?
						[currYear + yearsAround + i, currYear + yearsAround + i + "年"]
						:
						[currYear + i, currYear + i + "年"]
				);
			}

			var months = [];
			var j = 1;
			for (; j <= 12; j++) {
				months.push([j < 10 ? "0" + j : j, (j < 10 ? "&nbsp;" + j : j) + "月"]);
			}

			var days = [];
			var k = 1;
			for (; k <= 31; k++) {
				days.push([k < 10 ? "0" + k : k, (k < 10 ? "&nbsp;" + k : k) + "日"]);
			}

			options.source = [years, months, days];

			// 没有设置默认值，内置规律
			if (!options.defaults) {
				if (yearsAround > 0) {
					options.defaults = [currYear + 1, (now.getMonth() < 9 ? "0" : "") + (now.getMonth() + 1), now.getDate() < 10 ? "0" + now.getDate() : now.getDate()];
				} else {
					options.defaults = [years[years.length - 1][0], months[months.length - 1][0], days[days.length - 1][0]];
				}
			}

		})();

		options = $.extend({
			title     : '出生日期',
			select    : function (SelectScroller, values) {
				var birth = values[0] + "-" + values[1] + "-" + values[2];
				options.formField.val(birth);
				options.__select && options.__select(SelectScroller, birth);
			},
			beforeShow: function (SelectScroller) {
				var that = SelectScroller;
				that.year_ready = false;
				that.month_ready = false;
				var birth = options.formField.val();

				if (birth) {
					birth = birth.split("-");
				} else {
					birth = options.defaults;
				}

				birth && (that.currents = birth);
				options.__beforeShow && options.__beforeShow(SelectScroller);
			},
			scroll    : function (SelectScroller, index, value) {
				var that = SelectScroller;
				// 三级联动
				(function () {
					if (index == 2) { //选日，不处理
						return;
					}
					if (index == 0) { // 选年份
						that.year_ready = true;
					}
					if (index == 1) { // 选月份
						that.month_ready = true;
					}

					if (!that.year_ready || !that.month_ready) {
						return;
					}

					var $select_year = that.ui.selects.eq(0);
					var $select_month = that.ui.selects.eq(1);
					var $select_day = that.ui.selects.eq(2);

					var year = that.getSelectVal($select_year);

					var month = that.getSelectVal($select_month);

					var days = 32 - new Date(year, month - 1, 32).getDate(); // 获取当月的天数

					var $items = $select_day.find("[data-val]");
					// 动态设置天数
					if ($items.length == days) {
						return;
					} else if ($items.length > days) {
						// console.log(days,$items.slice(days));
						// slice()  在只有一个参数的情况下，会返回该参数指定位置开始到当前数组末尾的所有项 ( 31 -> 30 )，那么第 31 个会被删除
						$items.slice(days).remove();
					} else {
						var html = "";
						// $items.length：30; days：31
						for (var i = $items.length + 1; i <= days; i++) {
							html += that.generateOption([i, i + "日"]);
						}
						// 添加到每一项的最后，由于生成的 li，有最后两个空li，所以要这样做
						$(html).insertAfter( $items.last() );
					}

					// DOM 节点更新就要刷新一次 iScroll
					$select_day.data("iScroll").refresh();

				})();

				options.__scroll && options.__scroll(SelectScroller, index, value);
			}

		}, options);



		return this.selectscroller(options);

	};

})(jQuery);
