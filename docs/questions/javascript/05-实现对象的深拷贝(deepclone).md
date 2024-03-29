---
title: 5. 实现对象的深拷贝(deepclone) 
---

## 浅拷贝

属性值是对象的话，拷贝的是地址

* Object.assign
* ... 扩展运算符

## 深拷贝

1. `JSON.parse(JSON.stringify(object))`

局限性:

* 如果对象中存在循环引用，会报错
* 在遇到不支持的数据类型，比如函数、 undefined 或者 symbol 的时候，这些属性都会被忽略

2. `MessageChannel` 实现异步深拷贝 不支持函数

```js
function clone(obj) {
  return new Promise(resolve => {
    const { port1, port2 } = new MessageChannel()
    port2.onmessage = ev => resolve(ev.data)
    port1.postMessage(obj)
  })
}

var obj = {
  a: 1,
  b: {
    c: 2
  }
}

obj.b.d = obj.b

// 注意该方法是异步的
// 可以处理 undefined 和循环引用对象
const test = async () => {
  const clone = await clone(obj)
  console.log(clone)
}
test()
```
3. JS 有原生的深拷贝 API `structuredClone` (不支持函数)

> https://developer.mozilla.org/zh-CN/docs/Web/API/structuredClone

4. 实现深拷贝

* JavaScript内置对象的复制: Set、Map、Date、Regex等
* 解决循环引用

优化方向：递归肯定会存在爆栈的问题，层序遍历，通过数组来模拟执行栈...


```js
function deepClone(target, memory) {
  const isPrimitive = (value) => {
    return /Number|Boolean|String|Null|Undefined|Symbol|Function/.test(
      Object.prototype.toString.call(value)
    );
  };
  let result = null;

  memory || (memory = new WeakMap()); // 使用WeakMap解决循环引用

  // 基础类型、 函数
  if (isPrimitive(target)) {
    result = target
  }

  // 数组
  else if (Array.isArray(target)) {
    result = target.map(val => deepClone(val, memory));
  }
  
  // Date 对象
  else if (Object.prototype.toString.call(target) === "[object Date]") {
    result = new Date(target);
  }

  // Regex 对象
  else if (Object.prototype.toString.call(target) === "[object RegExp]") {
    result = new RegExp(target);
  }

  // 内置 Set 对象
  else if (Object.prototype.toString.call(target) === "[object Set]") {
    result = new Set();
    for (const value of target) {
      result.add(deepClone(value, memory));
    }
  }

  // 内置 Map 对象
  else if (Object.prototype.toString.call(target) === "[object Map]") {
    result = new Map();
    for (const [key, value] of target.entries()) {
      result.set(key, deepClone(value, memeory));
    }
  }

  // 引用类型
  else {
    if (memory.has(target)) {
      result  = memory.get(target);
    } else {
      result = Object.create(null);
      memory.set(target, result);
      Object.keys(target).forEach((key) => {
        const value = target[key];
        result[key] = deepClone(value, memory);
      });
    }
  }

  return result;
}
```