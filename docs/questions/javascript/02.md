---
title: 2. 将扁平化数组转化为Tree
---

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

