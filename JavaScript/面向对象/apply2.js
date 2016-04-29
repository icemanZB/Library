// 当前是否处于创建类的阶段

var initializing = false;

function jClass(baseClass, prop) {

    // 只接受一个参数的情况 - jClass(prop)

    if (typeof(baseClass) === "object") {

        prop = baseClass;

        baseClass = null;

    }

    // 本次调用所创建的类（构造函数）

    function F() {

        // 如果当前处于实例化类的阶段，则调用init原型函数

        if (initializing === false) {

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

        if (prop.hasOwnProperty(name)) {  // 指出一个对象是否具有指定名称的属性

            F.prototype[name] = prop[name];

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

    }

});

var Employee = jClass(Person, {

    init: function (name, employeeID) {

        this.name = name;

        this.employeeID = employeeID;

    },

    getEmployeeID: function () {

        return this.employeeID;

    }

});


var zhang = new Employee("ZhangSan", "1234");

console.log(zhang.getName()); // "ZhangSan"
