---
title: 经典面试题
---

### 1. 如下为一段代码，请完善 sum 函数，使得 sum(1,2,3,4,5,6) 函数返回值为 21, 需要在 sum 函数中调用 asyncAdd 函数进行数值运算，且不能修改 asyncAdd 函数.

```js
/**
 * 请在 sum函数中调用此函数，完成数值计算
 * @param {*} a 要相加的第一个值
 * @param {*} b 要相加的第二个值
 * @param {*} callback 相加之后的回调函数
 */
function asyncAdd(a, b, callback) {
  setTimeout(function () {
    callback(null, a + b);
  }, 1000);
}

/**
 * 请在此方法中调用asyncAdd方法，完成数值计算
 * @param  {...any} rest 传入的参数
 */
async function sum(...rest) {
  // 请在此处完善代码

  let arr = [];
  if (rest.length % 2 === 1) {
    rest.push(0);
  }
  let fn = function (s1, s2) {
    return new Promise((resolve, reject) => {
      asyncAdd(s1, s2, function (m, n) {
        resolve(n);
      });
    });
  };
  for (let i = 0; i < rest.length; i += 2) {
    arr.push(fn(rest[i], rest[i + 1]));
  }

  return Promise.all(arr).then((res) => {
    let s = res.reduce((cur, pre) => (cur += pre), 0);
    return s;
  });
}

let start = window.performance.now();
sum(1, 2, 3, 4, 5, 6, 7, 8).then((res) => {
  // 请保证在调用sum方法之后，返回结果21
  console.log(res);
  console.log(`程序执行共耗时: ${window.performance.now() - start}`);
});
```


### 2. 将扁平化数组转化为Tree

```js
let arr = [
  {id: 1, name: '部门1', pid: 0},
  {id: 2, name: '部门2', pid: 1},
  {id: 3, name: '部门3', pid: 1},
  {id: 4, name: '部门4', pid: 3},
  {id: 5, name: '部门5', pid: 4},
  {id: 6, name: '部门6', pid: 0},
  {id: 7, name: '部门7', pid: 6},
]
```
#### 递归处理 时间复杂度为O(2^n)

```js
function getChildren(data, res, pid) {
  for (let i = 0; i < data.length; i++) {
    const item = arr[i];
    if(item.pid === pid) {
      const newItem = {...item, children: []};
      res.push(newItem);
      getChildren(data, newItem.children, item.id);
    }
  }
}

// 调用 
function turnTree() {
  const res = [];
  getChildren(arr, res, 0);
  console.log(res);
}
```

#### 最佳性能 使用Map

```js
function arrayToTree() {
  const res = [];
  const itemMap = {};

  for (const item of arr) {
    const id = item.id;
    const pid = item.pid;

    itemMap[id] = {
      ...item,
      children: []
    }
    const treeItem = itemMap[id];
    if (pid === 0) {
      res.push(treeItem);
    } else {
      if (!itemMap[pid]) {
        itemMap[pid] = { children: [] };
      }
      // 遍历的同时借助对象的引用
      itemMap[pid].children.push(treeItem);
    }
  }

  return res;
}
```

