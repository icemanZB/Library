(function ($) {

	// 重写_resize方法，修复bug
	// 当某个元素隐藏的时候，iScroll 计算高度是有问题的
	// 场景用在 tab 切换的时候，切到另外个tab，然后再切换回来就会有错乱的情况，因为之前的 tab 已经被隐藏了，高度计算就有问题
	// 这里当显示的时候，在重新计算一下高度 refresh()，等于手动调用内部方法 _resize()
	// 具体项目得找下？？？ 还没找到具体的项目
	// iScroll 必须研究下
	!iScroll.prototype._resize_fix && $.extend(iScroll.prototype, {
		_resize_fix: iScroll.prototype._resize,
		_resize    : function () {
			if ($(this.wrapper).is(':visible')) {
				this._resize_fix();
			}
		}
	});

	// resize 会自动调用 refresh()
	// 这里是修正 refresh() 当前页的问题
	!iScroll.prototype._refresh_fix && $.extend(iScroll.prototype, {
		_refresh_fix: iScroll.prototype.refresh,
		refresh     : function () {
			this._refresh_fix();
			this.scrollToPage(this.currPageX, 0);
		}
	});

	$.fn.iScroll = function (options) {
		return this.each(function () {
			var $this = $(this);
			var $scroller = $this.children().eq(0);
			var $slides = $scroller.children();
			if (options.hScroll && options.pager) {
				$scroller.width($slides.length * $this.width() );
			}

			var that = new iScroll(this, options);

			$this.data("iScroll", that);

			// resize 重新计算宽度
			$(window).on("resize", function () {
				if (options.hScroll && options.pager) {
					$scroller.width($slides.length * $this.width());
				}
			});

			if (options.pager) {
				// 翻页功能扩展
				var $pager;
				if (typeof options.pager) {
					$pager = $('<div class="pager"></div>').insertAfter($scroller);
				} else {
					$pager = $(options.pager);
				}

				// 创建指示器
				$pager.html((function (len) {
					var html = '';
					for (var i = 1; i <= len; i++) {
						html += '<a href="#" class="' + (i == 1 ? 'current' : '') + '">' + i + '</a>';
					}
					return html;
				})($slides.length));

				var $pages = $pager.children();

				// 事件绑定
				$pager.on("click", "a", function () {
					var page = $(this).index();
					$pages.removeClass("current").eq(page).addClass("current");
					// 滚动到那一页
					that.scrollToPage(page, 0);
					return false;
				});
			}

			that.options.onBeforeScrollStart = function (event) {
				if (!event.touches) {
					event.preventDefault();
				}
				options.onBeforeScrollStart && options.onBeforeScrollStart.call(this);
			};

			that.options.onScrollMove = function (event) {
				// 由于 iScroll 修改了默认事件，所以在区域中滚动的时候，默认的滚动是不会触发的
				// 想要触发的话，就要阻止 iScroll 页面滚动
				if (that.options.hScroll && that.dirX != 0) {
					event.preventDefault();
				}
				if (that.options.vScroll && that.dirY != 0) {
					event.preventDefault();
				}
				options.onScrollMove && options.onScrollMove.call(this);
			};

			that.options.onScrollEnd = function () {
				if ($pages) {
					$pages.removeClass("current").eq(this.currPageX).addClass("current");
				}
				options.onScrollEnd && options.onScrollEnd.call(this);
			};

		});
	};

})(jQuery);
