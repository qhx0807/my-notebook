---
title: 19. 实现 new 
---

`new` 操作符实现了什么效果

```js
function Person(name, age){
  this.name = name;
  this.age = age;
}
var p = new Person('tom', 12);
```

1. 创建一个新对象

```js
var p = {};
```

2. this 指向 p

```js
Person.call(this);
```

3. 链接原型对象

实例的隐式原型等于构造函数的显示原型

```js
p.__proto = Person.prototype
```

实现 `new`

```js
function myNew() {
  let obj = {};
  let constructor = [].shift.call(arguments); // 取第一个参数

  obj.__proto__ = constructor.prototype; // 指定实例的原型

  let result = constructor.apply(obj, arguments); // 执行构造函数

  return typeof (result === 'object' && result !== null) ? result : obj; // 如果构造函数有返回值
}
```