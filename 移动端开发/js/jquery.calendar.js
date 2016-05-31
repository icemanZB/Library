(function ($) {
	$.fn.calendar = function (options) {
		return this.each(function () {
			var $this = $(this);
			var calendar = $this.data("calendar");
			var opts = $.extend({}, $.fn.calendar.defaults, calendar ? calendar.options : {}, options);
			if (!calendar) {
				calendar = new Calendar($this, opts);
			} else {
				calendar.options = opts;
				calendar.update();
			}
			$this.data("calendar", calendar);
		});
	};

	// 默认设置
	$.fn.calendar.defaults = {
		currDate       : 0, // 当前日期，默认系统当前时间
		startDate      : "", // 日历起始日期，默认当前月份
		format         : "YYYY-MM-DD", // 日期格式
		// dayNames: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
		dayNames       : ["日", "一", "二", "三", "四", "五", "六"], // 星期的名称
		startDay       : 0, // 星期的开始, Sun = 0, Mon = 1, ...
		prev           : null, // 上月按钮
		next           : null, // 下月按钮
		minDate        : null, // 最小可选择日期 +1y 代表一年后, +1m -> 1月, +1w -> 1周, +1 -> 1天, 0 当天
		maxDate        : null, // 最大可选择日期
		showMonths     : 2, // 显示月数
		showOtherMonths: false, // 显示日历中的其他月份的日期
		appendWrap     : '', // 日历添加容器的位置，默认 body
		beforeShow     : null, // 日期显示前的事件
		onSelect       : null // 选择事件
	};

	// 日历对象
	function Calendar(target, options) {
		this.$element = $(target);
		this.options = options;
		this.generate();
	}

	Calendar.prototype = {
		update: function (date) {
			this.generate(date);
		},

		generate: function (date) {
			var opts = this.options;

			date = new Date(date || opts.startDate || Date.now());

			// console.log(date);  // Mon May 16 2016 星期一 五月 16号

			// 获取上面变量 date 的 "年 月"，在生成新的 date 指向这个年的月份的第一天

			date = new Date(date.getFullYear(), date.getMonth());
			
			// console.log(date);  // Sun May 01 2016 星期天 五月 1号

			this.minDate = $.calendar.parseDate(opts.minDate);

			// console.log( this.minDate,opts.minDate );

			this.maxDate = $.calendar.parseDate(opts.maxDate);

			var currDate = $.calendar.parseDate(opts.currDate); // 选中的日期

			var $calendar = $('<div class="calendar-wrapper"></div>');

			// 循环显示多少个月
			for (var i = 0; i < opts.showMonths; i++) {
				$calendar.append(this.getHtml(date, currDate));
				date.setMonth(date.getMonth() + 1); // 设置下月
			}

			// 当某个对象重复绑定的时候，后者会覆盖前者
			if (this.$calendar) {
				this.$calendar.replaceWith($calendar);
			}

			this.$calendar = $calendar;

			var nodeName = this.$element[0].nodeName.toLowerCase();

			var inline = nodeName == "div" || nodeName == "span";

			var appendWrap = opts.appendWrap;  // 添加的容器

			if (!appendWrap) {
				appendWrap = inline ? this.$element : "body";
			}

			$calendar.appendTo(appendWrap);

			// 事件绑定
			this.bindEvents();
		},

		getHtml: function (date, currDate) {
			var _this = this;
			var options = this.options;

			var today = $.calendar.clearTime(new Date());  // 过滤掉了时分秒

			// console.log(today);  // Mon May 16 2016 星期一 五月 16号

			var drawDate = new Date(date.getFullYear(), date.getMonth(), 1);

			// Sun May 01 2016  星期天 5月 1号
			// Wed Jun 01 2016  星期三 6月 1号
			// Fri Jul 01 2016  星期五 7月 1号
			// console.log( drawDate );  // 所要画的日历，默认也是当前月的第一天

			var drawYear = drawDate.getFullYear();
			var drawMonth = drawDate.getMonth();  // 4月 5月 6月，比实际少了一个月
			var drawDay = drawDate.getDay();  // 星期 ( 从 Date 对象返回当前月的第一天是礼拜几 (0 ~ 6)，0 代表是礼拜天 )

			// var dayNames = options.dayNames.slice(options.startDay).concat(options.dayNames.slice(0, options.startDay)); // 星期显示的顺序

			// 上月遗留的天数
			var preDays = (drawDay + options.dayNames.slice(options.startDay).length) % 7;

			// 当月的天数
			var daysInMonth = $.calendar.getDaysInMonth(drawYear, drawMonth);

			var colSize = 7; // 7列

			// ( 上月遗留的天数 + 这月的总天数 ) / 7 向上取整
			var rowCount = Math.ceil((preDays + daysInMonth) / colSize);  // 行数

			var dateSettings = {};

			// [dateName, cssClass]
			dateSettings[today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate()] = ["<span>今天</span>", "today"];

			// setDate() 设置 Date 对象中月的某一天 (1 ~ 31)，today.getDate() 获取是几号 16号

			today.setDate(today.getDate() + 1);

			dateSettings[today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate()] = ["<span>明天</span>", ""];

			today.setDate(today.getDate() + 1);

			dateSettings[today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate()] = ["<span>后天</span>", ""];

			// 2016-5-16:["今天", "today",16],2016-5-17:["明天", "",17],2016-5-18: ["后天", "",18]
			// 2016-5-16:["今天", "today"],2016-5-17:["明天", "",17],2016-5-18: ["后天", ""]
			// 2016-5-16:["今天", "today"],2016-5-17:["明天", ""],2016-5-18: ["后天", ""]

			var html = '<div class="calendar" data-year="' + drawYear + '" data-month="' + drawMonth + '">';
			html += '<table>';
			html += '<caption>' + drawYear + '年 ' + (drawMonth + 1) + '月</caption>';  // 月份要 +1
			// html += '<thead><tr><th>' + options.dayNames.join('</th><th>') + '</th></tr></thead>';
			html += '<thead><tr>';
			for (var i = 0; i < 7; i++) { // days of the week
				var day = (i + options.startDay) % 7; // 计算从星期几开始

				// console.log((i + options.startDay + 6) , (i + options.startDay + 6) % 7 , i  );

				html += '<th' + ((i + options.startDay + 6) % 7 >= 5 ? ' class="weekend"' : '') + '>' + options.dayNames[day] + '</th>';
			}
			html += '</tr></thead>';

			html += '<tbody>';
			for (var row = 1; row <= rowCount; row++) {
				html += '<tr>';
				// 循环列 ( 天数 )
				for (var col = 1; col <= colSize; col++) {

					// 第一行 1-7、第二行 8-14、第三行 15-21、第四行 22-28、第五行 29-35、第六行 36-42 ( 如果有的话 )
					var j = (row - 1) * colSize + col;

					var printDate = new Date(drawYear, drawMonth, j - preDays);

					// Tue May 31 2016 00:00:00, 31, 0, 31
					// console.log(printDate, j, preDays, j - preDays,daysInMonth);

					var settings;
					if (j <= preDays) {
						// Sun May 29 2016 00:00:00, 1, 3, -2
						// Mon May 30 2016 00:00:00, 2, 3, -1
						// Tue May 31 2016 00:00:00, 3, 3, 0
						settings = getDateSettings(printDate, true); // 上月的
					} else if (j > preDays + daysInMonth) {
						// Wed Jun 01 2016 00:00:00, 32, 0, 32
						// Thu Jun 02 2016 00:00:00, 33, 0, 33
						// Fri Jun 03 2016 00:00:00, 34, 0, 34
						// Sat Jun 04 2016 00:00:00, 35, 0, 35
						settings = getDateSettings(printDate, true); // 下月的
					} else {
						settings = getDateSettings(printDate, false); // 本月的
					}

					html += '<td class="' + settings[1] + '" data-day="' + settings[2] + '"><a>' + settings[0] + '</a></td>';
				}
			}
			html += '</tbody>';
			html += '</table>';
			html += '</div>';

			function getDateSettings(date, otherMonth) {
				// 几号 ( 1-31 )
				var day = date.getDate();

				// 除了本月日期，其他月的日期都是禁用的，覆盖了上面定义的 settings
				if (otherMonth) {
					return [options.showOtherMonths ? day : "", "disabled", day];

				}

				// 设置本月的 setting
				var settings = dateSettings[drawYear + "-" + (drawMonth + 1) + "-" + day];

				// console.log( settings );

				if (settings) {
					settings.push(day);
				} else {
					settings = ["<span>" + day + "</span>", "", day]; // [day name, class, day]
				}

				// date.getDay()：从 Date 对象返回一周中的某一天 (0 ~ 6)
				if ("06".indexOf(date.getDay() + "") !== -1) {
					settings[1] += " weekend"; // 周末
				}

				if (currDate && currDate.getTime() == date.getTime()) {
					settings[1] += " selected"; // 选中
					settings[0] += "<small>出发</small>";
				}

				if ((_this.minDate && _this.minDate > date) || (_this.maxDate && _this.maxDate < date)) {
					settings[1] += " disabled"; // 可选范围以外
				}

				(_this.options.beforeShow || $.noop).call(_this, _this, date, settings);

				// console.log( settings );

				return settings;
			}

			return html;
		},

		bindEvents: function () {
			var _this = this;
			this.$calendar.on("click.calendar", "td", function () {
				var $td = $(this);

				if ($td.hasClass("disabled")) return;

				_this.selectDate($td);

			});

		},

		selectDate: function ($cell) {

			var $calendar = $cell.closest(".calendar");

			var data = $calendar.data();

			var date = new Date(data.year, data.month, $cell.data("day"));

			var dateFormat = $.calendar.formatDate(this.options.format, date);

			// this.$calendar.find(".selected").eq(0).removeClass("selected");

			// $cell.addClass("selected");

			this.$calendar.find(".selected").eq(0).removeClass("selected").find("small").remove();

			$cell.addClass("selected").children().append("<small>出发</small>");

			(this.options.onSelect || $.noop).call(this, dateFormat, date, $cell, this);
		}
	};

	// 静态方法
	$.calendar = {
		// 获取指定月的天数
		getDaysInMonth: function (year, month) {

			// console.log( month );  // 4 5 6

			// Sat Apr 30 2016 星期六 4月 30 天
			// Tue May 31 2016 星期二 5月 31 天
			// Thu Jun 30 2016 星期四 6月 30 天
			// console.log( new Date(year, month, 0) );  // 4 月 5 月 6 月
			// console.log(new Date(year, month, 0).getDate());  // 30 天 31 天 30 天

			// Wed Jun 01 2016 星期三 6月 1 号  30 天
			// Sat Jul 02 2016 星期六 7月 2 号  31 天
			// Mon Aug 01 2016 星期一 8月 1 号  31 天

			// console.log( new Date(year, month, 32) );  // 6月 7月 8月

			// console.log( new Date(year, month, 32).getDate() );  // 1 号 2 号 1 号 ( 从 Date 对象返回一个月中的某一天 )

			// console.log(  32 - new Date(year, month, 32).getDate() );  // 5月 31天 6月 30天 7月 31天

			return 32 - new Date(year, month, 32).getDate();
		},

		// 转换日期
		parseDate: function (param, curDate) {
			var offsetString = function (offset) {
				var date = curDate || new Date();
				var year = date.getFullYear();
				// 获取 month 正常来说应该是要 +1 显示和系统时间一样的月份
				var month = date.getMonth();
				var day = date.getDate();
				var pattern = /([+-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g;

				var matches = pattern.exec(offset);

				// 如果 offset 参数是 "+59"，那么 exec("+59") 后的结果是：["+59", "+59", undefined, index: 0, input: "+59"]
				// 如果 offset 参数是 "+1y"，那么 exec("+1y") 后的结果是： ["+1y", "+1", "y", index: 0, input: "+1y"]
				// console.log(matches);

				// 只传了数字，按照天数计算
				switch (matches[2] || "d") {
					case "d" :
					case "D" :
						day += parseInt(matches[1], 10);
						break;
					case "w" :
					case "W" :
						day += parseInt(matches[1], 10) * 7;
						break;
					case "m" :
					case "M" :
						month += parseInt(matches[1], 10);
						//day = Math.min(day, $.calendar.getDaysInMonth(year, month));
						break;
					case "y":
					case "Y" :
						year += parseInt(matches[1], 10);
						//	day = Math.min(day, $.calendar.getDaysInMonth(year, month));
						break;
				}

				return new Date(year, month, day);
			};

			var date = null;

			if (typeof(param) == "undefined" || param == null) {
				return null;
			}

			if (typeof(param) == "object") {
				if (param.getFullYear) {
					return param;
				} else {
					return null;
				}
			}

			if (typeof(param) == "string") {

				if (param.toString() === "") {
					return null;
				}

				// 传入的参数是 2016-05-19 这样的格式会进这个 if
				if (/^[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}$/.test(param) || /^[0-9]{4}\-[0-9]{1,2}\-[0-9]{1,2}$/.test(param)) {
					date = new Date(param.replace(/\-/g, "/"));
				}
			}

			//  param 参数可能是传入了 "+59" 这类
			if (!date) date = offsetString(param);

			date = (date.toString() == "Invalid Date" ? null : date);

			return date;
		},

		// 日期格式化
		formatDate: function (format, date) {
			if (!date) return "";
			format = (format || "YYYY-MM-DD").toUpperCase();
			if (format.indexOf("YYYY") === -1) {
				format = format.replace("YY", "YYYY");
			}
			var year = date.getFullYear();
			var month = date.getMonth() + 1;
			var day = date.getDate();

			// if (month < 10) month = "0" + month.toString();
			if (day < 10) day = "0" + day.toString();

			var str = format;
			str = str.replace(/YYYY/gi, year.toString());
			str = str.replace(/MM/gi, month.toString());
			str = str.replace(/DD/gi, day.toString());

			return str;
		},

		// 清除日期的时间
		clearTime: function (date) {
			if (!date) return null;
			return new Date(date.getFullYear(), date.getMonth(), date.getDate());
		}
	};

})(jQuery);




