/*!
 * jQuery scroller v1.0.0
 *
 * Copyright 2012, Joying E-Commerce
 * http://trip.cmbchina.com/
 *
 * Author: Jason.Wang
 *
 */

(function ($) {
    $.fn.scroller = function (opts) {
        var options = $.extend({
            fx: 'scroll', // effect, string or function
            scroller: '.wrap',
            items: '.items .item',
            triggers: '.triggers',
            triggerEvent: 'mouseover',
            selected: null, // number, string, object. show selected tab on init.
            prev: '.prev',
            prevClass: ['prev', 'prev-disable'], // [activeClass, disableClass]
            next: '.next',
            nextClass: ['next', 'next-disable'],
            lazyload: '.loading img',
            auto: 5000,
            speed: 300,
            step: null,
            loop: true,
            onscroll: $.noop,
            onready: $.noop
        }, opts);

        $(this).each(function () {
            var $container = $(this);
            // 设置匹配元素的滚动条的水平位置，并且返回匹配元素
            var $scroller = $container.find(options.scroller).scrollLeft(0);
            // 获取元素的宽度，不包括padding、border、margin
            var scrollerWidth = $scroller.width();
            options.step = options.step || scrollerWidth;
            // 显示第几项
            var showItems = parseInt(scrollerWidth / options.step);
            // 找到所有的项
            var $items = $container.find(options.items);
            // var stepItems = options.step / $items.eq(0).width();
            // 循环的数字
            var $triggers = options.triggers ? $container.find(options.triggers) : null;
            var $prev = $container.find(options.prev);
            var $next = $container.find(options.next);

            // 不存在则创建一个空div
            if (!$triggers || !$triggers.length) {
                $triggers = $('<div></div>');
            }

            // 如果num数量与图片数量不符，则要对应创建相同数目的a
            if ($triggers.children().length != $items.length) {
                $triggers = $triggers.html($items.map(function (i) {
                    return '<a href="#"' + (i == 0 ? ' class="current"' : '') + '>' + (i + 1) + '</a>';
                }).get().join('')).children();
            } else {
                $triggers = $triggers.children();
            }

            $triggers.bind(options.triggerEvent, function () {
                transform($(this));
            }).click(function () {
                $(this).blur();
                return false;
            });

            if ($items.length <= showItems) {
                $prev.removeClass(options.prevClass[0]).addClass(options.prevClass[1]).removeAttr('href');
                $next.removeClass(options.nextClass[0]).addClass(options.nextClass[1]).removeAttr('href');
            } else {
                $prev.click(function () {
                    transform(null, -1);
                    $(this).blur();
                    return false;
                });
                $next.click(function () {
                    transform(null, +1);
                    $(this).blur();
                    return false;
                });
            }

            var fx = typeof(options.fx) === 'function' ? fx : $.fn.scroller.fx[options.fx];

            var fxInit = $.fn.scroller.fxInit[options.fx];

            // 滑动到指定的trigger
            var transform = function ($trigger, position, loop) {
                // 0 (第1个a去掉了current，显示第二张图片)
                // 1 (第2个a去掉了current，显示第三张图片)
                // 2 (第3个a去掉了current，显示第一张图片) 0 1 2 loop ( 索引 )
                // 筛选出有.current样式的a标签，去掉current样式，并且获得到这个元素当前的索引
                var iprev = $triggers.filter('.current').removeClass('current').index() || 0; // 上一个
                // 1(第二张图片显示)
                // 2(第三张图片显示)
                // 3(第一张图片显示) 1 2 3 loop
                // 这边是两个逻辑，一个是鼠标移入，$trigger 有值，获取鼠标移入元素的当前索引
                // 如果是自动播放，$trigger为 undefined，获得a标签的索引 + position ( 位置 1 )
                var icurr = ($trigger ? $trigger.index() : iprev) + (position || 0);
                // 是否循环播放
                var lp = loop || options.loop;
                var max = $triggers.length - showItems; // $triggers.length(3) - showItems(1) = 2
                var overstep = undefined;
                // 一次循环结束回到第一张图片，判断是否继续循环 ( 自动播放 )
                if (icurr > max) {
                    icurr = lp ? overstep = 0 : max;
                }
                // 按钮点击无缝滚动时( 当前是第一张，往后点击 )，循环的话等于最大值，不循环等于0 ( 还是显示第一张图片 )
                if (icurr <= -1) {
                    icurr = lp ? overstep = max : 0;
                }

                $triggers.eq(icurr).addClass('current');

                // 不循环 ( 可用样式，禁用样式切换 prevClass: ['prev', 'prev-disable'] )
                if (!options.loop) {
                    if (icurr <= 0)
                        $prev.removeClass(options.prevClass[0]).addClass(options.prevClass[1]);
                    else
                        $prev.removeClass(options.prevClass[1]).addClass(options.prevClass[0]);
                    if (icurr >= max)
                        $next.removeClass(options.nextClass[0]).addClass(options.nextClass[1]);
                    else
                        $next.removeClass(options.nextClass[1]).addClass(options.nextClass[0]);
                }
                // 当前索引 和 上一个索引不相等时 执行滚动效果
                if (iprev != icurr) {
                    fx && fx(options, $scroller, $items, $triggers, icurr, iprev, max, overstep);
                }
                // 执行回调函数
                options.onscroll($scroller, $items, $triggers, icurr, iprev);
            };

            // 效果初始化， 用于无缝滚动
            fxInit && fxInit(options, $scroller, $items, $triggers);

            if (options.lazyload) {
                // 图片懒加载
                $scroller.find(options.lazyload).each(function () {
                    $(this).load(function () {
                        $(this).closest('.loading', $scroller).removeClass('loading');
                    });
                    $(this).show().attr('src', $(this).attr('data-src')).removeAttr('data-src');
                });
            }
            // 准备完成后，自定义函数
            options.onready($scroller, $items, $triggers);

            // 如果是数字直接选中哪一张图片 或者传入的是选择器的字符串
            if (typeof(options.selected) == 'number') {
                transform($triggers.eq(options.selected));
            } else if (options.selected != null && (typeof(options.selected) == 'string' || typeof(options.selected) == 'object')) {
                transform($triggers.filter(options.selected));
            }

            // 是否自动切换
            if (options.auto && options.auto > 0) {
                var pause = false;
                var timer = setInterval(function () { // 自动切换
                    if (pause) {
                        return;
                    }
                    transform(null, +1, true);
                }, options.auto);

                $items.add($triggers).add($prev).add($next).hover(function () {
                    pause = true;
                }, function () {
                    pause = false;
                });
            }
        });

        return this;
    };

    $.fn.scroller.fxInit = {
        scroll: function (options, $scroller, $items, $triggers) {
            // 用于循环轮播
            $items.first().clone().insertAfter($items.last());
            $items.last().clone().insertBefore($items.first());
            $scroller.scrollLeft(options.step);
        },
        fade: function (options, $scroller, $items, $triggers) {
            if ($scroller.css('zIndex') == 'auto') {
                $scroller.css('zIndex', 0);
            }
            $items.each(function (i) {
                var $item = $(this);
                $item.css({
                    display: 'none',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    zIndex: $items.length - i
                });
            }).eq(0).show();
        }
    };

    $.fn.scroller.fx = {
        scroll: function (options, $scroller, $items, $triggers, icurr, iprev, max, overstep) { // 滚动效果
            // 边值处理
            /*if (overstep != undefined) {
                // icurr=overstep=0 ( 正向loop ) ,icurr=overstep=2 (max) 反向loop
                icurr = overstep === 0 ? max + 1 : -1;
                // console.log(icurr);   3  -1
            }*/
            // icurr => 1 2 3 loop
            $scroller.stop().animate({
                scrollLeft: options.step * (icurr + 1)
            }, options.speed, function () {
                // 边值处理 ( 滚动效果倒一个或者最后一个图 )
               /* if (overstep != undefined) {
                    $scroller.scrollLeft(options.step * (overstep + 1));
                }*/
            });
        },
        fade: function (options, $scroller, $items, $triggers, icurr, iprev) { // 渐变效果
            $items.eq(iprev).stop(true, true).fadeOut(options.speed, function () {
                $items.eq(iprev).hide(); // 修复父元素隐藏时的bug
            });
            $items.eq(icurr).stop(true, true).fadeIn(options.speed);
        }

    };

})(jQuery);



