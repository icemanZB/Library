(function ($) {

	var isIe6      = !window.XMLHttpRequest,
	    $window    = $(window),
	    html       = $("html"),
	    pageWidth  = $window.width(),
	    pageHeight = $window.height(),
	    aEles      = [];

	$window.on("scroll resize click", function () {
		$.each(aEles, function (i, n) {
			n.update(n.ele, n.options, $window.scrollTop());
		});
	});

	$.fn.fixed = function (opts) {
		var $this = this;

		if (!$this.length) return;

		var options = $.extend({
			left       : null,
			top        : null,
			right      : 400,
			bottom     : 100,
			showAnim   : "fadeIn",
			hideAnim   : "fadeOut",
			onscrolling: $.noop
		}, opts);

		options.selfWidth = $this.outerWidth();
		options.selfHeight = $this.outerHeight();
		options.visible = $this.is(":visible");

		// 用浏览器空白页面作为背景 , prevent screen flash in IE6 确保滚动条滚动时，元素不闪动
		if (isIe6 && html.css("backgroundAttachment") !== "fixed") {
			html.css({
				"backgroundAttachment": "fixed",
				"backgroundImage"     : "url(about:blank)"
			})

		}

		$this.css("position", isIe6 ? "absolute" : "fixed");

		aEles.push({ele: $this, options: options, update: $.fn.fixed.update});

		return this;

	};

	$.fn.fixed.update = function ($element, options, scrollTop) {
		var left = options.left ? options.left : pageWidth - options.selfWidth - options.right;

		var top = options.top ? options.top : pageHeight - options.bottom - options.selfHeight;

		if (isIe6) {

			$element[0].style.setExpression("left", 'eval((document.documentElement).scrollLeft + ' + left + ') + "px"');

			$element[0].style.setExpression("top", 'eval((document.documentElement).scrollTop + ' + top + ') + "px"');
		} else {
			$element.css({
				"left": left,
				"top" : top
			});
		}

		if (!options.visible) {
			$element[scrollTop > 0 ? options.showAnim : options.hideAnim]();
		}

		options.onscrolling && options.onscrolling($element, options, scrollTop, isIe6);

	}
})(jQuery);