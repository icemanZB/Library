/*!
 * jQuery fixed v1.0.0
 *
 * Copyright 2012
 *
 * Author: Iceman.Zhou
 *
 */

(function ($) {

    var isIe6 = !window.XMLHttpRequest;
    var elements = [];
    var $window = $(window);
    var html = $('html');

    $window.on('scroll', function () {
        var scrollTop = $window.scrollTop();  // 获取滚动条滚动的距离
        $.each(elements, function (i, n) {
            n.update(n.element, n.options, scrollTop);
        });
    }).on('resize', function () {
        var scrollTop = $window.scrollTop();
        $.each(elements, function (i, n) {
            n.update(n.element, n.options, scrollTop);
        });
    });

    $.fn.fixed1 = function (opts) {
        var $this = this;

        if (!$this.length) return;

        var options = $.extend({
            left: null,
            top: null,
            right: 400,
            bottom: 100,
            onscrolling: $.noop
        }, opts);

        options.selfWidth = $this.outerWidth();
        options.selfHeight = $this.outerHeight();
        options.showAnim = 'fadeIn';
        options.hideAnim = 'fadeOut';

        // 用浏览器空白页面作为背景 , prevent screen flash in IE6 确保滚动条滚动时，元素不闪动
        if (isIe6 && html.css('backgroundAttachment') !== 'fixed') {
            html.css('backgroundAttachment', 'fixed')
                .css('backgroundImage', 'url(about:blank)');
        }

        $this.css('position', isIe6 ? 'absolute' : 'fixed');

        options.visible = $this.is(':visible');

        function update($element, options, scrollTop) {
            var pageWidth = $(document.body).width();  // document.body.offsetWidth
            var left = options.left ? options.left : pageWidth - options.selfWidth - options.right;
            var top = options.top ? options.top : document.documentElement.clientHeight - options.bottom - options.selfHeight;

            if (isIe6) {
                $element.css('position', 'absolute');

                $element[0].style.setExpression('left', 'eval((document.documentElement).scrollLeft + ' + left + ') + "px"');

                $element[0].style.setExpression('top', 'eval((document.documentElement).scrollTop + ' + top + ') + "px"');
            } else {
                $element.css({
                    "left": left,
                    "top": top
                });
            }

            if (!options.visible) {
                $element[scrollTop > 0 ? options.showAnim : options.hideAnim]();
            }

            options.onscrolling && options.onscrolling($element, options, scrollTop, isIe6);
        }

        elements.push({element: $this, options: options, update: update});

        update($this, options, $window.scrollTop());

        return this;

    };
})(jQuery);