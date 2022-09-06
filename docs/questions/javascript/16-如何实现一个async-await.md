---
title: 16. 如何实现一个 async/await
---

是基于 `promise` 和 `generator` 函数实现。

`@bable/runtime` 中 `asyncToGenerator.js` 有实现。 [连接](https://cdn.jsdelivr.net/npm/@babel/runtime@7.18.9/helpers/esm/asyncToGenerator.js)

```js
const getData = () => new Promise((resolve) => setTimeout(() => resolve("data"), 1000));

// 这样的一个async函数 应该再1秒后打印data
async function test() {
  const data = await getData();
  console.log("data: ", data);
  const data2 = await getData();
  console.log("data2: ", data2);
  return "success";
}

// async函数会被编译成generator函数
function* testG() {
  // await被编译成了yield
  const data = yield getData();
  console.log("data: ", data);
  const data2 = yield getData();
  console.log("data2: ", data2);
  return "success";
}

// 使用
const testGAsync = asyncToGenerator(testG);
testGAsync().then((result) => {
  console.log(result);
});
```

```js
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

// 更像是 generator 函数 转换为 Promise
export default function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}
```
