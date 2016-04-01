;(function ($) {

    var userAgent = navigator.userAgent;

    $.browser = {};

    function uaMatch(ua) {
        ua = ua.toLowerCase();

        var rwebkit = /(webkit)[ \/]([\w.]+)/,
            ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
            rmsie = /(msie) ([\w.]+)/,
            rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/;

        var match = rwebkit.exec(ua) ||
            ropera.exec(ua) ||
            rmsie.exec(ua) ||
            ua.indexOf("compatible") < 0 && rmozilla.exec(ua) ||
            [];

        return {browser: match[1] || "", version: match[2] || "0"};
    }


    var browserMatch = uaMatch(userAgent);

    if (browserMatch.browser) {
        $.browser[browserMatch.browser] = true;
        $.browser.version = browserMatch.version;
    }

    if ($.browser.webkit) {
        $.browser.safari = true;
    }


})(jQuery);