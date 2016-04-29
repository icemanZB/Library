// 当前是否处于创建类的阶段
// 我们可以通过为实例化对象提供一个 base 的属性，来指向父类（构造函数）的原型

var initializing = false;

function jClass(baseClass, prop) {

    // 只接受一个参数的情况 - jClass(prop)

    if (typeof(baseClass) === "object") {

        prop = baseClass;

        baseClass = null;

    }

    // 本次调用所创建的类 (构造函数)

    function F() {

        // 如果当前处于实例化类的阶段，则调用 init 原型函数

        if (initializing === false) {

            // 如果父类存在，则实例对象的 baseprototype 指向父类的原型

            // 这就提供了在实例对象中调用父类方法的途径

            if (baseClass) {

                this.baseprototype = baseClass.prototype;

            }

            this.init.apply(this, arguments);

        }

    }

    // 如果此类需要从其它类扩展

    if (baseClass) {

        initializing = true;

        F.prototype = new baseClass();

        F.prototype.constructor = F;

        initializing = false;

    }

    // 覆盖父类的同名函数

    for (var name in prop) {

        if (prop.hasOwnProperty(name)) {

            // 如果此类继承自父类 baseClass 并且父类原型中存在同名函数 name

            if (baseClass && typeof(prop[name]) === "function" && typeof(F.prototype[name]) === "function") {

                // 重定义函数 name

                // 首先在函数上下文设置 this.base 指向父类原型中的同名函数

                // 然后调用函数 prop[name]，返回函数结果

                // 注意：这里的自执行函数创建了一个上下文，这个上下文返回另一个函数

                // 此函数中可以应用此上下文中的变量，这就是闭包 (Closure)，这是JavaScript框架开发中常用的技巧

                F.prototype[name] = (function (name, fn) {

                    return function () {

                        this.base = baseClass.prototype[name];

                        return fn.apply(this, arguments);

                    };

                })(name, prop[name]);


            } else {

                F.prototype[name] = prop[name];

            }

        }

    }

    return F;

}

var Person = jClass({

    init: function (name) {

        this.name = name;

    },

    getName: function () {
        return this.name;
    },

    getName1: function () {
        return this.name;
    }

});

var Employee = jClass(Person, {

    init: function (name, employeeID) {

        this.base(name);

        this.employeeID = employeeID;

    },

    getEmployeeID: function () {
        return this.employeeID;
    },

    getName: function () {
        return "Employee name: " + this.base();
    }

});


var zhang = new Employee("ZhangSan", "1234");

console.info(zhang.getName1()); // "Employee name: ZhangSan"


