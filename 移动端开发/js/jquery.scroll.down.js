(function ($) {

	$.fn.scrolldown = function (opts) {
		var $scroller = this;
		var options = $.extend({}, $.fn.scrolldown._default, opts);
		var $content = $(options.selector);

		if (!$content.length) {
			$content = $scroller;
		}

		options.$scroller = $scroller;

		$content.data("options", options);

		var $contents = $scroller.data("contents");

		if (!$contents) {
			$contents = $content;
		} else {
			$contents = $contents.add($content);
		}

		$scroller.data("contents", $contents);

		if ($scroller.data("bind")) {
			return this;
		}

		$scroller.data("bind", true).bind("scroll touchmove", function () {

			var $contents = $scroller.data("contents");

			if (!$contents || !$contents.length) {
				return;
			}

			// 获取 window 的 scrollTop
			var scrollTop = $scroller.scrollTop();

			// console.log(scrollTop);

			// 如果是 window 的话就是可视区的高度
			var offsetHeight = $scroller[0]["window"] ? $(window).height() : $scroller[0].offsetHeight;

			// 如果是 window 的话就是整个文档的高度
			var scrollHeight = $scroller[0]["window"] ? $(document).height() : $scroller[0].scrollHeight;

			// console.log( scrollHeight, offsetHeight ); 820,568
			// options.threshold：提前多少加载
			if (scrollTop >= scrollHeight - offsetHeight - options.threshold) {
				$contents.each(function () {
					options.onscrolldown && options.onscrolldown();
					LoadContent($(this));
				});
			}
		}).trigger("scroll");

		return this;
	};

	function LoadContent($content) {

		// $content.is(":visible") 判断是否显示，容器不显示就不走下面
		if ($content.data("loading") || $content.data("disabled") || !$content.is(":visible")) {
			return;
		}

		var options = $content.data("options");

		// url 不存在也不走下面
		if (!options.url) {
			return;
		}

		// 如果开始页大于总页数就禁止滚动，配置的总页数在 html 中
		if (options.pageStart > $content.data("page-count")) {
			disabled($content);
			return;
		}

		$content.data("loading", true);

		var loadingStyle = options.loadingStyle || 1;

		if (typeof(loadingStyle) == "number") {
			if (loadingStyle == 1) {
				loadingStyle = '<div class="loading-png"><span class="loading-pic"></span>loading</div>';
			} else {
				loadingStyle = '<div class="loading global"><em></em><span>努力加载中…</span></div>';
			}
		}

		// 构建 loading
		var $loading = $(loadingStyle).appendTo("body");

		options.onload && options.onload($content);

		$.ajax({
			url     : options.url,
			data    : options.pageParameter + "=" + options.pageStart,
			type    : "GET",
			dataType: "html",
			timeout : 10000,
			success : function (data) {
				onload(data);
				$loading.remove();
			},
			error   : function () {
				$content.data("loading", false);
				options.onerror && options.onerror($content);
				$loading.remove();
			}
		});

		function onload(data) {
			options.pageStart++;

			if (data) {
				$content.append(data.html || data);
			}

			// console.log($content.data());

			if (!data || options.pageStart > $content.data("page-count") || options.pageStart > data.PageCount) {
				disabled($content);
			}

			options.oncomplete && options.oncomplete($content);

			$content.data("loading", false);
		}

		function disabled($content) {

			$content.data("disabled", true);   // 设置禁用

			var $contents = options.$scroller.data("contents");

			// console.log( $contents,$content );

			$contents = $contents.not($content); // 去掉容器

			options.$scroller.data("contents", $contents);

		}
	}

	$.fn.scrolldown._default = {
		selector     : "",
		url          : "",
		threshold    : 100,
		loadingStyle : 2,
		pageStart    : 2,
		pageParameter: "PageNumber",
		checkVisible : true,
		onscrolldown : null,
		onload       : null,
		oncomplete   : null,
		onerror      : null
	};

})(jQuery);