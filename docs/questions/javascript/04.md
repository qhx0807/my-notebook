---
title: 4. 实现 instanceof 
---

`instanceof` 通过原型链的方式去判断是否为构造函数的实例，通常用于判断具体的对象类型

```js
const Person = function() {}

const p1 = new Person();
p1 instanceof Person // true

// 基础类型不能通过 `instanceof` 来判断类型
var str = 'hello world'
str instanceof String // false
```

改进：

```js
class PrimitiveString() {
  static [Symbol.hasInstance](x) {
    return typeof x === 'string';
  }
}

'hello world' instanceof PrimitiveString // true
```

> 关于 `Symbol.hasInstance` 查看： https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/hasInstance

实现 `instanceof`

```js
// 
function instanceofFoo(obj, target) {
  if (typeof obj !== 'object' && typeof target !== 'function') return false;
  let objProto = obj.__proto__;
  let tagetProto = target.prototype;

  while(objProto) {
    if (objProto === targetProto) {
      return true;
    } else {
      objProto = objProto.__proto__;
    }
  }
  return false;
}

```