define(function (require, exports, module) {

    //alert(module.id)   module.uri

    // alert( module.dependencies );  依赖的数组 ( 依赖模块的路径 )

    // require('./module2.js'); // 依赖模块2 同步

    //alert( module.exports == exports );  true
    // exports 是 module.exports 的引用

    // 异步加载模块
    require.async('.js/module2.js', function () {
        alert('模块加载完的回调');
    });

    var a = 100;

    exports.a = a;

    module.exports = {
        a: a
    };

});
