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

    if (initializing===false) {

      // 如果父类存在，则实例对象的base指向父类的原型

      // 这就提供了在实例对象中调用父类方法的途径

      if (baseClass) {

        this.base = baseClass.prototype;

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

      F.prototype[name] = prop[name];

    }

  }

  return F;

}


var Person = jClass({

  init: function(name) {

    this.name = name;

  },

  getName: function() {

    return this.name;

  }

});

var Employee = jClass(Person, {

  init: function(name, employeeID) {

    // 调用父类的原型函数init，注意使用apply函数修改init的this指向

    this.base.init.apply(this, [name]);

    this.employeeID = employeeID;

  },

  getEmployeeID: function() {

    return this.employeeID;

  },

  getName: function() {

    // 调用父类的原型函数getName

    return "Employee name: " + this.base.getName.apply(this);

  }

});



var zhang = new Employee("ZhangSan", "1234");

console.info(zhang.getName()); // "Employee name: ZhangSan"
