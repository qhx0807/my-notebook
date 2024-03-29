---
title: JacaScript原型及原型链
date: 2021-08-01
sidebar_position: 1
---

## 实例与原型

使用构造函数创建对象

```js
function Fn() {

}
Fn.prototype.test = function() {
    console.log('test)
}
var fn = new Fn()
```

### prototype

每个函数都有有个 `prototype` 属性，称之为 `显示原型属性`

### **proto**

每个对象（除了 null）都有一个 `__proto__` 属性，称之为 `隐式原型属性`

### 它们之间的关系

**实例对象的隐式原型等于其对应的构造函数的显示原型**

```js
Fn.prototype === fn.__proto__; // true
```

### constructor

```js
Fn === Fn.prototype.constructor; // true
```

## 图

![](http://cdn.cqhiji.com/pic/20200901155746.jpg)
