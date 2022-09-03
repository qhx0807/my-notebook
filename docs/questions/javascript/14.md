---
title: 14. 如何遍历得到对象的key？
---

遍历对象的方式：

* `for...in` 主要用来遍历对象(for key in obj) 会遍历原型上的

* `Object.keys(obj)` 返回一个数组,包括对象**自身**的(不含继承的)所有可枚举属性(不含 `Symbol` 属性)

* `Object.getOwnPropertyNames(obj)` 返回一个数组，包含对象**自身的**所有属性(不含 `Symbol` 属性， **包含不可枚举属性**)

* `Object.getOwnPropertySymbols(obj)` 返回数组，只会遍历 `Symbol` 类型属性，且包含不可枚举类型。

* `Reflect.ownKeys(obj)` 遍历：返回一个数组，包含对象**自身**的所有属性，不管属性名是 Symbol 或字符串，也不管是否可枚举。


```js
var b = Symbol("b");
    var obj = {
      [Symbol("a")]: "a",
      [b]: "b",
      c: "c",
      d: "d"
    };
    obj.__proto__ = {
      p: "p",
    };
    Object.defineProperty(obj, b, {
      enumerable: false,
    });

    Object.defineProperty(obj, 'd', {
      enumerable: false,
    });

    for (const key in obj) {
      console.log(key); // 'c' 'p'
    }

    console.log(Object.keys(obj)); // ['c'],

    // for (const v of obj) {
    //   console.log(v); // TypeError: obj is not iterable
    // }
    // console.log("---------------");

    console.log(Object.getOwnPropertyNames(obj)); // ['c', 'd']

    console.log(Object.getOwnPropertySymbols(obj)); // [Symbol(a), Symbol(b)]
    
    console.log(Reflect.ownKeys(obj)); // ['c', 'd', Symbol(a), Symbol(b)]
```