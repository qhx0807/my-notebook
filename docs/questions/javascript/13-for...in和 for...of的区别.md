---
title: 13. for...in 和 for...of 的区别？
---

1. for...in 遍历得到 key
2. for...of 遍历得到 value

### for...in 循环

更适合遍历对象，当然也可以遍历数组，但是会存在一些问题

key 为字符串类型，且 遍历顺序有可能不是按照实际数组的内部顺序。

```js
var arr = [1, 2, 3];

for (const i in arr) {
  console.log(i); // '0', '1', '2'
}


```
使用 `for in` 会遍历数组所有的**可枚举**属性，包括原型上的属性，如果想过滤，可以使用 `Object.hasOwnProperty()` 判断。

```js
var arr = [1, 2, 3];
Array.prototype.a = 4;
for (const i in arr) {
  console.log(i); // '0', '1', '2', 'a'
}


for (const i in arr) {
  if (Object.hasOwnProperty.call(arr, i)) {
    console.log(i); // '0', '1', '2'
  }
}
```

### for...of 遍历

`for of` 遍历的是数组元素值，而且 `for of` 遍历的只是数组内的元素，不包括原型属性和索引.

`for of` 遍历**可迭代**的数据，如数组对象/字符串/map/generator/set等拥有迭代器对象（`[Symbol.iterator]` 接口）的集合，但是不能遍历对象。

### 总结

`for in` 遍历的是数组的索引（即键名），而 `for of` 遍历的是数组元素值

`for in` 总是得到对象的key或数组、字符串的下标

`for of` 总是得到对象的value或数组、字符串的值